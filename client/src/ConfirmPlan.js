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
      <div className="confirm-card" style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 32px rgba(56,142,60,0.10)', padding: '2.5em 2em', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
          <FaSeedling style={{ fontSize: '2.5em', color: '#388e3c' }} />
          <h2 style={{ margin: '0.5em 0', color: '#388e3c', fontWeight: 700 }}>Confirm Your Plan</h2>
          <div style={{ fontSize: '1.1em', color: '#00838f', marginBottom: '0.5em' }}>
            Selected Plan: <strong style={{ textTransform: 'capitalize' }}>{planType}</strong>
          </div>
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="confirm-plan-form" style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <FaUser style={{ color: '#388e3c' }} />
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required style={{ flex: 1, padding: '0.7em', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <FaPhone style={{ color: '#388e3c' }} />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required inputMode="numeric" pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" style={{ flex: 1, padding: '0.7em', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <FaEnvelope style={{ color: '#388e3c' }} />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ flex: 1, padding: '0.7em', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <FaMapMarkerAlt style={{ color: '#388e3c' }} />
                <input type="text" name="landLocation" value={form.landLocation} onChange={handleChange} placeholder="Land Location (address or area)" required style={{ flex: 1, padding: '0.7em', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
              </div>
              <div style={{ marginTop: '0.5em' }}>
                <label style={{ fontWeight: 500, color: '#388e3c' }}>Select Land Location on Map:</label>
                <MapContainer center={[11.0168, 76.9558]} zoom={7} style={{ height: '220px', width: '100%', borderRadius: '12px', marginTop: '0.5em', border: '1px solid #e0e0e0' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {form.coordinates && <Marker position={[form.coordinates.lat, form.coordinates.lng]} />}
                  <LocationPicker onSelect={coords => setForm(prev => ({ ...prev, coordinates: coords }))} />
                </MapContainer>
                {form.coordinates && (
                  <div style={{ fontSize: '0.95em', color: '#00838f', marginTop: '0.5em' }}>
                    Selected Coordinates: <strong>{form.coordinates.lat.toFixed(5)}, {form.coordinates.lng.toFixed(5)}</strong>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <FaCheckCircle style={{ color: '#388e3c' }} />
              <input type="text" name="landSize" value={form.landSize} onChange={handleChange} placeholder="Land Size (in acres)" required style={{ flex: 1, padding: '0.7em', borderRadius: '8px', border: '1px solid #e0e0e0' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: '#388e3c', color: '#fff', borderRadius: '8px', padding: '0.8em', fontWeight: 600, fontSize: '1.1em', marginTop: '1em', border: 'none', boxShadow: '0 2px 8px rgba(56,142,60,0.08)' }}>Confirm</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2em 0' }}>
            <FaCheckCircle style={{ fontSize: '2.5em', color: '#388e3c' }} />
            <h3 style={{ color: '#388e3c', marginTop: '1em' }}>Thank you!</h3>
            <p>Your confirmation has been received.<br />We will contact you soon.</p>
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
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          animation: 'toastSlideIn 0.5s ease-out',
          border: `3px solid ${notification.success ? '#4CAF50' : '#f44336'}`
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
