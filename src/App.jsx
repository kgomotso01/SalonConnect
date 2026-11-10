
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Booking from './pages/Booking'
import CustomerDashboard from './pages/CustomerDashboard'
import MyAppointments from './pages/MyAppointments'
import PaymentInformation from './pages/PaymentInformation'
import Contact from './pages/Contact'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerAppointments from './pages/OwnerAppointments'
import ReviewBookings from './pages/ReviewBookings'
import './App.css'

// Protect pages that only the salon owner can access
function OwnerRoute({ children }) {
  const token = localStorage.getItem('accessToken')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!token || !user || user.role !== 'OWNER') {
    return <Navigate to="/login" replace />
  }

  return children
}

function Home() {
  const navigate = useNavigate()

  function handleBooking() {
    const token = localStorage.getItem('accessToken')

    if (token) {
      navigate('/booking')
    } else {
      navigate('/login', { state: { from: '/booking' } })
    }
  }

  return (
    <div className="app">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="welcome">
            BEAUTY • STYLE • CONFIDENCE
          </p>

          <h1>
            Feel beautiful.<br />
            <span>Look amazing.</span>
          </h1>

          <p className="hero-description">
            Your hair deserves the best care. Discover our salon
            services and book your next appointment with just
            a few clicks.
          </p>

          <button onClick={handleBooking} className="book-btn">
            ♡ &nbsp; Book an Appointment →
          </button>

          <p className="hero-note">
            ♡ Your beauty, our passion.
          </p>
        </div>

        <div className="hero-image">
          <img
            src="/images/salon-hero.jpg"
            alt="A stylist braiding a customer's hair in a salon"
          />
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-text">
          <p className="welcome">WHY CHOOSE US?</p>

          <h2>
            Your salon experience,<br />
            made easier.
          </h2>

          <p>
            Spend less time organising appointments and
            more time enjoying your beauty experience.
          </p>
        </div>

        <div className="benefits">
          <p>✓ Easy appointment booking</p>
          <p>✓ Choose your preferred service</p>
          <p>✓ Keep track of your bookings</p>
        </div>
      </section>

      <footer>
        <h2>Salon<span>Connect.</span></h2>
        <p>Beauty, style and confidence.</p>
        <p>© 2026 SalonConnect. All rights reserved.</p>
      </footer>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/owner-dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner-appointments"
          element={
            <OwnerRoute>
              <OwnerAppointments />
            </OwnerRoute>
          }
        />

        <Route
          path="/review-bookings"
          element={
            <OwnerRoute>
              <ReviewBookings />
            </OwnerRoute>
          }
        />

        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/payment-information"
          element={<PaymentInformation />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
