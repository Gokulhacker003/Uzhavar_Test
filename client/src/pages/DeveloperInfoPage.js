import React from 'react';
import {  FaMobileAlt, FaServer, FaRobot, FaCog, FaLightbulb, FaHandshake, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { MdWeb, MdEmail, MdPhone } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import '../styles/DeveloperInfoPage.css';

function DeveloperInfoPage() {
  return (
    <div className="developer-info-page">
      <div className="dev-container">
        
        {/* Header Card */}
        <div className="dev-header-card">
          <div className="dev-logo-placeholder">
            <img 
              src={process.env.PUBLIC_URL + '/logo.jpeg'} 
              alt="Netcraft Studio Logo" 
              className="dev-logo-img"
            />
          </div>
          <h1 className="company-name">Netcraft Studio</h1>
          <p className="company-tagline"></p>
        </div>

        {/* About Section */}
        <div className="dev-card">
          <h2 className="dev-section-title">
            <FaLightbulb className="title-icon" /> About Netcraft Studio
          </h2>
          <p className="dev-text">
            Netcraft Studio is an innovative and technology-driven IT solutions company dedicated to delivering modern, 
            scalable, and highly efficient digital products. Built with a passion for quality and precision, we blend 
            creativity, technology, and strategic thinking to empower businesses in the digital world.
          </p>
        </div>

        {/* Services Section */}
        <div className="dev-card">
          <h2 className="dev-section-title">
            <FaCog className="title-icon" /> Services Provided
          </h2>
          <div className="services-grid">
            <div className="service-item">
              <MdWeb className="service-icon" />
              <span>Web Development</span>
            </div>
            <div className="service-item">
              <FaMobileAlt className="service-icon" />
              <span>Mobile / Web Applications</span>
            </div>
            <div className="service-item">
              <FaServer className="service-icon" />
              <span>Hosting Services</span>
            </div>
            <div className="service-item">
              <FaRobot className="service-icon" />
              <span>IoT Projects</span>
            </div>
            <div className="service-item">
              <FaCog className="service-icon" />
              <span>System Services</span>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="dev-two-col">
          <div className="dev-card">
            <h2 className="dev-section-title">Who We Are</h2>
            <p className="dev-text">
              A team of skilled developers, creative thinkers, and technology enthusiasts focused on solving 
              real business challenges with user-first digital solutions.
            </p>
          </div>

          <div className="dev-card">
            <h2 className="dev-section-title">Our Mission</h2>
            <p className="dev-text">
              To deliver innovative and reliable digital solutions that simplify business operations and 
              empower organizations.
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="dev-header-card">
          <h2 className="dev-section-title">Our Vision</h2>
          <p className="dev-text">
            To become a leading global tech solutions provider known for creativity, quality, and long-term client success.
          </p>
        </div>

        {/* Core Values */}
        <div className="dev-card">
          <h2 className="dev-section-title">
            <FaShieldAlt className="title-icon" /> Core Values
          </h2>
          <div className="values-list">
            <div className="value-item">
              <BsCheckCircleFill className="check-icon" />
              <span>Quality First</span>
            </div>
            <div className="value-item">
              <BsCheckCircleFill className="check-icon" />
              <span>Innovation</span>
            </div>
            <div className="value-item">
              <BsCheckCircleFill className="check-icon" />
              <span>Client Focus</span>
            </div>
            <div className="value-item">
              <BsCheckCircleFill className="check-icon" />
              <span>Transparency</span>
            </div>
            <div className="value-item">
              <BsCheckCircleFill className="check-icon" />
              <span>Long-Term Support</span>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="dev-card">
          <h2 className="dev-section-title">
            <FaHandshake className="title-icon" /> Why Choose Us
          </h2>
          <div className="why-us-grid">
            <div className="why-item">• Experienced and dedicated team</div>
            <div className="why-item">• Professional project execution</div>
            <div className="why-item">• Affordable pricing</div>
            <div className="why-item">• On-time delivery</div>
            <div className="why-item">• Full after-deployment support</div>
            <div className="why-item">• Tailored digital solutions</div>
          </div>
        </div>

        {/* Our Promise */}
        <div className="dev-header-card">
          <h2 className="dev-section-title">
            <FaHeart className="title-icon" /> Our Promise
          </h2>
          <div className="promise-grid">
            <div className="promise-item">
              <BsCheckCircleFill className="promise-check" />
              <span>Commitment</span>
            </div>
            <div className="promise-item">
              <BsCheckCircleFill className="promise-check" />
              <span>Quality</span>
            </div>
            <div className="promise-item">
              <BsCheckCircleFill className="promise-check" />
              <span>Integrity</span>
            </div>
            <div className="promise-item">
              <BsCheckCircleFill className="promise-check" />
              <span>Passion</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="dev-header-card">
          <h2 className="dev-section-title">Contact Information</h2>
          <div className="contact-info">
            <div className="contact-item">
              <MdPhone className="contact-icon" />
              <div>
                <a href="tel:+919360244928">+91 93602 44928</a>
                <span> / </span>
                <a href="tel:+918122696986">+91 81226 96986</a>
              </div>
            </div>
            <div className="contact-item">
              <MdEmail className="contact-icon" />
              <a href="mailto:netcraftstudio01@gmail.com">netcraftstudio01@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dev-footer">
          <p>© 2025 Netcraft Studio. All Rights Reserved.</p>
          <p className="dev-footer-tagline">Built with passion for excellence</p>
        </div>

      </div>
    </div>
  );
}

export default DeveloperInfoPage;
