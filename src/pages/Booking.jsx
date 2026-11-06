
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Booking() {
  const [services, setServices] = useState([])
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

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

  const selectedService = services.find(
    (item) => item.service_id === Number(service)
  )

  function handleBooking(e) {
    e.preventDefault()

    alert('Booking request submitted! The salon owner will review your appointment.')
  }

  return (
    <div className="booking-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
        </div>

        <Link to="/login" className="login-btn">
          Login
        </Link>
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
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Appointment Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">Choose a time</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
          </select>

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
            disabled={loading || services.length === 0}
          >
            Confirm Booking
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
