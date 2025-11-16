# Product Management Code - Without Price Field
**Version:** 2.0 (Price Removed)  
**Date:** November 9, 2025

This document contains all the code for managing products **without the price field**.

---

## 1. Admin Product Form (AdminCompaniesPage.js)

### State Management (No Price)
```javascript
// Product form state - NO PRICE FIELD
const [productForm, setProductForm] = useState({ 
  name: '', 
  image: '', 
  imageFile: null 
});
```

### Add Product Function (No Price)
```javascript
function handleAddProduct(e, companyId) {
  e.preventDefault();
  if (!productForm.name.trim()) return;

  const formData = new FormData();
  formData.append('name', productForm.name);
  // NO PRICE FIELD - Price removed
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
    setProductForm({ name: '', image: '', imageFile: null }); // Reset without price
    setActiveProductCompanyId(null);
  })
  .catch(err => {
    console.error('Error adding product:', err);
    alert('Failed to add product');
  });
}
```

### Update Product Function (No Price)
```javascript
function handleUpdateProduct(e, companyId, productIndex) {
  e.preventDefault();
  if (!productForm.name.trim()) return;

  const formData = new FormData();
  formData.append('name', productForm.name);
  // NO PRICE FIELD - Price removed
  if (productForm.imageFile) {
    formData.append('image', productForm.imageFile);
  } else if (productForm.image !== undefined) {
    formData.append('image', productForm.image);
  }

  fetch(apiUrl(`/api/companies/${companyId}/products/${productIndex}`), {
    method: 'PUT',
    body: formData
  })
  .then(r => r.json())
  .then(updated => {
    setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
    setProductForm({ name: '', image: '', imageFile: null }); // Reset without price
    setActiveProductCompanyId(null);
  })
  .catch(err => {
    console.error('Error updating product:', err);
    alert('Failed to update product');
  });
}
```

### Product Form UI (No Price Input)
```javascript
{/* Product Form - WITHOUT PRICE FIELD */}
{activeProductCompanyId === company.id && (
  <div style={{ 
    background: '#e9ecef', 
    padding: '1.5rem', 
    borderRadius: 6, 
    border: '1px solid #ced4da', 
    marginTop: '1rem' 
  }}>
    <h5 style={{ marginTop: 0, color: '#495057' }}>
      {productForm.editIndex !== null && productForm.editIndex !== undefined 
        ? 'Edit Product' 
        : 'Add New Product'}
    </h5>
    
    <form onSubmit={e => {
      if (productForm.editIndex !== null && productForm.editIndex !== undefined) {
        handleUpdateProduct(e, company.id, productForm.editIndex);
      } else {
        handleAddProduct(e, company.id);
      }
    }}>
      {/* Product Name Field */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: 'bold', 
          color: '#495057', 
          fontSize: '0.9rem' 
        }}>
          Product Name *
        </label>
        <input 
          name="name" 
          value={productForm.name} 
          onChange={handleProductChange} 
          placeholder="Product Name" 
          required 
          style={{ 
            padding: '0.7em', 
            borderRadius: 4, 
            border: '1px solid #ced4da', 
            width: '100%', 
            fontSize: '0.95rem', 
            boxSizing: 'border-box' 
          }} 
        />
      </div>

      {/* NO PRICE FIELD HERE - Removed */}

      {/* Image Fields */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem', 
        marginBottom: '1rem' 
      }}>
        {/* Image URL */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold', 
            color: '#495057', 
            fontSize: '0.9rem' 
          }}>
            Image URL
          </label>
          <input 
            name="image" 
            value={productForm.image} 
            onChange={handleProductChange} 
            placeholder="Image URL" 
            style={{ 
              padding: '0.7em', 
              borderRadius: 4, 
              border: '1px solid #ced4da', 
              width: '100%', 
              fontSize: '0.95rem', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>
        
        {/* Upload Image */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold', 
            color: '#495057', 
            fontSize: '0.9rem' 
          }}>
            Or Upload Image
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProductImageFileChange} 
              style={{ 
                padding: '0.5em', 
                borderRadius: 4, 
                border: '1px solid #ced4da', 
                flex: 1, 
                fontSize: '0.9rem' 
              }} 
            />
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => { 
                setGalleryType('product'); 
                setIsGalleryOpen(true); 
              }}
              style={{ 
                fontSize: '0.85em', 
                whiteSpace: 'nowrap', 
                padding: '0.5em 1em' 
              }}
            >
              📁 Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button type="submit" className="btn btn-primary" style={{ padding: '0.7em 1.5em' }}>
          {productForm.editIndex !== null && productForm.editIndex !== undefined 
            ? '✓ Update Product' 
            : '+ Add Product'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => { 
            setActiveProductCompanyId(null); 
            setProductForm({ name: '', image: '', imageFile: null }); 
          }}
          style={{ padding: '0.7em 1.5em' }}
        >
          ✕ Cancel
        </button>
        
        {/* Image Preview */}
        {(productForm.image || productForm.imageFile) && (
          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Preview:</span>
            <img 
              src={productForm.imageFile 
                ? URL.createObjectURL(productForm.imageFile) 
                : productForm.image
              } 
              alt="Product preview" 
              style={{ 
                width: 60, 
                height: 60, 
                objectFit: 'cover', 
                borderRadius: 4, 
                border: '2px solid #ced4da' 
              }} 
            />
          </div>
        )}
      </div>
    </form>
  </div>
)}
```

### Edit Product Button (No Price)
```javascript
<button 
  className="btn btn-secondary" 
  style={{ fontSize: '0.8em', flex: 1 }} 
  onClick={() => {
    setActiveProductCompanyId(company.id);
    setProductForm({ 
      name: product.name, 
      // NO PRICE FIELD - Removed
      image: product.image || '',
      imageFile: null,
      editIndex: idx 
    });
  }}
>
  Edit
</button>
```

---

## 2. Frontend Product Display (CompaniesPage.js)

### Product Card (No Price Display)
```javascript
{company.products && company.products.length > 0 ? (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '1.5em' 
  }}>
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
        {/* Product Image */}
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
                e.target.parentElement.innerHTML = `
                  <div style="width: 100%; height: 100%; 
                    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); 
                    display: flex; align-items: center; justify-content: center; 
                    color: #999; font-size: 0.9em;">
                    Image Not Found
                  </div>
                `;
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
        
        {/* Product Name - NO PRICE SHOWN */}
        <h4 style={{ 
          color: '#333', 
          fontSize: '1.2em', 
          fontWeight: 700, 
          marginBottom: '0.5em' 
        }}>
          {product.name}
        </h4>
        
        {/* Product Description (if available) */}
        {product.description && (
          <p style={{ 
            color: '#666', 
            fontSize: '0.95em', 
            marginBottom: '1em', 
            lineHeight: 1.5 
          }}>
            {product.description}
          </p>
        )}

        {/* NO PRICE DISPLAY - Removed */}
        {/* Instead: Contact for pricing button */}
        
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
          📞 Contact for Price
        </button>
      </div>
    ))}
  </div>
) : (
  <p style={{ 
    color: '#999', 
    fontStyle: 'italic', 
    fontSize: '1.1em' 
  }}>
    No products available yet
  </p>
)}
```

---

## 3. Server-Side Code (index.js)

### Add Product Endpoint (No Price)
```javascript
// Add product to company - NO PRICE FIELD
app.post('/api/companies/:id/products', upload.single('image'), (req, res) => {
  const companyId = parseInt(req.params.id);
  const { name } = req.body; // NO PRICE PARAMETER
  let imageValue = req.body.image || '';
  
  if (req.file) {
    imageValue = `/uploads/${req.file.filename}`;
  }

  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  if (!company.products) {
    company.products = [];
  }

  company.products.push({ 
    name, 
    image: imageValue 
    // NO PRICE FIELD
  });

  saveCompanies();
  res.json(company);
});
```

### Update Product Endpoint (No Price)
```javascript
// Update product - NO PRICE FIELD
app.put('/api/companies/:id/products/:idx', upload.single('image'), (req, res) => {
  const companyId = parseInt(req.params.id);
  const productIdx = parseInt(req.params.idx);
  const { name } = req.body; // NO PRICE PARAMETER
  let imageValue = req.body.image;
  
  if (req.file) {
    imageValue = `/uploads/${req.file.filename}`;
  }

  const company = companies.find(c => c.id === companyId);
  if (!company || !company.products || !company.products[productIdx]) {
    return res.status(404).json({ error: 'Product not found' });
  }

  company.products[productIdx] = {
    name,
    image: imageValue !== undefined ? imageValue : company.products[productIdx].image
    // NO PRICE FIELD
  };

  saveCompanies();
  res.json(company);
});
```

---

## 4. JSON File Structure (companies.json)

```json
[
  {
    "id": 1,
    "name": "Uzhavar Masala & Pickles",
    "description": "Authentic Tamil Nadu spices and traditional pickles",
    "logo": "/uploads/company-logo-123.jpg",
    "products": [
      {
        "name": "Chilli Powder",
        "image": "/uploads/chilli-powder.jpg"
      },
      {
        "name": "Coriander Powder",
        "image": "/uploads/coriander-powder.jpg"
      },
      {
        "name": "Turmeric Powder",
        "image": "/uploads/turmeric-powder.jpg"
      }
    ]
  },
  {
    "id": 2,
    "name": "Organic Farm Products",
    "description": "100% organic vegetables and grains",
    "logo": "/uploads/organic-logo.jpg",
    "products": [
      {
        "name": "Organic Rice",
        "image": "/uploads/organic-rice.jpg"
      },
      {
        "name": "Organic Vegetables",
        "image": "/uploads/organic-veggies.jpg"
      }
    ]
  }
]
```

**Note:** No `price` field in products!

---

## 5. Database Schema (PostgreSQL)

```sql
-- Products table WITHOUT price field
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NO PRICE COLUMN!

CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
```

---

## 6. Migration SQL (Remove Existing Price)

```sql
-- If you have existing price column, remove it:
ALTER TABLE products DROP COLUMN IF EXISTS price;

-- Verify the column is removed:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
```

---

## 7. Contact for Pricing Message

### Option 1: Button in Product Card
```javascript
<button
  onClick={() => window.open(`https://wa.me/919876543210?text=Hi, I'm interested in ${product.name}`, '_blank')}
  style={{
    width: '100%',
    background: '#25D366', // WhatsApp green
    color: 'white',
    border: 'none',
    padding: '0.7em 1.2em',
    borderRadius: 8,
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  💬 WhatsApp for Price
</button>
```

### Option 2: Contact Badge
```javascript
<div style={{
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  color: 'white',
  padding: '0.8em 1.2em',
  borderRadius: 8,
  textAlign: 'center',
  fontSize: '0.95em',
  fontWeight: 'bold'
}}>
  📞 Call for Pricing: +91 98765 43210
</div>
```

### Option 3: Email for Quote
```javascript
<button
  onClick={() => window.location.href = `mailto:sales@company.com?subject=Price Inquiry for ${product.name}`}
  style={{
    width: '100%',
    background: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '0.7em 1.2em',
    borderRadius: 8,
    cursor: 'pointer'
  }}
>
  ✉️ Email for Quote
</button>
```

---

## Summary

✅ **Removed from:**
- State management (`productForm`)
- Add product function
- Update product function
- Product form UI (no price input)
- Product display (no price shown)
- Server endpoints
- JSON file structure
- Database schema

✅ **Replaced with:**
- Contact buttons (WhatsApp, Phone, Email)
- "Contact for pricing" messaging
- Direct communication encouraged

✅ **Benefits:**
- Flexible pricing
- Better negotiation
- Seasonal adjustments
- Bulk discounts
- Regional variations
- Market-based pricing

**Users now contact directly for pricing information! 💬📞**
