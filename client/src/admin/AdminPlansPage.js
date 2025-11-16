import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api';
import { authHelper } from './authHelper';
import '../App.css';

function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    duration: 'Monthly',
    description: '',
    features: [],
    popular: false
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans =async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/plans'));
      if (!res.ok) throw new Error('Failed to load plans');
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
      alert('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPlan 
        ? apiUrl(`/api/plans/${editingPlan.id}`)
        : apiUrl('/api/plans');
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save plan');
      
      alert(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      resetForm();
      loadPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      id: plan.id,
      name: plan.name,
      duration: plan.duration,
      description: plan.description || '',
      features: plan.features || [],
      popular: plan.popular || false
    });
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/plans/${planId}`), {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete plan');
      
      alert('Plan deleted successfully!');
      loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      duration: 'Monthly',
      description: '',
      features: [],
      popular: false
    });
    setFeatureInput('');
    setEditingPlan(null);
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2em auto', padding: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2em', flexWrap: 'wrap', gap: '1em' }}>
        <div>
          <h1 style={{ color: '#388e3c', margin: 0 }}>📋 Manage AMC Plans</h1>
          <p style={{ color: '#666', margin: '0.5em 0 0 0', fontSize: '0.9em' }}>
            👤 Logged in as: <strong>{authHelper.getUser()?.username || 'Admin'}</strong>
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? '#666' : '#388e3c',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Plan'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          padding: '2em',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '2em'
        }}>
          <h2 style={{ color: '#388e3c', marginBottom: '1.5em' }}>
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5em', marginBottom: '1.5em' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2e7d32', fontSize: '0.95em' }}>
                  Plan ID *
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={!!editingPlan}
                  placeholder="e.g., basic, standard, premium"
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: 10,
                    fontSize: '1rem',
                    backgroundColor: editingPlan ? '#f5f5f5' : 'rgba(255,255,255,0.9)',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => !editingPlan && (e.target.style.borderColor = '#2e7d32')}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2e7d32', fontSize: '0.95em' }}>
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Basic Plan"
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: 10,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.9)',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2e7d32', fontSize: '0.95em' }}>
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: 10,
                    fontSize: '1rem',
                    background: 'rgba(255,255,255,0.9)',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2e7d32', fontSize: '0.95em' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the plan"
                rows="2"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2e7d32', fontSize: '0.95em' }}>
                Features
              </label>
              <div style={{ display: 'flex', gap: '0.5em', marginBottom: '1em' }}>
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Add a feature and press Enter"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  style={{
                    background: '#388e3c',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Add
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {formData.features.map((feature, index) => (
                  <li key={index} style={{
                    background: '#f5f5f5',
                    padding: '10px',
                    marginBottom: '0.5em',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>✓ {feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      style={{
                        background: '#ef5350',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  Mark as Popular (Featured Badge)
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1em' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: 10,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
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
                {loading ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #757575, #9e9e9e)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2em' }}>
        {loading && plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3em', color: '#666' }}>
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3em', color: '#666' }}>
            No plans available. Create your first plan!
          </div>
        ) : (
          plans.map(plan => (
            <div
              key={plan.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2em',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative',
                border: plan.popular ? '3px solid #388e3c' : '1px solid #ddd'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: '#388e3c',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  ⭐ Popular
                </div>
              )}

              <h3 style={{ color: '#388e3c', fontSize: '1.5em', marginBottom: '0.5em' }}>
                {plan.name}
              </h3>
              <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '1em', minHeight: '40px' }}>
                {plan.description}
              </p>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#388e3c', marginBottom: '1em' }}>
                Duration: {plan.duration}
              </div>

              <div style={{ marginBottom: '1.5em' }}>
                <strong style={{ color: '#333', display: 'block', marginBottom: '0.5em' }}>Features:</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features && plan.features.map((feature, index) => (
                    <li key={index} style={{ padding: '0.3em 0', color: '#555' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '0.5em' }}>
                <button
                  onClick={() => handleEdit(plan)}
                  style={{
                    flex: 1,
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  style={{
                    flex: 1,
                    background: '#ef5350',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPlansPage;
