import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar" style={{ minHeight: '44px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', height: '44px' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1em' }}>
          <img src={process.env.PUBLIC_URL + '/assert/logo.png'} alt="Uzhavar Connect Logo" className="logo-icon" style={{ height: '32px', width: 'auto' }} />
        </div>
        
        {/* Burger button - visible only on mobile */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
