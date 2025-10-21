import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api';
import '../App.css';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'Monthly',
    features: '',
    color: '#4CAF50',
    isPopular: false
  });

  // Password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'ullavar2025';

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadPlans();
    }
  }, [isAuthenticated]);

  const loadPlans = () => {
    setLoading(true);
    fetch(apiUrl('/api/plans'), {
      headers: { 'Accept': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load plans');
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const planData = {
      name: formData.name,
      price: formData.price,
      duration: formData.duration,
      features: formData.features.split('\n').filter(f => f.trim()),
      color: formData.color,
      isPopular: formData.isPopular
    };

    const url = editingPlan 
      ? apiUrl(`/api/plans/${editingPlan.id}`)
      : apiUrl('/api/plans');
    
    const method = editingPlan ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_PASSWORD
      },
      body: JSON.stringify(planData)
    })
      .then(r => {
        if (!r.ok) throw new Error('Authentication failed');
        return r.json();
      })
      .then(() => {
        alert(editingPlan ? 'Plan updated!' : 'Plan created!');
        setShowForm(false);
        setEditingPlan(null);
        setFormData({ name: '', price: '', duration: 'Monthly', features: '', color: '#4CAF50', isPopular: false });
        loadPlans();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save plan: ' + err.message);
      });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.join('\n'),
      color: plan.color,
      isPopular: plan.isPopular
    });
    setShowForm(true);
  };

  const handleDelete = (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    fetch(apiUrl(`/api/plans/${planId}`), {
      method: 'DELETE',
      headers: { 
        'x-admin-key': ADMIN_PASSWORD
      }
    })
      .then(r => {
        if (!r.ok) throw new Error('Authentication failed');
        return r.json();
      })
      .then(() => {
        alert('Plan deleted!');
        loadPlans();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete plan: ' + err.message);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ name: '', price: '', duration: 'Monthly', features: '', color: '#4CAF50', isPopular: false });
  };

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '3em',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: 400,
          width: '100%'
        }}>
          <h2 style={{ 
            color: '#388e3c', 
            marginBottom: '1.5em',
            textAlign: 'center',
            fontSize: '1.8em'
          }}>
            🔒 Admin Access
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '2em' 
          }}>
            Enter password to manage AMC plans
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #ddd',
                borderRadius: 8,
                fontSize: '1em',
                marginBottom: '1.5em',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#388e3c'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
              autoFocus
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#388e3c',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: 8,
                fontSize: '1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#2e7d32'}
              onMouseOut={(e) => e.target.style.background = '#388e3c'}
            >
              🔓 Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2em auto', padding: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2em' }}>
        <h1 style={{ color: '#388e3c', margin: 0 }}>📋 Manage AMC Plans</h1>
        <button 
          onClick={() => setShowForm(true)}
          style={{
            background: '#388e3c',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1em'
          }}
        >
          + Add New Plan
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            padding: '2em',
            borderRadius: 16,
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#388e3c', marginBottom: '1.5em' }}>
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1em' }}>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Basic Plan"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1em',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="5000"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      fontSize: '1em',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1em' }}>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>
                  Color Theme
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    height: 50,
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1em' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  Mark as Popular Plan
                </label>
              </div>

              <div style={{ marginBottom: '1.5em' }}>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 600 }}>
                  Features (one per line) *
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Monthly farm visit&#10;Basic irrigation check&#10;Pest monitoring"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    fontSize: '1em',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
                <small style={{ color: '#666' }}>Enter each feature on a new line</small>
              </div>

              <div style={{ display: 'flex', gap: '1em' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#388e3c',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1em'
                  }}
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    background: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #ddd',
                    padding: '14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1em'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3em', color: '#666' }}>
          Loading plans...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2em' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{
                background: 'white',
                border: `3px solid ${plan.color}`,
                borderRadius: 16,
                padding: '2em',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {plan.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: -15,
                  right: 20,
                  background: '#FF9800',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: 20,
                  fontSize: '0.85em',
                  fontWeight: 'bold'
                }}>
                  ⭐ Popular
                </div>
              )}

              <h3 style={{ color: plan.color, fontSize: '1.5em', marginBottom: '0.5em' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#333', marginBottom: '0.5em' }}>
                ₹{plan.price}
                <span style={{ fontSize: '0.5em', color: '#666' }}>/{plan.duration}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5em 0' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ padding: '0.5em 0', color: '#555', display: 'flex', gap: '0.5em' }}>
                    <span style={{ color: plan.color }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '1em', marginTop: '1.5em' }}>
                <button
                  onClick={() => handleEdit(plan)}
                  style={{
                    flex: 1,
                    background: plan.color,
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  style={{
                    flex: 1,
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4em',
          color: '#666',
          background: '#f9f9f9',
          borderRadius: 16,
          border: '2px dashed #ddd'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>📋</div>
          <h3>No Plans Yet</h3>
          <p>Click "Add New Plan" to create your first AMC plan</p>
        </div>
      )}
    </div>
  );
}
