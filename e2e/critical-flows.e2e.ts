import { expect, test } from '@playwright/test';

const encryptedShareSettings = {
  themeColor: 'indigo',
  customColor: '#4F46E5',
  themeMode: 'light',
  fontSize: 'standard',
  fontFamily: 'sans',
  margin: 'standard',
  layoutMode: 'split',
  h2Style: 'accent-line',
  topAccentLine: true,
  lineHeight: 1.6,
  blockGap: 1,
  letterSpacing: 0,
  showPageBreakLine: true,
  templateLayout: 'single',
  lang: 'zh',
  isPrivacyMasked: false,
};

test.describe('critical resume flows', () => {
  test('persists Markdown edits locally across reloads', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '源码编辑' }).click();
    const editor = page.locator('#markdown-textarea');
    await expect(editor).toBeVisible();

    const markdown = [
      '# E2E Candidate',
      '',
      '## 技能',
      '- TypeScript',
      '- React',
    ].join('\n');

    await editor.fill(markdown);

    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('resume-markdown')),
      )
      .toBe(markdown);

    await page.reload();
    await page.getByRole('button', { name: '源码编辑' }).click();
    await expect(page.locator('#markdown-textarea')).toHaveValue(markdown);
  });

  test('ATS PDF action reaches the browser print pipeline', async ({ page }) => {
    await page.goto('/');

    const atsButton = page
      .locator('button:visible')
      .filter({ hasText: 'ATS PDF' })
      .first();

    await expect(atsButton).toBeVisible();

    const printFrameAttached = page.waitForEvent('frameattached', {
      timeout: 5_000,
    });

    await atsButton.click();
    await printFrameAttached;
  });

  test('encrypted share rejects a wrong password and decrypts with the correct one', async ({
    page,
  }) => {
    await page.goto('/');

    const password = 'e2e-share-password';
    const payload = await page.evaluate(
      async ({ password: sharePassword, settings }) => {
        const modulePath = '/src/lib/share-utils.ts';
        const shareUtils = await import(modulePath);

        return shareUtils.encryptShareState(
          {
            markdown: '# E2E Candidate\n\n## Experience\n- Encrypted share flow',
            settings,
          },
          sharePassword,
        );
      },
      {
        password,
        settings: encryptedShareSettings,
      },
    );

    await page.goto(`/#share=${payload}`);

    await expect(
      page.getByRole('heading', { name: '加密简历分享' }),
    ).toBeVisible();

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('wrong-password');
    await page.getByRole('button', { name: '解密并查看简历' }).click();

    await expect(
      page.getByText('密码错误，或加密分享链接已被修改'),
    ).toBeVisible();

    await passwordInput.fill(password);
    await page.getByRole('button', { name: '解密并查看简历' }).click();

    await expect(
      page.getByRole('heading', { name: '在线简历分享' }),
    ).toBeVisible();
    await expect(page.getByText('E2E Candidate').first()).toBeVisible();
  });
});
