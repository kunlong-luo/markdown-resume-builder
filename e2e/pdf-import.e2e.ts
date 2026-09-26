import { expect, test } from '@playwright/test';

const TEST_RESUME_PDF_BASE64 =
  'JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMSAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0NvbnRlbnRzIDcgMCBSIC9NZWRpYUJveCBbIDAgMCA2MTIgNzkyIF0gL1BhcmVudCA2IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgNiAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0F1dGhvciAoYW5vbnltb3VzKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwOTI2MDEyOTEyKzAwJzAwJykgL0NyZWF0b3IgKGFub255bW91cykgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwOTI2MDEyOTEyKzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKHVuc3BlY2lmaWVkKSAvVGl0bGUgKHVudGl0bGVkKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0NvdW50IDEgL0tpZHMgWyAzIDAgUiBdIC9UeXBlIC9QYWdlcwo+PgplbmRvYmoKNyAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAzNjkKPj4Kc3RyZWFtCkdhcj5CZ0ouZikmOk5ebGM2RmdBRjlWMjMrbyZ0WFQoaDBKbUp0ZW9kZDg2Sm5GO01YPVxNTVk6MWVQLz5aLSwtKzQ3Y3UibS1HQTAqMz5RZ2Q0XT8kMDJGZDNULklDTCFGX1FAbjtPOlpfOFRaSFpFMkwrLT4oay5cOGNNOzsjPiovJXJuLjJaaEltUFVaJlVSNkppQEJbS3FfQFhJQTwyTFZQcStMZmdbLXQ6WT07ZWBeLixicm8wJkYtXSFBRiQ9KD1ybWM3OXMxOVZVSjtnOypzOVwmaktzdE1TazJgIWEqRVxMWDxaOVY7U1RdOCRHaVtKcCFIK1wmSC4vMiIpOTVjWiVdMiwpOFE7UkNHLTBUOk1pZV1cJD9IQlBZbTJtX0FmSjtiSVVEcG1tXF4zPHU3KEVWTlVaQFRDJGojJWhyZk0+Li1LPE1OITI/Y202JitQWzJdaUpwPz5eNT1zLSdyKC5gUSI4aVtlSUt+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAwOTIgMDAwMDAgbiAKMDAwMDAwMDE5OSAwMDAwMCBuIAowMDAwMDAwMzkyIDAwMDAwIG4gCjAwMDAwMDA0NjAgMDAwMDAgbiAKMDAwMDAwMDcyMSAwMDAwMCBuIAowMDAwMDAwNzgwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDg2MDMxYzFlMGZiYjhmZjA3MjM3YTNhYjU0ZDYwYTM5Pjw4NjAzMWMxZTBmYmI4ZmYwNzIzN2EzYWI1NGQ2MGEzOT5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNSAwIFIKL1Jvb3QgNCAwIFIKL1NpemUgOAo+PgpzdGFydHhyZWYKMTIzOQolJUVPRgo=';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem(
      'resume-settings',
      JSON.stringify({ lang: 'en' }),
    );
  });
});

test('imports a text-based PDF locally and shows machine-readability feedback', async ({
  page,
}) => {
  await page.goto('/');

  await page
    .locator('button:visible')
    .filter({ hasText: /^(Import|导入)$/ })
    .first()
    .click();

  const dialog = page.getByRole('dialog', {
    name: /Import Resume|导入简历/,
  });
  await expect(dialog).toBeVisible();

  const fileInput = dialog.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'alex-chen-resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(TEST_RESUME_PDF_BASE64, 'base64'),
  });

  await expect(dialog.getByText('alex-chen-resume.pdf')).toBeVisible();
  await expect(
    dialog.getByText(/PDF machine-readability|PDF 机器可读性/),
  ).toBeVisible();
  await expect(dialog.getByText(/1 pages|1 页/)).toBeVisible();

  await dialog
    .getByRole('button', { name: /Import This File|确认导入/ })
    .click();

  await expect(dialog).toBeHidden();

  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem('resume-markdown') || ''),
    )
    .toContain('Alex Chen');

  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem('resume-markdown') || ''),
    )
    .toContain('Experience');
});
