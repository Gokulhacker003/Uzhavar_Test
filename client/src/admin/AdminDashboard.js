import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthProvider';
import AdminCompaniesPage from './AdminCompaniesPage';
import AdminPlansPage from './AdminPlansPage';
import AdminSubmissionsPage from './AdminSubmissionsPage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('companies');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function handleNavClick(itemId) {
    setActiveTab(itemId);
    setMenuOpen(false);
  }

  const navItems = [
    { id: 'companies', label: 'Companies & Products', icon: '🏢', path: '/admin/companies' },
    { id: 'plans', label: 'Plans Management', icon: '📋', path: '/admin/plans' },
    { id: 'submissions', label: 'Form Submissions', icon: '📨', path: '/admin/submissions' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'rgba(255, 255, 255, 0.95)',
      position: 'relative'
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.3
        }}
      >
        <source src="/videos/farm-bg.mp4" type="video/mp4" />
      </video>
      
      {/* White Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Top Navigation Bar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        color: '#1a202c',
        padding: '0',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1002,
        borderBottom: '1px solid rgba(201, 168, 106, 0.2)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2em'
        }}>
          {/* Logo/Brand */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1em',
            padding: '1em 0'
          }}>
            <div style={{
              background: 'white',
              padding: '0.5em',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(201, 168, 106, 0.3)'
            }}>
              <img 
                src="/assert/logo.png" 
                alt="Uzhavar Logo" 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.5em', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C9A86A 0%, #B8935A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Uzhavar Admin
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '0.85em', 
                color: '#718096',
                fontWeight: 500
              }}>
                Dashboard Management
              </p>
            </div>
          </div>

          {/* Desktop: Logout Button | Mobile: Burger + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
            {/* Burger Menu Button (visible on mobile) */}
            <button
              onClick={toggleMenu}
              style={{
                background: 'linear-gradient(135deg, #C9A86A 0%, #B8935A 100%)',
                color: 'white',
                border: 'none',
                padding: '0.7em',
                borderRadius: 12,
                cursor: 'pointer',
                fontSize: '1.5em',
                display: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(201, 168, 106, 0.3)'
              }}
              className="burger-menu-btn"
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(201, 168, 106, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(201, 168, 106, 0.3)';
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Logout Button (visible on desktop only) */}
            <button
              onClick={handleLogout}
              className="desktop-logout-btn"
              style={{
                background: 'linear-gradient(135deg, #C9A86A 0%, #B8935A 100%)',
                color: 'white',
                border: 'none',
                padding: '0.7em 1.5em',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95em',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em',
                boxShadow: '0 4px 15px rgba(201, 168, 106, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(201, 168, 106, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(201, 168, 106, 0.3)';
              }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(102, 126, 234, 0.05)',
          borderTop: '1px solid rgba(102, 126, 234, 0.1)'
        }}
        className="desktop-nav">
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            padding: '0 2em',
            overflowX: 'auto'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                style={{
                  textDecoration: 'none',
                  color: activeTab === item.id ? '#C9A86A' : '#4a5568',
                  padding: '1em 1.5em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  fontWeight: 600,
                  fontSize: '0.95em',
                  borderBottom: activeTab === item.id ? '3px solid #C9A86A' : '3px solid transparent',
                  background: activeTab === item.id ? 'rgba(201, 168, 106, 0.1)' : 'transparent',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'rgba(201, 168, 106, 0.05)';
                    e.target.style.color = '#C9A86A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#4a5568';
                  }
                }}
              >
                <span style={{ fontSize: '1.2em' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(201, 168, 106, 0.2)',
            position: 'absolute',
            width: '100%',
            left: 0,
            zIndex: 999,
            boxShadow: '0 8px 32px rgba(201, 168, 106, 0.15)',
            borderRadius: '0 0 12px 12px'
          }}
          className="mobile-nav">
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '1em 2em'
            }}>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    textDecoration: 'none',
                    color: activeTab === item.id ? '#C9A86A' : '#4a5568',
                    padding: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em',
                    fontWeight: 600,
                    fontSize: '1em',
                    background: activeTab === item.id ? 'rgba(201, 168, 106, 0.1)' : 'transparent',
                    borderRadius: 8,
                    marginBottom: '0.5em',
                    transition: 'all 0.3s',
                    borderLeft: activeTab === item.id ? '4px solid #C9A86A' : '4px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'rgba(201, 168, 106, 0.05)';
                      e.target.style.color = '#C9A86A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#4a5568';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.5em' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Logout Button in Mobile Menu */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '1em',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1em',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  marginTop: '0.5em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2em',
        paddingTop: 'calc(2em + 140px)',
        position: 'relative',
        zIndex: 2
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/companies" replace />} />
          <Route path="/companies" element={<AdminCompaniesPage onLogout={handleLogout} />} />
          <Route path="/plans" element={<AdminPlansPage onLogout={handleLogout} />} />
          <Route path="/submissions" element={<AdminSubmissionsPage onLogout={handleLogout} />} />
        </Routes>
      </div>
    </div>
  );
}
