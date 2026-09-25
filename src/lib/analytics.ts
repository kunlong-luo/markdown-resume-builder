export const ANALYTICS_EVENTS = [
  'editing_started',
  'pdf_export_success',
  'browser_print_started',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

declare global {
  interface Window {
    sa_event?: (event: string) => void;
    sa_pageview?: (path?: string) => void;
  }
}

const OFFICIAL_HOSTNAME = 'kunlong-luo.github.io';
const APP_PATH_PREFIX = '/resume-craft';

export function isOfficialAnalyticsContext(hostname: string, pathname: string) {
  return hostname === OFFICIAL_HOSTNAME && (
    pathname === APP_PATH_PREFIX || pathname.startsWith(`${APP_PATH_PREFIX}/`)
  );
}

export function isDoNotTrackEnabled(
  navigatorLike: Pick<Navigator, 'doNotTrack'> & { msDoNotTrack?: string },
  windowDoNotTrack?: string | null,
) {
  const value = navigatorLike.doNotTrack ?? navigatorLike.msDoNotTrack ?? windowDoNotTrack;
  return value === '1' || value === 'yes';
}

export function getSafeAnalyticsPath(pathname: string, search: string) {
  try {
    const params = new URLSearchParams(search);
    if (params.has('share')) {
      return `${APP_PATH_PREFIX}/shared`;
    }
  } catch {
    // Fall back to the browser pathname below.
  }

  return pathname;
}

export function initAnalyticsPageview() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!isOfficialAnalyticsContext(window.location.hostname, window.location.pathname)) return;

  const nav = navigator as Navigator & { msDoNotTrack?: string };
  const win = window as Window & { doNotTrack?: string | null };
  if (isDoNotTrackEnabled(nav, win.doNotTrack)) return;

  const send = () => {
    if (typeof window.sa_pageview !== 'function') return;
    window.sa_pageview(getSafeAnalyticsPath(window.location.pathname, window.location.search));
  };

  if (typeof window.sa_pageview === 'function') {
    send();
    return;
  }

  document.getElementById('simple-analytics')?.addEventListener('load', send, { once: true });
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  if (!ANALYTICS_EVENTS.includes(event)) return;
  if (!isOfficialAnalyticsContext(window.location.hostname, window.location.pathname)) return;

  const nav = navigator as Navigator & { msDoNotTrack?: string };
  const win = window as Window & { doNotTrack?: string | null };
  if (isDoNotTrackEnabled(nav, win.doNotTrack)) return;

  window.sa_event?.(event);
}
