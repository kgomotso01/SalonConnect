
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/OwnerDashboard.css'

function OwnerDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('accessToken')

  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAppointmentMenu, setShowAppointmentMenu] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(
    notification => !notification.is_read
  ).length

  // Fetch appointments
  async function fetchAppointments() {
    try {
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
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch owner notifications
  async function fetchNotifications() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error retrieving notifications:', error)
    }
  }

  // Refresh appointments and notifications every 15 seconds
  useEffect(() => {
    if (!token) return

    fetchAppointments()
    fetchNotifications()

    const interval = setInterval(() => {
      fetchAppointments()
      fetchNotifications()
    }, 15000)

    return () => clearInterval(interval)
  }, [token])

  // Open notifications and mark them as read
  async function handleNotificationClick() {
    const willOpen = !showNotifications
    setShowNotifications(willOpen)

    if (willOpen && unreadCount > 0) {
      try {
        const response = await fetch(
          'http://localhost:5000/api/notifications/read-all',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.ok) {
          setNotifications(previous =>
            previous.map(notification => ({
              ...notification,
              is_read: 1
            }))
          )
        }
      } catch (error) {
        console.error('Error marking notifications as read:', error)
      }
    }
  }

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
              Pending Bookings ({pendingBookings})
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

          <div className="owner-topbar-actions">

            <div className="notification-container">
              <button
                className="notification-bell"
                onClick={handleNotificationClick}
                title="Notifications"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="notification-count">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <h3>Notifications</h3>

                  {notifications.length === 0 ? (
                    <p className="no-notifications">
                      You have no notifications.
                    </p>
                  ) : (
                    notifications.map(notification => (
                      <div
                        className={`notification-item ${
                          !notification.is_read ? 'unread' : ''
                        }`}
                        key={notification.notification_id}
                      >
                        <p>{notification.message}</p>

                        <small>
                          {new Date(notification.created_at).toLocaleString()}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="owner-profile">
              <span className="owner-profile-icon">♛</span>
              <span>Salon Owner</span>
            </div>

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
