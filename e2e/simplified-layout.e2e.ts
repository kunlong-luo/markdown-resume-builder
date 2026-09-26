import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem(
      'resume-settings',
      JSON.stringify({ lang: 'en' }),
    );
  });
});

test.describe('simplified workspace actions', () => {
  test('keeps formatting choices inside one Typography entry', async ({ page }) => {
    await page.goto('/');

    const toolbar = page.locator('#resume-main-toolbar');

    await expect(
      toolbar.getByRole('button', { name: 'Open template library' }),
    ).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Typography' })).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Fit 1 Page' })).toBeVisible();

    // Preset / layout / title-style selectors should no longer occupy
    // separate first-level toolbar slots.
    await expect(toolbar.locator('button[aria-haspopup="listbox"]')).toHaveCount(0);

    await toolbar.getByRole('button', { name: 'Typography' }).click();

    await expect(page.getByText('Style preset', { exact: true })).toBeVisible();
    await expect(page.getByText('Page layout', { exact: true })).toBeVisible();
    await expect(page.getByText('Title Style', { exact: true })).toBeVisible();
    await expect(page.getByText('File Name:', { exact: true })).toBeVisible();
  });

  test('uses one PDF download action with ATS and Quick choices', async ({ page }) => {
    await page.goto('/');

    const download = page.getByRole('button', { name: 'Download PDF' }).first();
    await expect(download).toBeVisible();

    await expect(
      page.getByRole('button', { name: /^ATS PDF$/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /^Quick PDF$/ }),
    ).toHaveCount(0);

    await page
      .getByRole('button', { name: 'Choose PDF export mode' })
      .click();

    await expect(
      page.getByRole('button', { name: /ATS PDF · Recommended/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Quick PDF · Image/ }),
    ).toBeVisible();
  });

  test('moves lower-frequency actions into More', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
    const resumeCheck = page.getByRole('button', { name: 'Resume Check' });
    await expect(resumeCheck).toBeVisible();
    await expect(page.getByRole('button', { name: 'More actions' })).toBeVisible();

    await resumeCheck.click();
    const checkDialog = page.getByRole('dialog', { name: 'Resume Check' });
    await expect(checkDialog).toBeVisible();
    await expect(checkDialog.getByText('Check Results', { exact: true })).toBeVisible();
    await expect(
      checkDialog.getByText(
        'Check resume structure, wording, and ATS readability with local analysis.',
        { exact: true },
      ),
    ).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(
      page.getByRole('button', { name: /^Guide$/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /^Import$/ }),
    ).toHaveCount(0);

    await page.getByRole('button', { name: 'More actions' }).click();

    await expect(
      page.getByRole('button', { name: 'Import resume' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export Markdown' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Versions & backup' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Guide & privacy' }),
    ).toBeVisible();
  });
});
