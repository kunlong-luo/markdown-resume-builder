import { ResumeSettings } from '../types';

export interface ShareState {
  markdown: string;
  settings: ResumeSettings;
  passwordHash?: string; // Legacy field name: optional client-side access code, not a cryptographic hash.
}

/**
 * Encodes the sharing state into a compressed URI-safe string.
 */
export function serializeShareState(state: ShareState): string {
  try {
    const dataStr = JSON.stringify({
      m: state.markdown,
      s: state.settings,
      p: state.passwordHash ? btoa(encodeURIComponent(state.passwordHash)) : undefined
    });
    // Use encodeURIComponent + btoa for lightweight safe Base64
    const utf8Bytes = new TextEncoder().encode(dataStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.byteLength; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to serialize share state', e);
    return '';
  }
}

/**
 * Decodes the sharing state from a URI-safe Base64 string.
 */
export function deserializeShareState(encoded: string): ShareState | null {
  if (!encoded) return null;
  try {
    // Restore standard Base64 chars
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decodedText = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(decodedText);
    
    return {
      markdown: parsed.m,
      settings: parsed.s,
      passwordHash: parsed.p ? decodeURIComponent(atob(parsed.p)) : undefined
    };
  } catch (e) {
    console.error('Failed to deserialize share state', e);
    return null;
  }
}

/**
 * Reads a share payload from the privacy-preserving URL fragment first,
 * while keeping legacy ?share= links working.
 */
export function getSharePayloadFromLocation(search: string, hash: string): string | null {
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
 * Fragments are not sent in the HTTP request to the hosting server.
 */
export function generateShareUrl(state: ShareState): string {
  const payload = serializeShareState(state);
  const origin = window.location.origin + window.location.pathname;
  return `${origin}#share=${payload}`;
}
