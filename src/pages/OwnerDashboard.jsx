
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/OwnerDashboard.css'

function OwnerDashboard() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAppointmentMenu, setShowAppointmentMenu] = useState(true)

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

        setAppointments(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const totalAppointments = appointments.length

  const pendingBookings = appointments.filter(
    appointment => appointment.status === 'PENDING'
  ).length

  const approvedBookings = appointments.filter(
    appointment => appointment.status === 'APPROVED'
  ).length

  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'COMPLETED'
  ).length

  return (
    <div className="owner-dashboard">

      {/* Sidebar */}
      <aside className="owner-sidebar">

        <Link to="/" className="sidebar-logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <p className="sidebar-heading">MAIN MENU</p>

        <Link to="/owner-dashboard" className="sidebar-link active">
          <span>▦</span>
          Dashboard
        </Link>

        <button
          className="sidebar-menu-button"
          onClick={() => setShowAppointmentMenu(!showAppointmentMenu)}
        >
          <span>▤</span>
          Appointment Management
          <span className="menu-arrow">
            {showAppointmentMenu ? '⌄' : '›'}
          </span>
        </button>

        {showAppointmentMenu && (
          <div className="sidebar-submenu">

            <Link to="/owner-appointments">
              All Appointments
            </Link>

            <Link to="/review-bookings">
              Pending Bookings
            </Link>

            <Link to="/owner-appointments?status=COMPLETED">
              Completed Appointments
            </Link>
            <Link to="/owner-appointments?status=APPROVED">
  Approved Appointments
</Link>

          </div>
        )}

        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="sidebar-logout">
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* Main dashboard */}
      <main className="owner-main">

        <header className="owner-topbar">
          <div>
            <p className="owner-topbar-label">SALON MANAGEMENT</p>
            <h2>Dashboard</h2>
          </div>

          <div className="owner-profile">
            <span className="owner-profile-icon">♛</span>
            <span>Salon Owner</span>
          </div>
        </header>

        <section className="owner-welcome">
          <p>WELCOME BACK</p>
          <h1>Welcome, Salon Owner!</h1>
          <span>
            Here's an overview of your salon appointments.
          </span>
        </section>

        <section className="owner-overview">

          <h2>Appointment Overview</h2>

          <p className="overview-description">
            Keep track of your salon bookings and appointments.
          </p>

          {loading && <p>Loading appointment summaries...</p>}

          {error && <p className="owner-error">{error}</p>}

          {!loading && !error && (
            <div className="owner-summary-cards">

              <div className="summary-card total-card">
                <div className="summary-icon">▤</div>
                <p>Total Appointments</p>
                <h3>{totalAppointments}</h3>
                <span>All customer bookings</span>
              </div>

              <div className="summary-card pending-card">
                <div className="summary-icon">◷</div>
                <p>Pending Bookings</p>
                <h3>{pendingBookings}</h3>
                <span>Waiting for approval</span>
              </div>

              <div className="summary-card approved-card">
                <div className="summary-icon">✓</div>
                <p>Approved Bookings</p>
                <h3>{approvedBookings}</h3>
                <span>Confirmed appointments</span>
              </div>

              <div className="summary-card completed-card">
                <div className="summary-icon">★</div>
                <p>Completed Appointments</p>
                <h3>{completedAppointments}</h3>
                <span>Services completed</span>
              </div>

            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default OwnerDashboard
