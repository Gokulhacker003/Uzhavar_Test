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
        maxWidth: 420, 
        width: '100%',
        padding: "2.5em", 
        background: "#fff", 
        borderRadius: 16, 
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)" 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2em' }}>
          <div style={{ 
            fontSize: '3em', 
            marginBottom: '0.3em',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
          }}>
            🌾
          </div>
          <h2 style={{ 
            color: "#388e3c", 
            marginBottom: "0.5em",
            fontSize: '1.8em',
            fontWeight: 700
          }}>
            Admin Login
          </h2>
          <p style={{ color: '#666', fontSize: '0.9em' }}>
            Access Uzhavar Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5em" }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5em',
              color: '#333',
              fontWeight: 600,
              fontSize: '0.9em'
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
                padding: "0.8em",
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: '1em',
                transition: 'border-color 0.3s',
                outline: 'none'
              }} 
              onFocus={(e) => e.target.style.borderColor = '#388e3c'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: "1.5em" }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5em',
              color: '#333',
              fontWeight: 600,
              fontSize: '0.9em'
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
                padding: "0.8em",
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: '1em',
                transition: 'border-color 0.3s',
                outline: 'none'
              }} 
              onFocus={(e) => e.target.style.borderColor = '#388e3c'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {error && (
            <div style={{ 
              color: "#d32f2f", 
              background: '#ffebee',
              padding: '0.8em',
              borderRadius: 6,
              marginBottom: "1.5em",
              fontSize: '0.9em',
              textAlign: 'center',
              border: '1px solid #ffcdd2'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "0.9em", 
              background: loading ? "#ccc" : "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              fontWeight: 700,
              fontSize: '1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(56, 142, 60, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(56, 142, 60, 0.4)';
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
