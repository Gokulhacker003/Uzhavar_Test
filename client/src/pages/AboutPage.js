import 'leaflet/dist/leaflet.css';
import '../App.css';
import founderImg from '../assert/founder.jpg'
import adminImg from '../assert/admin.jpg'

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Who We Are</h1>
          <div className="about-statement">
            <p>We are Uzhavar Connect – a full-stack, no-nonsense, execution team for farmers.</p>
            <p className="highlight">We've built farms. Not decks.</p>
            <p className="highlight">We don't sell leads. We take responsibility.</p>
          </div>
        </div>
        <div className="about-hero-image">
          <img src="https://media.istockphoto.com/id/1316735334/photo/young-indian-farmer-with-agronomist-at-banana-field.jpg?s=612x612&w=0&k=20&c=SjD-Bi-oO9LsYUSB69Jphal7nB-DySGiwLb8aDnw8UI=" alt="Farm Workers" />
        </div>
      </section>
      
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>Whether you're a 10-acre landowner or NRI, we offer peace of mind, proof of work, and professional systems.</p>
        <blockquote>Build your farm like it's a factory.</blockquote>
      </section>
      
      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={founderImg} alt="Founder" />
            <h3>Velu Samy</h3>
            <p style={{ color: '#388e3c', fontWeight: 'bold' }}>Founder</p>
          </div>
          <div className="team-member">
            <img src={adminImg} alt="Admin" />
            <h3>Prasanth</h3>
            <p style={{ color: '#388e3c', fontWeight: 'bold' }}>Admin</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;