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
    <div className="request-quote-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '2.5em 2em', position: 'relative', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.2em', color: '#388e3c', fontWeight: 700, fontSize: '1.6em', letterSpacing: '0.02em' }}>Request a Construction Quote</h2>
        {!quoteSubmitted ? (
          <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2em' }} encType="multipart/form-data">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Name</label>
              <input type="text" name="name" value={quoteForm.name} onChange={handleQuoteInput} required pattern="^[A-Za-z ]+$" title="Name should contain only letters and spaces" style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Phone</label>
              <input type="tel" name="phone" value={quoteForm.phone} onChange={handleQuoteInput} required pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Email</label>
              <input type="email" name="email" value={quoteForm.email} onChange={handleQuoteInput} required style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Project Type</label>
              <select name="projectType" value={quoteForm.projectType} onChange={handleQuoteInput} required style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em', background: '#f9f9f9' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Description</label>
              <textarea name="description" value={quoteForm.description} onChange={handleQuoteInput} rows="3" required maxLength="500" title="Describe your project (max 500 characters)" style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em', resize: 'vertical', minHeight: 60 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Land Type</label>
              <input type="text" name="landType" value={quoteForm.landType} onChange={handleQuoteInput} placeholder="e.g. Red soil, Clay, Sandy" style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              <label style={{ fontWeight: 500, color: '#1976d2', textAlign: 'left' }}>Land Image</label>
              <input type="file" name="landImage" accept="image/*" onChange={handleQuoteInput} style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1em' }} />
              {quoteForm.landImage && <span style={{ fontSize: '0.95em', color: '#388e3c', marginTop: '0.3em' }}>Selected: {quoteForm.landImage.name}</span>}
            </div>
            <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginTop: '1em' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.7em 2em', borderRadius: 8, fontWeight: 600, fontSize: '1em', background: '#388e3c', border: 'none' }}>Submit</button>
            </div>
          </form>
        ) : (
          <div className="project-success">
            <p>Thank you! Your construction quote request has been submitted.</p>
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
    </div>
  );
}
