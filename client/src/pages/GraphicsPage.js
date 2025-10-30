import React, { useEffect } from 'react';

export default function GraphicsPage() {
  useEffect(() => {
    // Redirect to Aadhivelan Graphics website or external link
    // Replace with actual URL when available
    window.location.href = 'https://aadhivelangraphics.com';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2em',
      textAlign: 'center'
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        fontSize: '3em',
        marginBottom: '1em'
      }}>
        🎨
      </div>
      <h1 style={{ fontSize: '2em', marginBottom: '0.5em' }}>
        Redirecting to Aadhivelan Graphics...
      </h1>
      <p style={{ fontSize: '1.1em', opacity: 0.9 }}>
        Please wait while we redirect you to our graphics services website.
      </p>
      <p style={{ marginTop: '2em', fontSize: '0.9em', opacity: 0.7 }}>
        If you are not redirected automatically, 
        <a 
          href="https://aadhivelangraphics.com" 
          style={{ color: 'white', textDecoration: 'underline', marginLeft: '0.3em' }}
        >
          click here
        </a>
      </p>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
