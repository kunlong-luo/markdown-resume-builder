import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
  });
});

test.describe('keyboard accessibility', () => {
  test('share dialog traps focus context and restores trigger focus on Escape', async ({
    page,
  }) => {
    await page.goto('/');

    const shareButton = page.getByRole('button', { name: /^(分享|Share)$/ });
    await expect(shareButton).toBeVisible();
    await shareButton.focus();
    await expect(shareButton).toBeFocused();

    await shareButton.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /分享简历|Share resume/,
    });
    await expect(dialog).toBeVisible();

    const focusedInsideDialog = await dialog.evaluate(
      (element) => element.contains(document.activeElement),
    );
    expect(focusedInsideDialog).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(shareButton).toBeFocused();
  });

  test('import dialog restores keyboard focus after Escape', async ({ page }) => {
    await page.goto('/');

    const importButton = page
      .locator('button:visible')
      .filter({ hasText: /^(Import|导入)$/ })
      .first();
    await expect(importButton).toBeVisible();
    await importButton.focus();
    await importButton.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /Import Resume|导入简历/,
    });
    await expect(dialog).toBeVisible();

    const focusedInsideDialog = await dialog.evaluate(
      (element) => element.contains(document.activeElement),
    );
    expect(focusedInsideDialog).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(importButton).toBeFocused();
  });
});
