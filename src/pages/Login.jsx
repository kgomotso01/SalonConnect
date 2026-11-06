
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Login failed.')
        return
      }

      // Save login details
      localStorage.setItem('accessToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setMessage('Login successful!')

      // Go to customer dashboard
      setTimeout(() => {
  if (data.user.role === 'CUSTOMER') {
    navigate('/customer-dashboard')
  } else if (data.user.role === 'STAFF') {
    navigate('/staff-dashboard')
  } else if (data.user.role === 'OWNER') {
    navigate('/owner-dashboard')
  }
}, 1000)

    } catch (error) {
      setMessage('Could not connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back!</h1>
        <p>Login to your SalonConnect account.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <Link to="/">Back to Home</Link>
      </div>
    </div>
  )
}

export default Login
