import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { bookings, createApp, eventTypes } from '../src/app.js'

beforeEach(() => {
  bookings.splice(0)
})

describe('booking API', () => {
  it('returns Event Types', async () => {
    const response = await request(createApp()).get('/event-types')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(eventTypes)
  })

  it('creates a booking and rejects partial overlap across Event Types', async () => {
    const app = createApp()
    const first = await request(app).post('/bookings').send({
      eventTypeId: 'planning',
      guestName: 'Алия',
      guestEmail: 'aliya@example.com',
      start: '2026-12-01T10:00:00+05:00',
      timezone: 'Asia/Almaty',
    })
    expect(first.status).toBe(201)

    const conflict = await request(app).post('/bookings').send({
      eventTypeId: 'intro',
      guestName: 'Дамир',
      guestEmail: 'damir@example.com',
      start: '2026-12-01T10:30:00+05:00',
      timezone: 'Asia/Almaty',
    })
    expect(conflict.status).toBe(409)
    expect(conflict.body.message).toContain('overlaps')
  })

  it('allows a booking that starts at an existing booking end', async () => {
    const app = createApp()
    await request(app).post('/bookings').send({
      eventTypeId: 'planning',
      guestName: 'Алия',
      guestEmail: 'aliya@example.com',
      start: '2026-12-01T10:00:00+05:00',
      timezone: 'Asia/Almaty',
    })
    const adjacent = await request(app).post('/bookings').send({
      eventTypeId: 'intro',
      guestName: 'Дамир',
      guestEmail: 'damir@example.com',
      start: '2026-12-01T11:00:00+05:00',
      timezone: 'Asia/Almaty',
    })
    expect(adjacent.status).toBe(201)
  })

  it('returns validation details for invalid data', async () => {
    const response = await request(createApp()).post('/bookings').send({})
    expect(response.status).toBe(400)
    expect(response.body.errors).toEqual(
      expect.arrayContaining(['eventTypeId', 'guestName', 'guestEmail', 'start', 'timezone']),
    )
  })
})
