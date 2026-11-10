
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import '../styles/OwnerAppointments.css'

function OwnerAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()

  const statusFilter = searchParams.get('status')

  async function fetchAppointments() {
    try {
      setLoading(true)
      setError('')

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
        throw new Error(data.message || 'Could not retrieve appointments.')
      }

      setAppointments(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function completeAppointment(appointmentId) {
    const confirmComplete = window.confirm(
      'Are you sure you want to mark this appointment as completed?'
    )

    if (!confirmComplete) return

    try {
      setMessage('')
      setError('')

      const token = localStorage.getItem('accessToken')

      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/complete`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not complete appointment.')
      }

      setMessage(data.message)
      await fetchAppointments()
    } catch (error) {
      setError(error.message)
    }
  }

  const displayedAppointments = statusFilter
    ? appointments.filter(
        appointment => appointment.status === statusFilter
      )
    : appointments

  const pageTitle = statusFilter === 'COMPLETED'
    ? 'Completed Appointments'
    : 'All Appointments'

  return (
    <div className="appointments-page">

      {/* Navigation */}
      <nav className="appointments-navbar">
        <Link to="/" className="appointments-logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <Link to="/owner-dashboard" className="appointments-back-btn">
          Back to Dashboard
        </Link>
      </nav>

      {/* Page content */}
      <main className="appointments-content">

        <div className="appointments-heading">
          <div>
            <p className="appointments-label">SALON MANAGEMENT</p>
            <h1>{pageTitle}</h1>
            <p>Manage and keep track of your customer bookings.</p>
          </div>

          <div className="appointments-count">
            <span>{displayedAppointments.length}</span>
            <p>Appointments</p>
          </div>
        </div>

        {message && (
          <div className="appointments-success">
            {message}
          </div>
        )}

        {error && (
          <div className="appointments-error">
            {error}
          </div>
        )}

        {loading && (
          <p className="appointments-message">Loading appointments...</p>
        )}

        {!loading && !error && displayedAppointments.length === 0 && (
          <div className="appointments-empty">
            <div className="empty-icon">♡</div>
            <h3>No appointments found</h3>
            <p>
              {statusFilter === 'COMPLETED'
                ? 'There are no completed appointments yet.'
                : 'No appointments have been booked yet.'}
            </p>
          </div>
        )}

        {!loading && !error && displayedAppointments.length > 0 && (
          <div className="appointments-list">

            {displayedAppointments.map(appointment => (
              <div
                className="appointment-card"
                key={appointment.appointment_id}
              >

                <div className="appointment-card-top">
                  <div>
                    <span className="appointment-number">
                      APPOINTMENT #{appointment.appointment_id}
                    </span>

                    <h2>{appointment.service_name}</h2>
                  </div>

                  <span
                    className={`appointment-status ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">

                  <div className="appointment-detail">
                    <span>Customer</span>
                    <strong>{appointment.customer_name}</strong>
                  </div>

                  <div className="appointment-detail">
                    <span>Phone Number</span>
                    <strong>
                      {appointment.customer_phone || 'Not provided'}
                    </strong>
                  </div>

                  <div className="appointment-detail">
                    <span>Appointment Date</span>
                    <strong>
                      {String(appointment.appointment_date).slice(0, 10)}
                    </strong>
                  </div>

                  <div className="appointment-detail">
                    <span>Appointment Time</span>
                    <strong>{appointment.appointment_time}</strong>
                  </div>

                  <div className="appointment-detail">
                    <span>Service Price</span>
                    <strong>
                      R{Number(appointment.price).toFixed(2)}
                    </strong>
                  </div>

                  <div className="appointment-detail">
                    <span>Assigned Staff</span>
                    <strong>
                      {appointment.staff_name || 'Not assigned yet'}
                    </strong>
                  </div>

                </div>

                {appointment.status === 'APPROVED' && (
                  <div className="appointment-card-actions">
                    <button
                      onClick={() =>
                        completeAppointment(appointment.appointment_id)
                      }
                      className="complete-appointment-btn"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default OwnerAppointments
