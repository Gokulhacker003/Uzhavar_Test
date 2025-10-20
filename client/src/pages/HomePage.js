import React, { useState, useEffect } from 'react';
import { getHello } from '../api';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { FaLeaf,FaImage, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import {  MdSettings, MdSell } from 'react-icons/md';
import { BsArrowRightCircle, BsStars } from 'react-icons/bs';
import '../App.css';
import {
  GiFarmTractor,
} from 'react-icons/gi';
import services from '../data/services';
import trustFactors from '../data/trustFactors';
import howItWorks from '../data/howItWorks';
import projects from '../data/projects';


function HomePage({ currentSlide, onBookProject }) {
  const [backendMessage, setBackendMessage] = useState('');
  useEffect(() => {
    getHello().then(data => setBackendMessage(data.message)).catch(() => setBackendMessage('Backend not reachable'));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Manage Your Farm Like a Pro. From Soil to Sale.</h1>
          <p style={{ color: '#388e3c', fontWeight: 'bold' }}>AMC, planting, irrigation, fencing, inputs, tank work, harvesting, buyer connect – all in one app. With photo proof.</p>
          <div style={{marginBottom: '1em', color: 'green', fontWeight: 'bold'}}>
            Backend says: {backendMessage}
          </div>
          <div className="hero-cta">
            <Link to="/manage-farm" className="btn btn-primary"><GiFarmTractor /> Start Managing My Farm</Link>
            <Link to="/buy-inputs" className="btn btn-primary"><FaShoppingCart /> Buy Agri Inputs</Link>
            <Link to="/sell-produce" className="btn btn-primary"><MdSell /> Sell My Produce</Link>
            <Link to="/book-team" className="btn btn-primary" >Book Our Team</Link>
            <Link to="/farm-details" className="btn btn-primary">   Upload My Farm Details</Link>
            {/* Book a Project button removed as requested */}
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Farm Management" />
        </div>
      </section>


      <section className="what-we-do-section">
        <div className="section-heading">
            <div className="section-heading-container">
                <h2><FaLeaf /> We Are Ullavar Connect – What We Do</h2>
                <p className="tagline">We are not a consultancy. Not just labour. We are your farm's execution team – structured, documented, scheduled.</p>
            </div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-card-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
  {/* Explore All Services button removed as requested */}
      </section>

      <section className="trust-section">
        <div className="section-heading">
          <h2><BsStars /> Why Farmers Choose Us</h2>
        </div>
        <div className="trust-factors">
          {trustFactors.map((factor, index) => (
            <div className="trust-card" key={index}>
              <div className="trust-icon">{factor.icon}</div>
              <h3>{factor.title}</h3>
              <p>{factor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-heading">
            <div className="section-heading-container">
              <h2><MdSettings /> How It Works – SOP System</h2>
            </div>
        </div>
        <div className="steps-container">
          {howItWorks.map((step) => (
            <div className="step-card" key={step.step}>
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
  {/* Book Site Visit button removed as requested */}
      </section>

      <section className="recent-projects-section">
        <div className="section-heading">
            <div className="section-heading-container">
                <h2><FaImage /> Recent Projects</h2>
            </div>
        </div>
        <div className="projects-carousel">
          <div className="carousel-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {projects.map((project, index) => (
              <div className="project-card" key={project.id}>
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="project-location"><FaMapMarkerAlt /> {project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-dots">
          {projects.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${currentSlide === index ? 'active' : ''}`} 
            />
          ))}
        </div>
        <Link to="/projects" className="btn btn-primary center-btn">See Past Work <BsArrowRightCircle /></Link>
      </section>
    </div>
  );
}
export default HomePage;