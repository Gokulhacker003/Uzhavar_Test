import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authHelper } from "./authHelper";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authHelper.isAuthenticated()) {
      navigate('/admin/companies', { replace: true });
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate slight delay for better UX
    setTimeout(() => {
      const result = authHelper.login(username, password);
      
      if (result.success) {
        // Redirect to admin dashboard on successful login
        navigate('/admin/companies', { replace: true });
      } else {
        setError(result.error || "Invalid credentials");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="admin-login-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2em'
    }}>
      <div className="admin-login" style={{ 
        maxWidth: 450, 
        width: '100%',
        padding: "3rem 2.5rem", 
        background: "rgba(255, 255, 255, 0.85)", 
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 20, 
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)" 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5em' }}>
          <div style={{ 
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2em',
            boxShadow: '0 4px 15px rgba(46,125,50,0.3)'
          }}>
            🌾
          </div>
          <h2 style={{ 
            color: "#2e7d32", 
            marginBottom: "0.5em",
            fontSize: '1.8em',
            fontWeight: 700
          }}>
            Admin Login
          </h2>
          <p style={{ color: '#666', fontSize: '0.95em' }}>
            Access Uzhavar Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2e7d32',
              fontWeight: 600,
              fontSize: '0.95em'
            }}>
              Username
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Enter username"
              style={{ 
                width: "100%", 
                padding: "0.85rem 1rem",
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                fontSize: '1em',
                transition: 'border-color 0.3s',
                outline: 'none',
                background: 'rgba(255,255,255,0.9)',
                boxSizing: 'border-box'
              }} 
              onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2e7d32',
              fontWeight: 600,
              fontSize: '0.95em'
            }}>
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Enter password"
              style={{ 
                width: "100%", 
                padding: "0.85rem 1rem",
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                fontSize: '1em',
                transition: 'border-color 0.3s',
                outline: 'none',
                background: 'rgba(255,255,255,0.9)',
                boxSizing: 'border-box'
              }} 
              onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div style={{ 
              color: "#d32f2f", 
              background: '#ffebee',
              padding: '1rem',
              borderRadius: 10,
              marginBottom: "1.5rem",
              fontSize: '0.9em',
              textAlign: 'center',
              border: '2px solid #ffcdd2'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "1rem", 
              background: loading ? "#ccc" : "linear-gradient(135deg, #2e7d32, #4caf50)",
              color: "#fff", 
              border: "none", 
              borderRadius: 10, 
              fontWeight: 700,
              fontSize: '1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(46,125,50,0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(46,125,50,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(56, 142, 60, 0.3)';
              }
            }}
          >
            {loading ? '🔄 Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ 
          marginTop: '2em', 
          textAlign: 'center',
          paddingTop: '1.5em',
          borderTop: '1px solid #e0e0e0'
        }}>
          <p style={{ 
            color: '#999', 
            fontSize: '0.85em',
            margin: 0
          }}>
            Protected Admin Area
          </p>
        </div>
      </div>
    </div>
  );
}
