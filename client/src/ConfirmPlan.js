import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSeedling, FaCheckCircle } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiUrl } from './api';
import { sanitizePhone, isValidPhone } from './utils/validation';

function ConfirmPlan() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planType = params.get('type');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    landLocation: '',
    landSize: '',
    coordinates: null
  });
  function LocationPicker({ onSelect }) {
    useMapEvents({
      click(e) {
        onSelect(e.latlng);
      }
    });
    return null;
  }
  const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'phone' ? sanitizePhone(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPhone(form.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'Start Managing My Farm',
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: `Farm management plan confirmation for ${planType} plan`,
      extra: {
        'Name': form.name,
        'Phone': form.phone,
        'Email': form.email,
        'Selected Plan': planType,
        'Land Location': form.landLocation,
        'Land Size': form.landSize
      }
    };

    // Send email
    fetch(apiUrl('/api/send-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Farm management plan submitted successfully:', data);
      setNotification({ 
        show: true, 
        success: true, 
        message: `Thank you ${form.name}! Your ${planType} plan has been confirmed successfully. We'll guide you through the next steps!` 
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({ name: '', phone: '', email: '', landLocation: '', landSize: '', coordinates: null });
        setSubmitted(false);
      }, 3000);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    })
    .catch(error => {
      console.error('Error submitting farm management plan:', error);
      setNotification({ 
        show: true, 
        success: false, 
        message: 'Failed to confirm plan. Please try again.' 
      });
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    });
  };

  return (
    <div className="confirm-plan-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="confirm-card" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '20px', boxShadow: '0 12px 40px rgba(56,142,60,0.15)', padding: '3rem 2.5rem', maxWidth: '520px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #2e7d32, #4caf50)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <FaSeedling style={{ fontSize: '2em', color: 'white' }} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32', fontWeight: 700, fontSize: '1.8em' }}>Confirm Your Plan</h2>
          <div style={{ fontSize: '1.1em', color: '#00838f', marginBottom: '0.5em' }}>
            Selected Plan: <strong style={{ textTransform: 'capitalize' }}>{planType}</strong>
          </div>
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="confirm-plan-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.1em' }} />
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ position: 'relative' }}>
              <FaPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.1em' }} />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required inputMode="numeric" pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.1em' }} />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <FaMapMarkerAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.1em' }} />
                <input type="text" name="landLocation" value={form.landLocation} onChange={handleChange} placeholder="Land Location (address or area)" required style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Select Land Location on Map:</label>
                <MapContainer center={[11.0168, 76.9558]} zoom={7} style={{ height: '220px', width: '100%', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {form.coordinates && <Marker position={[form.coordinates.lat, form.coordinates.lng]} />}
                  <LocationPicker onSelect={coords => setForm(prev => ({ ...prev, coordinates: coords }))} />
                </MapContainer>
                {form.coordinates && (
                  <div style={{ fontSize: '0.9em', color: '#2e7d32', marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(46,125,50,0.1)', borderRadius: '8px', fontWeight: 500 }}>
                    ✓ Selected: <strong>{form.coordinates.lat.toFixed(5)}, {form.coordinates.lng.toFixed(5)}</strong>
                  </div>
                )}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <FaCheckCircle style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#2e7d32', fontSize: '1.1em' }} />
              <input type="text" name="landSize" value={form.landSize} onChange={handleChange} placeholder="Land Size (in acres)" required style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: 10, fontWeight: 600, fontSize: '1.05em', background: 'linear-gradient(135deg, #2e7d32, #4caf50)', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)', marginTop: '0.5rem' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>Confirm Plan</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
            <div style={{ background: 'linear-gradient(135deg, #2e7d32, #4caf50)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5em', color: 'white' }}>✓</div>
            <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem', fontSize: '1.5em' }}>Thank You!</h3>
            <p style={{ color: '#666', margin: 0 }}>Your confirmation has been received.<br />We will contact you soon.</p>
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
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
                background: '#4CAF50',
                animation: 'progressBar 3s linear'
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConfirmPlan;
