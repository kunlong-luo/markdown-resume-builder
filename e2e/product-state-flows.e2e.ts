import { expect, test } from '@playwright/test';

test.describe('product state flows', () => {
  test('imports a Markdown file through the real import UI', async ({ page }) => {
    await page.goto('/');

    const importButton = page
      .locator('button:visible')
      .filter({ hasText: /^(Import|导入)$/ })
      .first();
    await importButton.click();

    await expect(
      page.getByRole('heading', { name: /Import Resume|导入简历/ }),
    ).toBeVisible();

    const markdown = [
      '# Imported E2E Candidate',
      '',
      '## Experience',
      '- Imported from a Markdown file',
    ].join('\n');

    await page.locator('input[type="file"]').setInputFiles({
      name: 'e2e-resume.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from(markdown),
    });

    await expect(page.getByText('e2e-resume.md')).toBeVisible();
    await page
      .getByRole('button', { name: /Import This File|确认导入/ })
      .click();

    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume-markdown')),
      )
      .toBe(markdown);
  });

  test('persists dark theme across reloads', async ({ page }) => {
    await page.goto('/');

    const themeButton = page
      .locator('button:visible')
      .filter({ hasText: /^(Light|浅色)$/ })
      .first();

    await expect(themeButton).toBeVisible();
    await themeButton.click();

    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume_theme_mode')),
      )
      .toBe('dark');

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('duplicates and renames a resume profile and restores it after reload', async ({
    page,
  }) => {
    await page.goto('/');

    const profileTrigger = page
      .locator('button:visible')
      .filter({ hasText: /默认简历|Default/ })
      .first();
    await expect(profileTrigger).toBeVisible();
    await profileTrigger.click();

    const fastCopy = page
      .locator('button:visible')
      .filter({ hasText: /^(Copy|复制)$/ })
      .first();
    await fastCopy.click();

    const profileNameInput = page.getByPlaceholder(
      /Profile name|输入档案名称/,
    );
    await expect(profileNameInput).toBeVisible();
    await profileNameInput.fill('E2E Profile');
    await profileNameInput.press('Enter');

    await expect
      .poll(() =>
        page.evaluate(() => {
          const raw = window.localStorage.getItem('resume-profiles');
          if (!raw) return false;
          try {
            const profiles = JSON.parse(raw) as Array<{ name?: string }>;
            return profiles.some((profile) => profile.name === 'E2E Profile');
          } catch {
            return false;
          }
        }),
      )
      .toBe(true);

    await page.reload();

    await expect(
      page
        .locator('button:visible')
        .filter({ hasText: 'E2E Profile' })
        .first(),
    ).toBeVisible();
  });
});
