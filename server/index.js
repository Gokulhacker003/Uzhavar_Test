const express = require('express');
require('dotenv').config();
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
  'https://uzhavar.vercel.app',     // production frontend (NO trailing slash!)
  'https://uzhavar-backend.vercel.app', // backend itself
  'http://localhost:3000',          // CRA dev
  'http://localhost:3001'           // CRA dev alternate port
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.indexOf(origin) === -1) {
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
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      const companies = JSON.parse(data);
      res.json(companies);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading companies:', error);
    res.status(500).json({ error: 'Failed to read companies' });
  }
});

// Create new company
app.post('/api/companies', upload.single('logo'), (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  
  try {
    let companies = [];
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      companies = JSON.parse(data);
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
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    res.json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company', details: error.message });
  }
});

// Update company
app.put('/api/companies/:id', upload.single('logo'), (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const index = companies.findIndex(c => c.id == id);
      if (index !== -1) {
        const logoPath = req.file ? `/uploads/${req.file.filename}` : (req.body.logo !== undefined ? req.body.logo : companies[index].logo);
        
        // Preserve products array when updating company
        companies[index] = { 
          ...companies[index], 
          name: req.body.name,
          description: req.body.description || '',
          logo: logoPath,
          products: companies[index].products || []
        };
        fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
        res.json(companies[index]);
      } else {
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company', details: error.message });
  }
});

// Delete company
app.delete('/api/companies/:id', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      companies = companies.filter(c => c.id != id);
      fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
      res.json({ message: 'Company deleted' });
    } else {
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Add product to company
app.post('/api/companies/:companyId/products', upload.single('image'), (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      if (company) {
        if (!company.products) company.products = [];
        
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');
        
        const newProduct = {
          name: req.body.name,
          price: req.body.price,
          image: imagePath
        };
        
        company.products.push(newProduct);
        fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
        res.json(company);
      } else {
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// Update product in company
app.put('/api/companies/:companyId/products/:productIndex', upload.single('image'), (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId, productIndex } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      const idx = parseInt(productIndex);
      
      if (company && company.products && company.products[idx] !== undefined) {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image !== undefined ? req.body.image : company.products[idx].image);
        
        company.products[idx] = {
          name: req.body.name,
          price: req.body.price,
          image: imagePath
        };
        fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
        res.json(company);
      } else {
        res.status(404).json({ error: 'Company or product not found' });
      }
    } else {
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete product from company
app.delete('/api/companies/:companyId/products/:productIndex', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId, productIndex } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      // Handle both string and number IDs
      const company = companies.find(c => c.id == companyId);
      const idx = parseInt(productIndex);
      
      if (company && company.products && company.products[idx] !== undefined) {
        company.products.splice(idx, 1);
        fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
        res.json(company);
      } else {
        res.status(404).json({ error: 'Company or product not found' });
      }
    } else {
      res.status(404).json({ error: 'Companies file not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
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

// Send email endpoint (placeholder - implement with nodemailer or your email service)
app.post('/api/send-email', async (req, res) => {
  try {
    // Basic phone validation when provided
    const rawPhone = req.body?.phone || req.body?.payload?.phone || '';
    const digits = String(rawPhone).replace(/\D/g, '');
    if (rawPhone && digits.length !== 10) {
      return res.status(400).json({ error: 'Invalid phone number. Provide exactly 10 digits.' });
    }

    // 1) Persist submission locally
    const dataDir = path.join(__dirname, 'data');
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

    const now = new Date().toISOString();
    const ua = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const contentLength = req.headers['content-length'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const formType = req.body?.formType || 'Form Submission';
    const name = req.body?.name || req.body?.payload?.name || 'Unknown';
    const toEmail = process.env.SMTP_USER || 'uzhavarconnect2025@gmail.com';
    const subject = req.body?.subject || `${formType} from ${name}`;

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

    // 2) Optionally send real email (if enabled)
    if (String(process.env.SEND_EMAILS).toLowerCase() === 'true') {
      const nodemailer = require('nodemailer');
      
      // Use port 587 with STARTTLS for Render compatibility (port 465 is blocked)
      const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
      const smtpSecure = smtpPort === 465; // true for 465, false for other ports
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Add connection timeout and other options
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
                <tr><td style="padding: 8px 0; color: #666;"><strong>Price:</strong></td><td style="padding: 8px 0;">${extra['Price'] || 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Quantity:</strong></td><td style="padding: 8px 0;">${extra['Quantity'] || 1}</td></tr>
                <tr style="background-color: #f0f0f0;">
                  <td style="padding: 12px 8px; color: #333; font-size: 16px;"><strong>Total Amount:</strong></td>
                  <td style="padding: 12px 8px; color: #4CAF50; font-size: 18px; font-weight: bold;">${extra['Total Amount'] || 'N/A'}</td>
                </tr>
              </table>

              <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 30px;">Delivery Address</h2>
              <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0;">${extra['Delivery Address'] || 'N/A'}</p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p><strong>Order Time:</strong> ${orderDate}</p>
                <p style="margin-top: 10px;">This is an automated email from Uzhavar Connect. Please process this order promptly.</p>
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
Price: ${extra['Price'] || 'N/A'}
Quantity: ${extra['Quantity'] || 1}
TOTAL AMOUNT: ${extra['Total Amount'] || 'N/A'}

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

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      fs.appendFileSync(emailLogPath, `[${now}] sent to ${toEmail} | ${subject}\n`);
      return res.json({ success: true, message: 'Email sent', queued: false });
    }

    // If not sending, we still logged & stored
    return res.json({ success: true, message: 'Submission stored (email sending disabled)', queued: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to process email request', details: error.message });
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

// Keep server awake on Render (pings itself every 10 minutes)
if (process.env.RENDER) {
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
