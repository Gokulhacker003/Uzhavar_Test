import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {  FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineConstruction } from 'react-icons/md';
import '../App.css';
import fencingImg from '../assert/fencing.jpg';
import farmhouseImg from '../assert/FArmhouse.jpeg'
import poolImg from '../assert/Swimmingpool.jpeg'
import tankImg from '../assert/tank.jpeg'
import polyhouseImg from '../assert/polly.jpeg'
import shedImg from '../assert/goat.jpg'
import projects from '../data/projects';

function ConstructionPage() {

  return (
    <div className="construction-page">
      <section className="page-header">
        <h1><MdOutlineConstruction /> Construction Services</h1>
        <p>Quality infrastructure for your farm with professional teams</p>
      </section>
      
      <section className="construction-intro">
        <div className="intro-content">
          <h2>Farm Infrastructure Experts</h2>
          <p>From water storage to living spaces, we build the facilities your farm needs to thrive.</p>
          <p>All our construction projects come with:</p>
          <ul>
            <li>Detailed planning and estimation</li>
            <li>Quality materials</li>
            <li>Professional construction teams</li>
            <li>Regular progress updates</li>
            <li>Photo documentation</li>
            <li>Transparent billing</li>
          </ul>
          {/* Top Request Quote button removed as requested */}
        </div>
        <div className="intro-image">
          <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farm Construction" />
        </div>
      </section>

      
      <section className="construction-services">
        <h2>Our Construction Services</h2>
        <div className="service-cards">
          <div className="service-card">
        <img src={farmhouseImg} alt="Farmhouse" />
        <h3>Farmhouses</h3>
        <p>Elegant farm living with modern comforts.</p>
        <p>Perfect for retreats or permanent residence.</p>
      </div>

      <div className="service-card">
        <img src={poolImg} alt="Swimming Pool" />
        <h3>Swimming Pools</h3>
        <p>Luxury pools designed for relaxation & fun.</p>
        <p>Durable, stylish, and low-maintenance.</p>
      </div>

      <div className="service-card">
        <img src={tankImg} alt="Water Tanks" />
        <h3>Water Tanks</h3>
        <p>Reliable storage for irrigation & livestock.</p>
        <p>Built strong, lasting through all seasons.</p>
      </div>

      <div className="service-card">
        <img src={fencingImg} alt="Fencing" />
        <h3>Fencing</h3>
        <p>Secure & durable fencing solutions.</p>
        <p>Protect crops, livestock, and property.</p>
      </div>

      <div className="service-card">
        <img src={polyhouseImg} alt="Polyhouse" />
        <h3>Polyhouse</h3>
        <p>Climate-controlled farming spaces.</p>
        <p>Boosts yield with advanced technology.</p>
      </div>

      <div className="service-card">
        <img src={shedImg} alt="Cow & Goat Shed" />
        <h3>Cow & Goat Sheds</h3>
        <p>Hygienic, ventilated, and durable shelters.</p>
        <p>Designed for animal comfort & health.</p>
      </div>
        </div>
      </section>
      
      <section className="construction-cta">
        <h2>Ready to Start Your Construction Project?</h2>
        <div className="cta-buttons">
          <Link to="/request-quote" className="btn btn-primary">Request Quote</Link>
          {/* See Past Constructions button removed as requested */}
        </div>
      </section>
      
      <div className="projects-grid">
        {projects.map(project => (
          <div className="gallery-project-card" key={project.id}>
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="project-location"><FaMapMarkerAlt /> {project.location}</p>
              <div className="project-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="rating-text">5.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination removed as requested */}
    </div>
  );
}

export default ConstructionPage;