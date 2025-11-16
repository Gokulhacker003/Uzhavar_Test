import React, { useState, useEffect } from 'react';
import { apiUrl, imageUrl } from '../api';

export default function AdminCompaniesPage({ onLogout }) {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', logo: '', logoFile: null });
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', image: '', imageFile: null, showOrderButton: true });
  const [activeProductCompanyId, setActiveProductCompanyId] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState(new Set());

  // CSS Variables for theming
  const theme = {
    primaryColor: '#2e7d32',
    primaryLight: '#4caf50',
    dangerColor: '#d32f2f',
    dangerLight: '#f44336',
    bgColor: '#f9fafb',
    cardBg: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    borderColor: '#e0e0e0',
    shadowSm: '0 1px 3px rgba(0,0,0,0.1)',
    shadowMd: '0 4px 6px rgba(0,0,0,0.1)',
    shadowLg: '0 10px 20px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    spacing: '1rem'
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleLogoFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, logoFile: file, logo: '' }));
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.logoFile) {
      formData.append('logo', form.logoFile);
    } else if (form.logo) {
      formData.append('logo', form.logo);
    }

    fetch(apiUrl('/api/companies'), {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(newCompany => {
      setCompanies(prev => [...prev, newCompany]);
      setForm({ name: '', description: '', logo: '', logoFile: null });
      alert('✓ Company added successfully!');
    })
    .catch(err => {
      console.error('Error adding company:', err);
      alert('Failed to add company');
    });
  }

  function handleEdit(id) {
    const company = companies.find(c => c.id === id);
    setForm({ 
      name: company.name, 
      description: company.description || '', 
      logo: company.logo || '',
      logoFile: null 
    });
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.logoFile) {
      formData.append('logo', form.logoFile);
    } else if (form.logo !== undefined) {
      formData.append('logo', form.logo);
    }

    fetch(apiUrl(`/api/companies/${editingId}`), {
      method: 'PUT',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
      setForm({ name: '', description: '', logo: '', logoFile: null });
      setEditingId(null);
      alert('✓ Company updated successfully!');
    })
    .catch(err => {
      console.error('Error updating company:', err);
      alert('Failed to update company');
    });
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    fetch(apiUrl(`/api/companies/${id}`), {
      method: 'DELETE'
    })
    .then(r => r.json())
    .then(() => {
      setCompanies(prev => prev.filter(c => c.id !== id));
      alert('✓ Company deleted successfully!');
    })
    .catch(err => {
      console.error('Error deleting company:', err);
      alert('Failed to delete company');
    });
  }

  // Product management
  function handleProductChange(e) {
    const { name, value } = e.target;
    setProductForm(f => ({ ...f, [name]: value }));
  }

  function handleProductImageFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProductForm(f => ({ ...f, imageFile: file, image: '' }));
    }
  }

  function handleAddProduct(e, companyId) {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('showOrderButton', productForm.showOrderButton);
    if (productForm.imageFile) {
      formData.append('image', productForm.imageFile);
    } else if (productForm.image) {
      formData.append('image', productForm.image);
    }

    fetch(apiUrl(`/api/companies/${companyId}/products`), {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
      setProductForm({ name: '', image: '', imageFile: null, showOrderButton: true });
      setActiveProductCompanyId(null);
      alert('✓ Product added successfully!');
    })
    .catch(err => {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    });
  }

  function handleUpdateProduct(e, companyId, productId) {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    console.log('🔄 UPDATE REQUEST:', { companyId, productId, name: productForm.name });

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('showOrderButton', productForm.showOrderButton);
    if (productForm.imageFile) {
      formData.append('image', productForm.imageFile);
    } else if (productForm.image !== undefined) {
      formData.append('image', productForm.image);
    }

    const url = apiUrl(`/api/companies/${companyId}/products/${productId}`);
    console.log('📡 API URL:', url);

    fetch(url, {
      method: 'PUT',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
      setProductForm({ name: '', image: '', imageFile: null, showOrderButton: true });
      setActiveProductCompanyId(null);
      alert('✓ Product updated successfully!');
    })
    .catch(err => {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    });
  }

  function handleRemoveProduct(companyId, productId) {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    fetch(apiUrl(`/api/companies/${companyId}/products/${productId}`), { method: 'DELETE' })
      .then(r => r.json())
      .then(updated => {
        setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
        alert('✓ Product removed successfully!');
      })
      .catch(err => {
        console.error('Error removing product:', err);
        alert('Failed to remove product');
      });
  }

  function toggleCompanyExpand(companyId) {
    setExpandedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  }

  useEffect(() => {
    fetch(apiUrl('/api/companies'))
      .then(r => r.json())
      .then(data => {
        console.log('📦 COMPANIES LOADED:', data);
        data.forEach(company => {
          console.log(`Company: ${company.name}, Products:`, company.products);
        });
        setCompanies(data);
      })
      .catch(err => {
        console.error('Failed to load companies', err);
        setCompanies([]);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.3
        }}
      >
        <source src="/videos/farm-video.mp4" type="video/mp4" />
        <source src="/videos/farm-video.webm" type="video/webm" />
      </video>
      
      {/* Overlay for better readability */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(249, 250, 251, 0.85)',
        zIndex: -1
      }} />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <header style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryLight})`,
          borderRadius: theme.borderRadius,
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: theme.shadowMd,
          color: '#fff'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '2em',
            fontWeight: 700
          }}>
            🏢 Companies Management
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.95, fontSize: '1.05em' }}>
            Manage your companies and their product catalogs
          </p>
        </header>

        {/* Add/Edit Company Form */}
        <section
          aria-label="Company Form"
          style={{
            background: theme.cardBg,
            borderRadius: theme.borderRadius,
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: theme.shadowSm,
            border: `1px solid ${theme.borderColor}`
          }}
        >
          <h2 style={{
            color: theme.primaryColor,
            marginTop: 0,
            marginBottom: '1.5rem',
            fontSize: '1.5em',
            fontWeight: 700
          }}>
            {editingId ? '✏️ Edit Company' : '➕ Add New Company'}
          </h2>
          
          <form onSubmit={editingId ? handleUpdate : handleAdd}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <label htmlFor="companyName" style={{
                  display: 'block',
                  fontWeight: 600,
                  color: theme.textPrimary,
                  marginBottom: '0.5rem'
                }}>
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: theme.borderRadius,
                    border: `2px solid ${theme.borderColor}`,
                    fontSize: '1rem',
                    background: theme.cardBg,
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = theme.primaryColor}
                  onBlur={e => e.target.style.borderColor = theme.borderColor}
                />
              </div>

              <div>
                <label htmlFor="companyDescription" style={{
                  display: 'block',
                  fontWeight: 600,
                  color: theme.textPrimary,
                  marginBottom: '0.5rem'
                }}>
                  Description
                </label>
                <textarea
                  id="companyDescription"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: theme.borderRadius,
                    border: `2px solid ${theme.borderColor}`,
                    fontSize: '1rem',
                    background: theme.cardBg,
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  onFocus={e => e.target.style.borderColor = theme.primaryColor}
                  onBlur={e => e.target.style.borderColor = theme.borderColor}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label htmlFor="logoUrl" style={{
                    display: 'block',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    marginBottom: '0.5rem'
                  }}>
                    Logo URL
                  </label>
                  <input
                    id="logoUrl"
                    name="logo"
                    type="url"
                    value={form.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: theme.borderRadius,
                      border: `2px solid ${theme.borderColor}`,
                      fontSize: '1rem',
                      background: theme.cardBg,
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = theme.primaryColor}
                    onBlur={e => e.target.style.borderColor = theme.borderColor}
                  />
                </div>

                <div>
                  <label htmlFor="logoFile" style={{
                    display: 'block',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    marginBottom: '0.5rem'
                  }}>
                    Or Upload Logo
                  </label>
                  <input
                    id="logoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: theme.borderRadius,
                      border: `2px solid ${theme.borderColor}`,
                      fontSize: '0.95rem',
                      background: theme.cardBg,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    minWidth: 150,
                    padding: '0.85rem 1.5rem',
                    borderRadius: theme.borderRadius,
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryLight})`,
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: theme.shadowSm,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = theme.shadowMd;
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = theme.shadowSm;
                  }}
                >
                  {editingId ? '✓ Update Company' : '+ Add Company'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: '', description: '', logo: '', logoFile: null });
                    }}
                    style={{
                      flex: 1,
                      minWidth: 150,
                      padding: '0.85rem 1.5rem',
                      borderRadius: theme.borderRadius,
                      background: theme.textSecondary,
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: theme.shadowSm,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        {/* Companies List */}
        <section aria-label="Companies List">
          <div style={{
            background: theme.cardBg,
            borderRadius: theme.borderRadius,
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: theme.shadowSm,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              margin: 0,
              color: theme.primaryColor,
              fontSize: '1.5em',
              fontWeight: 700
            }}>
              📊 Companies ({companies.length})
            </h2>
          </div>

          {companies.length === 0 ? (
            <div style={{
              background: theme.cardBg,
              borderRadius: theme.borderRadius,
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: theme.shadowSm
            }}>
              <div style={{ fontSize: '4em', marginBottom: '1rem' }}>🏢</div>
              <h3 style={{ color: theme.textSecondary, fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                No companies yet
              </h3>
              <p style={{ color: theme.textMuted, margin: 0 }}>
                Add your first company using the form above
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {companies.map(company => {
                const isExpanded = expandedCompanies.has(company.id);
                const productCount = company.products?.length || 0;

                return (
                  <article
                    key={company.id}
                    aria-label={`Company: ${company.name}`}
                    style={{
                      background: theme.cardBg,
                      borderRadius: theme.borderRadius,
                      boxShadow: theme.shadowSm,
                      border: `1px solid ${theme.borderColor}`,
                      overflow: 'hidden',
                      transition: 'all 0.3s'
                    }}
                  >
                    {/* Company Card */}
                    <div style={{
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      {/* Company Logo */}
                      <div style={{
                        width: 60,
                        height: 60,
                        borderRadius: theme.borderRadius,
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: theme.shadowSm,
                        background: company.logo ? 'transparent' : '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {company.logo ? (
                          <img
                            src={imageUrl(company.logo)}
                            alt={`${company.name} logo`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '1.8em' }}>🏢</span>
                        )}
                      </div>

                      {/* Company Info */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h3 style={{
                          margin: '0 0 0.5rem 0',
                          color: theme.primaryColor,
                          fontSize: '1.25em',
                          fontWeight: 700
                        }}>
                          {company.name}
                        </h3>
                        
                        <p style={{
                          margin: '0 0 0.5rem 0',
                          color: theme.textSecondary,
                          fontSize: '0.95em',
                          lineHeight: 1.6
                        }}>
                          {company.description || 'No description provided'}
                        </p>
                        
                        <div style={{
                          color: theme.textMuted,
                          fontSize: '0.85em'
                        }}>
                          ID: {company.id}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={() => handleEdit(company.id)}
                          aria-label={`Edit ${company.name}`}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: theme.borderRadius,
                            background: 'transparent',
                            border: `2px solid ${theme.primaryColor}`,
                            color: theme.primaryColor,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={e => {
                            e.target.style.background = theme.primaryColor;
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={e => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = theme.primaryColor;
                          }}
                        >
                          <span>✏️</span> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(company.id)}
                          aria-label={`Delete ${company.name}`}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: theme.borderRadius,
                            background: theme.dangerColor,
                            border: 'none',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={e => e.target.style.background = theme.dangerLight}
                          onMouseLeave={e => e.target.style.background = theme.dangerColor}
                        >
                          <span>🗑️</span> Delete
                        </button>

                        <button
                          onClick={() => toggleCompanyExpand(company.id)}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} products for ${company.name}`}
                          aria-expanded={isExpanded}
                          style={{
                            padding: '0.6rem 1rem',
                            borderRadius: theme.borderRadius,
                            background: '#f0f0f0',
                            border: 'none',
                            color: theme.textPrimary,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.background = '#e0e0e0'}
                          onMouseLeave={e => e.target.style.background = '#f0f0f0'}
                        >
                          {isExpanded ? '▲' : '▼'} Products ({productCount})
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Products Section */}
                    {isExpanded && (
                      <div style={{
                        borderTop: `1px solid ${theme.borderColor}`,
                        background: '#fafafa',
                        padding: '1.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '1.5rem',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}>
                          <h4 style={{
                            margin: 0,
                            color: theme.textPrimary,
                            fontSize: '1.15em',
                            fontWeight: 700
                          }}>
                            📦 Products
                          </h4>
                          
                          <button
                            onClick={() => {
                              setActiveProductCompanyId(company.id);
                              setProductForm({ name: '', image: '', imageFile: null, showOrderButton: true, editProductId: null });
                            }}
                            aria-label={`Add product to ${company.name}`}
                            style={{
                              padding: '0.6rem 1.2rem',
                              borderRadius: theme.borderRadius,
                              background: theme.primaryColor,
                              border: 'none',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.background = theme.primaryLight}
                            onMouseLeave={e => e.target.style.background = theme.primaryColor}
                          >
                            ➕ Add Product
                          </button>
                        </div>

                        {/* Products Grid */}
                        {productCount === 0 && activeProductCompanyId !== company.id ? (
                          <div style={{
                            background: '#fff',
                            borderRadius: theme.borderRadius,
                            padding: '2rem',
                            textAlign: 'center',
                            border: `2px dashed ${theme.borderColor}`
                          }}>
                            <div style={{ fontSize: '2.5em', marginBottom: '0.5rem' }}>📦</div>
                            <p style={{ margin: 0, color: theme.textMuted }}>
                              No products yet. Add your first product!
                            </p>
                          </div>
                        ) : (
                          productCount > 0 && (
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                              gap: '1rem',
                              marginBottom: activeProductCompanyId === company.id ? '1.5rem' : 0
                            }}>
                              {company.products.map((product, idx) => (
                                <div
                                  key={product.id || idx}
                                  style={{
                                    background: '#fff',
                                    borderRadius: theme.borderRadius,
                                    overflow: 'hidden',
                                    boxShadow: theme.shadowSm,
                                    border: `1px solid ${theme.borderColor}`,
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = theme.shadowMd;
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.shadowSm;
                                  }}
                                >
                                  {/* Product Image */}
                                  <div style={{
                                    width: '100%',
                                    height: 150,
                                    background: product.image ? '#f8f8f8' : '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                  }}>
                                    {product.image ? (
                                      <img
                                        src={imageUrl(product.image)}
                                        alt={product.name}
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '100%',
                                          objectFit: 'contain',
                                          padding: '0.5rem'
                                        }}
                                      />
                                    ) : (
                                      <span style={{ fontSize: '2.5em' }}>📦</span>
                                    )}
                                  </div>

                                  {/* Product Info */}
                                  <div style={{ padding: '1rem' }}>
                                    <h5 style={{
                                      margin: '0 0 1rem 0',
                                      color: theme.textPrimary,
                                      fontSize: '1em',
                                      fontWeight: 600,
                                      lineHeight: 1.4
                                    }}>
                                      {product.name}
                                    </h5>

                                    <div style={{
                                      display: 'flex',
                                      gap: '0.5rem'
                                    }}>
                                      <button
                                        onClick={() => {
                                          console.log('✏️ EDIT CLICKED:', { 
                                            productName: product.name, 
                                            productId: product.id, 
                                            companyId: company.id,
                                            fullProduct: product 
                                          });
                                          setActiveProductCompanyId(company.id);
                                          setProductForm({
                                            name: product.name,
                                            image: product.image || '',
                                            imageFile: null,
                                            showOrderButton: (product.showOrderButton === undefined) ? true : product.showOrderButton,
                                            editProductId: product.id
                                          });
                                        }}
                                        aria-label={`Edit product ${product.name}`}
                                        style={{
                                          flex: 1,
                                          padding: '0.5rem',
                                          borderRadius: theme.borderRadius,
                                          background: 'transparent',
                                          border: `2px solid ${theme.primaryColor}`,
                                          color: theme.primaryColor,
                                          fontWeight: 600,
                                          fontSize: '0.85em',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                          e.target.style.background = theme.primaryColor;
                                          e.target.style.color = '#fff';
                                        }}
                                        onMouseLeave={e => {
                                          e.target.style.background = 'transparent';
                                          e.target.style.color = theme.primaryColor;
                                        }}
                                      >
                                        ✏️
                                      </button>

                                      <button
                                        onClick={() => handleRemoveProduct(company.id, product.id)}
                                        aria-label={`Remove product ${product.name}`}
                                        style={{
                                          flex: 1,
                                          padding: '0.5rem',
                                          borderRadius: theme.borderRadius,
                                          background: theme.dangerColor,
                                          border: 'none',
                                          color: '#fff',
                                          fontWeight: 600,
                                          fontSize: '0.85em',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.target.style.background = theme.dangerLight}
                                        onMouseLeave={e => e.target.style.background = theme.dangerColor}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}

                        {/* Product Form */}
                        {activeProductCompanyId === company.id && (
                          <div style={{
                            background: '#fff',
                            borderRadius: theme.borderRadius,
                            padding: '1.5rem',
                            border: `2px solid ${theme.borderColor}`,
                            marginTop: productCount > 0 ? '1.5rem' : 0
                          }}>
                            <h5 style={{
                              marginTop: 0,
                              marginBottom: '1.5rem',
                              color: theme.primaryColor,
                              fontSize: '1.1em',
                              fontWeight: 700
                            }}>
                              {productForm.editProductId !== null && productForm.editProductId !== undefined
                                ? '✏️ Edit Product'
                                : '➕ Add New Product'}
                            </h5>

                            <form
                              onSubmit={e => {
                                if (productForm.editProductId !== null && productForm.editProductId !== undefined) {
                                  handleUpdateProduct(e, company.id, productForm.editProductId);
                                } else {
                                  handleAddProduct(e, company.id);
                                }
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                marginBottom: '1rem'
                              }}>
                                <div>
                                  <label htmlFor={`productName-${company.id}`} style={{
                                    display: 'block',
                                    fontWeight: 600,
                                    color: theme.textPrimary,
                                    marginBottom: '0.5rem'
                                  }}>
                                    Product Name *
                                  </label>
                                  <input
                                    id={`productName-${company.id}`}
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleProductChange}
                                    placeholder="Enter product name"
                                    required
                                    style={{
                                      width: '100%',
                                      padding: '0.75rem 1rem',
                                      borderRadius: theme.borderRadius,
                                      border: `2px solid ${theme.borderColor}`,
                                      fontSize: '0.95rem',
                                      background: '#fff',
                                      boxSizing: 'border-box',
                                      transition: 'all 0.2s',
                                      outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = theme.primaryColor}
                                    onBlur={e => e.target.style.borderColor = theme.borderColor}
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`productImage-${company.id}`} style={{
                                    display: 'block',
                                    fontWeight: 600,
                                    color: theme.textPrimary,
                                    marginBottom: '0.5rem'
                                  }}>
                                    Image URL
                                  </label>
                                  <input
                                    id={`productImage-${company.id}`}
                                    name="image"
                                    type="url"
                                    value={productForm.image}
                                    onChange={handleProductChange}
                                    placeholder="https://example.com/image.png"
                                    style={{
                                      width: '100%',
                                      padding: '0.75rem 1rem',
                                      borderRadius: theme.borderRadius,
                                      border: `2px solid ${theme.borderColor}`,
                                      fontSize: '0.95rem',
                                      background: '#fff',
                                      boxSizing: 'border-box',
                                      transition: 'all 0.2s',
                                      outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = theme.primaryColor}
                                    onBlur={e => e.target.style.borderColor = theme.borderColor}
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`productImageFile-${company.id}`} style={{
                                    display: 'block',
                                    fontWeight: 600,
                                    color: theme.textPrimary,
                                    marginBottom: '0.5rem'
                                  }}>
                                    Or Upload Image
                                  </label>
                                  <input
                                    id={`productImageFile-${company.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProductImageFileChange}
                                    style={{
                                      width: '100%',
                                      padding: '0.65rem 1rem',
                                      borderRadius: theme.borderRadius,
                                      border: `2px solid ${theme.borderColor}`,
                                      fontSize: '0.85rem',
                                      background: '#fff',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  padding: '0.75rem',
                                  background: '#f8f9fa',
                                  borderRadius: theme.borderRadius,
                                  border: `2px solid ${theme.borderColor}`
                                }}>
                                  <input
                                    id={`showOrderButton-${company.id}`}
                                    type="checkbox"
                                    checked={productForm.showOrderButton}
                                    onChange={(e) => setProductForm(f => ({ ...f, showOrderButton: e.target.checked }))}
                                    style={{
                                      width: 18,
                                      height: 18,
                                      cursor: 'pointer',
                                      accentColor: theme.primaryColor
                                    }}
                                  />
                                  <label htmlFor={`showOrderButton-${company.id}`} style={{
                                    fontWeight: 600,
                                    color: theme.textPrimary,
                                    cursor: 'pointer',
                                    margin: 0,
                                    userSelect: 'none'
                                  }}>
                                    🛒 Show "Order Now" button on customer page
                                  </label>
                                </div>
                              </div>

                              <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap'
                              }}>
                                <button
                                  type="submit"
                                  style={{
                                    flex: 1,
                                    minWidth: 120,
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: theme.borderRadius,
                                    background: theme.primaryColor,
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => e.target.style.background = theme.primaryLight}
                                  onMouseLeave={e => e.target.style.background = theme.primaryColor}
                                >
                                  {productForm.editProductId !== null && productForm.editProductId !== undefined
                                    ? '✓ Update'
                                    : '+ Add'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveProductCompanyId(null);
                                    setProductForm({ name: '', image: '', imageFile: null, showOrderButton: true });
                                  }}
                                  style={{
                                    flex: 1,
                                    minWidth: 120,
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: theme.borderRadius,
                                    background: theme.textSecondary,
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                                  onMouseLeave={e => e.target.style.opacity = '1'}
                                >
                                  ✕ Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
