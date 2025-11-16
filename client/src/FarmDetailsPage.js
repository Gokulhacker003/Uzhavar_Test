import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { apiUrl } from './api';
import { sanitizePhone, isValidPhone } from './utils/validation';

export default function FarmDetailsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: '',
    contact: '',
    address: '',
    landImage: null,
    area: '',
    crop: '',
    irrigationType: '',
    notes: '',
    location: null
  });
  const [marker, setMarker] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    const v = files ? files[0] : (name === 'contact' ? sanitizePhone(value) : value);
    setForm(f => ({
      ...f,
      [name]: v
    }));
  }


  function LocationPicker({ onLocationSelect }) {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        setForm(f => ({ ...f, location: e.latlng }));
        if (onLocationSelect) onLocationSelect(e.latlng);
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValidPhone(form.contact)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Prepare email data with ALL fields for Google Sheets
    const emailData = {
      formType: 'Upload Your Farm Details',
      name: form.ownerName,
      phone: form.contact,
      email: '', // No email field in this form
      message: `Farm details submitted by ${form.ownerName}`,
      extra: {
        'Owner Name': form.ownerName,
        'Phone Number': form.contact,
        'Address': form.address,
        'Farm Location': marker ? `Lat: ${marker.lat}, Lng: ${marker.lng}` : 'Not selected',
        'Area (acres)': form.area,
        'Crop Planted': form.crop || 'Not specified',
        'Irrigation Type': form.irrigationType || 'Not specified',
        'Additional Notes': form.notes || 'None'
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
      console.log('Farm details submitted successfully:', data);
      setSubmitted(true);
      
      // Store notification in sessionStorage for home page
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('farmSubmitNotification', JSON.stringify({
          show: true,
          success: true,
          message: `Thank you ${form.ownerName}! Your farm details have been submitted successfully. We'll contact you soon.`
        }));
      }
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        navigate('/');
      }, 1000);
    })
    .catch(error => {
      console.error('Error submitting farm details:', error);
      
      // Store error notification
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('farmSubmitNotification', JSON.stringify({
          show: true,
          success: false,
          message: 'There was an error submitting your farm details. Please try again.'
        }));
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    });
  }

  return (
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'80vh',padding:'2rem 1rem'}}>
      <div style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(15px)',border:'1px solid rgba(255,255,255,0.6)',padding:'3rem 2.5rem',borderRadius:'20px',boxShadow:'0 12px 40px rgba(0,0,0,0.15)',width:'100%',maxWidth:600}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{background:'linear-gradient(135deg, #2e7d32, #4caf50)',width:'70px',height:'70px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'2em'}}>🌾</div>
          <h2 style={{color:'#2e7d32',margin:'0 0 0.5rem 0',fontSize:'1.8em',fontWeight:700}}>Upload Your Farm Details</h2>
          <p style={{color:'#666',fontSize:'0.95em',margin:0}}>Share your farm information with us</p>
        </div>
  <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Owner Name *</label>
            <input name="ownerName" value={form.ownerName} onChange={handleChange} required style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Select Farm Land Location *</label>
            <div style={{ width: '100%', height: '250px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #e0e0e0', marginBottom: '0.75rem' }}>
              <MapContainer center={[11.0, 78.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            </div>
            {form.location && <div style={{color:'#2e7d32',fontSize:'0.9em',padding:'0.5rem',background:'rgba(46,125,50,0.1)',borderRadius:'8px',fontWeight:500}}>✓ Selected: Lat {form.location.lat}, Lng {form.location.lng}</div>}
            <small style={{color:'#666',fontSize:'0.85em',display:'block',marginTop:'0.5rem'}}>Click on the map to select your farm's location</small>
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Contact Number *</label>
            <input name="contact" value={form.contact} onChange={handleChange} required type="tel" inputMode="numeric" pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} required style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)',minHeight:'80px',resize:'vertical'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Land Image *</label>
            <input type="file" name="landImage" accept="image/*" onChange={handleChange} required style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)',cursor:'pointer'}} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Area (in acres) *</label>
            <input name="area" value={form.area} onChange={handleChange} required style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Crop Planted</label>
            <input name="crop" value={form.crop} onChange={handleChange} style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Irrigation Type</label>
            <input name="irrigationType" value={form.irrigationType} onChange={handleChange} style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{display:'block',fontWeight:600,color:'#2e7d32',marginBottom:'0.5rem',fontSize:'0.95em'}}>Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} style={{width:'100%',padding:'0.85rem 1rem',borderRadius:'10px',border:'2px solid #e0e0e0',fontSize:'1em',transition:'all 0.3s ease',outline:'none',background:'rgba(255,255,255,0.9)',minHeight:'60px',resize:'vertical'}} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>
          <button type="submit" style={{width:'100%',padding:'1rem',background:'linear-gradient(135deg, #2e7d32, #4caf50)',color:'white',border:'none',borderRadius:'10px',fontWeight:600,fontSize:'1.05em',cursor:'pointer',boxShadow:'0 4px 15px rgba(46,125,50,0.3)',transition:'all 0.3s ease'}} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>Submit Farm Details</button>
        </form>
        {submitted && <div style={{textAlign:'center',marginTop:'2rem',padding:'1.5rem',background:'rgba(46,125,50,0.1)',borderRadius:'10px',color:'#2e7d32'}}><div style={{fontSize:'2em',marginBottom:'0.5rem'}}>✓</div><div style={{fontWeight:600}}>Thank you! We received your farm details.</div></div>}
      </div>
    </div>
  );
}
