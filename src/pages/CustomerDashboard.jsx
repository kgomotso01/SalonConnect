
import '../styles/CustomerDashboard.css'
import { Link, useNavigate } from 'react-router-dom'

function CustomerDashboard() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

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

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
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
              View Appointments
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
            <h3>Deposit Status</h3>
            <p>Keep track of your appointment deposits.</p>
            <Link to="/my-appointments" className="dashboard-btn">
              Check Status
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}

export default CustomerDashboard
