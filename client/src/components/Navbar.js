import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  };

  const changeLanguage = (lang) => {
    // Set Google Translate cookie
    const googleTransCookie = '/en/' + lang;
    setCookie('googtrans', googleTransCookie, 1);
    
    localStorage.setItem('selectedLang', lang);
    setCurrentLanguage(lang);
    
    // Reload page to apply translation
    window.location.reload();
  };

  useEffect(() => {
    // Check if Google Translate has been initialized
    const checkForTranslate = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkForTranslate);
        console.log('Google Translate loaded successfully');
      }
    }, 100);

    setTimeout(() => clearInterval(checkForTranslate), 5000);

    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setCurrentLanguage(savedLang);
    
    // Apply saved language on mount - but don't reload automatically
    // User will click the button to change language

    return () => clearInterval(checkForTranslate);
  }, []);

  return (
    <nav className="navbar" style={{ minHeight: '44px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', height: '44px' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1em' }}>
          <img src={process.env.PUBLIC_URL + '/assert/logo.png'} alt="Uzhavar Connect Logo" className="logo-icon" style={{ height: '32px', width: 'auto' }} />
        </div>

        {/* Language Buttons - Always Visible */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginLeft: 'auto', 
          marginRight: '15px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: currentLanguage === 'en' ? 'bold' : '500',
              color: currentLanguage === 'en' ? '#000' : '#4a5568',
              backgroundColor: currentLanguage === 'en' ? '#C9A86A' : 'transparent',
              border: '2px solid',
              borderColor: currentLanguage === 'en' ? '#B8935A' : '#cbd5e0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: currentLanguage === 'en' ? '0 2px 4px rgba(201, 168, 106, 0.4)' : 'none'
            }}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('ta')}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: currentLanguage === 'ta' ? 'bold' : '500',
              color: currentLanguage === 'ta' ? '#000' : '#4a5568',
              backgroundColor: currentLanguage === 'ta' ? '#C9A86A' : 'transparent',
              border: '2px solid',
              borderColor: currentLanguage === 'ta' ? '#B8935A' : '#cbd5e0',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: currentLanguage === 'ta' ? '0 2px 4px rgba(201, 168, 106, 0.4)' : 'none'
            }}
          >
            தமிழ்
          </button>
        </div>

        {/* Burger button */}
        <button
          className={`burger ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <div></div>
          <div></div>
          <div></div>
        </button>

        {/* Backdrop overlay for mobile menu */}
        <div 
          className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <ul id="primary-navigation" className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
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
          
          {/* Language Selection Menu Item */}
          <li className="language-menu-item" style={{ 
            borderTop: '2px solid #e2e8f0', 
            marginTop: '8px', 
            paddingTop: '8px',
            paddingBottom: '8px',
            background: '#fafafa',
            display: 'block !important',
            visibility: 'visible !important'
          }}>
            <div style={{ 
              padding: '6px 12px 8px 12px', 
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#2d3748',
              textAlign: 'center'
            }}>
              🌐 Language / மொழி
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '6px', 
              padding: '0 12px 8px 12px',
              flexWrap: 'nowrap'
            }}>
              <button
                onClick={() => {
                  changeLanguage('en');
                  setIsMenuOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: currentLanguage === 'en' ? 'bold' : '500',
                  color: currentLanguage === 'en' ? '#000' : '#4a5568',
                  backgroundColor: currentLanguage === 'en' ? '#C9A86A' : '#f7fafc',
                  border: '2px solid',
                  borderColor: currentLanguage === 'en' ? '#B8935A' : '#cbd5e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentLanguage === 'en' ? '0 3px 6px rgba(201, 168, 106, 0.4)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                English
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
                  fontWeight: currentLanguage === 'ta' ? 'bold' : '500',
                  color: currentLanguage === 'ta' ? '#000' : '#4a5568',
                  backgroundColor: currentLanguage === 'ta' ? '#C9A86A' : '#f7fafc',
                  border: '2px solid',
                  borderColor: currentLanguage === 'ta' ? '#B8935A' : '#cbd5e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentLanguage === 'ta' ? '0 3px 6px rgba(201, 168, 106, 0.4)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                தமிழ்
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
