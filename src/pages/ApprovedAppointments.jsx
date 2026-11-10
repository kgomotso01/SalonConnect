
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ApprovedAppointments.css'

function ApprovedAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem('accessToken')

        const response = await fetch(
          'http://localhost:5000/api/appointments',
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

        setAppointments(
          data.filter(item => item.status === 'APPROVED')
        )
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  return (
    <div className="approved-page">

      <nav className="approved-navbar">
        <Link to="/" className="approved-logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <Link to="/owner-dashboard" className="approved-back-btn">
          Back to Dashboard
        </Link>
      </nav>

      <main className="approved-content">

        <div className="approved-heading">
          <div>
            <p className="approved-label">SALON MANAGEMENT</p>
            <h1>Approved Appointments</h1>
            <p>View confirmed bookings and their assigned staff members.</p>
          </div>

          <div className="approved-count">
            <span>{appointments.length}</span>
            <p>Approved</p>
          </div>
        </div>

        {loading && (
          <p className="approved-message">Loading approved appointments...</p>
        )}

        {error && (
          <div className="approved-error">{error}</div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="approved-empty">
            <div className="approved-empty-icon">♡</div>
            <h3>No approved appointments</h3>
            <p>Approved customer bookings will appear here.</p>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="approved-list">

            {appointments.map(appointment => (
              <div
                className="approved-card"
                key={appointment.appointment_id}
              >

                <div className="approved-card-header">
                  <div>
                    <span className="approved-number">
                      APPOINTMENT #{appointment.appointment_id}
                    </span>

                    <h2>{appointment.service_name}</h2>
                  </div>

                  <span className="approved-status">
                    APPROVED
                  </span>
                </div>

                <div className="approved-details">

                  <div className="approved-detail">
                    <span>Customer</span>
                    <strong>{appointment.customer_name}</strong>
                  </div>

                  <div className="approved-detail">
                    <span>Phone Number</span>
                    <strong>
                      {appointment.customer_phone || 'Not provided'}
                    </strong>
                  </div>

                  <div className="approved-detail">
                    <span>Appointment Date</span>
                    <strong>
                      {String(appointment.appointment_date).slice(0, 10)}
                    </strong>
                  </div>

                  <div className="approved-detail">
                    <span>Appointment Time</span>
                    <strong>{appointment.appointment_time}</strong>
                  </div>

                  <div className="approved-detail">
                    <span>Service Price</span>
                    <strong>
                      R{Number(appointment.price).toFixed(2)}
                    </strong>
                  </div>

                  <div className="approved-detail">
                    <span>Assigned Staff</span>
                    <strong>
                      {appointment.staff_name || 'Not assigned'}
                    </strong>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default ApprovedAppointments
