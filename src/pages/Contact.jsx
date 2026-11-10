
import { Link } from 'react-router-dom'
import '../styles/Contact.css'

function Contact() {
  return (
    <div className="contact-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
         
        </div>
      </nav>

      <section className="contact-header">
        <p>BEAUTY • STYLE • CONFIDENCE</p>
        <h1>Contact Us</h1>
        <span>We would love to hear from you!</span>
      </section>

      <section className="contact-container">

        <h2>Get in Touch</h2>
        <p className="contact-intro">
          Have questions or need assistance with your appointment?
          Feel free to contact us using the details below.
        </p>

        <div className="contact-cards">

          <div className="contact-card">
            <h3>Phone</h3>
            <p>073 058 9541</p>
            <a href="tel:0730589541">Call Us</a>
          </div>

          <div className="contact-card">
            <h3>WhatsApp</h3>
            <p>073 058 9541</p>
            <a
              href="https://wa.me/27730589541"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-card">
            <h3>Email</h3>
            <p>salonconnect@gmail.com</p>
            <a href="mailto:salonconnect@gmail.com">
              Send Email
            </a>
          </div>

          <div className="contact-card">
            <h3>Salon Address</h3>
           <p>15 Daniel Malan Ave, Florida Park, Roodepoort, 1709</p>
            <a
            href="https://www.google.com/maps/search/?api=1&query=15+Daniel+Malan+Ave+Florida+Park+Roodepoort+1709+South+Africa"
            >
              View Location
            </a>
          </div>

        </div>

       

      </section>

    </div>
  )
}

export default Contact
