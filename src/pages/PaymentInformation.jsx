
import '../styles/PaymentInformation.css'
import { Link } from 'react-router-dom'
import '../styles/PaymentInformation.css'

function PaymentInformation() {
  return (
    <div className="payment-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/customer-dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="payment-header">
        <p>BEAUTY • STYLE • CONFIDENCE</p>
        <h1>Payment Information</h1>
        <span>Everything you need to know about paying for your service.</span>
      </section>

      <section className="payment-container">

        <div className="payment-card">
          <div className="payment-icon">💵</div>

          <h2>Cash Payment</h2>

          <p>
            SalonConnect currently accepts cash payments at the salon.
            You can pay after receiving your hair service.
          </p>

          <div className="payment-details">
            <p><strong>Payment Method:</strong> Cash</p>
            <p><strong>Payment Location:</strong> At the salon</p>
            <p><strong>When to Pay:</strong> After receiving your service</p>
            <p><strong>Online Payments:</strong> Not available</p>
          </div>

        </div>

       
      </section>

    </div>
  )
}

export default PaymentInformation
