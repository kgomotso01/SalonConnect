
import '../styles/CustomerDashboard.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function CustomerDashboard() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('accessToken')

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter(
    notification => !notification.is_read
  ).length

  // Retrieve notifications
  async function fetchNotifications() {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error retrieving notifications:', error)
    }
  }

  // Check for notifications every 15 seconds
  useEffect(() => {
    if (!token) return

    fetchNotifications()

    const interval = setInterval(fetchNotifications, 15000)

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

  return (
    <div className="customer-dashboard">

      <nav className="dashboard-navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="customer-navbar-actions">

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

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

        </div>
      </nav>

      <section className="dashboard-welcome">
        <p>YOUR BEAUTY JOURNEY STARTS HERE</p>

        <h1>
          Welcome, {user.full_name || 'Customer'}!
        </h1>

        <p>
          Manage your appointments and enjoy your salon experience.
        </p>
      </section>

      <section className="dashboard-content">

        <h2>What would you like to do today?</h2>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>♡ Book an Appointment</h3>
            <p>Choose your preferred salon service and book a visit.</p>
            <Link to="/booking" className="dashboard-btn">
              Book Now
            </Link>
          </div>

          <div className="dashboard-card">
            <h3>My Appointments</h3>
            <p>View and manage your salon bookings.</p>
            <Link to="/my-appointments" className="dashboard-btn">
              My Appointments
            </Link>
          </div>

          <div className="dashboard-card">
            <h3>Our Services</h3>
            <p>Explore our available hair and beauty services.</p>
            <Link to="/services" className="dashboard-btn">
              View Services
            </Link>
          </div>

          <div className="dashboard-card">
            <h3>Payment Information</h3>
            <p>Find out how payments are made for your salon services.</p>
            <Link to="/payment-information" className="dashboard-btn">
              View Payment Information
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}

export default CustomerDashboard
