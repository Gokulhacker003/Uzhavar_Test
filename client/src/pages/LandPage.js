import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MdLandscape } from "react-icons/md";
import { apiUrl } from '../api';

export default function LandPage() {
  const [form, setForm] = useState({
    ownerName: '',
    contact: '',
    location: '',
    latlng: null,
    area: '',
    soilType: '',
    waterSource: '',
    description: '',
    pattaNumber: '',
    landImage: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, success: false, message: '' });

  function handleLocation(latlng) {
    setForm(prev => ({ ...prev, latlng }));
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'landImage') {
      setForm(prev => ({ ...prev, landImage: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'List Your Land for Buy/Sell (Main Page)',
      name: form.owner,
      phone: form.contact,
      message: `Land listing details submitted from main page`,
      extra: {
        'Owner Name': form.owner,
        'Area (acres)': form.area,
        'Contact': form.contact,
        'Location': form.location ? `Lat: ${form.location.lat}, Lng: ${form.location.lng}` : 'Not selected',
        'Land Image': form.landImage ? form.landImage.name : 'No image uploaded',
        'Patta Details': form.patta ? form.patta.name : 'No document uploaded'
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
      console.log('Land listing from main page submitted successfully:', data);
      setNotification({ 
        show: true, 
        success: true, 
        message: `Thank you ${form.ownerName}! Your land listing has been submitted successfully. We'll contact you soon with potential buyers!` 
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({
          ownerName: '',
          contact: '',
          location: '',
          latlng: null,
          area: '',
          soilType: '',
          waterSource: '',
          description: '',
          pattaNumber: '',
          landImage: null
        });
        setSubmitted(false);
      }, 3000);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    })
    .catch(error => {
      console.error('Error submitting land listing from main page:', error);
      setNotification({ 
        show: true, 
        success: false, 
        message: 'Failed to submit land listing. Please try again.' 
      });
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    });
  }

  function LocationPicker({ onLocationSelect }) {
    const [marker, setMarker] = useState(null);
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onLocationSelect(e.latlng);
      }
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <div className="land-page">
      <section className="page-header">
        <h1><MdLandscape /> Buy/Sell Land – Uzhavar Bhoomi</h1>
      </section>
      <div className="land-form-section" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
        <h2 style={{textAlign:'center',marginBottom:'1em'}}>List Your Land for Buy/Sell</h2>
        <form className="land-form" onSubmit={handleSubmit} style={{maxWidth:'500px',width:'100%',background:'#f9f9f9',padding:'2em',borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <div className="form-group">
            <label>Owner Name</label>
            <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" name="contact" value={form.contact} onChange={handleChange} required inputMode="numeric" pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mark Land Location on Map</label>
            <MapContainer center={[11.0168, 76.9558]} zoom={7} style={{ height: '250px', width: '100%', marginBottom: '1em' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker onLocationSelect={handleLocation} />
            </MapContainer>
            {form.latlng && (
              <div style={{fontSize:'0.9em',color:'#388e3c'}}>Selected: Lat {form.latlng.lat}, Lng {form.latlng.lng}</div>
            )}
          </div>
          <div className="form-group">
            <label>Area (in acres)</label>
            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0.1" step="0.01" />
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <input type="text" name="soilType" value={form.soilType} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Water Source</label>
            <input type="text" name="waterSource" value={form.waterSource} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Any additional details about the land" />
          </div>
          <div className="form-group">
            <label>Patta Number</label>
            <input type="text" name="pattaNumber" value={form.pattaNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Land Image</label>
            <input type="file" name="landImage" accept="image/*" onChange={handleChange} required />
            {form.landImage && <span style={{fontSize:'0.9em',color:'#388e3c'}}>Selected: {form.landImage.name}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:'1em'}}>Submit</button>
        </form>
        {submitted && (
          <div className="success-message" style={{marginTop:'2em',color:'green',fontWeight:'bold'}}>
            Thank you! Your land details have been submitted.
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