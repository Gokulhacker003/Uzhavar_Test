# Image Hosting Fix for Vercel + Render Deployment

## Problem
Images were displaying on localhost but not on production (Vercel + Render) because:
- Image paths in database are relative: `/uploads/image.jpg`
- Frontend hosted on Vercel can't find images on Render backend
- Need to convert relative paths to full URLs

## Solution Implemented

### 1. Created `imageUrl()` Helper Function
**File:** `client/src/api.js`

```javascript
export function imageUrl(path) {
  if (!path) return '';
  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If relative path, prepend API base URL
  if (API_BASE) {
    return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
  }
  // In development with proxy, return relative path
  return path.startsWith('/') ? path : `/${path}`;
}
```

### 2. Updated CompaniesPage.js
- Imported `imageUrl` from `./api`
- Wrapped all image paths with `imageUrl()` function
- Applied to: company logos, product images, fallback images

### 3. Created Production Environment File
**File:** `client/.env.production`
```
REACT_APP_API_URL=https://uzhavar.onrender.com
```

## How It Works

### Development (localhost:3000)
- `REACT_APP_API_URL` is empty
- Uses proxy from package.json
- Image path: `/uploads/image.jpg` → `http://localhost:4000/uploads/image.jpg` (via proxy)

### Production (Vercel + Render)
- `REACT_APP_API_URL=https://uzhavar.onrender.com`
- Image path: `/uploads/image.jpg` → `https://uzhavar.onrender.com/uploads/image.jpg`

## Deployment Steps

### 1. Deploy Backend to Render
Make sure your backend serves static files:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 2. Deploy Frontend to Vercel
Set environment variable in Vercel dashboard:
- Key: `REACT_APP_API_URL`
- Value: `https://uzhavar.onrender.com`

**OR** Vercel will automatically use `.env.production` file.

### 3. Verify CORS Settings
In `server/index.js`, ensure Vercel URL is allowed:
```javascript
const allowedOrigins = [
  'https://uzhavar.vercel.app',  // Your Vercel URL
  'http://localhost:3000'
];
```

## Testing

### Check if images load:
1. Open browser console (F12)
2. Check image URLs in Network tab
3. Should see: `https://uzhavar.onrender.com/uploads/...`
4. Not: `/uploads/...`

### Common Issues:

**Issue 1:** Images still not loading
- Check Render backend logs
- Verify `/uploads` folder exists on Render
- Test direct URL: `https://uzhavar.onrender.com/uploads/filename.jpg`

**Issue 2:** CORS errors
- Add your Vercel URL to `allowedOrigins` in backend
- Restart Render backend after changes

**Issue 3:** 404 errors for images
- Ensure images are uploaded to Render's persistent storage
- Check file paths in `companies.json`

## File Changes Summary

### Modified Files:
1. ✅ `client/src/api.js` - Added `imageUrl()` helper
2. ✅ `client/src/CompaniesPage.js` - Applied `imageUrl()` to all images
3. ✅ `client/src/admin/AdminCompaniesPage.js` - Applied `imageUrl()` to admin panel images
4. ✅ `client/.env.production` - Created with backend URL

### Backend Requirements:
- Static file serving for `/uploads` folder
- CORS configured for Vercel domain
- Persistent storage on Render (important!)

## Future Improvements

Consider using cloud storage for images:
- AWS S3
- Cloudinary
- Firebase Storage

This prevents issues with Render's ephemeral file system.
