
import '../styles/MyAppointments.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  async function getAppointments() {
    const token = localStorage.getItem('accessToken')

    try {
      const response = await fetch(
        'http://localhost:5000/api/appointments/my-appointments',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not load appointments.')
      }

      setAppointments(data)
      return true
    } catch (error) {
      setMessage(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAppointments()
  }, [])

  async function handleCancel(appointmentId) {
    const token = localStorage.getItem('accessToken')

    setMessage('')
    setCancellingId(appointmentId)

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not cancel appointment.')
      }

      const refreshed = await getAppointments()

      if (refreshed) {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="my-appointments-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/customer-dashboard">Dashboard</Link>
        </div>
      </nav>

      <div className="booking-header">
        <p>BEAUTY • STYLE • CONFIDENCE</p>
        <h1>My Appointments</h1>
        <span>View and keep track of your salon appointments.</span>
      </div>

      <div className="appointments-container">

        {message && <p>{message}</p>}

        {loading ? (
          <p>Loading your appointments...</p>
        ) : appointments.length === 0 ? (
          <div>
            <h2>No Appointments Yet</h2>
            <p>You have not booked any appointments yet.</p>
            <Link to="/booking">Book an Appointment</Link>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              className="appointment-card"
              key={appointment.appointment_id}
            >
              <h2>{appointment.service_name}</h2>

              <p>
                Date: <strong>{String(appointment.appointment_date).slice(0, 10)}</strong>
              </p>

              <p>
                Time: <strong>{String(appointment.appointment_time).slice(0, 5)}</strong>
              </p>

              <p>
                Price: <strong>R{Number(appointment.price).toFixed(2)}</strong>
              </p>

              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </p>

              <p>
                Staff: <strong>{appointment.staff_name || 'Not assigned yet'}</strong>
              </p>

              {appointment.status === 'PENDING' && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(appointment.appointment_id)}
                  disabled={cancellingId === appointment.appointment_id}
                >
                  {cancellingId === appointment.appointment_id
                    ? 'Cancelling...'
                    : 'Cancel Appointment'}
                </button>
              )}
            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default MyAppointments
