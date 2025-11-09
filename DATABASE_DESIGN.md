# Uzhavar Connect - Database Design
**Last Updated:** November 9, 2025  
**Version:** 2.0 (Price Field Removed)

## Overview
This document outlines the complete database schema for the Uzhavar Connect platform. The system uses **PostgreSQL** (Supabase) as the primary database and falls back to JSON file storage when the database is not configured.

---

## Database Tables

### 1. **users** (Authentication & User Management)
Stores user information for farmers, workers, contractors, and administrators.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    user_type VARCHAR(50) NOT NULL, -- 'farmer', 'worker', 'contractor', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(user_type);
```

---

### 2. **farmers** (Farmer-Specific Details)
Extended information for users registered as farmers.

```sql
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255),
    farm_size VARCHAR(100), -- e.g., "5 acres", "2 hectares"
    crop_types TEXT, -- Comma-separated list or JSON array
    farming_experience VARCHAR(100),
    irrigation_type VARCHAR(100),
    current_challenges TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_farmers_user_id ON farmers(user_id);
```

---

### 3. **workers** (Worker/Contractor Details)
Extended information for users registered as workers or contractors.

```sql
CREATE TABLE workers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    worker_type VARCHAR(100), -- 'plowing', 'harvesting', 'irrigation', etc.
    experience VARCHAR(100),
    skills TEXT, -- Comma-separated or JSON
    vehicle_owned VARCHAR(100),
    availability VARCHAR(100),
    previous_work TEXT,
    expected_salary VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workers_user_id ON workers(user_id);
CREATE INDEX idx_workers_type ON workers(worker_type);
```

---

### 4. **farms** (Farm Details & Land Information)
Stores detailed farm information including location and resources.

```sql
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    owner_name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    farm_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_area VARCHAR(100), -- e.g., "10 acres"
    soil_type VARCHAR(100),
    water_source VARCHAR(100),
    current_crop VARCHAR(255),
    farm_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_farms_location ON farms(latitude, longitude);
```

---

### 5. **land_listings** (Buy/Sell Land)
Land available for purchase or sale. **NOTE: Price field removed - contact for pricing.**

```sql
CREATE TABLE land_listings (
    id SERIAL PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    location_address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    area VARCHAR(100) NOT NULL, -- e.g., "5 acres"
    soil_type VARCHAR(100),
    water_source VARCHAR(100),
    description TEXT,
    patta_number VARCHAR(100) NOT NULL,
    land_image_url TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'sold', 'pending'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_status ON land_listings(status);
CREATE INDEX idx_land_location ON land_listings(latitude, longitude);
```

**Important:** The `price` field has been removed. Users should contact the owner directly for pricing information.

---

### 6. **companies** (Service Provider Companies)
Agricultural service providers, suppliers, and product vendors.

```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    category VARCHAR(100), -- 'masala', 'organics', 'machinery', 'services'
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_active ON companies(is_active);
```

---

### 7. **products** (Company Products)
Products offered by companies. **NOTE: Price field removed - contact for pricing.**

```sql
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

CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
```

**Important:** The `price` field has been removed from products. Users should contact the company directly for current pricing and availability.

---

### 8. **construction_quotes** (Construction Service Requests)
Requests for construction services (farmhouse, water tank, etc.).

```sql
CREATE TABLE construction_quotes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL, -- 'Farmhouse', 'Water Tank', 'Swimming Pool', etc.
    description TEXT NOT NULL,
    land_type VARCHAR(100),
    land_image_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_status ON construction_quotes(status);
CREATE INDEX idx_quotes_project_type ON construction_quotes(project_type);
```

---

### 9. **team_bookings** (Book Team Services)
Requests to book farming teams for various agricultural services.

```sql
CREATE TABLE team_bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    land_image_url TEXT,
    crop VARCHAR(255),
    service_type VARCHAR(100), -- 'plowing', 'harvesting', 'planting', etc.
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_status ON team_bookings(status);
CREATE INDEX idx_bookings_service ON team_bookings(service_type);
```

---

### 10. **farm_plans** (Farm Management Plan Confirmations)
Users who confirmed farm management plans.

```sql
CREATE TABLE farm_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'silver', 'gold', 'platinum'
    land_location TEXT NOT NULL,
    land_size VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'active', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_status ON farm_plans(status);
CREATE INDEX idx_plans_type ON farm_plans(plan_type);
```

---

### 11. **product_orders** (Product Orders)
Orders placed for products from companies.

```sql
CREATE TABLE product_orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_status ON product_orders(order_status);
CREATE INDEX idx_orders_product ON product_orders(product_id);
CREATE INDEX idx_orders_company ON product_orders(company_id);
```

---

### 12. **submissions** (Generic Form Submissions)
Legacy table for generic form submissions (email notifications).

```sql
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    message TEXT,
    extra_data JSONB, -- Flexible JSON storage for additional fields
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'processed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_type ON submissions(form_type);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
```

---

### 13. **construction_gallery** (Construction Project Gallery)
Gallery images for completed construction projects.

```sql
CREATE TABLE construction_gallery (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    folder_name VARCHAR(100), -- 'All Projects' or specific category
    image_url TEXT NOT NULL,
    description TEXT,
    project_type VARCHAR(100), -- 'farmhouse', 'water_tank', 'swimming_pool', etc.
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_folder ON construction_gallery(folder_name);
CREATE INDEX idx_gallery_type ON construction_gallery(project_type);
CREATE INDEX idx_gallery_visible ON construction_gallery(is_visible);
```

---

## Key Changes in Version 2.0

### ✅ Removed Fields:
1. **`land_listings.price`** - Users must contact the owner directly for pricing
2. **`products.price`** - Users must contact the company for current pricing

### 💡 Why Price Fields Were Removed:
- **Market Fluctuation**: Agricultural product prices change frequently
- **Location-Based Pricing**: Prices vary by region and availability
- **Negotiation**: Allows for better price negotiation between buyers and sellers
- **Bulk Discounts**: Companies can offer custom pricing based on quantity
- **Seasonal Variations**: Prices for land and products vary seasonally
- **Contact-First Approach**: Encourages direct communication for better deals

---

## JSON File Fallback Structure

When database is not configured, the system uses JSON files:

### File Locations:
```
server/data/
├── companies.json       # Companies and products (no price field)
├── submissions.json     # All form submissions
└── user-data.json       # User registrations
```

### companies.json Structure:
```json
[
  {
    "id": 1,
    "name": "Company Name",
    "description": "Company description",
    "logo": "logo-url.jpg",
    "products": [
      {
        "name": "Product Name",
        "image": "product-image.jpg"
        // Note: No price field
      }
    ]
  }
]
```

---

## Migration Guide

If you have existing data with price fields, run this migration:

```sql
-- Remove price from land_listings
ALTER TABLE land_listings DROP COLUMN IF EXISTS price;

-- Remove price from products
ALTER TABLE products DROP COLUMN IF EXISTS price;

-- Add updated_at trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_land_listings_updated_at BEFORE UPDATE ON land_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Environment Variables

Required in `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Email Configuration (for form submissions)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=admin@uzhavar.com

# Server Configuration
PORT=5000
NODE_ENV=production
```

---

## API Endpoints Affected

### Updated Endpoints (Price Removed):

1. **GET /api/companies** - Returns companies with products (no price)
2. **POST /api/companies/:id/products** - Add product without price
3. **PUT /api/companies/:id/products/:idx** - Update product without price
4. **POST /api/send-email** - Land listing submissions (no price in email)

---

## Best Practices

1. **Contact Information**: Always ensure contact details are accurate in listings
2. **Direct Communication**: Encourage users to call/email for pricing
3. **WhatsApp Integration**: Use WhatsApp links for quick contact: `https://wa.me/91XXXXXXXXXX`
4. **Regular Updates**: Keep product and land availability status updated
5. **Image Quality**: Use high-quality images for better user engagement

---

## Support

For database-related queries:
- Email: support@uzhavar.com
- Documentation: /DATABASE_SETUP.md
- Migration Help: /MIGRATION_GUIDE.md
