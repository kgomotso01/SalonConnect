
import { Link } from 'react-router-dom'

function Services() {
  const services = [
    {
      name: 'Knotless Braids',
      price: 250,
      image: '/images/knotless.png',
      description: 'Beautiful knotless braids for a neat and stylish look.'
    },
    {
      name: 'Treatment',
      price: 200,
      image: '/images/treatment.png',
      description: 'Classic treatment for a beautiful everyday style.'
    },
    {
      name: 'Cornrows',
      price: 100,
      image: '/images/cornrows.png',
      description: 'Neat and beautiful cornrow braiding styles.'
    },
    {
      name: 'Hair Washing',
      price: 50,
      image: '/images/washing.png',
      description: 'A refreshing hair wash to keep your hair clean.'
    },
    {
      name: 'Dreadlocks',
      price: 300,
      image: '/images/dreadlocks.png',
      description: 'Beautiful dreadlock styles for a unique look.'
    },
    {
      name: 'Hair Styling',
      price: 30,
      image: '/images/styling.png',
      description: 'Get your hair styled into a look you love.'
    }
  ]

  return (
    <div className="services-page">

      {/* Navigation */}
      <nav className="navbar">
        <Link to="/" className="logo">
          ♛ Salon<span>Connect.</span>
        </Link>

        <div className="nav-links">
          
          
          <Link to="/customer-dashboard">Dashboard</Link>
        </div>

        
      </nav>

      {/* Services heading */}
      <div className="services-page-header">
        <p>BEAUTY • STYLE • CONFIDENCE</p>

        <h1>Our Salon Services</h1>

        <span>
          At SalonConnect, we believe in quality over quantity.
          We take our time to provide excellent service and make
          sure every client feels valued and respected. We give
          special care to children by being patient and gentle,
          allowing them 10-minute breaks during their appointments
          to help them feel comfortable and safe. Our goal is to
          create a warm and welcoming environment where every
          client feels cared for and at home.
        </span>
      </div>
      

      {/* Service cards */}
      <div className="service-container">
        {services.map((service) => (
          <div className="service-card" key={service.name}>

            <div className="service-image">
              <img
                src={service.image}
                alt={service.name}
              />
            </div>

            <div className="service-details">
              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <h4 className="service-price">
                R{service.price}
              </h4>
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <footer>
        <h2>Salon<span>Connect.</span></h2>
        <p>Beauty, style and confidence.</p>
        <p>© 2026 SalonConnect. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Services
