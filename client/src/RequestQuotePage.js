import React, { useState } from 'react';
import { apiUrl } from './api';

export default function RequestQuotePage() {
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    description: '',
    landType: '',
    landImage: null
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, success: false, message: '' });

  const handleQuoteInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'landImage') {
      setQuoteForm(prev => ({ ...prev, landImage: files[0] }));
    } else {
      setQuoteForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    
    // Prepare email data
    const emailData = {
      formType: 'Request Quote in Construction',
      name: quoteForm.name,
      phone: quoteForm.phone,
      email: quoteForm.email,
      message: `Construction quote request for ${quoteForm.projectType}`,
      extra: {
        'Name': quoteForm.name,
        'Phone': quoteForm.phone,
        'Email': quoteForm.email,
        'Project Type': quoteForm.projectType,
        'Description': quoteForm.description || 'Not provided',
        'Uploaded File': quoteForm.file ? quoteForm.file.name : 'No file uploaded'
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
      console.log('Construction quote request submitted successfully:', data);
      setQuoteSubmitted(true);
      setNotification({ 
        show: true, 
        success: true, 
        message: `Thank you ${quoteForm.name}! Your construction quote request has been submitted successfully. We'll contact you soon!` 
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setQuoteForm({
          name: '',
          phone: '',
          email: '',
          projectType: '',
          description: '',
          landType: '',
          landImage: null
        });
        setQuoteSubmitted(false);
      }, 3000);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    })
    .catch(error => {
      console.error('Error submitting construction quote request:', error);
      setNotification({ 
        show: true, 
        success: false, 
        message: 'Failed to submit quote request. Please try again.' 
      });
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 3000);
    });
  };

  return (
    <div className="request-quote-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 520, width: '100%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', padding: '3rem 2.5rem', position: 'relative' }}>
        <h2 style={{ marginBottom: '0.5rem', color: '#2e7d32', fontWeight: 700, fontSize: '1.8em', textAlign: 'center' }}>Request a Construction Quote</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '0.95em' }}>Fill in the details and we'll get back to you soon</p>
        {!quoteSubmitted ? (
          <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2em' }} encType="multipart/form-data">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Name *</label>
              <input type="text" name="name" value={quoteForm.name} onChange={handleQuoteInput} required pattern="^[A-Za-z ]+$" title="Name should contain only letters and spaces" style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Phone *</label>
              <input type="tel" name="phone" value={quoteForm.phone} onChange={handleQuoteInput} required pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Email *</label>
              <input type="email" name="email" value={quoteForm.email} onChange={handleQuoteInput} required style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Project Type *</label>
              <select name="projectType" value={quoteForm.projectType} onChange={handleQuoteInput} required style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}>
                <option value="">Select Type</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Swimming Pool">Swimming Pool</option>
                <option value="Water Tank">Water Tank</option>
                <option value="Fencing">Fencing</option>
                <option value="Polyhouse">Polyhouse</option>
                <option value="Cow & Goat Shed">Cow & Goat Shed</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Description *</label>
              <textarea name="description" value={quoteForm.description} onChange={handleQuoteInput} rows="3" required maxLength="500" title="Describe your project (max 500 characters)" style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)', resize: 'vertical', minHeight: 80 }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Land Type</label>
              <input type="text" name="landType" value={quoteForm.landType} onChange={handleQuoteInput} placeholder="e.g. Red soil, Clay, Sandy" style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)' }} onFocus={(e) => e.target.style.borderColor = '#2e7d32'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#2e7d32', marginBottom: '0.5rem', fontSize: '0.95em' }}>Land Image</label>
              <input type="file" name="landImage" accept="image/*" onChange={handleQuoteInput} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 10, border: '2px solid #e0e0e0', fontSize: '1em', transition: 'all 0.3s ease', outline: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer' }} />
              {quoteForm.landImage && <span style={{ fontSize: '0.9em', color: '#2e7d32', marginTop: '0.5rem', display: 'block', fontWeight: 500 }}>✓ Selected: {quoteForm.landImage.name}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: 10, fontWeight: 600, fontSize: '1.05em', background: 'linear-gradient(135deg, #2e7d32, #4caf50)', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>Submit Quote Request</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3em', marginBottom: '1rem' }}>✓</div>
            <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>Thank You!</h3>
            <p style={{ color: '#666' }}>Your construction quote request has been submitted successfully.</p>
          </div>
        )}
        
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
    </div>
  );
}
