import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {  FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineConstruction } from 'react-icons/md';
import { useState } from 'react';
import '../App.css';
import fencingImg from '../assert/fencing.jpg';
import farmhouseImg from '../assert/FArmhouse.jpeg'
import poolImg from '../assert/Swimmingpool.jpeg'
import tankImg from '../assert/tank.jpeg'
import polyhouseImg from '../assert/polly.jpeg'
import shedImg from '../assert/goat.jpg'
import projects from '../data/projects';

function ConstructionPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery images
  const galleryImages = [
    { id: 1, src: process.env.PUBLIC_URL + '/assert/RENTAL1.jpg', title: 'Construction Project 1' },
    { id: 2, src: process.env.PUBLIC_URL + '/assert/RENTAL2.jpg', title: 'Construction Project 2' },
    { id: 3, src: process.env.PUBLIC_URL + '/assert/RENTAL3.jpg', title: 'Construction Project 3' },
    { id: 4, src: process.env.PUBLIC_URL + '/assert/RENTAL4.jpg', title: 'Construction Project 4' },
    { id: 5, src: process.env.PUBLIC_URL + '/assert/RENTAL5.jpg', title: 'Construction Project 5' },
    { id: 6, src: process.env.PUBLIC_URL + '/assert/RENTAL6.jpg', title: 'Construction Project 6' },
    { id: 7, src: process.env.PUBLIC_URL + '/assert/RENTAL7.jpg', title: 'Construction Project 7' },
    { id: 8, src: process.env.PUBLIC_URL + '/assert/RENTAL8.jpg', title: 'Construction Project 8' },
    { id: 9, src: process.env.PUBLIC_URL + '/assert/RENTAL9.jpg', title: 'Construction Project 9' }
  ];

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

      {/* Construction Gallery */}
      <section style={{
        padding: '3em 2em',
        background: '#f9f9f9',
        margin: '2em 0'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2e7d32',
          fontSize: '2em',
          marginBottom: '1.5em',
          fontWeight: 700
        }}>
          🏗️ Our Construction Gallery
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5em',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {galleryImages.map(image => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              style={{
                position: 'relative',
                height: '250px',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <img 
                src={image.src} 
                alt={image.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white',
                padding: '1.5em 1em 1em',
                fontSize: '1.1em',
                fontWeight: 600
              }}>
                {image.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2em',
            cursor: 'pointer'
          }}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                color: '#333',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.5em',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              ×
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            />
            <h3 style={{
              color: 'white',
              textAlign: 'center',
              marginTop: '1em',
              fontSize: '1.5em'
            }}>
              {selectedImage.title}
            </h3>
          </div>
        </div>
      )}
      
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