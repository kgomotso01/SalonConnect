
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Registration failed.')
        return
      }

      setMessage('Registration successful! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {
      setMessage('Could not connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join SalonConnect today.</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password (minimum 8 characters)"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/">Back to Home</Link>
      </div>
    </div>
  )
}

export default Register
