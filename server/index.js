const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

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
app.post('/api/companies', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  
  try {
    let companies = [];
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      companies = JSON.parse(data);
    }
    
    const newCompany = {
      id: Date.now().toString(),
      ...req.body,
      products: req.body.products || []
    };
    
    companies.push(newCompany);
    fs.writeFileSync(companiesPath, JSON.stringify(companies, null, 2));
    res.json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
app.put('/api/companies/:id', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { id } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      const index = companies.findIndex(c => c.id === id);
      if (index !== -1) {
        companies[index] = { ...companies[index], ...req.body };
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
    res.status(500).json({ error: 'Failed to update company' });
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
      
      companies = companies.filter(c => c.id !== id);
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
app.post('/api/companies/:companyId/products', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      const company = companies.find(c => c.id === companyId);
      if (company) {
        if (!company.products) company.products = [];
        company.products.push(req.body);
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
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product in company
app.put('/api/companies/:companyId/products/:productIndex', (req, res) => {
  const companiesPath = path.join(__dirname, 'data', 'companies.json');
  const { companyId, productIndex } = req.params;
  
  try {
    if (fs.existsSync(companiesPath)) {
      const data = fs.readFileSync(companiesPath, 'utf8');
      let companies = JSON.parse(data);
      
      const company = companies.find(c => c.id === companyId);
      if (company && company.products && company.products[productIndex]) {
        company.products[productIndex] = req.body;
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
    res.status(500).json({ error: 'Failed to update product' });
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
      
      const company = companies.find(c => c.id === companyId);
      if (company && company.products && company.products[productIndex]) {
        company.products.splice(productIndex, 1);
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
    res.status(500).json({ error: 'Failed to delete product' });
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
app.post('/api/send-email', (req, res) => {
  console.log('Email request received:', req.body);
  
  // TODO: Implement actual email sending logic
  // For now, just log and return success
  
  try {
    // You would use nodemailer or another email service here
    res.json({ 
      success: true, 
      message: 'Email endpoint received request (implement email service)'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
