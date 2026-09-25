export const SUPPORT_REPO_URL = 'https://github.com/kunlong-luo/resume-craft';
export const SUPPORT_PROMPT_STORAGE_KEY = 'resume-craft.support-prompt.v1';

const DAY_MS = 24 * 60 * 60 * 1000;
const SUPPORTED_COOLDOWN_MS = 30 * DAY_MS;
const SKIP_COOLDOWN_MS = 7 * DAY_MS;

export type SupportPromptDecision = 'supported' | 'skip';

interface SupportPromptState {
  nextPromptAt: number;
  exportCount: number;
}

interface ShouldShowSupportPromptOptions {
  hostname: string;
  pathname: string;
  now?: number;
  nextPromptAt?: number | null;
  exportCount?: number;
}

export function isOfficialHostedApp(hostname: string, pathname: string) {
  return hostname === 'kunlong-luo.github.io' && (
    pathname === '/resume-craft' || pathname.startsWith('/resume-craft/')
  );
}

export function getSupportPromptCooldown(decision: SupportPromptDecision) {
  return decision === 'supported' ? SUPPORTED_COOLDOWN_MS : SKIP_COOLDOWN_MS;
}

export function shouldShowSupportPrompt({
  hostname,
  pathname,
  now = Date.now(),
  nextPromptAt = null,
  exportCount = 0,
}: ShouldShowSupportPromptOptions) {
  if (!isOfficialHostedApp(hostname, pathname)) {
    return false;
  }

  // Never interrupt a user's first export. The support prompt becomes eligible
  // only after they have already tried exporting once.
  if (exportCount < 1) {
    return false;
  }

  return !nextPromptAt || now >= nextPromptAt;
}

function readSupportPromptState(): SupportPromptState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SUPPORT_PROMPT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SupportPromptState>;
    if (typeof parsed.nextPromptAt !== 'number') {
      return null;
    }

    return {
      nextPromptAt: parsed.nextPromptAt,
      // Older saved states predate exportCount. Those users have already seen
      // the prompt, so treat them as having completed the first export.
      exportCount: typeof parsed.exportCount === 'number' ? parsed.exportCount : 1,
    };
  } catch {
    return null;
  }
}

function writeSupportPromptState(state: SupportPromptState) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SUPPORT_PROMPT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Export should never fail because localStorage is unavailable.
  }
}

export function shouldPromptForSupport() {
  if (typeof window === 'undefined') return false;

  const state = readSupportPromptState();

  if (!state) {
    writeSupportPromptState({
      nextPromptAt: 0,
      exportCount: 1,
    });
    return false;
  }

  return shouldShowSupportPrompt({
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    nextPromptAt: state.nextPromptAt,
    exportCount: state.exportCount,
  });
}

export function markSupportPrompt(decision: SupportPromptDecision) {
  if (typeof window === 'undefined') return;

  const current = readSupportPromptState();
  writeSupportPromptState({
    nextPromptAt: Date.now() + getSupportPromptCooldown(decision),
    exportCount: Math.max(1, current?.exportCount ?? 1),
  });
}
