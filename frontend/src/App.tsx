import { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { createClient } from './api/generated/client'
import { createBooking, listEventTypes, listSlots, listUpcomingBookings } from './api/generated'
import './App.css'

const client = createClient({ baseUrl: '' })

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-panel">
        <p className="eyebrow">Простое планирование встреч</p>
        <h1>Записывайте встречи и управляйте временем</h1>
        <p className="hero-description">Выберите удобное время и организуйте встречу без лишних сообщений.</p>
        <Link className="primary-action" to="/booking">Записаться</Link>
      </section>
    </main>
  )
}

function BookingCatalog() {
  const [eventTypes, setEventTypes] = useState<Array<{ id: string; name: string; description: string; durationMinutes: number }>>([])

  useEffect(() => {
    listEventTypes({ client }).then(({ data }) => {
      if (Array.isArray(data)) setEventTypes(data)
    })
  }, [])

  return (
    <main className="catalog-page">
      <p className="eyebrow">Каталог типов встреч</p>
      <h1>Выберите встречу</h1>
      <div className="event-types">
        {eventTypes.map((eventType) => (
          <Link key={eventType.id} className="event-type-card" to={`/booking/${eventType.id}`}>
            <strong>{eventType.name}</strong>
            <span>{eventType.description}</span>
            <span>{eventType.durationMinutes} мин</span>
          </Link>
        ))}
      </div>
    </main>
  )
}

function BookingCalendar() {
  const { eventTypeId } = useParams()
  const [slots, setSlots] = useState<Array<{ start: string; end: string }>>([])
  const [selected, setSelected] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [message, setMessage] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!eventTypeId) return
    listSlots({ client, path: { eventTypeId } }).then(({ data }) => {
      if (Array.isArray(data)) setSlots(data)
    })
  }, [eventTypeId])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')
    const result = await createBooking({
      client,
      body: { eventTypeId: eventTypeId!, guestName, guestEmail, start: selected, timezone: 'Asia/Almaty' },
    })
    if (result.data) {
      setConfirmed(true)
      setMessage('Встреча успешно записана')
    } else if (result.error) {
      const conflict = 'conflict' in result.error ? result.error.conflict : undefined
      setMessage(conflict ? `Конфликт слота: ${conflict.start}–${conflict.end}` : 'Проверьте данные записи')
    }
  }

  if (confirmed) {
    return <main className="catalog-page"><h1>Встреча подтверждена</h1><p>{message}</p></main>
  }

  return (
    <main className="catalog-page">
      <h1>Выберите слот</h1>
      <div className="slots">
        {slots.map((slot) => (
          <button key={slot.start} type="button" onClick={() => setSelected(slot.start)}>
            {new Date(slot.start).toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
          </button>
        ))}
      </div>
      {selected && (
        <form onSubmit={submit} className="booking-form">
          <label>Имя<input value={guestName} onChange={(event) => setGuestName(event.target.value)} /></label>
          <label>Email<input type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} /></label>
          <button type="submit">Записаться</button>
        </form>
      )}
      {message && <p role="alert">{message}</p>}
    </main>
  )
}

function UpcomingPage() {
  const [bookings, setBookings] = useState<Array<{ id: string; eventTypeId: string; guestName: string; start: string }>>([])
  useEffect(() => {
    listUpcomingBookings({ client }).then(({ data }) => {
      if (data) setBookings(data as typeof bookings)
    })
  }, [])
  return (
    <main className="catalog-page">
      <h1>Предстоящие встречи</h1>
      {bookings.map((booking) => (
        <article key={booking.id}>
          <strong>{booking.eventTypeId}</strong>
          <span>{booking.guestName}</span>
          <time>{new Date(booking.start).toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}</time>
        </article>
      ))}
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingCatalog />} />
      <Route path="/booking/:eventTypeId" element={<BookingCalendar />} />
      <Route path="/owner/bookings" element={<UpcomingPage />} />
    </Routes>
  )
}

export default App
