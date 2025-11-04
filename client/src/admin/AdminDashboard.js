import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link, Navigate } from 'react-router-dom';
import { authHelper } from './authHelper';
import AdminCompaniesPage from './AdminCompaniesPage';
import AdminPlansPage from './AdminPlansPage';
import AdminSubmissionsPage from './AdminSubmissionsPage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    authHelper.logout();
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
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <nav style={{
        background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
        color: 'white',
        padding: '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
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
            <span style={{ fontSize: '2em' }}>🌾</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5em', fontWeight: 700 }}>
                Uzhavar Admin
              </h1>
              <p style={{ margin: 0, fontSize: '0.85em', opacity: 0.9 }}>
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
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '0.7em',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '1.5em',
                display: 'none',
                transition: 'all 0.3s'
              }}
              className="burger-menu-btn"
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Logout Button (visible on desktop only) */}
            <button
              onClick={handleLogout}
              className="desktop-logout-btn"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '0.7em 1.5em',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95em',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(0,0,0,0.1)',
          borderTop: '1px solid rgba(255,255,255,0.1)'
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
                  color: 'white',
                  padding: '1em 1.5em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  fontWeight: 600,
                  fontSize: '0.95em',
                  borderBottom: activeTab === item.id ? '3px solid white' : '3px solid transparent',
                  background: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'transparent';
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
            background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            position: 'absolute',
            width: '100%',
            left: 0,
            zIndex: 999
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
                    color: 'white',
                    padding: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em',
                    fontWeight: 600,
                    fontSize: '1em',
                    background: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                    borderRadius: 8,
                    marginBottom: '0.5em',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'transparent';
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
        padding: '2em'
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
