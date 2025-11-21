import React, { useState, useEffect } from 'react';
import ConfirmPlan from './ConfirmPlan';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import { AdminAuthProvider } from './admin/AdminAuthProvider';
import 'leaflet/dist/leaflet.css';
import CompaniesPage from './CompaniesPage';
import RequestQuotePage from './RequestQuotePage';
import ProjectsPage from './ProjectsPage';
import FarmDetailsPage from './FarmDetailsPage';
import BookTeamPage from './BookTeamPage';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import AboutPage from './pages/AboutPage';
import projects from './data/projects';
import HomePage from './pages/HomePage';
import ManageFarmPage from './pages/ManageFarmPage';
import BuyInputsPage from './pages/BuyInputsPage';
import SellProducePage from './pages/SellProducePage';
import JoinUsPage from './pages/JoinUsPage';
import LandPage from './pages/LandPage';
import ConstructionPage from './pages/ConstructionPage';
import OurServicesPage from './pages/OurServicesPage';
import DeveloperInfoPage from './pages/DeveloperInfoPage';
import ScrollToTop from './ScrollToTop';
import { apiUrl } from './api';
// ...existing code...

// Main projects array for carousel and other usage




function App() {
  // Notification state for farm submission redirect
  const [notification, setNotification] = useState({ show: false, success: false, message: '' });
  
  // Language state for Google Translate
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Check for notification from farm details submission
  useEffect(() => {
    // Safe sessionStorage access for SSR/build compatibility
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedNotification = sessionStorage.getItem('farmSubmitNotification');
      if (storedNotification) {
        const notif = JSON.parse(storedNotification);
        setNotification(notif);
        sessionStorage.removeItem('farmSubmitNotification');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, success: false, message: '' });
        }, 3000);
      }
    }
    
    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setCurrentLanguage(savedLang);
  }, []);
  
  // Language change function
  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  };

  const changeLanguage = (lang) => {
    const googleTransCookie = '/en/' + lang;
    setCookie('googtrans', googleTransCookie, 1);
    localStorage.setItem('selectedLang', lang);
    setCurrentLanguage(lang);
    window.location.reload();
  };

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
      <AppContent 
        notification={notification}
        currentLanguage={currentLanguage}
        changeLanguage={changeLanguage}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        currentSlide={currentSlide}
        showSoilTestModal={showSoilTestModal}
        setShowSoilTestModal={setShowSoilTestModal}
        soilTestForm={soilTestForm}
        handleSoilTestChange={handleSoilTestChange}
        handleSoilTestSubmit={handleSoilTestSubmit}
        showProjectForm={showProjectForm}
        setShowProjectForm={setShowProjectForm}
        projectForm={projectForm}
        handleProjectInput={handleProjectInput}
        handleProjectSubmit={handleProjectSubmit}
        projectSubmitted={projectSubmitted}
        isSubmitting={isSubmitting}
      />
    </Router>
  );
}

function AppContent({ 
  notification, currentLanguage, changeLanguage, isMenuOpen, setIsMenuOpen, currentSlide, 
  showSoilTestModal, setShowSoilTestModal, soilTestForm, 
  handleSoilTestChange, handleSoilTestSubmit, showProjectForm, 
  setShowProjectForm, projectForm, handleProjectInput, 
  handleProjectSubmit, projectSubmitted, isSubmitting 
}) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  return (
      <div className="app" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Toast Notification for Farm Submission */}
        {notification.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '320px',
            maxWidth: '400px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `3px solid ${notification.success ? '#4CAF50' : '#f44336'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            animation: 'toastSlideIn 0.5s ease-out'
          }}>
            {/* Colored header bar */}
            <div style={{
              background: notification.success 
                ? 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
                : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
              padding: '1em 1.5em',
              display: 'flex',
              alignItems: 'center',
              gap: '1em'
            }}>
              <div style={{
                fontSize: '2em',
                animation: 'scaleIn 0.5s ease-out'
              }}>
                {notification.success ? '✓' : '✕'}
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'white', fontSize: '1.1em', fontWeight: 600 }}>
                  {notification.success ? 'Success!' : 'Error'}
                </h4>
              </div>
            </div>

            {/* Message content */}
            <div style={{
              padding: '1.5em',
              color: '#333',
              fontSize: '0.95em',
              lineHeight: '1.6'
            }}>
              {notification.message}
            </div>

            {/* Progress bar */}
            {notification.success && (
              <div style={{
                height: '4px',
                background: '#e0e0e0',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: notification.success ? '#4CAF50' : '#f44336',
                  animation: 'progressBar 3s linear'
                }} />
              </div>
            )}
          </div>
        )}

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
        {!isAdminPage && (
        <nav className="navbar" style={{ minHeight: '70px', padding: '0 1.5em', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1.1em', textDecoration: 'none' }}>
              <img src={process.env.PUBLIC_URL + '/assert/logo.png'} alt="Uzhavar Connect Logo" className="logo-icon" style={{ height: '45px', width: 'auto' }} />
              <span className="logo-text" style={{ fontWeight: 700, color: '#388e3c' }}>Uzhavar Connect</span>
            </Link>
            
            {/* Show burger on both mobile and desktop */}
            <button
              className={`burger ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              type="button"
            >
              <div></div>
              <div></div>
              <div></div>
            </button>
            
            {/* Backdrop overlay when nav opened */}
            <div 
              className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <ul id="primary-navigation" className={`nav-menu ${isMenuOpen ? 'show' : ''}`} style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '13px', fontWeight: 500, display: 'flex', flexWrap: 'nowrap', gap: '0.8em', justifyContent: 'center', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
              <li><NavLink to="/companies" onClick={() => setIsMenuOpen(false)}>Our Companies</NavLink></li>
              <li><NavLink to="/our-services" onClick={() => setIsMenuOpen(false)}>Our Services</NavLink></li>
              <li><NavLink to="/manage-farm" onClick={() => setIsMenuOpen(false)}>Manage Farm</NavLink></li>
              <li><NavLink to="/buy-inputs" onClick={() => setIsMenuOpen(false)}>Buy Inputs</NavLink></li>
              <li><NavLink to="/sell-produce" onClick={() => setIsMenuOpen(false)}>Sell Produce</NavLink></li>
              <li><NavLink to="/land" onClick={() => setIsMenuOpen(false)}>Land</NavLink></li>
              <li><NavLink to="/construction" onClick={() => setIsMenuOpen(false)}>Construction</NavLink></li>
              <li><NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>Past Work</NavLink></li>
              <li><NavLink to="/join" onClick={() => setIsMenuOpen(false)}>Join Us</NavLink></li>
              
              {/* Language Selection */}
              <li style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', paddingTop: '12px', paddingBottom: '12px' }}>
                <div style={{ padding: '0 16px 10px 16px', fontSize: '0.75rem', fontWeight: '600', color: '#718096', textAlign: 'center', letterSpacing: '0.5px' }}>
                  🌐 LANGUAGE / மொழி
                </div>
                <div style={{ display: 'flex', gap: '8px', padding: '0 16px', flexWrap: 'nowrap' }}>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: currentLanguage === 'en' ? '700' : '500',
                      color: currentLanguage === 'en' ? '#fff' : '#4a5568',
                      backgroundColor: currentLanguage === 'en' ? '#C9A86A' : '#fff',
                      border: '2px solid',
                      borderColor: currentLanguage === 'en' ? '#C9A86A' : '#e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentLanguage === 'en' ? '0 2px 8px rgba(201, 168, 106, 0.3)' : 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      if (currentLanguage !== 'en') {
                        e.target.style.borderColor = '#C9A86A';
                        e.target.style.backgroundColor = '#faf8f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLanguage !== 'en') {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.backgroundColor = '#fff';
                      }
                    }}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('ta');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: currentLanguage === 'ta' ? '700' : '500',
                      color: currentLanguage === 'ta' ? '#fff' : '#4a5568',
                      backgroundColor: currentLanguage === 'ta' ? '#C9A86A' : '#fff',
                      border: '2px solid',
                      borderColor: currentLanguage === 'ta' ? '#C9A86A' : '#e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentLanguage === 'ta' ? '0 2px 8px rgba(201, 168, 106, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentLanguage !== 'ta') {
                        e.target.style.borderColor = '#C9A86A';
                        e.target.style.backgroundColor = '#faf8f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLanguage !== 'ta') {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.backgroundColor = '#fff';
                      }
                    }}
                  >
                    தமிழ்
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        )}

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
            <Route path="/our-services" element={<OurServicesPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/join" element={<JoinUsPage />} />
            <Route path="/developer-info" element={<DeveloperInfoPage />} />
            <Route path="/confirm-plan" element={<ConfirmPlan />} />
            
            {/* Admin Routes - Wrapped with Auth Provider */}
            <Route path="/admin/login" element={
              <AdminAuthProvider>
                <AdminLogin />
              </AdminAuthProvider>
            } />
            
            {/* Protected Admin Dashboard with all admin pages */}
            <Route path="/admin/*" element={
              <AdminAuthProvider>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </AdminAuthProvider>
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
          {/* Row 1 - Uzhavar Connect */}
          <div className="footer-header">
            <h2>Uzhavar Connect</h2>
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
                <li className="developer-info-highlight">
                  <Link to="/developer-info" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    ✨ Developer Info
                  </Link>
                </li>
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
              <p>Phone: 98422 97056/ 75501 19994 </p>
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
            <p>&copy; {new Date().getFullYear()} Uzhavar Connect. All rights reserved.</p>
            <p>Powered by Netcraft Studio</p>
          </div>
        </footer>
      </div>
  );
}

export default App;