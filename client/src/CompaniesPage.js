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
        // Debug: Log logo URLs
        data.forEach(company => {
          if (company.logo) {
            console.log(`Company: ${company.name}, Logo path: ${company.logo}, Full URL: ${imageUrl(company.logo)}`);
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
          'Price': selectedProduct.price ? `₹${selectedProduct.price}` : 'N/A',
          'Quantity': orderForm.quantity,
          'Delivery Address': orderForm.address,
          'Total Amount': selectedProduct.price ? `₹${selectedProduct.price * orderForm.quantity}` : 'N/A'
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
        flex: '1 1 320px', 
        background: '#f7faf7', 
        borderRadius: 14, 
        boxShadow: '0 2px 8px rgba(56,142,60,0.07)', 
        padding: '2em', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        minWidth: 280,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent'
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(56,142,60,0.15)';
        e.currentTarget.style.borderColor = '#388e3c';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(56,142,60,0.07)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <img 
        src={c.logo ? imageUrl(c.logo) : (c.products && c.products.length > 0 && c.products[0].image ? imageUrl(c.products[0].image) : fallbackImg)} 
        alt={c.name} 
        style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: '1em', objectFit: 'cover', boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} 
        onError={(e) => {
          console.log('Image failed to load:', e.target.src, 'for company:', c.name);
          e.target.src = fallbackImg;
        }}
      />
      <h3 style={{ color: '#388e3c', fontWeight: 700, fontSize: '1.3em', marginBottom: '0.7em' }}>{c.name}</h3>
      <p style={{ color: '#444', fontSize: '1.08em', textAlign: 'center', marginBottom: '1em' }}>{c.description}</p>
      <div style={{ 
        background: '#388e3c', 
        color: 'white', 
        padding: '0.5em 1.2em', 
        borderRadius: 20, 
        fontSize: '0.9em', 
        fontWeight: 'bold',
        marginTop: 'auto'
      }}>
        Click to view products
      </div>
      {c.products && c.products.length > 0 && (
        <div style={{ marginTop: '0.5em', fontSize: '0.9em', color: '#666' }}>
          {c.products.length} products available
        </div>
      )}
    </div>
  );

  const fallbackMasala = 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80';
  const fallbackOrganics = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';

  const renderCompanyDetail = (company) => (
    <div className="company-detail" style={{ maxWidth: 1000, margin: "2em auto", padding: "2em", background: "rgba(255,255,255,0.95)", borderRadius: 18, boxShadow: "0 4px 24px rgba(56,142,60,0.10)" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2em' }}>
        <button 
          onClick={() => setSelectedCompany(null)}
          style={{ 
            background: '#388e3c', 
            color: 'white', 
            border: 'none', 
            padding: '0.7em 1.2em', 
            borderRadius: 8, 
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold',
            marginRight: '1em'
          }}
          onMouseOver={e => e.target.style.background = '#2e7d32'}
          onMouseOut={e => e.target.style.background = '#388e3c'}
        >
          ← Back to Companies
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <img 
            src={company.logo ? imageUrl(company.logo) : (company.products && company.products.length > 0 && company.products[0].image ? imageUrl(company.products[0].image) : (company.name && company.name.includes('Masala') ? fallbackMasala : fallbackOrganics))} 
            alt={company.name} 
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} 
            onError={(e) => {
              console.log('Detail image failed to load:', e.target.src, 'for company:', company.name);
              e.target.src = company.name && company.name.includes('Masala') ? fallbackMasala : fallbackOrganics;
            }}
          />
          <div>
            <h2 style={{ color: "#388e3c", margin: 0, fontWeight: 800, fontSize: '2.2em', letterSpacing: '1px' }}>{company.name}</h2>
            <p style={{ color: '#666', margin: '0.5em 0 0 0', fontSize: '1.1em' }}>{company.description}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2em' }}>
        <h3 style={{ color: '#388e3c', fontSize: '1.8em', marginBottom: '1em', fontWeight: 700 }}>
          Products ({company.products ? company.products.length : 0})
        </h3>
        
        {company.products && company.products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5em' }}>
            {company.products.map((product, index) => (
              <div key={index} style={{ 
                background: '#f9f9f9', 
                borderRadius: 12, 
                padding: '1.5em', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '100%', 
                  height: 180, 
                  borderRadius: 8, 
                  overflow: 'hidden', 
                  background: '#fff', 
                  marginBottom: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img 
                      src={imageUrl(product.image)} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        console.log('Product image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.9em;">Image Not Found</div>';
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
                      color: '#999',
                      fontSize: '0.9em'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <h4 style={{ color: '#333', fontSize: '1.2em', fontWeight: 700, marginBottom: '0.5em' }}>{product.name}</h4>
                {product.description && (
                  <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '1em', lineHeight: 1.5 }}>{product.description}</p>
                )}
                <button
                  onClick={() => handleOrderClick(product, company)}
                  style={{
                    width: '100%',
                    background: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    padding: '0.7em 1.2em',
                    borderRadius: 8,
                    fontSize: '1em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => e.target.style.background = '#1b5e20'}
                  onMouseLeave={e => e.target.style.background = '#2e7d32'}
                >
                  🛒 Order Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3em', 
            color: '#666',
            background: '#f9f9f9',
            borderRadius: 12,
            border: '2px dashed #ddd'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>📦</div>
            <h4 style={{ color: '#999', fontSize: '1.2em', marginBottom: '0.5em' }}>No Products Available</h4>
            <p style={{ color: '#999' }}>This company hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="companies-page">
      {selectedCompany ? (
        renderCompanyDetail(selectedCompany)
      ) : (
        <div style={{ maxWidth: 900, margin: "2em auto", padding: "2em", background: "rgba(255,255,255,0.95)", borderRadius: 18, boxShadow: "0 4px 24px rgba(56,142,60,0.10)" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5em' }}>
            <h2 style={{ color: "#388e3c", margin: 0, fontWeight: 800, fontSize: '2.2em', letterSpacing: '1px' }}>Our Companies</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {lastUpdated && (
                <small style={{ color: '#666' }}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
              <button 
                onClick={loadCompanies}
                disabled={loading}
                style={{ 
                  background: loading ? '#ccc' : '#388e3c', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5em 1em', 
                  borderRadius: 8, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9em',
                  fontWeight: 'bold'
                }}
                onMouseOver={e => { if (!loading) e.target.style.background = '#2e7d32'; }}
                onMouseOut={e => { if (!loading) e.target.style.background = '#388e3c'; }}
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
          
          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '1em', 
              borderRadius: 8, 
              marginBottom: '1.5em',
              textAlign: 'center',
              border: '1px solid #ef5350'
            }}>
              <strong>⚠️ Connection Error:</strong> {error}
              <br />
              <small>Make sure the backend server is running on port 4000</small>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '2.5em', flexWrap: 'wrap', justifyContent: 'center' }}>
            {companies && companies.length > 0 ? (
              companies.map(c => renderCompanyCard(c, c.name && c.name.includes('Masala') ? fallbackMasala : fallbackOrganics))
            ) : (
              <>
                {renderCompanyCard({ id: 'masala', name: 'Aadhivelan Masala', description: 'Premium spice blends and masala products, crafted for authentic taste and quality. Serving homes and businesses with pure, flavorful masalas.', products: [] }, fallbackMasala)}
                {renderCompanyCard({ id: 'organics', name: 'Aadhivelan Organics', description: 'Organic farm produce and products, grown and processed with care for health and sustainability. Bringing fresh, chemical-free food to your table.', products: [] }, fallbackOrganics)}
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
              background: 'white',
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

                  {selectedProduct.price && (
                    <div style={{ 
                      background: '#e8f5e9', 
                      padding: '1rem', 
                      borderRadius: 8, 
                      marginBottom: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <strong style={{ color: '#2e7d32', fontSize: '1.2rem' }}>
                        Total: ₹{selectedProduct.price * orderForm.quantity}
                      </strong>
                    </div>
                  )}

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
