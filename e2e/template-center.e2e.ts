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

test.describe('template center', () => {
  test('exposes one template library entry and removes the legacy template selector', async ({ page }) => {
    await page.goto('/');

    const toolbar = page.locator('#resume-main-toolbar');
    await expect(
      toolbar.getByRole('button', { name: /Open template library|打开模板库/ }),
    ).toHaveCount(1);

    await expect(
      toolbar.locator(
        'button[aria-haspopup="listbox"][title="Custom / Starter"]',
      ),
    ).toHaveCount(0);

    await expect(
      toolbar.locator(
        'button[aria-haspopup="listbox"][title="AI Backend Developer"]',
      ),
    ).toHaveCount(0);
  });

  test('keeps resume management separate from template selection', async ({ page }) => {
    await page.goto('/');

    await page.locator('button[aria-controls="resume-profile-panel"]').click();

    const profilePanel = page.locator('#resume-profile-panel');
    await expect(profilePanel).toBeVisible();
    await expect(profilePanel.getByText(/My resumes|我的简历/, { exact: true })).toBeVisible();
    await expect(
      profilePanel.getByRole('button', { name: /New blank|新建空白/ }),
    ).toBeVisible();
    await expect(
      profilePanel.getByText(/Fast load from benchmark templates|快速选用标杆模板创建/),
    ).toHaveCount(0);
    await expect(
      profilePanel.getByRole('button', { name: /AI Frontend Developer|AI 前端工程师/ }),
    ).toHaveCount(0);
  });

  test('previews a template without changing the active resume', async ({ page }) => {
    await page.goto('/');

    const originalMarkdown = await page.evaluate(
      () => window.localStorage.getItem('resume-markdown'),
    );

    await page
      .getByRole('button', { name: /Open template library|打开模板库/ })
      .click();

    const dialog = page.getByRole('dialog', {
      name: /Choose a content template|选择内容模板/,
    });
    await expect(dialog).toBeVisible();

    await dialog
      .getByRole('button', {
        name: /AI Frontend Developer|AI 前端工程师/,
      })
      .click();

    await expect(
      dialog.getByRole('heading', {
        name: /AI Frontend Developer|AI 前端工程师/,
      }),
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume-markdown')),
      )
      .toBe(originalMarkdown);
  });

  test('applies a selected template only after confirmation', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /Open template library|打开模板库/ })
      .click();

    const dialog = page.getByRole('dialog', {
      name: /Choose a content template|选择内容模板/,
    });

    await dialog
      .getByRole('button', {
        name: /AI Frontend Developer|AI 前端工程师/,
      })
      .click();

    await dialog
      .getByRole('button', {
        name: /Use content template|使用内容模板/,
      })
      .click();

    const confirmDialog = page.getByRole('dialog', {
      name: /Use this content template\?|使用这个内容模板？/,
    });
    await expect(confirmDialog).toBeVisible();

    await confirmDialog
      .getByRole('button', { name: /Use content template|使用内容模板/ })
      .click();

    await expect(dialog).toBeHidden();

    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume-markdown') || ''),
      )
      .toContain('林智远');
  });

  test('restores toolbar focus when closed with Escape', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button', {
      name: /Open template library|打开模板库/,
    });
    await trigger.focus();
    await trigger.press('Enter');

    const dialog = page.getByRole('dialog', {
      name: /Choose a content template|选择内容模板/,
    });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
