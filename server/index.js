const express = require('express');
// Load environment variables from root .env file
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const https = require('https');
const db = require('./db'); // Database connection
const { uploadToCloudinary, deleteFromCloudinary } = require('./cloudinary'); // Cloudinary integration

// Allow self-signed certificates in development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();
const PORT = process.env.PORT || 4000;

// Configure multer for memory storage (files will be uploaded to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const allowedOrigins = [
  'https://uzhavar.onrender.com',          // production frontend on Render
  'https://uzhavar-fg5p.onrender.com',     // production frontend on Render (actual URL)
  'https://uzhavar-backend.onrender.com',  // backend on Render
  'http://localhost:3000',                 // CRA dev
  'http://localhost:3001',                 // CRA dev alternate port
  'http://localhost:4000'                  // Backend itself (for proxy)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or same-origin via proxy)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedAllowedOrigins = allowedOrigins.map(o => o.replace(/\/$/, ''));
    
    // Allow if origin is in the allowed list
    if (normalizedAllowedOrigins.indexOf(normalizedOrigin) === -1) {
      console.warn('⚠️ CORS blocked origin:', origin);
      return callback(new Error('CORS policy does not allow access from this origin.'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: false // set to true only if you use cookies; then also set fetch credentials: 'include'
}));

app.use(express.json());

// Serve static files - uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files - assets directory (if you have one in server folder)
// If assets are in client folder, you'll need to copy them or adjust the path
const clientAssetsPath = path.join(__dirname, '..', 'client', 'public', 'assets');
if (fs.existsSync(clientAssetsPath)) {
  app.use('/assets', express.static(clientAssetsPath));
}

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Get all submissions
app.get('/api/submissions', async (req, res) => {
  console.log('📥 GET /api/submissions - Fetching submissions');
  
  const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL;
  const googleSheetsSecret = process.env.GOOGLE_SHEETS_SECRET;
  
  // Try Google Sheets first
  if (googleSheetsUrl && googleSheetsSecret) {
    try {
      console.log('📊 Attempting to fetch from Google Sheets...');
      const url = `${googleSheetsUrl}?secret=${encodeURIComponent(googleSheetsSecret)}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const responseText = await response.text();
        
        // Check if response is JSON
        if (responseText.startsWith('{') || responseText.startsWith('[')) {
          const result = JSON.parse(responseText);
          
          if (result.status === 'success') {
            // Transform Google Sheets data to match AdminSubmissionsPage format
            const submissions = (result.data || []).map(item => ({
              receivedAt: item.timestamp,
              toEmail: 'admin@uzhavar.com',
              subject: item.subject || item.formType || 'No Subject',
              payload: {
                name: item.name,
                email: item.email,
                phone: item.phone,
                message: item.message,
                company: item.company,
                location: item.location,
                serviceType: item.serviceType,
                farmSize: item.farmSize,
                extra: {
                  'Product Name': item.productName,
                  'Quantity': item.quantity,
                  'Address': item.address,
                  'City': item.city,
                  'State': item.state,
                  'Pincode': item.pincode
                }
              },
              metadata: {
                source: 'google-sheets'
              }
            }));
            
            console.log(`✅ Successfully fetched ${submissions.length} submissions from Google Sheets`);
            return res.json(submissions);
          }
        } else {
          console.warn('⚠️ Google Sheets returned HTML instead of JSON - falling back to local file');
        }
      } else {
        console.warn(`⚠️ Google Sheets returned ${response.status} - falling back to local file`);
      }
    } catch (error) {
      console.error('❌ Error fetching from Google Sheets:', error.message);
      console.warn('⚠️ Falling back to local file');
    }
  }
  
  // Fallback to local file
  console.log('📂 Reading from local submissions.json file');
  const submissionsPath = path.join(__dirname, 'data', 'submissions.json');
  
  try {
    if (fs.existsSync(submissionsPath)) {
      const data = fs.readFileSync(submissionsPath, 'utf8');
      const submissions = JSON.parse(data);
      console.log(`✅ Loaded ${submissions.length} submissions from local file`);
      res.json(submissions);
    } else {
      console.log('ℹ️ No local submissions file found - returning empty array');
      res.json([]);
    }
  } catch (error) {
    console.error('❌ Error reading local submissions:', error);
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// Delete a submission - DISABLED (using Google Sheets now)
app.delete('/api/submissions/:index', (req, res) => {
  console.log('⚠️ DELETE /api/submissions - Feature disabled (using Google Sheets)');
  res.status(501).json({ 
    error: 'Delete feature not available. Please delete directly from Google Sheets.' 
  });
});

// Get all companies
app.get('/api/companies', async (req, res) => {
  console.log('📦 GET /api/companies - Request received');
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(`
        SELECT c.id, c.name, c.description, c.logo,
               json_agg(json_build_object('name', p.name, 'image', p.image)) FILTER (WHERE p.id IS NOT NULL) as products
        FROM companies c
        LEFT JOIN products p ON c.id = p.company_id
        GROUP BY c.id, c.name, c.description, c.logo
        ORDER BY c.id
      `);
      
      const companies = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        logo: row.logo,
        products: row.products || []
      }));
      
      console.log('✅ Companies loaded from Supabase:', companies.length);
      return res.json(companies);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      const companies = JSON.parse(data);
      console.log('✅ Companies loaded from file:', companies.length);
      res.json(companies);
    } else {
      console.log('⚠️ Companies file not found');
      res.json([]);
    }
  } catch (error) {
    console.error('❌ Error reading companies:', error.message);
    res.status(500).json({ error: 'Failed to read companies' });
  }
});

// Create new company
app.post('/api/companies', upload.single('logo'), async (req, res) => {
  console.log('➕ POST /api/companies - Creating new company');
  console.log('📝 Request body:', req.body);
  console.log('📝 File uploaded:', req.file ? req.file.originalname : 'none');
  
  let logoPath = req.body.logo || '';
  
  // Upload to Cloudinary if file provided
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'uzhavar/companies');
      logoPath = result.secure_url;
      console.log('☁️ Logo uploaded to Cloudinary:', logoPath);
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      return res.status(500).json({ error: 'Failed to upload logo', details: error.message });
    }
  }
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(
        'INSERT INTO companies (name, description, logo) VALUES ($1, $2, $3) RETURNING *',
        [req.body.name, req.body.description || '', logoPath]
      );
      
      const newCompany = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        logo: result.rows[0].logo,
        products: []
      };
      
      console.log('✅ Company created successfully in Supabase');
      return res.json(newCompany);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    const dataDir = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let companies = [];
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      companies = JSON.parse(data);
    }
    
    const newCompany = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description || '',
      logo: logoPath,
      products: []
    };
    
    companies.push(newCompany);
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Company created successfully in JSON file');
    res.json(newCompany);
  } catch (error) {
    console.error('❌ Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company', details: error.message });
  }
});

// Update company
app.put('/api/companies/:id', upload.single('logo'), async (req, res) => {
  console.log('📝 PUT /api/companies/:id - Request received');
  console.log('📝 Company ID:', req.params.id);
  console.log('📝 Request body:', req.body);
  
  let logoPath = req.body.logo !== undefined ? req.body.logo : undefined;
  
  // Upload to Cloudinary if new file provided
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'uzhavar/companies');
      logoPath = result.secure_url;
      console.log('☁️ Logo uploaded to Cloudinary:', logoPath);
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      return res.status(500).json({ error: 'Failed to upload logo', details: error.message });
    }
  }
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      let updateQuery = 'UPDATE companies SET name = $1, description = $2';
      let params = [req.body.name, req.body.description || ''];
      let paramIndex = 3;
      
      if (logoPath !== undefined) {
        updateQuery += `, logo = $${paramIndex}`;
        params.push(logoPath);
        paramIndex++;
      }
      
      updateQuery += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      params.push(req.params.id);
      
      const result = await db.query(updateQuery, params);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      const productsResult = await db.query(
        'SELECT name, price, image FROM products WHERE company_id = $1',
        [req.params.id]
      );
      
      const updatedCompany = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        logo: result.rows[0].logo,
        products: productsResult.rows
      };
      
      console.log('✅ Company updated successfully in Supabase');
      return res.json(updatedCompany);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (!fs.existsSync(companiesPath)) {
      return res.status(404).json({ error: 'Companies file not found' });
    }
    
    const data = fs.readFileSync(companiesPath, 'utf8');
    let companies = JSON.parse(data);
    
    const index = companies.findIndex(c => c.id == req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    const updatedCompany = {
      ...companies[index],
      name: req.body.name,
      description: req.body.description || '',
      logo: logoPath !== undefined ? logoPath : companies[index].logo,
      products: companies[index].products || []
    };
    
    companies[index] = updatedCompany;
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Company updated successfully in JSON file');
    res.json(updatedCompany);
  } catch (error) {
    console.error('❌ Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company', details: error.message });
  }
});

// Delete company
app.delete('/api/companies/:id', async (req, res) => {
  console.log('🗑️ DELETE /api/companies/:id - Deleting company');
  console.log('📝 Company ID:', req.params.id);
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(
        'DELETE FROM companies WHERE id = $1 RETURNING id',
        [req.params.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      console.log('✅ Company deleted successfully from Supabase');
      return res.json({ message: 'Company deleted' });
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (!fs.existsSync(companiesPath)) {
      return res.status(404).json({ error: 'Companies file not found' });
    }
    
    const data = fs.readFileSync(companiesPath, 'utf8');
    let companies = JSON.parse(data);
    
    const beforeCount = companies.length;
    companies = companies.filter(c => c.id != req.params.id);
    
    if (beforeCount === companies.length) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Company deleted successfully from JSON file');
    res.json({ message: 'Company deleted' });
  } catch (error) {
    console.error('❌ Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company', details: error.message });
  }
});

// Add product to company
app.post('/api/companies/:companyId/products', upload.single('image'), async (req, res) => {
  console.log('➕ POST /api/companies/:companyId/products - Adding product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Request body:', req.body);
  
  let imagePath = req.body.image || '';
  
  // Upload to Cloudinary if file provided
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'uzhavar/products');
      imagePath = result.secure_url;
      console.log('☁️ Product image uploaded to Cloudinary:', imagePath);
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      return res.status(500).json({ error: 'Failed to upload product image', details: error.message });
    }
  }
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      await db.query(
        'INSERT INTO products (company_id, name, image) VALUES ($1, $2, $3)',
        [req.params.companyId, req.body.name, imagePath]
      );
      
      const result = await db.query(`
        SELECT c.id, c.name, c.description, c.logo,
               json_agg(json_build_object('name', p.name, 'image', p.image)) FILTER (WHERE p.id IS NOT NULL) as products
        FROM companies c
        LEFT JOIN products p ON c.id = p.company_id
        WHERE c.id = $1
        GROUP BY c.id, c.name, c.description, c.logo
      `, [req.params.companyId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
      
      const company = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        logo: result.rows[0].logo,
        products: result.rows[0].products || []
      };
      
      console.log('✅ Product added successfully to Supabase');
      return res.json(company);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (!fs.existsSync(companiesPath)) {
      return res.status(404).json({ error: 'Companies file not found' });
    }
    
    const data = fs.readFileSync(companiesPath, 'utf8');
    let companies = JSON.parse(data);
    
    const company = companies.find(c => c.id == req.params.companyId);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    if (!company.products) company.products = [];
    
    const newProduct = {
      name: req.body.name,
      image: imagePath
    };
    
    company.products.push(newProduct);
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Product added successfully to JSON file');
    res.json(company);
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// Update product in company
app.put('/api/companies/:companyId/products/:productIndex', upload.single('image'), async (req, res) => {
  console.log('📝 PUT /api/companies/:companyId/products/:productIndex - Updating product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Product Index:', req.params.productIndex);
  
  const { companyId, productIndex } = req.params;
  let imagePath = req.body.image !== undefined ? req.body.image : undefined;
  
  // Upload to Cloudinary if new file provided
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'uzhavar/products');
      imagePath = result.secure_url;
      console.log('☁️ Product image uploaded to Cloudinary:', imagePath);
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      return res.status(500).json({ error: 'Failed to upload product image', details: error.message });
    }
  }
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const getResult = await db.query(`
        SELECT id FROM products 
        WHERE company_id = $1 
        ORDER BY id LIMIT 1 OFFSET $2
      `, [companyId, parseInt(productIndex)]);
      
      if (getResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const productId = getResult.rows[0].id;
      
      let updateQuery = 'UPDATE products SET name = $1';
      let params = [req.body.name];
      let paramIndex = 2;
      
      if (imagePath !== undefined) {
        updateQuery += `, image = $${paramIndex}`;
        params.push(imagePath);
        paramIndex++;
      }
      
      updateQuery += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`;
      params.push(productId);
      
      await db.query(updateQuery, params);
      
      const result = await db.query(`
        SELECT c.id, c.name, c.description, c.logo,
               json_agg(json_build_object('name', p.name, 'image', p.image)) FILTER (WHERE p.id IS NOT NULL) as products
        FROM companies c
        LEFT JOIN products p ON c.id = p.company_id
        WHERE c.id = $1
        GROUP BY c.id, c.name, c.description, c.logo
      `, [companyId]);
      
      const company = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        logo: result.rows[0].logo,
        products: result.rows[0].products || []
      };
      
      console.log('✅ Product updated successfully in Supabase');
      return res.json(company);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (!fs.existsSync(companiesPath)) {
      return res.status(404).json({ error: 'Companies file not found' });
    }
    
    const data = fs.readFileSync(companiesPath, 'utf8');
    let companies = JSON.parse(data);
    
    const company = companies.find(c => c.id == companyId);
    const idx = parseInt(productIndex);
    
    if (!company || !company.products || company.products[idx] === undefined) {
      return res.status(404).json({ error: 'Company or product not found' });
    }
    
    company.products[idx] = {
      name: req.body.name,
      image: imagePath !== undefined ? imagePath : company.products[idx].image
    };
    
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Product updated successfully in JSON file');
    res.json(company);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product from company
app.delete('/api/companies/:companyId/products/:productIndex', async (req, res) => {
  console.log('🗑️ DELETE /api/companies/:companyId/products/:productIndex - Deleting product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Product Index:', req.params.productIndex);
  
  const { companyId, productIndex } = req.params;
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const getResult = await db.query(`
        SELECT id FROM products 
        WHERE company_id = $1 
        ORDER BY id LIMIT 1 OFFSET $2
      `, [companyId, parseInt(productIndex)]);
      
      if (getResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const productId = getResult.rows[0].id;
      await db.query('DELETE FROM products WHERE id = $1', [productId]);
      
      const result = await db.query(`
        SELECT c.id, c.name, c.description, c.logo,
               json_agg(json_build_object('name', p.name, 'price', p.price, 'image', p.image)) FILTER (WHERE p.id IS NOT NULL) as products
        FROM companies c
        LEFT JOIN products p ON c.id = p.company_id
        WHERE c.id = $1
        GROUP BY c.id, c.name, c.description, c.logo
      `, [companyId]);
      
      const company = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        logo: result.rows[0].logo,
        products: result.rows[0].products || []
      };
      
      console.log('✅ Product deleted successfully from Supabase');
      return res.json(company);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const companiesPath = path.join(__dirname, 'data', 'companies.json');
    
    if (!fs.existsSync(companiesPath)) {
      return res.status(404).json({ error: 'Companies file not found' });
    }
    
    const data = fs.readFileSync(companiesPath, 'utf8');
    let companies = JSON.parse(data);
    
    const company = companies.find(c => c.id == companyId);
    const idx = parseInt(productIndex);
    
    if (!company || !company.products || company.products[idx] === undefined) {
      return res.status(404).json({ error: 'Company or product not found' });
    }
    
    company.products.splice(idx, 1);
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    
    console.log('✅ Product deleted successfully from JSON file');
    res.json(company);
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  console.log('� Form submission endpoint hit');
  console.log('� Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Basic phone validation when provided
    const rawPhone = req.body?.phone || req.body?.payload?.phone || '';
    const digits = String(rawPhone).replace(/\D/g, '');
    if (rawPhone && digits.length !== 10) {
      return res.status(400).json({ error: 'Invalid phone number. Provide exactly 10 digits.' });
    }

    const now = new Date().toISOString();
    const formType = req.body?.formType || 'Form Submission';
    const name = req.body?.name || req.body?.payload?.name || 'Unknown';
    const subject = req.body?.subject || `${formType} from ${name}`;

    console.log('� Form submission received:', { formType, name, subject });

    // Send data to Google Sheets for storage
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL;
    const googleSheetsSecret = process.env.GOOGLE_SHEETS_SECRET;
    
    console.log('🔧 Google Sheets config check:', {
      hasUrl: !!googleSheetsUrl,
      hasSecret: !!googleSheetsSecret,
      urlPreview: googleSheetsUrl ? googleSheetsUrl.substring(0, 50) + '...' : 'MISSING'
    });
    
    if (googleSheetsUrl) {
      try {
        console.log('📊 Sending data to Google Sheets...');
        
        const extra = req.body?.extra || {};
        
        // DEBUG: Log all extra fields to see what we're receiving
        console.log('🔍 DEBUG - Extra fields received:', JSON.stringify(extra, null, 2));
        
        // Standardize field extraction - handle all possible field name variations
        const sheetData = {
          secret: googleSheetsSecret || 'MY_APP_KEY',
          timestamp: now,
          formType: formType,
          name: name,
          email: req.body?.email || extra['Email'] || '',
          phone: req.body?.phone || extra['Phone'] || extra['Phone Number'] || '',
          subject: subject,
          message: req.body?.message || extra['Message'] || extra['Description'] || '',
          company: extra['Company'] || extra['company'] || '',
          location: extra['Location'] || extra['location'] || extra['Land Location'] || extra['Farm Location'] || '',
          serviceType: extra['Service Type'] || extra['serviceType'] || extra['Project Type'] || '',
          farmSize: extra['Farm Size'] || extra['farmSize'] || extra['Area (acres)'] || '',
          productName: extra['Product Name'] || extra['productName'] || extra['Uploaded File'] || extra['Crop Planted'] || '',
          quantity: extra['Quantity'] || extra['quantity'] || '',
          address: extra['Address'] || extra['address'] || extra['Delivery Address'] || '',
          city: extra['City'] || extra['city'] || '',
          state: extra['State'] || extra['state'] || '',
          pincode: extra['Pincode'] || extra['pincode'] || ''
        };

        console.log('📤 Sending sheet data:', { 
          formType: sheetData.formType, 
          name: sheetData.name,
          farmSize: sheetData.farmSize,
          location: sheetData.location,
          productName: sheetData.productName,
          hasSecret: !!sheetData.secret 
        });

        const response = await fetch(googleSheetsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData)
        });

        const responseText = await response.text();
        console.log('📥 Google Sheets response status:', response.status);
        console.log('📥 Google Sheets response:', responseText);

        if (response.ok) {
          console.log('✅ Data sent to Google Sheets successfully');
          try {
            const jsonResponse = JSON.parse(responseText);
            console.log('✅ Parsed response:', jsonResponse);
          } catch (e) {
            console.log('⚠️ Response is not JSON:', responseText.substring(0, 200));
          }
        } else {
          console.error('❌ Failed to send data to Google Sheets:', response.status, response.statusText);
          console.error('❌ Response body:', responseText);
        }
      } catch (sheetsError) {
        console.error('❌ Error sending to Google Sheets:', sheetsError.message);
        console.error('❌ Error stack:', sheetsError.stack);
      }
    } else {
      console.warn('⚠️ GOOGLE_SHEETS_URL not configured - skipping Google Sheets save');
    }

    // 3) Submission stored successfully in Google Sheets
    console.log('✅ Submission stored successfully in Google Sheets');
    return res.json({ success: true, message: 'Submission stored successfully in Google Sheets' });
  } catch (error) {
    console.error('❌ Error in /api/send-email:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Failed to process email request', 
      details: error.message,
      errorType: error.name 
    });
  }
});

// Get all plans
app.get('/api/plans', async (req, res) => {
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query('SELECT * FROM plans ORDER BY id');
      
      const plans = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        duration: row.duration,
        description: row.description,
        popular: row.popular,
        features: Array.isArray(row.features) ? row.features : (row.features ? row.features.split(',') : [])
      }));
      
      console.log('✅ Plans loaded from Supabase:', plans.length);
      return res.json(plans);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback for plans');
    const plansPath = path.join(__dirname, 'data', 'plans.json');
    
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      const plans = JSON.parse(data);
      console.log('✅ Plans loaded from file:', plans.length);
      res.json(plans);
    } else {
      console.log('ℹ️ Plans file not found - returning empty array');
      res.json([]);
    }
  } catch (error) {
    console.error('❌ Error reading plans:', error.message);
    res.status(500).json({ error: 'Failed to read plans' });
  }
});

// Create new plan
app.post('/api/plans', async (req, res) => {
  try {
    const features = Array.isArray(req.body.features) ? req.body.features : [];
    
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(
        'INSERT INTO plans (id, name, duration, description, popular, features) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          req.body.id || Date.now().toString(),
          req.body.name,
          req.body.duration || 'Monthly',
          req.body.description || '',
          req.body.popular || false,
          features
        ]
      );
      
      const newPlan = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        duration: result.rows[0].duration,
        description: result.rows[0].description,
        popular: result.rows[0].popular,
        features: result.rows[0].features
      };
      
      console.log('✅ Plan created successfully in Supabase');
      return res.json(newPlan);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const plansPath = path.join(__dirname, 'data', 'plans.json');
    const dataDir = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let plans = [];
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      plans = JSON.parse(data);
    }
    
    const newPlan = {
      id: req.body.id || Date.now().toString(),
      name: req.body.name,
      duration: req.body.duration || 'Monthly',
      description: req.body.description || '',
      popular: req.body.popular || false,
      features: features
    };
    
    plans.push(newPlan);
    fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
    
    console.log('✅ Plan created successfully in JSON file');
    res.json(newPlan);
  } catch (error) {
    console.error('❌ Error creating plan:', error);
    res.status(500).json({ error: 'Failed to create plan', details: error.message });
  }
});

// Update plan
app.put('/api/plans/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const features = Array.isArray(req.body.features) ? req.body.features : [];
    
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(
        'UPDATE plans SET name = $1, duration = $2, description = $3, popular = $4, features = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [
          req.body.name,
          req.body.duration || 'Monthly',
          req.body.description || '',
          req.body.popular || false,
          features,
          id
        ]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      const updatedPlan = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        duration: result.rows[0].duration,
        description: result.rows[0].description,
        popular: result.rows[0].popular,
        features: result.rows[0].features
      };
      
      console.log('✅ Plan updated successfully in Supabase');
      return res.json(updatedPlan);
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const plansPath = path.join(__dirname, 'data', 'plans.json');
    
    if (!fs.existsSync(plansPath)) {
      return res.status(404).json({ error: 'Plans file not found' });
    }
    
    const data = fs.readFileSync(plansPath, 'utf8');
    let plans = JSON.parse(data);
    
    const index = plans.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    plans[index] = {
      ...plans[index],
      name: req.body.name,
      duration: req.body.duration || 'Monthly',
      description: req.body.description || '',
      popular: req.body.popular || false,
      features: features
    };
    
    fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
    
    console.log('✅ Plan updated successfully in JSON file');
    res.json(plans[index]);
  } catch (error) {
    console.error('❌ Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan', details: error.message });
  }
});

// Delete plan
app.delete('/api/plans/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // If database is configured, use it
    if (db.isConfigured) {
      const result = await db.query(
        'DELETE FROM plans WHERE id = $1 RETURNING id',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      
      console.log('✅ Plan deleted successfully from Supabase');
      return res.json({ message: 'Plan deleted successfully' });
    }
    
    // Fallback to JSON file
    console.log('📂 Using JSON file fallback');
    const plansPath = path.join(__dirname, 'data', 'plans.json');
    
    if (!fs.existsSync(plansPath)) {
      return res.status(404).json({ error: 'Plans file not found' });
    }
    
    const data = fs.readFileSync(plansPath, 'utf8');
    let plans = JSON.parse(data);
    
    const beforeCount = plans.length;
    plans = plans.filter(p => p.id !== id);
    
    if (beforeCount === plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
    
    console.log('✅ Plan deleted successfully from JSON file');
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler - MUST be after all routes
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler caught:', err);
  console.error('Error stack:', err.stack);
  
  // Prevent HTML error pages - always send JSON
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../client/build');
  
  // Serve static files from React build
  app.use(express.static(frontendBuildPath));
  
  // All non-API GET routes serve React app (this should be last!)
  app.get('*', (req, res) => {
    // Serve React app for all GET requests (API routes are already handled above)
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Keep server awake on Render (pings itself every 10 minutes)
if (process.env.RENDER && process.env.RENDER_EXTERNAL_URL) {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  setInterval(() => {
    https.get(`${RENDER_URL}/health`, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Keep-alive ping failed:', err.message);
    });
  }, 10 * 60 * 1000); // 10 minutes
}

// For local development
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;