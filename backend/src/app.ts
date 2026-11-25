import express from 'express'
import { existsSync } from 'node:fs'
import path from 'node:path'

export type EventType = {
  id: string
  name: string
  description: string
  durationMinutes: number
}

export type Booking = {
  id: string
  eventTypeId: string
  guestName: string
  guestEmail: string
  start: string
  end: string
  note?: string
  timezone: 'Asia/Almaty'
}

export const eventTypes: EventType[] = [
  { id: 'intro', name: 'Знакомство', description: 'Короткое знакомство', durationMinutes: 30 },
  { id: 'planning', name: 'Планирование проекта', description: 'Разбор задач и планирование', durationMinutes: 60 },
]

export const bookings: Booking[] = []

function localParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Almaty',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function startForLocalDay(day: string, minutes: number) {
  const iso = `${day}T${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00+05:00`
  return new Date(iso)
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && startB < endA
}

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' })
  })

  app.get('/event-types', (_request, response) => {
    response.status(200).json(eventTypes)
  })

  app.get('/event-types/:eventTypeId/slots', (request, response) => {
    const eventType = eventTypes.find((item) => item.id === request.params.eventTypeId)
    if (!eventType) {
      response.status(400).json({ message: 'Unknown event type', errors: ['eventTypeId'] })
      return
    }

    const slots = []
    const now = new Date()
    const firstDay = new Date(now)
    firstDay.setDate(firstDay.getDate() + 1)

    for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + dayOffset)
      const day = localParts(date)

      for (let minutes = 9 * 60; minutes + eventType.durationMinutes <= 18 * 60; minutes += 30) {
        const start = startForLocalDay(day, minutes)
        const end = new Date(start.getTime() + eventType.durationMinutes * 60_000)
        const conflict = bookings.find((booking) =>
          overlaps(start, end, new Date(booking.start), new Date(booking.end)),
        )
        if (!conflict) {
          slots.push({
            start: start.toISOString(),
            end: end.toISOString(),
            timezone: 'Asia/Almaty',
          })
        }
      }
    }

    response.status(200).json(slots)
  })

  app.post('/bookings', (request, response) => {
    const { eventTypeId, guestName, guestEmail, start, note, timezone } = request.body as Partial<{
      eventTypeId: string
      guestName: string
      guestEmail: string
      start: string
      note: string | null
      timezone: 'Asia/Almaty'
    }>
    const eventType = eventTypes.find((item) => item.id === eventTypeId)
    const errors: string[] = []
    if (!eventType) errors.push('eventTypeId')
    if (!guestName?.trim()) errors.push('guestName')
    if (!guestEmail?.trim()) errors.push('guestEmail')
    if (!start) errors.push('start')
    if (note !== undefined && note !== null && (typeof note !== 'string' || note.length > 500)) errors.push('note')
    if (timezone !== 'Asia/Almaty') errors.push('timezone')

    if (errors.length > 0) {
      response.status(400).json({ message: 'Invalid booking data', errors })
      return
    }

    const startDate = new Date(start!)
    const endDate = new Date(startDate.getTime() + eventType!.durationMinutes * 60_000)
    const conflict = bookings.find((booking) =>
      overlaps(startDate, endDate, new Date(booking.start), new Date(booking.end)),
    )

    if (conflict) {
      response.status(409).json({
        message: 'This slot overlaps another booking',
        conflict: { start: conflict.start, end: conflict.end },
      })
      return
    }

    const booking: Booking = {
      id: `booking-${bookings.length + 1}`,
      eventTypeId: eventTypeId!,
      guestName: guestName!.trim(),
      guestEmail: guestEmail!.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      ...(typeof note === 'string' && note.trim() ? { note: note.trim() } : {}),
      timezone: 'Asia/Almaty',
    }
    bookings.push(booking)
    response.status(201).json(booking)
  })

  app.get('/bookings/upcoming', (_request, response) => {
    const now = Date.now()
    const upcoming = bookings
      .filter((booking) => new Date(booking.start).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    response.status(200).json(upcoming)
  })

  const frontendDist = existsSync(path.resolve(process.cwd(), 'frontend/dist'))
    ? path.resolve(process.cwd(), 'frontend/dist')
    : path.resolve(process.cwd(), '../frontend/dist')
  if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist))
    app.use((_request, response, next) => {
      if (_request.method !== 'GET' || _request.path.startsWith('/api/') ||
          _request.path === '/health' ||
          _request.path === '/event-types' ||
          _request.path.startsWith('/event-types/') ||
          _request.path === '/bookings' ||
          _request.path.startsWith('/bookings/')) {
        next()
        return
      }
      response.sendFile(path.join(frontendDist, 'index.html'))
    })
  }

  return app
}
