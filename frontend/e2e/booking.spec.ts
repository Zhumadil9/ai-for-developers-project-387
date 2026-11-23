import { expect, test } from '@playwright/test'

test('guest books a slot and Owner sees the upcoming meeting', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Записаться' }).click()
  await expect(page.getByRole('heading', { name: 'Выберите встречу' })).toBeVisible()
  await page.getByRole('link', { name: /Знакомство/ }).click()
  await expect(page.getByRole('heading', { name: 'Выберите слот' })).toBeVisible()
  const slot = page.locator('.slots button').first()
  await slot.click()
  await page.getByLabel('Имя').fill('Алия')
  await page.getByLabel('Email').fill('aliya@example.com')
  await page.getByLabel('Тема звонка').fill('Обсудить запуск проекта')
  await page.getByRole('button', { name: 'Записаться' }).click()
  await expect(page.getByRole('heading', { name: 'Встреча подтверждена' })).toBeVisible()

  await page.goto('/owner/bookings')
  await expect(page.getByRole('heading', { name: 'Предстоящие встречи' })).toBeVisible()
  await expect(page.getByText('Алия')).toBeVisible()
  await expect(page.getByText('Тема: Обсудить запуск проекта')).toBeVisible()
})
