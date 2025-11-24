import React, { useEffect, useState } from "react";
import { apiUrl, imageUrl } from './api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [error, setError] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    quantity: 1
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const loadCompanies = () => {
    setLoading(true);
    setError(null);
    // Add cache-busting parameter to ensure fresh data
    const timestamp = new Date().getTime();
    fetch(apiUrl(`/api/companies?_t=${timestamp}`), {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json'
      }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('Companies loaded:', data);
        // Debug: Log logo URLs and product flags
        data.forEach(company => {
          if (company.logo) {
            console.log(`Company: ${company.name}, Logo path: ${company.logo}, Full URL: ${imageUrl(company.logo)}`);
          }
          if (company.products) {
            company.products.forEach((p, idx) => {
              console.log(`  Product ${idx}: ${p.name}, showOrderButton:`, p.showOrderButton);
            });
          }
        });
        setCompanies(data);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading companies:', err);
        setError(err.message);
        setCompanies(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleOrderClick = (product, company) => {
    setSelectedProduct({ ...product, companyName: company.name });
    setShowOrderModal(true);
    setOrderSubmitted(false);
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        formType: 'Product Order',
        name: orderForm.name,
        phone: orderForm.phone,
        email: orderForm.email,
        message: `Order for ${selectedProduct.name} from ${selectedProduct.companyName}`,
        extra: {
          'Product Name': selectedProduct.name,
          'Company': selectedProduct.companyName,
          'Quantity': orderForm.quantity,
          'Delivery Address': orderForm.address
        }
      };

      const response = await fetch(apiUrl('/api/send-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSubmitted(true);
        setOrderForm({ name: '', phone: '', email: '', address: '', quantity: 1 });
        setTimeout(() => {
          setShowOrderModal(false);
          setOrderSubmitted(false);
        }, 3000);
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please check your connection and try again.');
    }
  };

  const renderCompanyCard = (c, fallbackImg) => (
    <div 
      key={c.id} 
      className="company-card" 
      onClick={() => setSelectedCompany(c)}
      style={{ 
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255,255,255,0.5)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backdropFilter: 'blur(10px)'
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(56,142,60,0.15)';
        e.currentTarget.style.borderColor = '#388e3c';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#e8e8e8';
      }}
    >
      {/* Header Image */}
      <div style={{
        height: 180,
        background: 'linear-gradient(135deg, rgba(232,245,233,0.6) 0%, rgba(200,230,201,0.6) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23388e3c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4
        }} />
        <img 
          src={c.logo ? imageUrl(c.logo) : (c.products && c.products.length > 0 && c.products[0].image ? imageUrl(c.products[0].image) : fallbackImg)} 
          alt={c.name} 
          style={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            objectFit: 'cover',
            border: '4px solid white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            position: 'relative',
            zIndex: 1
          }} 
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
      </div>
      
      {/* Content */}
      <div style={{ padding: '1.5em', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ 
          color: '#1b5e20', 
          fontWeight: 700, 
          fontSize: '1.4em', 
          marginBottom: '0.5em',
          textAlign: 'center'
        }}>{c.name}</h3>
        
        <p style={{ 
          color: '#666', 
          fontSize: '0.95em', 
          textAlign: 'center', 
          lineHeight: 1.6,
          marginBottom: '1.5em',
          flex: 1
        }}>{c.description}</p>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '1em 0',
          borderTop: '1px solid #f0f0f0',
          marginTop: 'auto'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#388e3c' }}>
              {c.products ? c.products.length : 0}
            </div>
            <div style={{ fontSize: '0.8em', color: '#999', marginTop: '0.2em' }}>Products</div>
          </div>
        </div>
      </div>
    </div>
  );

  const fallbackMasala = 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80';
  const fallbackOrganics = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';

  const renderCompanyDetail = (company) => {
    const filteredProducts = company.products?.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'transparent',
        padding: '2em 1em'
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 16,
            padding: '2em',
            marginBottom: '2em',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            <button 
              onClick={() => setSelectedCompany(null)}
              style={{ 
                background: '#388e3c', 
                color: 'white', 
                border: 'none', 
                padding: '0.6em 1.2em', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: '600',
                marginBottom: '1.5em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.target.style.background = '#2e7d32';
                e.target.style.transform = 'translateX(-4px)';
              }}
              onMouseOut={e => {
                e.target.style.background = '#388e3c';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <span>←</span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2em', flexWrap: 'wrap' }}>
              <img 
                src={company.logo ? imageUrl(company.logo) : (company.products && company.products.length > 0 && company.products[0].image ? imageUrl(company.products[0].image) : (company.name && company.name.includes('Masala') ? fallbackMasala : fallbackOrganics))} 
                alt={company.name} 
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '4px solid #388e3c',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                }} 
                onError={(e) => {
                  e.target.src = company.name && company.name.includes('Masala') ? fallbackMasala : fallbackOrganics;
                }}
              />
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  color: "#1b5e20", 
                  margin: 0, 
                  fontWeight: 800, 
                  fontSize: '2.5em',
                  marginBottom: '0.3em'
                }}>{company.name}</h1>
                <p style={{ color: '#666', margin: 0, fontSize: '1.1em', lineHeight: 1.5 }}>
                  {company.description}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 16,
            padding: '2em',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Search and Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2em',
              flexWrap: 'wrap',
              gap: '1em'
            }}>
              <h2 style={{ color: '#1b5e20', margin: 0, fontSize: '1.8em', fontWeight: 700 }}>
                Products <span style={{ color: '#999', fontSize: '0.8em' }}>({filteredProducts.length})</span>
              </h2>
              
              {company.products && company.products.length > 0 && (
                <div style={{ position: 'relative', minWidth: 250 }}>
                  <input
                    type="text"
                    placeholder="🔍 Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7em 1em',
                      borderRadius: 8,
                      border: '2px solid #e0e0e0',
                      fontSize: '0.95em',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#388e3c'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              )}
            </div>
            
            {filteredProducts.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '1.5em' 
              }}>
                {filteredProducts.map((product, index) => (
                  <div key={index} style={{ 
                    background: 'rgba(250,250,250,0.9)', 
                    borderRadius: 12, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(8px)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: 200, 
                      overflow: 'hidden', 
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {product.image ? (
                        <img 
                          src={imageUrl(product.image)} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); display: flex; align-items: center; justify-content: center; color: #999; font-size: 3em;">📦</div>';
                          }}
                        />
                      ) : (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3em'
                        }}>
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div style={{ padding: '1.2em', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ 
                        color: '#333', 
                        fontSize: '1.1em', 
                        fontWeight: 700, 
                        marginBottom: '0.5em',
                        lineHeight: 1.3
                      }}>{product.name}</h4>
                      
                      {product.description && (
                        <p style={{ 
                          color: '#777', 
                          fontSize: '0.9em', 
                          marginBottom: '1em', 
                          lineHeight: 1.5,
                          flex: 1
                        }}>{product.description}</p>
                      )}
                      
                      { (product.showOrderButton !== false) && (
                      <button
                        onClick={() => handleOrderClick(product, company)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '0.8em',
                          borderRadius: 8,
                          fontSize: '0.95em',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5em',
                          marginTop: 'auto'
                        }}
                        onMouseEnter={e => {
                          e.target.style.transform = 'scale(1.02)';
                          e.target.style.boxShadow = '0 4px 12px rgba(56,142,60,0.3)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      > 
                        <span>🛒</span> Order Now
                      </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '4em 2em',
                color: '#999'
              }}>
                <div style={{ fontSize: '4em', marginBottom: '0.5em' }}>
                  {searchQuery ? '🔍' : '📦'}
                </div>
                <h3 style={{ color: '#666', fontSize: '1.3em', marginBottom: '0.5em', fontWeight: 600 }}>
                  {searchQuery ? 'No products found' : 'No Products Available'}
                </h3>
                <p style={{ color: '#999', fontSize: '1em' }}>
                  {searchQuery ? 'Try a different search term' : 'This company hasn\'t added any products yet'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      marginTop: '1em',
                      padding: '0.6em 1.5em',
                      background: '#388e3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      fontWeight: '600'
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div translate="" style={{ 
      minHeight: '100vh',
      background: 'transparent',
      paddingTop: '80px',
      paddingBottom: '2em'
    }}>
      {selectedCompany ? (
        renderCompanyDetail(selectedCompany)
      ) : (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1em" }}>
          {/* Hero Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(27,94,32,0.75) 0%, rgba(56,142,60,0.75) 100%)',
            borderRadius: 20,
            padding: '3em 2em',
            marginBottom: '2em',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{ 
                margin: 0, 
                fontWeight: 900, 
                fontSize: '3em',
                marginBottom: '0.3em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Our Companies
              </h1>
              <p style={{ 
                fontSize: '1.2em',
                margin: 0,
                opacity: 0.95,
                maxWidth: 600
              }}>
                Discover premium products from our trusted brands
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2em',
                marginTop: '2em',
                flexWrap: 'wrap'
              }}>
                {lastUpdated && (
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.5em 1em',
                    borderRadius: 20,
                    fontSize: '0.9em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em'
                  }}>
                  </div>
                )}
                <button 
                  onClick={loadCompanies}
                  disabled={loading}
                  style={{ 
                    background: loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.25)', 
                    color: 'white', 
                    border: '2px solid rgba(255,255,255,0.5)', 
                    padding: '0.6em 1.5em', 
                    borderRadius: 25, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.95em',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={e => { 
                    if (!loading) {
                      e.target.style.background = 'rgba(255,255,255,0.35)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={e => { 
                    if (!loading) {
                      e.target.style.background = 'rgba(255,255,255,0.25)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? '🔄 Loading...' : '🔄 Refresh'}
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div style={{ 
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #ef5350',
              color: '#c62828', 
              padding: '1.5em', 
              borderRadius: 12, 
              marginBottom: '2em',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(239,83,80,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>⚠️</div>
              <strong style={{ fontSize: '1.1em' }}>Connection Error</strong>
              <p style={{ margin: '0.5em 0 0 0' }}>{error}</p>
              <small style={{ opacity: 0.8 }}>Make sure the backend server is running on port 4000</small>
            </div>
          )}
          
          {/* Companies Grid */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2em'
          }}>
            {companies && companies.length > 0 ? (
              companies.map(c => renderCompanyCard(c, c.name && c.name.includes('Masala') ? fallbackMasala : fallbackOrganics))
            ) : (
              <>
                {renderCompanyCard({ id: 'masala', name: 'Adhivelan Masala', description: 'Premium spice blends and masala products, crafted for authentic taste and quality. Serving homes and businesses with pure, flavorful masalas.', products: [] }, fallbackMasala)}
                {renderCompanyCard({ id: 'organics', name: 'Adhivelan Organics', description: 'Organic farm produce and products, grown and processed with care for health and sustainability. Bringing fresh, chemical-free food to your table.', products: [] }, fallbackOrganics)}
              </>
            )}
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedProduct && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}
          onClick={() => !orderSubmitted && setShowOrderModal(false)}
        >
          <div 
            style={{ 
              maxWidth: 500, 
              width: '100%',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: 16,
              padding: '2rem',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowOrderModal(false)}
              style={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: 'transparent',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#666',
                padding: 0,
                width: 35,
                height: 35,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {orderSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>Order Submitted!</h3>
                <p style={{ color: '#666' }}>We'll contact you shortly to confirm your order.</p>
              </div>
            ) : (
              <>
                <h2 style={{ color: '#2e7d32', marginBottom: '1.5rem', paddingRight: '2rem' }}>
                  Order: {selectedProduct.name}
                </h2>
                
                <div style={{ 
                  background: '#f5f5f5', 
                  padding: '1rem', 
                  borderRadius: 8, 
                  marginBottom: '1.5rem' 
                }}>
                  <p style={{ margin: '0.5rem 0', color: '#333' }}>
                    <strong>Company:</strong> {selectedProduct.companyName}
                  </p>
                </div>

                <form onSubmit={handleOrderSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={orderForm.name}
                      onChange={handleOrderFormChange}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        borderRadius: 8, 
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleOrderFormChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        borderRadius: 8, 
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleOrderFormChange}
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        borderRadius: 8, 
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={orderForm.quantity}
                      onChange={handleOrderFormChange}
                      required
                      min="1"
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        borderRadius: 8, 
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                      Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      value={orderForm.address}
                      onChange={handleOrderFormChange}
                      required
                      rows="3"
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        borderRadius: 8, 
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#2e7d32',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: 8,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={e => e.target.style.background = '#1b5e20'}
                    onMouseLeave={e => e.target.style.background = '#2e7d32'}
                  >
                    Place Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
