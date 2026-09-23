import { describe, it, expect, beforeEach } from 'vitest';
import { storage, STORAGE_KEYS } from '../lib/storage';

describe('storage', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStore[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
      length: 0,
      key: (_index: number) => null,
    };

    // Define window and localStorage on global
    (globalThis as unknown as { window?: { localStorage: Storage } }).window = {
      localStorage: mockLocalStorage as unknown as Storage,
    };
    (globalThis as unknown as { localStorage: Storage }).localStorage = mockLocalStorage as unknown as Storage;
  });

  it('should get and set string values safely', () => {
    storage.set('test_str', 'hello world');
    expect(storage.getString('test_str')).toBe('hello world');
  });

  it('should get and set JSON objects safely', () => {
    const data = { name: 'Alice', age: 30, skills: ['React', 'TS'] };
    storage.set('test_json', data);
    expect(storage.get('test_json', null)).toEqual(data);
  });

  it('should return fallback when key does not exist or JSON is empty', () => {
    expect(storage.get('non_existing_key', { fallback: true })).toEqual({ fallback: true });
  });

  it('should remove items safely', () => {
    storage.set('remove_me', '123');
    expect(storage.getString('remove_me')).toBe('123');
    storage.remove('remove_me');
    expect(storage.getString('remove_me')).toBe('');
  });

  it('should clear all resume data keys correctly', () => {
    storage.set(STORAGE_KEYS.MARKDOWN, '# Test');
    storage.set(STORAGE_KEYS.THEME_MODE, 'dark');
    expect(storage.getString(STORAGE_KEYS.MARKDOWN)).toBe('# Test');

    storage.clearAllResumeData();
    expect(storage.getString(STORAGE_KEYS.MARKDOWN)).toBe('');
  });
});
