import React, { useState, useEffect } from 'react';
import ConfirmPlan from './ConfirmPlan';
import AdminCompaniesPage from './admin/AdminCompaniesPage';
import AdminSubmissionsPage from './admin/AdminSubmissionsPage';
import AdminUserDataPage from './admin/AdminUserDataPage';
import AdminPlansPage from './admin/AdminPlansPage';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import 'leaflet/dist/leaflet.css';
import CompaniesPage from './CompaniesPage';
import RequestQuotePage from './RequestQuotePage';
import ProjectsPage from './ProjectsPage';
import FarmDetailsPage from './FarmDetailsPage';
import BookTeamPage from './BookTeamPage';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import {
  GiWheat
} from 'react-icons/gi';
import AboutPage from './pages/AboutPage';
import projects from './data/projects';
import HomePage from './pages/HomePage';
import ManageFarmPage from './pages/ManageFarmPage';
import BuyInputsPage from './pages/BuyInputsPage';
import SellProducePage from './pages/SellProducePage';
import JoinUsPage from './pages/JoinUsPage';
import LandPage from './pages/LandPage';
import ConstructionPage from './pages/ConstructionPage';
import ScrollToTop from './ScrollToTop';
import { apiUrl } from './api';
// ...existing code...

// Main projects array for carousel and other usage




function App() {
  // Modal state for Book a Project (legacy, not used)
  // const [showProjectModal, setShowProjectModal] = useState(false);

  // State for Book Project modal (used in main JSX)
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    description: ''
  });
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProjectInput = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // send to backend
      await postToApi({
        formType: 'Project Request',
        name: projectForm.name,
        email: projectForm.email,
        phone: projectForm.phone,
        message: projectForm.description,
        extra: { projectType: projectForm.projectType }
      });
      
      setProjectSubmitted(true);
      setShowProjectForm(false);
      setProjectForm({ name: '', phone: '', email: '', projectType: '', description: '' });
      
      // Show success message for 3 seconds
      setTimeout(() => setProjectSubmitted(false), 3000);
      
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soil Test Modal State for Fertilizer Plan
  const [showSoilTestModal, setShowSoilTestModal] = useState(false);
  const [soilTestForm, setSoilTestForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmLocation: '',
    farmSize: ''
  });

  const handleSoilTestChange = (e) => {
    const { name, value } = e.target;
    setSoilTestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSoilTestSubmit = (e) => {
    e.preventDefault();
    postToApi({
      formType: 'Soil Test',
      name: soilTestForm.name,
      email: soilTestForm.email,
      phone: soilTestForm.phone,
      extra: { farmLocation: soilTestForm.farmLocation, farmSize: soilTestForm.farmSize }
    }).then(() => {
      alert('Soil Test Scheduled! We will contact you soon.');
      setShowSoilTestModal(false);
      setSoilTestForm({ name: '', phone: '', email: '', farmLocation: '', farmSize: '' });
    }).catch(err => {
      console.error(err);
      alert('Failed to schedule soil test. Please try again later.');
    });
  };

  // helper to POST to backend
  const postToApi = async (payload) => {
    try {
      const res = await fetch(apiUrl('/api/send-email'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      return res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Remove legacy handleBookProject and setShowProjectModal
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Global Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            pointerEvents: 'none',
            opacity: 0.45
          }}
        >
          <source src={process.env.PUBLIC_URL + '/videos/farm-bg.mp4'} type="video/mp4" />
        </video>
        <nav className="navbar" style={{ minHeight: '44px', padding: '0 1em', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1em' }}>
              <GiWheat className="logo-icon" style={{ fontSize: '1.2em' }} />
              <span className="logo-text" style={{ fontWeight: 700, color: '#388e3c' }}>Ullavar Connect</span>
            </div>
            <div className={`burger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <ul className={`nav-menu ${isMenuOpen ? 'show' : ''}`} style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '13px', fontWeight: 500, display: 'flex', flexWrap: 'nowrap', gap: '0.8em', justifyContent: 'center', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
              <li><NavLink to="/companies" onClick={() => setIsMenuOpen(false)}>Our Companies</NavLink></li>
              <li><NavLink to="/manage-farm" onClick={() => setIsMenuOpen(false)}>Manage Farm</NavLink></li>
              <li><NavLink to="/buy-inputs" onClick={() => setIsMenuOpen(false)}>Buy Inputs</NavLink></li>
              <li><NavLink to="/sell-produce" onClick={() => setIsMenuOpen(false)}>Sell Produce</NavLink></li>
              <li><NavLink to="/land" onClick={() => setIsMenuOpen(false)}>Land</NavLink></li>
              <li><NavLink to="/construction" onClick={() => setIsMenuOpen(false)}>Construction</NavLink></li>
              <li><NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>Past Work</NavLink></li>
              <li><NavLink to="/join" onClick={() => setIsMenuOpen(false)}>Join Us</NavLink></li>
            </ul>
          </div>
        </nav>

        <ScrollToTop />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage currentSlide={currentSlide} />} />
            <Route path="/farm-details" element={<FarmDetailsPage />} />
            <Route path="/book-team" element={<BookTeamPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/manage-farm" element={
              <ManageFarmPage
                onOpenSoilTestModal={() => setShowSoilTestModal(true)}
                showProjectForm={showProjectForm}
                setShowProjectForm={setShowProjectForm}
                projectForm={projectForm}
                handleProjectInput={handleProjectInput}
                handleProjectSubmit={handleProjectSubmit}
                projectSubmitted={projectSubmitted}
                isSubmitting={isSubmitting}
              />
            } />
            <Route path="/buy-inputs" element={<BuyInputsPage />} />
            <Route path="/sell-produce" element={<SellProducePage />} />
            <Route path="/land" element={<LandPage />} />
            <Route path="/construction" element={<ConstructionPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/join" element={<JoinUsPage />} />
            <Route path="/confirm-plan" element={<ConfirmPlan />} />
            
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/companies" element={<AdminCompaniesPage onLogout={() => { /* navigation fallback if needed */ }} />} />
            <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />
            <Route path="/admin/user-data" element={<AdminUserDataPage />} />
            <Route path="/admin/plans" element={
              <ProtectedRoute>
                <AdminPlansPage />
              </ProtectedRoute>
            } />
          </Routes>
          {/* Soil Test Modal for Fertilizer Plan - only rendered in App */}
          {showSoilTestModal && (
            <div className="modal-overlay">
              <div className="modal soil-test-modal">
                <button className="modal-close" onClick={() => setShowSoilTestModal(false)} title="Close">&times;</button>
                <h2>
                  <span role="img" aria-label="soil">🧪</span> Schedule Soil Test
                </h2>
                <form onSubmit={handleSoilTestSubmit} className="soil-test-form">
                  <label>
                    Name
                    <input type="text" name="name" value={soilTestForm.name} onChange={handleSoilTestChange} required placeholder="Enter your name" />
                  </label>
                  <label>
                    Phone
                    <input type="tel" name="phone" value={soilTestForm.phone} onChange={handleSoilTestChange} required placeholder="10-digit mobile number" maxLength="10" />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" value={soilTestForm.email} onChange={handleSoilTestChange} required placeholder="Enter your email" />
                  </label>
                  <label>
                    Farm Location
                    <input type="text" name="farmLocation" value={soilTestForm.farmLocation} onChange={handleSoilTestChange} required placeholder="e.g., Coimbatore" />
                  </label>
                  <label>
                    Farm Size (in acres)
                    <input type="text" name="farmSize" value={soilTestForm.farmSize} onChange={handleSoilTestChange} required placeholder="e.g., 5" />
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowSoilTestModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
  <footer className="footer">
          {/* Row 1 - Ullavar Connect */}
          <div className="footer-header">
            <h2>Ullavar Connect</h2>
            <p>Manage Your Farm Like a Pro. From Soil to Sale.</p>
          </div>

          {/* Row 2 - Three Columns */}
          <div className="footer-content">
            {/* Column 1 - Quick Links */}
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/join">Careers</Link></li>
              </ul>
            </div>

            {/* Column 2 - Address */}
            <div className="footer-section">
              <h3>Address</h3>
              <p>
                7/3, Duraiswamy Nagar<br />
                Coimbatore, Tamil Nadu - 641014<br />
                India
              </p>
            </div>

            {/* Column 3 - Contact Us */}
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: uzhavarconnect2025@gmail.com</p>
              <p>Phone: +91 7550119994 / 9842297056</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="footer-cta">
            <h2>Start with a One-Time Project or Choose a Monthly Plan</h2>
            <div className="cta-buttons">
              <Link to="/book-team">
                <button className="btn btn-primary">Book Now</button>
              </Link>
              <Link to="/join">
                <button className="btn btn-primary">Join US</button>
              </Link>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Ullavar Connect. All rights reserved.</p>
            <p>Powered by Netcraft Studio</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;