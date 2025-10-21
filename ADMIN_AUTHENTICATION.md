# 🔐 Admin Authentication System

Complete password-based authentication system to secure admin routes and prevent unauthorized access.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Default Credentials](#default-credentials)
3. [How It Works](#how-it-works)
4. [API Endpoints](#api-endpoints)
5. [Frontend Implementation](#frontend-implementation)
6. [Changing Credentials](#changing-credentials)
7. [Security Features](#security-features)
8. [Usage Guide](#usage-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The authentication system provides:
- **Login/Logout functionality** with session management
- **Token-based authentication** using Bearer tokens
- **Protected admin routes** requiring valid authentication
- **24-hour session expiry** with automatic extension on activity
- **Environment variable support** for credentials

---

## 🔑 Default Credentials

**Username:** `admin`  
**Password:** `Uzhavar@2025`

⚠️ **Important:** Change these credentials before deploying to production!

---

## ⚙️ How It Works

### Authentication Flow

1. **User visits admin page** → Redirected to `/admin/login`
2. **User enters credentials** → Sent to backend `/api/admin/login`
3. **Backend validates** → Returns session token if valid
4. **Token stored in localStorage** → Used for subsequent requests
5. **Protected routes check token** → Verify with `/api/admin/verify`
6. **Token sent with API calls** → Using `Authorization: Bearer <token>` header

### Session Management

- Sessions expire after **24 hours** of inactivity
- Each API call **extends the session** by 24 hours
- Logout **immediately invalidates** the session
- Invalid/expired tokens **redirect to login**

---

## 🌐 API Endpoints

### 1. Login
**POST** `/api/admin/login`

**Request:**
```json
{
  "username": "admin",
  "password": "Uzhavar@2025"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "abc123xyz789...",
  "expiresAt": 1735689600000,
  "user": "admin"
}
```

**Response (Failure):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Logout
**POST** `/api/admin/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3. Verify Session
**GET** `/api/admin/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Valid):**
```json
{
  "success": true,
  "user": "admin"
}
```

**Response (Invalid):**
```json
{
  "error": "Session expired. Please login again."
}
```

---

## 🔒 Protected Endpoints

The following endpoints now require authentication:

### Admin Data Management
- `GET /api/submissions` - View form submissions
- `GET /api/user-data` - View user data

### Companies Management
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `POST /api/companies/:companyId/products` - Add product
- `PUT /api/companies/:companyId/products/:productIndex` - Update product
- `DELETE /api/companies/:companyId/products/:productIndex` - Delete product

### Plans Management
- `POST /api/plans` - Create plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Public Endpoints (No Auth Required)
- `GET /api/companies` - View companies (public)
- `GET /api/plans` - View plans (public)
- `POST /api/submit` - Submit forms (public)

---

## 💻 Frontend Implementation

### 1. Admin Login Component
**Location:** `client/src/admin/AdminLogin.js`

Features:
- Username and password fields
- Error message display
- Loading states
- Auto-redirect if already logged in
- Shows default credentials

```javascript
import AdminLogin from './admin/AdminLogin';

<Route path="/admin/login" element={
  <AdminLogin onLogin={() => setIsAuthenticated(true)} />
} />
```

---

### 2. Protected Route Component
**Location:** `client/src/admin/ProtectedRoute.js`

Features:
- Token verification on mount
- Automatic redirect to login if unauthorized
- Loading state while verifying
- Session validation with backend

```javascript
import ProtectedRoute from './admin/ProtectedRoute';

<Route path="/admin/companies" element={
  <ProtectedRoute>
    <AdminCompaniesPage onLogout={handleLogout} />
  </ProtectedRoute>
} />
```

---

### 3. Auth Helper Functions
**Location:** `client/src/admin/authHelper.js`

```javascript
import { getAuthHeaders, handleAuthError } from './authHelper';

// Get headers with auth token
fetch(apiUrl('/api/plans'), {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(data)
});

// Handle auth errors
.then(response => {
  if (!response.ok) {
    handleAuthError(response);
  }
  return response.json();
});
```

---

### 4. Logout Handler
**Location:** `client/src/App.js`

```javascript
const handleLogout = () => {
  localStorage.removeItem('adminToken');
  setIsAuthenticated(false);
  window.location.href = '/admin/login';
};
```

---

## 🔧 Changing Credentials

### Method 1: Environment Variables (Recommended)

**Production (Render):**
1. Go to your Render dashboard
2. Navigate to your service → Environment
3. Add environment variables:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```
4. Save and redeploy

**Development (.env file):**
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
```

---

### Method 2: Direct Code Change

**File:** `server/index.js`

```javascript
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'your_new_username';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_new_password';
```

⚠️ **Not recommended for production** - Use environment variables instead!

---

## 🛡️ Security Features

### Implemented
✅ Token-based authentication  
✅ Session expiration (24 hours)  
✅ Secure password transmission (HTTPS in production)  
✅ Auto-logout on token expiry  
✅ Protected admin routes  
✅ Environment variable support  
✅ Session extension on activity  

### Recommended Enhancements
🔸 **Password Hashing:** Use bcrypt to hash passwords  
🔸 **JWT Tokens:** Replace simple tokens with JWT  
🔸 **Rate Limiting:** Prevent brute force attacks  
🔸 **Multi-User Support:** Database for multiple admins  
🔸 **Role-Based Access:** Different permission levels  
🔸 **Two-Factor Authentication:** Extra security layer  
🔸 **Session Storage:** Use Redis instead of in-memory  

---

## 📖 Usage Guide

### Accessing Admin Panel

1. **Navigate to admin area:**
   ```
   http://localhost:3000/admin/companies
   ```

2. **You'll be redirected to login:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Enter credentials:**
   - Username: `admin`
   - Password: `Uzhavar@2025`

4. **Click "Login"** → Redirected to admin dashboard

5. **Session lasts 24 hours** or until you logout

---

### Admin Features Available

Once logged in, you can access:

- **Companies Management** (`/admin/companies`)
  - View all companies
  - Add new companies with logos
  - Edit company details
  - Delete companies
  - Manage products

- **Plans Management** (`/admin/plans`)
  - View all AMC plans
  - Create custom plans
  - Edit plan details
  - Delete plans
  - Set popular badges

- **Submissions** (`/admin/submissions`)
  - View all form submissions
  - Filter and search submissions

- **User Data** (`/admin/user-data`)
  - View all user information
  - Export data

---

### Logout

Click the **Logout** button in the admin panel header to end your session.

---

## 🔍 Troubleshooting

### Problem: "Authentication required" error
**Solution:**
- Check if you're logged in
- Try logging out and back in
- Clear browser localStorage
- Verify backend is running

---

### Problem: Login not working
**Solution:**
- Verify backend server is running
- Check credentials are correct
- Open browser console for errors
- Verify API URL is correct in `.env`

---

### Problem: Session expires too quickly
**Solution:**
- Session extends on activity
- Check system time is correct
- Verify token is being sent with requests

---

### Problem: Can't access after deployment
**Solution:**
- Set environment variables on Render
- Update CORS settings in `server/index.js`
- Clear browser cache
- Check Render logs for errors

---

## 🚀 Testing Checklist

Before deploying to production:

- [ ] Change default credentials
- [ ] Set environment variables on Render
- [ ] Test login functionality
- [ ] Test logout functionality
- [ ] Verify protected routes require auth
- [ ] Test session expiration
- [ ] Test with wrong credentials
- [ ] Check CORS settings
- [ ] Test all admin CRUD operations
- [ ] Verify public routes still work

---

## 📝 Quick Reference

### Backend Configuration
```javascript
// server/index.js
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Uzhavar@2025';
```

### Frontend Auth Headers
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
}
```

### Protected Route Pattern
```javascript
<Route path="/admin/..." element={
  <ProtectedRoute>
    <YourAdminComponent />
  </ProtectedRoute>
} />
```

---

## 📞 Support

If you encounter issues with authentication:

1. Check browser console for errors
2. Verify backend is running on port 4000
3. Check Render logs if deployed
4. Review CORS configuration
5. Ensure environment variables are set

---

**Last Updated:** October 21, 2025  
**Version:** 1.0.0
