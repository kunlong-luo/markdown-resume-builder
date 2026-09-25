export const SUPPORT_REPO_URL = 'https://github.com/kunlong-luo/resume-craft';
export const SUPPORT_PROMPT_STORAGE_KEY = 'resume-craft.support-prompt.v1';

const DAY_MS = 24 * 60 * 60 * 1000;
const SUPPORTED_COOLDOWN_MS = 30 * DAY_MS;
const SKIP_COOLDOWN_MS = 7 * DAY_MS;

export type SupportPromptDecision = 'supported' | 'skip';

interface SupportPromptState {
  nextPromptAt: number;
}

interface ShouldShowSupportPromptOptions {
  hostname: string;
  pathname: string;
  now?: number;
  nextPromptAt?: number | null;
}

export function isOfficialHostedApp(hostname: string, pathname: string) {
  return hostname === 'kunlong-luo.github.io' && pathname.startsWith('/resume-craft');
}

export function getSupportPromptCooldown(decision: SupportPromptDecision) {
  return decision === 'supported' ? SUPPORTED_COOLDOWN_MS : SKIP_COOLDOWN_MS;
}

export function shouldShowSupportPrompt({
  hostname,
  pathname,
  now = Date.now(),
  nextPromptAt = null,
}: ShouldShowSupportPromptOptions) {
  if (!isOfficialHostedApp(hostname, pathname)) {
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
    return typeof parsed.nextPromptAt === 'number'
      ? { nextPromptAt: parsed.nextPromptAt }
      : null;
  } catch {
    return null;
  }
}

export function shouldPromptForSupport() {
  if (typeof window === 'undefined') return false;

  const state = readSupportPromptState();
  return shouldShowSupportPrompt({
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    nextPromptAt: state?.nextPromptAt ?? null,
  });
}

export function markSupportPrompt(decision: SupportPromptDecision) {
  if (typeof window === 'undefined') return;

  try {
    const nextPromptAt = Date.now() + getSupportPromptCooldown(decision);
    window.localStorage.setItem(
      SUPPORT_PROMPT_STORAGE_KEY,
      JSON.stringify({ nextPromptAt }),
    );
  } catch {
    // Export should never fail because localStorage is unavailable.
  }
}
