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
  test('help dialog restores trigger focus after Escape', async ({ page }) => {
    await page.goto('/');

    const guideButton = page.getByRole('button', { name: /^(Guide|指南)$/ });
    await guideButton.focus();
    await guideButton.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /User Guide|使用指南/,
    });
    await expect(dialog).toBeVisible();

    const focusedInsideDialog = await dialog.evaluate(
      (element) => element.contains(document.activeElement),
    );
    expect(focusedInsideDialog).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(guideButton).toBeFocused();
  });

  test('confirmation dialog traps focus and restores the reset button', async ({ page }) => {
    await page.goto('/');

    const resetButton = page.getByRole('button', { name: /^(Reset|重置)$/ });
    await expect(resetButton).toBeVisible();
    await resetButton.focus();
    await resetButton.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /Reset Template|重置模板/,
    });
    await expect(dialog).toBeVisible();

    const focusedInsideDialog = await dialog.evaluate(
      (element) => element.contains(document.activeElement),
    );
    expect(focusedInsideDialog).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(resetButton).toBeFocused();
  });

  test('resume diagnostic behaves as a keyboard-managed dialog', async ({ page }) => {
    await page.goto('/');

    const diagnosticButton = page.getByRole('button', {
      name: /^(Diagnostic|诊断)$/,
    });
    await diagnosticButton.focus();
    await diagnosticButton.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /Resume Diagnostic|简历诊断/,
    });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(diagnosticButton).toBeFocused();
  });

});
