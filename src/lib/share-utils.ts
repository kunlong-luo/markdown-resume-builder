import type { Language, ResumeSettings } from '../types';
import { normalizeImportedSettings } from './import-validation';

export interface ShareState {
  markdown: string;
  settings: ResumeSettings;
  /**
   * Legacy v1 field. Older links stored the access code directly in the
   * fragment payload. New password-protected links never use this field.
   */
  passwordHash?: string;
}

export interface EncryptedSharePayload {
  version: 2;
  algorithm: 'AES-256-GCM';
  kdf: 'PBKDF2-SHA-256';
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  lang?: Language;
}

export type ParsedSharePayload =
  | { kind: 'plain'; state: ShareState }
  | { kind: 'encrypted'; payload: EncryptedSharePayload };

export const SHARE_PASSWORD_MIN_LENGTH = 8;
export const SHARE_PASSWORD_MAX_LENGTH = 64;
export const SHARE_PBKDF2_ITERATIONS = 310_000;

const SHARE_ENCRYPTION_VERSION = 2;
const SHARE_ENCRYPTION_AAD = 'resume-craft-share-v2';
const SHARE_SALT_BYTES = 16;
const SHARE_IV_BYTES = 12;
const SHARE_MAX_MARKDOWN_LENGTH = 2_000_000;
const SHARE_MAX_ENCODED_LENGTH = 3_000_000;
const SHARE_MAX_CIPHERTEXT_LENGTH = 2_800_000;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function encodeJsonBase64Url(value: unknown): string {
  return bytesToBase64Url(textEncoder.encode(JSON.stringify(value)));
}

function decodeJsonBase64Url(value: string): unknown {
  return JSON.parse(textDecoder.decode(base64UrlToBytes(value)));
}

function getWebCrypto(): Crypto {
  if (
    typeof crypto === 'undefined' ||
    !crypto.subtle ||
    typeof crypto.getRandomValues !== 'function'
  ) {
    throw new Error('Web Crypto API is unavailable in this browser');
  }

  return crypto;
}

async function deriveShareKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  const webCrypto = getWebCrypto();
  const keyMaterial = await webCrypto.subtle.importKey(
    'raw',
    toArrayBuffer(textEncoder.encode(password)),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return webCrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      iterations,
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

function isLanguage(value: unknown): value is Language {
  return value === 'zh' || value === 'en';
}

function getShareFallbackSettings(lang: Language = 'zh'): ResumeSettings {
  return {
    themeColor: 'indigo',
    customColor: '#4F46E5',
    themeMode: 'light',
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
    lang,
    isPrivacyMasked: false,
  };
}

function normalizeShareState(
  markdown: unknown,
  settings: unknown,
  langHint?: Language,
): ShareState | null {
  if (
    typeof markdown !== 'string' ||
    markdown.length === 0 ||
    markdown.length > SHARE_MAX_MARKDOWN_LENGTH
  ) {
    return null;
  }

  const normalizedSettings = normalizeImportedSettings(
    settings,
    getShareFallbackSettings(langHint),
  );

  if (!normalizedSettings) return null;

  return {
    markdown,
    settings: normalizedSettings,
  };
}

function parseEncryptedEnvelope(encoded: string): EncryptedSharePayload | null {
  if (!encoded || encoded.length > SHARE_MAX_ENCODED_LENGTH) return null;

  try {
    const parsed = decodeJsonBase64Url(encoded);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    const envelope = parsed as Record<string, unknown>;

    if (
      envelope.v !== SHARE_ENCRYPTION_VERSION ||
      envelope.a !== 'A256GCM' ||
      envelope.k !== 'PBKDF2-SHA256' ||
      typeof envelope.i !== 'number' ||
      !Number.isInteger(envelope.i) ||
      envelope.i < 100_000 ||
      envelope.i > 1_000_000 ||
      typeof envelope.s !== 'string' ||
      typeof envelope.n !== 'string' ||
      typeof envelope.c !== 'string' ||
      envelope.c.length === 0 ||
      envelope.c.length > SHARE_MAX_CIPHERTEXT_LENGTH
    ) {
      return null;
    }

    const salt = base64UrlToBytes(envelope.s);
    const iv = base64UrlToBytes(envelope.n);

    if (salt.byteLength !== SHARE_SALT_BYTES || iv.byteLength !== SHARE_IV_BYTES) {
      return null;
    }

    return {
      version: 2,
      algorithm: 'AES-256-GCM',
      kdf: 'PBKDF2-SHA-256',
      iterations: envelope.i,
      salt: envelope.s,
      iv: envelope.n,
      ciphertext: envelope.c,
      lang: isLanguage(envelope.l) ? envelope.l : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Encodes the legacy/public share state into a URI-safe Base64 payload.
 * This remains readable for public links and backwards compatibility.
 */
export function serializeShareState(state: ShareState): string {
  try {
    return encodeJsonBase64Url({
      m: state.markdown,
      s: state.settings,
      p: state.passwordHash
        ? btoa(encodeURIComponent(state.passwordHash))
        : undefined,
    });
  } catch (error) {
    console.error('Failed to serialize share state', error);
    return '';
  }
}

/**
 * Decodes legacy/public share state from a URI-safe Base64 payload.
 */
export function deserializeShareState(encoded: string): ShareState | null {
  if (!encoded || encoded.length > SHARE_MAX_ENCODED_LENGTH) return null;

  try {
    const parsed = decodeJsonBase64Url(encoded) as {
      m?: unknown;
      s?: unknown;
      p?: unknown;
    };

    const state = normalizeShareState(parsed?.m, parsed?.s);
    if (!state) return null;

    return {
      ...state,
      passwordHash:
        typeof parsed.p === 'string'
          ? decodeURIComponent(atob(parsed.p))
          : undefined,
    };
  } catch (error) {
    console.error('Failed to deserialize share state', error);
    return null;
  }
}

/**
 * Encrypts a share state using a password-derived AES-256-GCM key.
 *
 * The password is never stored in the payload. The URL contains only KDF
 * parameters, a random salt, a random IV, optional language metadata, and
 * authenticated ciphertext.
 */
export async function encryptShareState(
  state: ShareState,
  password: string,
): Promise<string> {
  const normalizedPassword = password.trim();

  if (
    normalizedPassword.length < SHARE_PASSWORD_MIN_LENGTH ||
    normalizedPassword.length > SHARE_PASSWORD_MAX_LENGTH
  ) {
    throw new Error(
      `Share password must be ${SHARE_PASSWORD_MIN_LENGTH}-${SHARE_PASSWORD_MAX_LENGTH} characters`,
    );
  }

  const webCrypto = getWebCrypto();
  const salt = webCrypto.getRandomValues(new Uint8Array(SHARE_SALT_BYTES));
  const iv = webCrypto.getRandomValues(new Uint8Array(SHARE_IV_BYTES));
  const key = await deriveShareKey(
    normalizedPassword,
    salt,
    SHARE_PBKDF2_ITERATIONS,
  );

  const normalizedState = normalizeShareState(
    state.markdown,
    state.settings,
    state.settings.lang,
  );

  if (!normalizedState) {
    throw new Error('Invalid share state');
  }

  const plaintext = textEncoder.encode(
    JSON.stringify({
      m: normalizedState.markdown,
      s: normalizedState.settings,
    }),
  );

  const ciphertext = await webCrypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
      additionalData: toArrayBuffer(textEncoder.encode(SHARE_ENCRYPTION_AAD)),
      tagLength: 128,
    },
    key,
    toArrayBuffer(plaintext),
  );

  return encodeJsonBase64Url({
    v: SHARE_ENCRYPTION_VERSION,
    a: 'A256GCM',
    k: 'PBKDF2-SHA256',
    i: SHARE_PBKDF2_ITERATIONS,
    s: bytesToBase64Url(salt),
    n: bytesToBase64Url(iv),
    c: bytesToBase64Url(new Uint8Array(ciphertext)),
    l: state.settings.lang,
  });
}

/**
 * Parses either the new encrypted format or a legacy/public plain payload.
 */
export function parseSharePayload(encoded: string): ParsedSharePayload | null {
  if (!encoded) return null;

  const encrypted = parseEncryptedEnvelope(encoded);
  if (encrypted) {
    return { kind: 'encrypted', payload: encrypted };
  }

  const plain = deserializeShareState(encoded);
  return plain ? { kind: 'plain', state: plain } : null;
}

/**
 * Decrypts a parsed encrypted share payload. Wrong passwords or tampered
 * ciphertext return null because AES-GCM authentication fails.
 */
export async function decryptSharePayload(
  payload: EncryptedSharePayload,
  password: string,
): Promise<ShareState | null> {
  try {
    const normalizedPassword = password.trim();
    if (
      normalizedPassword.length < SHARE_PASSWORD_MIN_LENGTH ||
      normalizedPassword.length > SHARE_PASSWORD_MAX_LENGTH
    ) {
      return null;
    }

    const webCrypto = getWebCrypto();
    const salt = base64UrlToBytes(payload.salt);
    const iv = base64UrlToBytes(payload.iv);
    const ciphertext = base64UrlToBytes(payload.ciphertext);
    const key = await deriveShareKey(
      normalizedPassword,
      salt,
      payload.iterations,
    );

    const plaintext = await webCrypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: toArrayBuffer(iv),
        additionalData: toArrayBuffer(textEncoder.encode(SHARE_ENCRYPTION_AAD)),
        tagLength: 128,
      },
      key,
      toArrayBuffer(ciphertext),
    );

    const parsed = JSON.parse(textDecoder.decode(plaintext)) as {
      m?: unknown;
      s?: unknown;
    };

    return normalizeShareState(parsed?.m, parsed?.s, payload.lang);
  } catch {
    return null;
  }
}

/**
 * Reads a share payload from the privacy-preserving URL fragment first,
 * while keeping legacy ?share= links working.
 */
export function getSharePayloadFromLocation(
  search: string,
  hash: string,
): string | null {
  try {
    const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
    const fragmentParams = new URLSearchParams(fragment);
    const fragmentShare = fragmentParams.get('share');
    if (fragmentShare) return fragmentShare;
  } catch {
    // Fall through to legacy query parsing.
  }

  try {
    return new URLSearchParams(search).get('share');
  } catch {
    return null;
  }
}

/**
 * Generates a share link using the URL fragment.
 *
 * - Public links use the existing plain fragment payload.
 * - Password-protected links use PBKDF2 + AES-256-GCM and never place the
 *   password or plaintext resume content in the URL.
 *
 * Fragments are not sent in the HTTP request to the hosting server.
 */
export async function generateShareUrl(
  state: ShareState,
  password?: string,
): Promise<string> {
  const normalizedPassword = password?.trim() || '';
  const payload = normalizedPassword
    ? await encryptShareState(
        {
          markdown: state.markdown,
          settings: state.settings,
        },
        normalizedPassword,
      )
    : serializeShareState({
        markdown: state.markdown,
        settings: state.settings,
      });

  if (!payload) {
    throw new Error('Failed to generate share payload');
  }

  const origin = window.location.origin + window.location.pathname;
  return `${origin}#share=${payload}`;
}
