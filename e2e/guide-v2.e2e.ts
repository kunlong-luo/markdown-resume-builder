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

async function openGuide(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('button', { name: 'Guide & privacy' }).click();

  const guide = page.getByRole('dialog', { name: 'User Guide' });
  await expect(guide).toBeVisible();
  return guide;
}

test.describe('task-oriented user guide', () => {
  test('shows the recommended resume workflow instead of a feature encyclopedia', async ({
    page,
  }) => {
    await page.goto('/');
    const guide = await openGuide(page);

    await expect(guide.getByText('Recommended workflow')).toBeVisible();
    await expect(
      guide.getByText('Build the resume in the right order'),
    ).toBeVisible();

    for (const step of [
      'Choose a starting point',
      'Finish the content first',
      'Tailor it to the target role',
      'Run Resume Check',
      'Adjust layout',
      'Polish the visual style',
      'Check page count',
      'Final check, download, and back up',
    ]) {
      await expect(guide.getByText(step, { exact: true })).toBeVisible();
    }

    await expect(guide.getByText('International applications')).toBeVisible();
    await expect(
      guide.getByText(/Keep the \+ country\/region calling code/),
    ).toBeVisible();
  });

  test('opens the template library directly from the guide', async ({ page }) => {
    await page.goto('/');
    const guide = await openGuide(page);

    await guide.getByRole('button', { name: 'Open template library' }).click();
    await expect(guide).toBeHidden();

    await expect(
      page.getByRole('dialog', { name: 'Choose a resume template' }),
    ).toBeVisible();
  });

  test('opens import and Resume Check directly from the guide', async ({ page }) => {
    await page.goto('/');

    let guide = await openGuide(page);
    await guide.getByRole('button', { name: 'Import resume' }).click();

    const importDialog = page.getByRole('dialog', { name: 'Import Resume' });
    await expect(importDialog).toBeVisible();
    await importDialog.getByRole('button', { name: 'Close import dialog' }).click();
    await expect(importDialog).toBeHidden();

    guide = await openGuide(page);
    await guide.getByRole('button', { name: 'Open Resume Check' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Resume Check' }),
    ).toBeVisible();
  });

  test('opens Layout and Style directly from the guide', async ({ page }) => {
    await page.goto('/');

    let guide = await openGuide(page);
    await guide.getByRole('button', { name: 'Open Layout' }).click();

    const layout = page.getByRole('dialog', { name: 'Layout' });
    await expect(layout).toBeVisible();
    await layout.getByRole('button', { name: 'Close Layout' }).click();
    await expect(layout).toBeHidden();

    guide = await openGuide(page);
    await guide.getByRole('button', { name: 'Open Style' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Style' }),
    ).toBeVisible();
  });
});
