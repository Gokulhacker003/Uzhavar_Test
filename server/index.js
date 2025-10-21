const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
  'https://uzhavar.vercel.app', // production frontend (NO trailing slash!)
  'http://localhost:3000',      // CRA dev
  'http://localhost:3001'       // CRA dev alternate port
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

// Admin password middleware
const ADMIN_PASSWORD = 'ullavar2025';
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['x-admin-key'];
  if (authHeader === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }
}

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
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const text = `Form Type: ${formType}\nName: ${name}\nTime: ${now}\n\nPayload:\n${JSON.stringify(req.body, null, 2)}\n`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject,
        text,
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

// ==================== PLANS MANAGEMENT API ====================

// Get all plans
app.get('/api/plans', (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  
  try {
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      const plans = JSON.parse(data);
      res.json(plans);
    } else {
      // Return default plans if file doesn't exist
      const defaultPlans = [
        {
          id: '1',
          name: 'Basic Plan',
          price: '5000',
          duration: 'Monthly',
          features: [
            'Monthly farm visit',
            'Basic irrigation check',
            'Pest monitoring',
            'Monthly report'
          ],
          color: '#2196F3',
          isPopular: false
        },
        {
          id: '2',
          name: 'Standard Plan',
          price: '10000',
          duration: 'Monthly',
          features: [
            'Bi-weekly farm visit',
            'Full irrigation maintenance',
            'Pest control application',
            'Fertilizer application',
            'Detailed bi-weekly reports'
          ],
          color: '#4CAF50',
          isPopular: true
        },
        {
          id: '3',
          name: 'Premium Plan',
          price: '18000',
          duration: 'Monthly',
          features: [
            'Weekly farm visit',
            'Complete farm management',
            'Advanced pest management',
            'Customized fertilizer program',
            'Weekly detailed reports',
            'Priority support'
          ],
          color: '#FF9800',
          isPopular: false
        }
      ];
      res.json(defaultPlans);
    }
  } catch (error) {
    console.error('Error reading plans:', error);
    res.status(500).json({ error: 'Failed to read plans' });
  }
});

// Create new plan (protected)
app.post('/api/plans', requireAdminAuth, (req, res) => {
  const plansPath = path.join(__dirname, 'data', 'plans.json');
  
  try {
    let plans = [];
    if (fs.existsSync(plansPath)) {
      const data = fs.readFileSync(plansPath, 'utf8');
      plans = JSON.parse(data);
    }
    
    const newPlan = {
      id: Date.now().toString(),
      name: req.body.name,
      price: req.body.price,
      duration: req.body.duration || 'Monthly',
      features: req.body.features || [],
      color: req.body.color || '#4CAF50',
      isPopular: req.body.isPopular || false
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

// Update plan (protected)
app.put('/api/plans/:id', requireAdminAuth, (req, res) => {
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
          color: req.body.color || '#4CAF50',
          isPopular: req.body.isPopular || false
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

// Delete plan (protected)
app.delete('/api/plans/:id', requireAdminAuth, (req, res) => {
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
