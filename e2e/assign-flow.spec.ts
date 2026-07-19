import { test, expect } from '@playwright/test'

const TEACHER_EMAIL = process.env.E2E_TEACHER_EMAIL!
const TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD!

test('teacher can log in, filter the repository, and assign a passage', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email Address').fill(TEACHER_EMAIL)
  await page.getByLabel('Password').fill(TEACHER_PASSWORD)
  await page.getByRole('button', { name: 'Log In' }).click()
  await expect(page).toHaveURL('/dashboard')

  await page.goto('/repository')
  await page.getByRole('button', { name: 'G1' }).click()
  await expect(page.getByText(/passages found/)).toBeVisible()

  await page.getByRole('link').filter({ hasText: 'Assign →' }).first().click()
  await page.getByRole('button', { name: 'Assign' }).click()
  await page.getByRole('button', { name: 'Confirm Assignment' }).click()
  await expect(page.getByText(/Assigned to/)).toBeVisible()
})
