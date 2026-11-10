
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Booking() {
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [bookedTimes, setBookedTimes] = useState([])
  const [availabilityError, setAvailabilityError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
  ]

  useEffect(() => {
    async function getServices() {
      try {
        const response = await fetch('http://localhost:5000/api/services')
        const data = await response.json()

        if (!response.ok) {
          throw new Error('Could not load services.')
        }

        setServices(data)
      } catch (error) {
        setMessage('Could not load salon services. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    getServices()
  }, [])

  // Check which times are already booked for the selected date
  useEffect(() => {
    async function getBookedTimes() {
      if (!date) {
        setBookedTimes([])
        setAvailabilityError('')
        return
      }

      setAvailabilityError('')
      setBookedTimes([])

      try {
        const response = await fetch(
          `http://localhost:5000/api/appointments/availability?date=${date}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error('Could not check available times.')
        }

        setBookedTimes(data)
      } catch (error) {
        setAvailabilityError(
          'Could not check available times. Please try again.'
        )
      }
    }

    getBookedTimes()
  }, [date])

  const selectedService = services.find(
    (item) => item.service_id === Number(service)
  )

  async function handleBooking(e) {
    e.preventDefault()
    setMessage('')

    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login', { state: { from: '/booking' } })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          service_id: Number(service),
          appointment_date: date,
          appointment_time: time
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not submit your booking.')

        // Refresh the booked times if the selected slot was taken
        if (response.status === 409) {
          setBookedTimes((previous) => [...previous, time])
        }

        return
      }
alert('Your appointment request was submitted successfully! The salon owner will review your booking.')

      // Mark this time as booked and keep the booking details visible
      setBookedTimes((previous) => [...previous, time])

    } catch (error) {
      setMessage('Could not connect to the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
         <Link to="/customer-dashboard">Dashboard</Link>
        </div>

       

        
      </nav>

      <div className="booking-header">
        <p>BEAUTY • STYLE • CONFIDENCE</p>
        <h1>Book Your Appointment</h1>
        <span>
          Choose your preferred service and schedule your visit with us.
        </span>
      </div>

      <div className="booking-container">

        <form className="booking-form" onSubmit={handleBooking}>

          <h2>Appointment Details</h2>

          <label>Select Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">
              {loading ? 'Loading services...' : 'Choose a service'}
            </option>

            {services.map((item) => (
              <option key={item.service_id} value={item.service_id}>
                {item.service_name} - R{Number(item.price).toFixed(2)}
              </option>
            ))}
          </select>

          {message && <p>{message}</p>}

          <label>Appointment Date</label>
          <input
            type="date"
            value={date}
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(e) => {
              setDate(e.target.value)
              setTime('')
            }}
            required
          />

          <label>Appointment Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={!date || availabilityError !== ''}
          >
            <option value="">Choose a time</option>

            {availableTimes.map((slot) => {
              const isBooked = bookedTimes.includes(slot)

              return (
                <option
                  key={slot}
                  value={slot}
                  disabled={isBooked}
                >
                  {slot} {isBooked ? '(Booked)' : ''}
                </option>
              )
            })}
          </select>

          {availabilityError && <p>{availabilityError}</p>}

          <div className="booking-summary">
            <h3>Booking Summary</h3>

            <p>
              Service: <strong>{selectedService?.service_name || 'Not selected'}</strong>
            </p>

            <p>
              Date: <strong>{date || 'Not selected'}</strong>
            </p>

            <p>
              Time: <strong>{time || 'Not selected'}</strong>
            </p>

            <h3>
              Total Price: R{selectedService ? Number(selectedService.price).toFixed(2) : '0.00'}
            </h3>

            <p>Payment will be made in cash at the salon.</p>
          </div>

          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={
              loading ||
              submitting ||
              services.length === 0 ||
              !date ||
              !time ||
              bookedTimes.includes(time) ||
              availabilityError !== ''
            }
          >
            {submitting ? 'Submitting...' : 'Confirm Booking'}
          </button>

        </form>

      </div>

      <footer>
        <h2>Salon<span>Connect.</span></h2>
        <p>Beauty, style and confidence.</p>
        <p>© 2026 SalonConnect. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Booking
