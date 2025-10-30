const express = require('express');
// Load environment variables from root .env file
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 4000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

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
app.get('/api/submissions', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const submissionsPath = path.join(__dirname, 'data', 'submissions.json');
  
  try {
    if (fs.existsSync(submissionsPath)) {
      const data = fs.readFileSync(submissionsPath, 'utf8');
      const submissions = JSON.parse(data);
      res.json(submissions);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

// Get all companies
app.get('/api/companies', (req, res) => {
  console.log('📦 GET /api/companies - Request received');
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  console.log('📂 Looking for file at:', companiesPath);
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      const companies = JSON.parse(data);
      console.log('✅ Companies loaded:', companies.length);
      res.json(companies);
    } else {
      console.log('⚠️ Companies file not found');
      res.json([]);
    }
  } catch (error) {
    console.error('❌ Error reading companies:', error);
    res.status(500).json({ error: 'Failed to read companies' });
  }
});

// Create new company
app.post('/api/companies', upload.single('logo'), (req, res) => {
  console.log('➕ POST /api/companies - Creating new company');
  console.log('📝 Request body:', req.body);
  console.log('📝 File uploaded:', req.file ? req.file.filename : 'none');
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let companies = [];
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      companies = JSON.parse(data);
      console.log('📊 Existing companies:', companies.length);
    } else {
      console.log('⚠️ Companies file does not exist, will create new one');
    }
    
    const logoPath = req.file ? `/uploads/${req.file.filename}` : (req.body.logo || '');
    
    const newCompany = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description || '',
      logo: logoPath,
      products: []
    };
    
    companies.push(newCompany);
    console.log('💾 Writing new company to file...');
    
    try {
      fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
      console.log('✅ Company created successfully');
    } catch (writeError) {
      console.warn('⚠️ Could not write to file (this is normal on Render):', writeError.message);
    }
    
    res.json(newCompany);
  } catch (error) {
    console.error('❌ Error creating company:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create company', details: error.message });
  }
});

// Update company
app.put('/api/companies/:id', upload.single('logo'), (req, res) => {
  console.log('📝 PUT /api/companies/:id - Request received');
  console.log('📝 Company ID:', req.params.id);
  console.log('📝 Request body:', req.body);
  console.log('📝 File uploaded:', req.file ? req.file.filename : 'none');
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { id } = req.params;
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(companiesPath)) {
      console.log('✅ Companies file exists, reading...');
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      console.log('📊 Total companies:', companies.length);
      
      // Handle both string and number IDs
      const index = companies.findIndex(c => c.id == id);
      console.log('🔍 Company index found:', index);
      
      if (index !== -1) {
        const logoPath = req.file ? `/uploads/${req.file.filename}` : (req.body.logo !== undefined ? req.body.logo : companies[index].logo);
        
        // Preserve products array when updating company
        const updatedCompany = { 
          ...companies[index], 
          name: req.body.name,
          description: req.body.description || '',
          logo: logoPath,
          products: companies[index].products || []
        };
        
        companies[index] = updatedCompany;
        console.log('💾 Writing updated company to file...');
        
        try {
          fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
          console.log('✅ Company updated successfully');
          res.json(updatedCompany);
        } catch (writeError) {
          console.error('❌ Error writing to file:', writeError);
          // If file system is read-only (like on Render), still return success
          // but log the warning
          console.warn('⚠️ File system may be read-only (this is normal on Render)');
          res.json(updatedCompany);
        }
      } else {
        console.log('❌ Company not found with ID:', id);
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      console.log('❌ Companies file not found at:', companiesPath);
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('❌ Error updating company:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update company', details: error.message });
  }
});

// Delete company
app.delete('/api/companies/:id', (req, res) => {
  console.log('🗑️ DELETE /api/companies/:id - Deleting company');
  console.log('📝 Company ID:', req.params.id);
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { id } = req.params;
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(companiesPath)) {
      console.log('✅ Companies file exists, reading...');
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      const beforeCount = companies.length;
      // Handle both string and number IDs
      companies = companies.filter(c => c.id != id);
      const afterCount = companies.length;
      
      console.log('📊 Companies before:', beforeCount, 'after:', afterCount);
      
      if (beforeCount > afterCount) {
        console.log('💾 Writing updated companies to file...');
        
        try {
          fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
          console.log('✅ Company deleted successfully');
        } catch (writeError) {
          console.warn('⚠️ Could not write to file (this is normal on Render):', writeError.message);
        }
        
        res.json({ message: 'Company deleted' });
      } else {
        console.log('❌ Company not found with ID:', id);
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      console.log('❌ Companies file not found at:', companiesPath);
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('❌ Error deleting company:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to delete company', details: error.message });
  }
});

// Add product to company
app.post('/api/companies/:companyId/products', upload.single('image'), (req, res) => {
  console.log('➕ POST /api/companies/:companyId/products - Adding product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Request body:', req.body);
  console.log('📝 File uploaded:', req.file ? req.file.filename : 'none');
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId } = req.params;
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(companiesPath)) {
      console.log('✅ Companies file exists, reading...');
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      console.log('🔍 Company found:', company ? company.name : 'not found');
      
      if (company) {
        if (!company.products) company.products = [];
        
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');
        
        const newProduct = {
          name: req.body.name,
          price: req.body.price,
          image: imagePath
        };
        
        company.products.push(newProduct);
        console.log('💾 Writing updated company to file...');
        
        try {
          fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
          console.log('✅ Product added successfully');
        } catch (writeError) {
          console.warn('⚠️ Could not write to file (this is normal on Render):', writeError.message);
        }
        
        res.json(company);
      } else {
        console.log('❌ Company not found with ID:', companyId);
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      console.log('❌ Companies file not found at:', companiesPath);
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('❌ Error adding product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// Update product in company
app.put('/api/companies/:companyId/products/:productIndex', upload.single('image'), (req, res) => {
  console.log('📝 PUT /api/companies/:companyId/products/:productIndex - Updating product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Product Index:', req.params.productIndex);
  console.log('📝 Request body:', req.body);
  console.log('📝 File uploaded:', req.file ? req.file.filename : 'none');
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId, productIndex } = req.params;
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(companiesPath)) {
      console.log('✅ Companies file exists, reading...');
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      const idx = parseInt(productIndex);
      
      console.log('🔍 Company found:', company ? company.name : 'not found');
      console.log('🔍 Product index:', idx);
      console.log('🔍 Products array length:', company?.products?.length || 0);
      
      if (company && company.products && company.products[idx] !== undefined) {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image !== undefined ? req.body.image : company.products[idx].image);
        
        const updatedProduct = {
          name: req.body.name,
          price: req.body.price,
          image: imagePath
        };
        
        company.products[idx] = updatedProduct;
        console.log('💾 Writing updated company to file...');
        
        try {
          fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
          console.log('✅ Product updated successfully');
        } catch (writeError) {
          console.warn('⚠️ Could not write to file (this is normal on Render):', writeError.message);
        }
        
        res.json(company);
      } else {
        console.log('❌ Company or product not found');
        console.log('Company exists:', !!company);
        console.log('Products array exists:', !!company?.products);
        console.log('Product at index exists:', company?.products?.[idx] !== undefined);
        res.status(404).json({ error: 'Company or product not found' });
      }
    } else {
      console.log('❌ Companies file not found at:', companiesPath);
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('❌ Error updating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product from company
app.delete('/api/companies/:companyId/products/:productIndex', (req, res) => {
  console.log('🗑️ DELETE /api/companies/:companyId/products/:productIndex - Deleting product');
  console.log('📝 Company ID:', req.params.companyId);
  console.log('📝 Product Index:', req.params.productIndex);
  
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId, productIndex } = req.params;
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ Data directory does not exist, creating it...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(companiesPath)) {
      console.log('✅ Companies file exists, reading...');
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      const idx = parseInt(productIndex);
      
      console.log('🔍 Company found:', company ? company.name : 'not found');
      console.log('🔍 Product index:', idx);
      
      if (company && company.products && company.products[idx] !== undefined) {
        company.products.splice(idx, 1);
        console.log('💾 Writing updated company to file...');
        
        try {
          fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
          console.log('✅ Product deleted successfully');
        } catch (writeError) {
          console.warn('⚠️ Could not write to file (this is normal on Render):', writeError.message);
        }
        
        res.json(company);
      } else {
        console.log('❌ Company or product not found');
        res.status(404).json({ error: 'Company or product not found' });
      }
    } else {
      console.log('❌ Companies file not found at:', companiesPath);
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// Get user data
app.get('/api/user-data', (req, res) => {
  const userDataPath = path.join(__dirname, 'data', 'user-data.json');
  
  try {
    if (fs.existsSync(userDataPath)) {
      const data = fs.readFileSync(userDataPath, 'utf8');
      const userData = JSON.parse(data);
      res.json(userData);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading user data:', error);
    res.status(500).json({ error: 'Failed to read user data' });
  }
});

// Store user data
app.post('/api/store-data', (req, res) => {
  const userDataPath = path.join(__dirname, 'data', 'user-data.json');
  
  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    let userData = [];
    if (fs.existsSync(userDataPath)) {
      const data = fs.readFileSync(userDataPath, 'utf8');
      userData = JSON.parse(data);
    }
    
    const newData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };
    
    userData.push(newData);
    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    res.json({ success: true, data: newData });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({ error: 'Failed to store user data' });
  }
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  console.log('📧 Email endpoint hit');
  console.log('📧 Request body:', JSON.stringify(req.body, null, 2));
  
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
    const toEmail = process.env.SMTP_USER || 'mylearnings2715@gmail.com';
    const subject = req.body?.subject || `${formType} from ${name}`;

    console.log('📧 Email details:', { formType, name, toEmail, subject });

    // 1) Persist submission locally (wrapped in try-catch for Render compatibility)
    const dataDir = path.join(__dirname, 'data');
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

      const submissionsPath = path.join(dataDir, 'submissions.json');
      const emailLogPath = path.join(dataDir, 'email.log');

      let submissions = [];
      if (fs.existsSync(submissionsPath)) {
        try {
          submissions = JSON.parse(fs.readFileSync(submissionsPath, 'utf8')) || [];
        } catch (_) {
          submissions = [];
        }
      }

      const ua = req.headers['user-agent'] || '';
      const referer = req.headers['referer'] || '';
      const contentLength = req.headers['content-length'] || '';
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

      const record = {
        receivedAt: now,
        toEmail,
        subject,
        payload: req.body || {},
        metadata: { userAgent: ua, ip, referer, contentLength }
      };

      submissions.push(record);
      fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

      const logLine = `[${now}] queued to ${toEmail} | ${subject}\n`;
      fs.appendFileSync(emailLogPath, logLine);
      
      console.log('✅ Submission saved locally');
    } catch (fileError) {
      // Log file system errors but don't fail the email send
      console.warn('⚠️ Could not save submission to file (this is normal on Render):', fileError.message);
    }

    // 2) Check if email sending is enabled
    const sendEmails = String(process.env.SEND_EMAILS).toLowerCase() === 'true';
    console.log('📧 SEND_EMAILS env var:', process.env.SEND_EMAILS);
    console.log('📧 Will send email:', sendEmails);

    if (sendEmails) {
      console.log('📧 Attempting to send email...');
      const nodemailer = require('nodemailer');
      
      // Use port 587 with STARTTLS for Render compatibility (port 465 is blocked)
      const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
      const smtpSecure = smtpPort === 465; // true for 465, false for other ports
      
      console.log('📧 SMTP Config:', {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpSecure,
        user: process.env.SMTP_USER,
        hasPassword: !!process.env.SMTP_PASS
      });
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 30000
      });

      // Format the email based on form type
      let htmlContent = '';
      let textContent = '';

      if (formType === 'Product Order') {
        const extra = req.body?.extra || {};
        const phone = req.body?.phone || 'N/A';
        const email = req.body?.email || 'N/A';
        const orderDate = new Date(now).toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">📦 New Product Order</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Customer Details</h2>
              <table style="width: 100%; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;">${email}</td></tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 30px;">Order Details</h2>
              <table style="width: 100%; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Product:</strong></td><td style="padding: 8px 0;">${extra['Product Name'] || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td><td style="padding: 8px 0;">${extra['Company'] || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Quantity:</strong></td><td style="padding: 8px 0;">${extra['Quantity'] || 1}</td></tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 30px;">Delivery Address</h2>
              <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0;">${extra['Delivery Address'] || 'N/A'}</p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p><strong>Order Time:</strong> ${orderDate}</p>
              </div>
            </div>
          </div>
        `;

        textContent = `📦 NEW PRODUCT ORDER

CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
Email: ${email}

ORDER DETAILS:
Product: ${extra['Product Name'] || 'N/A'}
Company: ${extra['Company'] || 'N/A'}
Quantity: ${extra['Quantity'] || 1}

DELIVERY ADDRESS:
${extra['Delivery Address'] || 'N/A'}

Order Time: ${orderDate}
`;
      } else {
        // Default format for other form types
        const extra = req.body?.extra || {};
        const phone = req.body?.phone || 'N/A';
        const email = req.body?.email || 'N/A';
        const message = req.body?.message || '';

        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #2196F3; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">📧 ${formType}</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">Contact Information</h2>
              <table style="width: 100%; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;">${email}</td></tr>
              </table>

              ${message ? `<h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px; margin-top: 30px;">Message</h2>
              <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2196F3; margin: 10px 0;">${message}</p>` : ''}

              ${Object.keys(extra).length > 0 ? `<h2 style="color: #333; border-bottom: 2px solid #2196F3; padding-bottom: 10px; margin-top: 30px;">Additional Details</h2>
              <table style="width: 100%; margin-bottom: 20px;">
                ${Object.entries(extra).map(([key, value]) => `
                  <tr><td style="padding: 8px 0; color: #666;"><strong>${key}:</strong></td><td style="padding: 8px 0;">${value}</td></tr>
                `).join('')}
              </table>` : ''}

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p><strong>Received:</strong> ${new Date(now).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
            </div>
          </div>
        `;

        textContent = `${formType.toUpperCase()}

CONTACT INFORMATION:
Name: ${name}
Phone: ${phone}
Email: ${email}

${message ? `MESSAGE:\n${message}\n` : ''}
${Object.keys(extra).length > 0 ? `\nADDITIONAL DETAILS:\n${Object.entries(extra).map(([k, v]) => `${k}: ${v}`).join('\n')}` : ''}

Received: ${new Date(now).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`;
      }

      console.log('📧 Sending email to:', toEmail);
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log('✅ Email sent successfully! Message ID:', info.messageId);
      
      // Log success (wrapped in try-catch)
      try {
        const emailLogPath = path.join(dataDir, 'email.log');
        fs.appendFileSync(emailLogPath, `[${now}] sent to ${toEmail} | ${subject}\n`);
      } catch (logError) {
        console.warn('⚠️ Could not write to email.log:', logError.message);
      }
      
      return res.json({ success: true, message: 'Email sent', queued: false });
    }

    // If not sending, we still logged & stored
    console.log('ℹ️ Email sending disabled (SEND_EMAILS != true)');
    return res.json({ success: true, message: 'Submission stored (email sending disabled)', queued: true });
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

// ==================== PLANS API ENDPOINTS ====================

// Get all plans
app.get('/api/plans', (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  
  try {
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      const plans = JSON.parse(data);
      res.json(plans);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading plans:', error);
    res.status(500).json({ error: 'Failed to read plans' });
  }
});

// Create new plan
app.post('/api/plans', (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  
  try {
    let plans = [];
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      plans = JSON.parse(data);
    }
    
    const newPlan = {
      id: req.body.id || Date.now().toString(),
      name: req.body.name,
      price: req.body.price,
      duration: req.body.duration || 'Monthly',
      features: req.body.features || [],
      popular: req.body.popular || false,
      description: req.body.description || ''
    };
    
    plans.push(newPlan);
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
    res.json(newPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Failed to create plan', details: error.message });
  }
});

// Update plan
app.put('/api/plans/:id', (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      let plans = JSON.parse(data);
      
      const index = plans.findIndex(p => p.id === id);
      if (index !== -1) {
        plans[index] = { 
          ...plans[index],
          name: req.body.name,
          price: req.body.price,
          duration: req.body.duration || 'Monthly',
          features: req.body.features || [],
          popular: req.body.popular || false,
          description: req.body.description || ''
        };
        fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
        res.json(plans[index]);
      } else {
        res.status(404).json({ error: 'Plan not found' });
      }
    } else {
      res.status(404).json({ error: 'Plans file not found' });
    }
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan', details: error.message });
  }
});

// Delete plan
app.delete('/api/plans/:id', (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      let plans = JSON.parse(data);
      
      plans = plans.filter(p => p.id !== id);
      fs.writeFileSync(plansPath, JSON.stringify(plans, null, 2));
      res.json({ message: 'Plan deleted successfully' });
    } else {
      res.status(404).json({ error: 'Plans file not found' });
    }
  } catch (error) {
    console.error('Error deleting plan:', error);
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