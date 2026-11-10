
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ReviewBookings.css'

function ReviewBookings() {
  const [appointments, setAppointments] = useState([])
  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('accessToken')

  async function fetchData() {
    try {
      setLoading(true)

      const [appointmentResponse, staffResponse] = await Promise.all([
        fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/staff', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const appointmentData = await appointmentResponse.json()
      const staffData = await staffResponse.json()

      if (!appointmentResponse.ok) {
        throw new Error(appointmentData.message || 'Could not load appointments.')
      }

      if (!staffResponse.ok) {
        throw new Error(staffData.message || 'Could not load staff.')
      }

      setAppointments(
        appointmentData.filter(item => item.status === 'PENDING')
      )

      setStaff(staffData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function reviewAppointment(appointmentId, status) {
    setMessage('')
    setError('')

    const staffId = selectedStaff[appointmentId]

    if (status === 'APPROVED' && !staffId) {
      setError('Please select a staff member before approving.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/review`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
            staff_id: status === 'APPROVED' ? staffId : null
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not review appointment.')
      }

      setMessage(data.message)
      await fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="review-page">

      {/* Navigation */}
      <nav className="review-navbar">
        <Link to="/" className="review-logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <Link to="/owner-dashboard" className="review-back-btn">
          Back to Dashboard
        </Link>
      </nav>

      {/* Main content */}
      <main className="review-content">

        <div className="review-heading">
          <div>
            <p className="review-label">SALON MANAGEMENT</p>
            <h1>Pending Bookings</h1>
            <p>Review customer requests and assign a staff member.</p>
          </div>

          <div className="pending-count">
            <span>{appointments.length}</span>
            <p>Pending</p>
          </div>
        </div>

        {message && (
          <div className="review-success">
            {message}
          </div>
        )}

        {error && (
          <div className="review-error">
            {error}
          </div>
        )}

        {loading && (
          <p className="review-message">Loading bookings...</p>
        )}

        {!loading && appointments.length === 0 && !error && (
          <div className="review-empty">
            <div className="review-empty-icon">♡</div>
            <h3>No pending bookings</h3>
            <p>There are currently no customer requests waiting for approval.</p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="review-list">

            {appointments.map(appointment => (
              <div className="review-card" key={appointment.appointment_id}>

                <div className="review-card-header">
                  <div>
                    <span className="review-booking-number">
                      BOOKING #{appointment.appointment_id}
                    </span>

                    <h2>{appointment.service_name}</h2>
                  </div>

                  <span className="review-status">
                    PENDING
                  </span>
                </div>

                <div className="review-details">

                  <div className="review-detail">
                    <span>Customer</span>
                    <strong>{appointment.customer_name}</strong>
                  </div>

                  <div className="review-detail">
                    <span>Phone Number</span>
                    <strong>
                      {appointment.customer_phone || 'Not provided'}
                    </strong>
                  </div>

                  <div className="review-detail">
                    <span>Appointment Date</span>
                    <strong>
                      {String(appointment.appointment_date).slice(0, 10)}
                    </strong>
                  </div>

                  <div className="review-detail">
                    <span>Appointment Time</span>
                    <strong>{appointment.appointment_time}</strong>
                  </div>

                  <div className="review-detail">
                    <span>Service Price</span>
                    <strong>R{Number(appointment.price).toFixed(2)}</strong>
                  </div>

                </div>

                <div className="staff-selection">
                  <label htmlFor={`staff-${appointment.appointment_id}`}>
                    Select Staff Member
                  </label>

                  <select
                    id={`staff-${appointment.appointment_id}`}
                    value={selectedStaff[appointment.appointment_id] || ''}
                    onChange={event =>
                      setSelectedStaff({
                        ...selectedStaff,
                        [appointment.appointment_id]: event.target.value
                      })
                    }
                  >
                    <option value="">Choose staff member</option>

                    {staff.map(member => (
                      <option key={member.staff_id} value={member.staff_id}>
                        {member.staff_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="review-actions">
                  <button
                    className="approve-btn"
                    onClick={() =>
                      reviewAppointment(appointment.appointment_id, 'APPROVED')
                    }
                  >
                    ✓ Approve Booking
                  </button>

                  <button
                    className="decline-btn"
                    onClick={() =>
                      reviewAppointment(appointment.appointment_id, 'DECLINED')
                    }
                  >
                    Decline Booking
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default ReviewBookings
