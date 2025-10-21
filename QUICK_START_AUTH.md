# 🔐 Quick Start: Admin Authentication

## 🚀 Immediate Setup (5 minutes)

### Step 1: Start the Backend
```powershell
Set-Location "e:\downloads\net craft studio\Uzhavar\Uzhavar-Connect\server"
node index.js
```
✅ Backend should show: `Server running on port 4000`

---

### Step 2: Start the Frontend
```powershell
Set-Location "e:\downloads\net craft studio\Uzhavar\Uzhavar-Connect\client"
npm start
```
✅ Browser opens at: `http://localhost:3000`

---

### Step 3: Try to Access Admin
1. Visit: **http://localhost:3000/admin/companies**
2. You'll be redirected to: **http://localhost:3000/admin/login**
3. Login with:
   - **Username:** `admin`
   - **Password:** `Uzhavar@2025`
4. Click **Login** → You're in! 🎉

---

## 🔑 Default Credentials

**Username:** `admin`  
**Password:** `Uzhavar@2025`

⚠️ **Important:** Change these before deploying to production!

---

## 📋 What's Protected Now

All these admin operations now require login:

✅ **Companies Management**
- Creating companies
- Editing companies
- Deleting companies
- Adding/editing products

✅ **Plans Management**
- Creating plans
- Editing plans
- Deleting plans

✅ **Data Viewing**
- Viewing submissions
- Viewing user data

---

## 🌐 What's Still Public

These endpoints work without login (as they should):

✅ View companies list (users need this)  
✅ View plans list (users need this)  
✅ Submit forms (users need this)

---

## 🔧 Change Password for Production

### On Render (Production Backend):
1. Go to Render Dashboard
2. Select your service
3. Go to **Environment** tab
4. Add these variables:
   ```
   ADMIN_USERNAME=your_new_username
   ADMIN_PASSWORD=YourSecurePassword123!
   ```
5. Click **Save**
6. Render will redeploy automatically

---

## 📖 Full Documentation

For complete details, see:
- **ADMIN_AUTHENTICATION.md** - Full authentication guide
- **AUTH_IMPLEMENTATION_SUMMARY.md** - Implementation details

---

## ✅ Testing Your Setup

1. **Test Login:**
   - Visit: http://localhost:3000/admin/login
   - Enter credentials
   - Should redirect to admin page

2. **Test Protected Routes:**
   - Try accessing: http://localhost:3000/admin/companies
   - Without login → Redirects to login
   - After login → Shows admin page

3. **Test Logout:**
   - Click logout button in admin header
   - Should redirect to login
   - Try accessing admin → Redirects to login

4. **Test Session:**
   - Login
   - Close browser
   - Reopen and visit admin
   - Should still be logged in (24-hour session)

---

## 🆘 Quick Troubleshooting

**Can't login?**
- Check backend is running (port 4000)
- Check credentials are exactly: `admin` / `Uzhavar@2025`
- Open browser console for errors

**Keeps redirecting?**
- Check localStorage has 'adminToken'
- Try clearing browser cache
- Check backend console for errors

**API calls failing?**
- Check CORS settings in server/index.js
- Verify token is being sent in headers
- Check network tab in browser dev tools

---

## 🎯 Next Steps

1. ✅ Test login functionality locally
2. ✅ Verify all admin features work
3. ⚠️ Change default credentials
4. 🚀 Deploy to production
5. ✅ Test production login
6. 📊 Monitor access logs

---

**Ready to Test!** 🚀

Your admin panel is now secure. Start the servers and try logging in!
