import { describe, expect, it } from 'vitest';
import {
  decryptSharePayload,
  deserializeShareState,
  encryptShareState,
  getSharePayloadFromLocation,
  parseSharePayload,
  serializeShareState,
  SHARE_PASSWORD_MIN_LENGTH,
} from '../lib/share-utils';
import type { ResumeSettings } from '../types';

const settings: ResumeSettings = {
  themeColor: 'indigo',
  fontSize: 'standard',
  fontFamily: 'sans',
  margin: 'standard',
  layoutMode: 'split',
  h2Style: 'accent-line',
  topAccentLine: true,
  lineHeight: 1.6,
  blockGap: 1,
  letterSpacing: 0,
  showPageBreakLine: true,
  templateLayout: 'single',
  lang: 'zh',
};

function decodeOuterEnvelope(encoded: string) {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

describe('privacy-preserving share links', () => {
  it('prefers fragment payloads and keeps legacy query links compatible', () => {
    expect(
      getSharePayloadFromLocation('?share=legacy', '#share=fragment'),
    ).toBe('fragment');

    expect(
      getSharePayloadFromLocation('?share=legacy', ''),
    ).toBe('legacy');
  });

  it('round-trips legacy/public share state without requiring a backend', () => {
    const encoded = serializeShareState({
      markdown: '# Candidate\n\nPrivate resume content',
      settings,
      passwordHash: 'legacy-client-side-code',
    });

    const decoded = deserializeShareState(encoded);

    expect(decoded?.markdown).toBe('# Candidate\n\nPrivate resume content');
    expect(decoded?.settings.themeColor).toBe('indigo');
    expect(decoded?.passwordHash).toBe('legacy-client-side-code');

    const parsed = parseSharePayload(encoded);
    expect(parsed?.kind).toBe('plain');
  });

  it('sanitizes malformed legacy settings instead of trusting URL payload types', () => {
    const malformedSettings = {
      ...settings,
      themeColor: 'not-a-theme',
      fontFamily: 'unknown-font',
      lineHeight: 999,
      blockGap: -20,
      letterSpacing: 9,
      customColor: 'javascript:alert(1)',
    } as unknown as ResumeSettings;

    const encoded = serializeShareState({
      markdown: '# Candidate',
      settings: malformedSettings,
    });

    const decoded = deserializeShareState(encoded);

    expect(decoded?.settings.themeColor).toBe('indigo');
    expect(decoded?.settings.fontFamily).toBe('sans');
    expect(decoded?.settings.lineHeight).toBe(2.5);
    expect(decoded?.settings.blockGap).toBe(0);
    expect(decoded?.settings.letterSpacing).toBe(2);
    expect(decoded?.settings.customColor).toBe('#4F46E5');
  });

  it('rejects oversized share payloads before decoding them', () => {
    expect(parseSharePayload('A'.repeat(3_000_001))).toBeNull();
  });

  it('encrypts protected shares without putting the password or plaintext in the envelope', async () => {
    const password = 'correct horse battery staple';
    const markdown = '# Candidate\n\nSecret resume content';

    const encoded = await encryptShareState(
      {
        markdown,
        settings,
      },
      password,
    );

    const envelope = decodeOuterEnvelope(encoded);
    const serializedEnvelope = JSON.stringify(envelope);

    expect(envelope.v).toBe(2);
    expect(envelope.a).toBe('A256GCM');
    expect(envelope.k).toBe('PBKDF2-SHA256');
    expect(serializedEnvelope).not.toContain(password);
    expect(serializedEnvelope).not.toContain('Secret resume content');

    const parsed = parseSharePayload(encoded);
    expect(parsed?.kind).toBe('encrypted');

    if (!parsed || parsed.kind !== 'encrypted') {
      throw new Error('Expected encrypted share payload');
    }

    const decrypted = await decryptSharePayload(parsed.payload, password);
    expect(decrypted?.markdown).toBe(markdown);
    expect(decrypted?.settings.themeColor).toBe('indigo');
    expect(decrypted?.passwordHash).toBeUndefined();
  });

  it('normalizes settings before encrypting protected shares', async () => {
    const malformedSettings = {
      ...settings,
      themeColor: 'invalid-theme',
      margin: 'impossible-margin',
      lineHeight: 42,
    } as unknown as ResumeSettings;

    const password = 'validation password';
    const encoded = await encryptShareState(
      {
        markdown: '# Candidate',
        settings: malformedSettings,
      },
      password,
    );

    const parsed = parseSharePayload(encoded);
    if (!parsed || parsed.kind !== 'encrypted') {
      throw new Error('Expected encrypted share payload');
    }

    const decrypted = await decryptSharePayload(parsed.payload, password);

    expect(decrypted?.settings.themeColor).toBe('indigo');
    expect(decrypted?.settings.margin).toBe('standard');
    expect(decrypted?.settings.lineHeight).toBe(2.5);
  });

  it('rejects an incorrect password', async () => {
    const encoded = await encryptShareState(
      {
        markdown: '# Candidate',
        settings,
      },
      'a sufficiently strong password',
    );

    const parsed = parseSharePayload(encoded);
    if (!parsed || parsed.kind !== 'encrypted') {
      throw new Error('Expected encrypted share payload');
    }

    await expect(
      decryptSharePayload(parsed.payload, 'wrong password value'),
    ).resolves.toBeNull();
  });

  it('rejects tampered AES-GCM ciphertext', async () => {
    const encoded = await encryptShareState(
      {
        markdown: '# Candidate',
        settings,
      },
      'another strong password',
    );

    const parsed = parseSharePayload(encoded);
    if (!parsed || parsed.kind !== 'encrypted') {
      throw new Error('Expected encrypted share payload');
    }

    const original = parsed.payload.ciphertext;
    const lastChar = original.slice(-1);
    const tamperedCiphertext =
      original.slice(0, -1) + (lastChar === 'A' ? 'B' : 'A');

    await expect(
      decryptSharePayload(
        {
          ...parsed.payload,
          ciphertext: tamperedCiphertext,
        },
        'another strong password',
      ),
    ).resolves.toBeNull();
  });

  it('rejects weak encryption passwords instead of silently falling back to plaintext', async () => {
    await expect(
      encryptShareState(
        {
          markdown: '# Candidate',
          settings,
        },
        'x'.repeat(SHARE_PASSWORD_MIN_LENGTH - 1),
      ),
    ).rejects.toThrow();
  });
});
