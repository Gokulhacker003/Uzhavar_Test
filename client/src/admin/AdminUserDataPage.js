import React, { useState } from 'react';
import { apiUrl } from '../api';

export default function AdminUserDataPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (password) headers['x-admin-key'] = password;
      const res = await fetch(apiUrl('/api/user-data'), { headers });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch user data');
      }
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        background: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(15px)', 
        border: '1px solid rgba(255, 255, 255, 0.6)', 
        borderRadius: 20, 
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
        padding: '3rem 2.5rem' 
      }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '2rem', fontSize: '1.8em', fontWeight: 700 }}>Admin — User Data Storage</h2>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            placeholder="Admin password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ 
              flex: 1,
              padding: '0.85rem 1rem',
              border: '2px solid #e0e0e0',
              borderRadius: 10,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.9)',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <button 
            onClick={loadUserData} 
            disabled={loading}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: 10,
              background: loading ? '#ccc' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
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
                e.target.style.boxShadow = '0 4px 15px rgba(46,125,50,0.3)';
              }
            }}
          >
            {loading ? 'Loading...' : 'Load User Data'}
          </button>
        </div>
        
        {error && <div style={{ color: 'red', background: '#ffebee', padding: '1rem', borderRadius: 10, border: '2px solid #ffcdd2', marginBottom: '1.5rem' }}>Error: {error}</div>}
        
        {!userData || userData.length === 0 ? (
          <div>No user data found or not authorized.</div>
        ) : (
          <div>
            <h3>Stored User Data ({userData.length} entries)</h3>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {userData.map((entry, i) => (
                <div key={i} style={{ 
                  border: '1px solid #ddd', 
                  margin: '10px 0', 
                  padding: '15px', 
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Entry #{entry.id} - {entry.type} - {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Data:</strong>
                    <pre style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.75)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      padding: '10px', 
                      borderRadius: '3px',
                      fontSize: '14px',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(entry.data, null, 2)}
                    </pre>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    User Agent: {entry.userAgent}<br/>
                    IP: {entry.ip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}