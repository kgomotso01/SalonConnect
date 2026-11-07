
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Booking from './pages/Booking'
import CustomerDashboard from './pages/CustomerDashboard'
import MyAppointments from './pages/MyAppointments'
import PaymentInformation from './pages/PaymentInformation'
import './App.css'

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
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
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

      <footer id="contact">
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
        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />
        <Route path="/payment-information" element={<PaymentInformation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
