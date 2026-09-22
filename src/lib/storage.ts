/**
 * Centralized Type-Safe Local Storage & Cache Management
 * 统一客户端本地存储与缓存管理模块
 */

export const STORAGE_KEYS = {
  MARKDOWN: 'resume-markdown',
  SETTINGS: 'resume-settings',
  THEME_MODE: 'resume_theme_mode',
  PREVIEW_ZOOM: 'resume_preview_zoom',
  DRAFTS: 'resume-drafts',
  MATRIX: 'resume-matrix',
  PROFILES: 'resume-profiles',
  ACTIVE_PROFILE_ID: 'resume-active-profile-id',
  JD_TEXT: 'resume-jd-text',
  CUSTOM_FILE_NAME: 'resume-custom-filename',
  CHECKER_STATE: 'resume-checker-state',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS] | string;

export const storage = {
  /**
   * Get an item from localStorage with type safety and fallback
   */
  get<T>(key: StorageKey, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return fallback;
      try {
        return JSON.parse(item) as T;
      } catch {
        // If it's a raw string (not JSON)
        return item as unknown as T;
      }
    } catch (e) {
      console.warn(`[storage] Error reading key "${key}":`, e);
      return fallback;
    }
  },

  /**
   * Get raw string from localStorage
   */
  getString(key: StorageKey, fallback: string = ''): string {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Set an item in localStorage
   */
  set<T>(key: StorageKey, value: T): boolean {
    if (typeof window === 'undefined') return false;
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (e) {
      console.error(`[storage] Error setting key "${key}":`, e);
      return false;
    }
  },

  /**
   * Remove an item from localStorage
   */
  remove(key: StorageKey): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[storage] Error removing key "${key}":`, e);
      return false;
    }
  },

  /**
   * Clear all resume-related keys
   */
  clearAllResumeData(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.error('[storage] Error clearing resume data:', e);
      return false;
    }
  }
};
