import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./api/generated', () => ({
  listEventTypes: vi.fn().mockResolvedValue({ data: [
    { id: 'intro', name: 'Знакомство', description: 'Короткое знакомство', durationMinutes: 30 },
  ], error: undefined }),
  listSlots: vi.fn().mockResolvedValue({ data: [], error: undefined }),
  createBooking: vi.fn(),
  listUpcomingBookings: vi.fn().mockResolvedValue({ data: [], error: undefined }),
}))

vi.mock('./api/generated/client', () => ({
  createClient: vi.fn(() => ({})),
}))

afterEach(cleanup)

describe('главная страница', () => {
  it('показывает заголовок и ведёт в Каталог типов встреч', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Записывайте встречи и управляйте временем' }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Записаться' }))
    expect(screen.getByRole('heading', { name: 'Выберите встречу' })).toBeInTheDocument()
  })

  it('открывает каталог типов встреч по прямому адресу', async () => {
    render(
      <MemoryRouter initialEntries={['/booking']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Знакомство')).toBeInTheDocument()
  })
})
