import { describe, expect, it } from 'vitest';
import {
  getSupportPromptCooldown,
  isOfficialHostedApp,
  shouldShowSupportPrompt,
} from '../lib/support-prompt';

describe('support prompt', () => {
  it('only enables the prompt on the official GitHub Pages app', () => {
    expect(isOfficialHostedApp('kunlong-luo.github.io', '/resume-craft/')).toBe(true);
    expect(isOfficialHostedApp('localhost', '/resume-craft/')).toBe(false);
    expect(isOfficialHostedApp('127.0.0.1', '/resume-craft/')).toBe(false);
    expect(isOfficialHostedApp('example.com', '/resume-craft/')).toBe(false);
    expect(isOfficialHostedApp('kunlong-luo.github.io', '/resume-craft-copy/')).toBe(false);
  });

  it('shows when there is no active cooldown', () => {
    expect(shouldShowSupportPrompt({
      hostname: 'kunlong-luo.github.io',
      pathname: '/resume-craft/',
      now: 1_000,
      nextPromptAt: null,
    })).toBe(true);

    expect(shouldShowSupportPrompt({
      hostname: 'kunlong-luo.github.io',
      pathname: '/resume-craft/',
      now: 1_000,
      nextPromptAt: 2_000,
    })).toBe(false);

    expect(shouldShowSupportPrompt({
      hostname: 'kunlong-luo.github.io',
      pathname: '/resume-craft/',
      now: 2_000,
      nextPromptAt: 2_000,
    })).toBe(true);
  });

  it('gives GitHub supporters a longer cooldown than skip', () => {
    expect(getSupportPromptCooldown('supported')).toBeGreaterThan(
      getSupportPromptCooldown('skip'),
    );
  });
});
