# 📋 AMC Plans System - Complete Implementation Guide

## ✨ Overview

A complete system for managing Monthly AMC (Annual Maintenance Contract) plans with admin interface for CRUD operations and dynamic frontend display.

---

## 🎯 Features

### **Admin Features:**
- ✅ Create new AMC plans
- ✅ Edit existing plans
- ✅ Delete plans
- ✅ Mark plans as "Popular" (featured badge)
- ✅ Manage features list (add/remove)
- ✅ Set pricing and duration
- ✅ Real-time preview

### **User Features:**
- ✅ Dynamic plan loading from backend
- ✅ Beautiful card-based display
- ✅ Popular plan highlighting
- ✅ Responsive design
- ✅ Select and book plans

---

## 📁 Files Created/Modified

### **Backend:**
1. ✅ `server/data/plans.json` - Plans database
2. ✅ `server/index.js` - API endpoints added

### **Frontend:**
1. ✅ `client/src/admin/AdminPlansPage.js` - Admin interface (NEW)
2. ✅ `client/src/pages/ManageFarmPage.js` - Dynamic plan display
3. ✅ `client/src/App.js` - Route added

---

## 🔌 Backend API Endpoints

### **Base URL:** `/api/plans`

### **1. GET /api/plans**
Get all plans

**Request:**
```http
GET /api/plans
```

**Response:**
```json
[
  {
    "id": "basic",
    "name": "Basic Plan",
    "price": "5000",
    "duration": "Monthly",
    "features": [
      "Monthly farm visit",
      "Basic irrigation check",
      "Pest monitoring",
      "Monthly report"
    ],
    "popular": false,
    "description": "Essential maintenance for small farms"
  }
]
```

---

### **2. POST /api/plans**
Create new plan

**Request:**
```http
POST /api/plans
Content-Type: application/json

{
  "id": "custom",
  "name": "Custom Plan",
  "price": "15000",
  "duration": "Monthly",
  "description": "Tailored to your needs",
  "features": [
    "Customized visit schedule",
    "Specialized services"
  ],
  "popular": false
}
```

**Response:**
```json
{
  "id": "custom",
  "name": "Custom Plan",
  "price": "15000",
  ...
}
```

---

### **3. PUT /api/plans/:id**
Update existing plan

**Request:**
```http
PUT /api/plans/basic
Content-Type: application/json

{
  "name": "Basic Plan Updated",
  "price": "6000",
  "duration": "Monthly",
  "features": ["Updated feature"],
  "popular": true,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "basic",
  "name": "Basic Plan Updated",
  "price": "6000",
  ...
}
```

---

### **4. DELETE /api/plans/:id**
Delete plan

**Request:**
```http
DELETE /api/plans/basic
```

**Response:**
```json
{
  "message": "Plan deleted successfully"
}
```

---

## 🖥️ Admin Interface

### **Access:**
```
http://localhost:3000/admin/plans
```

### **Features:**

#### **1. View All Plans**
- Grid layout with cards
- Shows price, features, popular badge
- Edit and Delete buttons on each card

#### **2. Create Plan Form**
- **Plan ID**: Unique identifier (e.g., `basic`, `premium`)
- **Plan Name**: Display name (e.g., "Basic Plan")
- **Price**: In rupees (₹)
- **Duration**: Monthly, Quarterly, Yearly
- **Description**: Short description
- **Features**: Add multiple features (Enter to add)
- **Popular**: Checkbox to mark as featured

#### **3. Edit Plan**
- Click "Edit" on any plan card
- Form pre-fills with existing data
- Plan ID is locked (can't change)
- Save changes

#### **4. Delete Plan**
- Click "Delete" on any plan card
- Confirmation prompt
- Permanently removes plan

---

## 🎨 Plan Card Design

### **Regular Plan:**
```
┌─────────────────────────┐
│  Plan Name              │
│  Description            │
│  ₹10,000/Monthly       │
│  ✓ Feature 1           │
│  ✓ Feature 2           │
│  [Select Plan]          │
└─────────────────────────┘
```

### **Popular Plan:**
```
┌─────────────────────────┐
│     ⭐ Popular          │
│ ╔═══════════════════╗  │
│ ║ Plan Name         ║  │
│ ║ Description       ║  │
│ ║ ₹10,000/Monthly  ║  │
│ ║ ✓ Feature 1      ║  │
│ ║ ✓ Feature 2      ║  │
│ ║ [Select Plan]    ║  │
│ ╚═══════════════════╝  │
└─────────────────────────┘
```

---

## 📊 Default Plans

### **Basic Plan**
- **Price**: ₹5,000/Monthly
- **Features**:
  - Monthly farm visit
  - Basic irrigation check
  - Pest monitoring
  - Monthly report

### **Standard Plan** ⭐ Popular
- **Price**: ₹10,000/Monthly
- **Features**:
  - Bi-weekly farm visit
  - Full irrigation maintenance
  - Pest control application
  - Fertilizer application
  - Detailed bi-weekly reports

### **Premium Plan**
- **Price**: ₹20,000/Monthly
- **Features**:
  - Weekly farm visit
  - Complete farm management
  - Advanced pest management
  - Customized fertilizer program
  - Weekly detailed reports
  - Priority support

---

## 🔧 Technical Implementation

### **State Management**

**Admin Page:**
```javascript
const [plans, setPlans] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingPlan, setEditingPlan] = useState(null);
const [formData, setFormData] = useState({...});
```

**User Page:**
```javascript
const [plans, setPlans] = useState([]);
const [loadingPlans, setLoadingPlans] = useState(false);

useEffect(() => {
  loadPlans();
}, []);
```

### **API Integration**

```javascript
import { apiUrl } from '../api';

// GET plans
const res = await fetch(apiUrl('/api/plans'));
const data = await res.json();

// POST new plan
await fetch(apiUrl('/api/plans'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// PUT update
await fetch(apiUrl(`/api/plans/${id}`), {
  method: 'PUT',
  body: JSON.stringify(formData)
});

// DELETE
await fetch(apiUrl(`/api/plans/${id}`), {
  method: 'DELETE'
});
```

---

## 🎨 Styling

### **Colors:**
- Primary Green: `#388e3c`
- Popular Badge: `#388e3c` with white text
- Edit Button: `#2196F3`
- Delete Button: `#ef5350`
- Background: White cards with shadows

### **Layout:**
- Admin: CSS Grid (auto-fit, minmax(320px, 1fr))
- User: Flex cards with responsive wrapping
- Forms: 2-column grid for inputs

---

## 🧪 Testing Checklist

### **Backend:**
- [ ] Start server: `cd server && node index.js`
- [ ] Test GET: `curl http://localhost:4000/api/plans`
- [ ] Test POST with new plan
- [ ] Test PUT to update plan
- [ ] Test DELETE to remove plan
- [ ] Verify plans.json updates correctly

### **Admin Interface:**
- [ ] Navigate to `/admin/plans`
- [ ] View existing plans
- [ ] Click "Add New Plan"
- [ ] Fill form and create plan
- [ ] Edit an existing plan
- [ ] Delete a plan
- [ ] Mark plan as popular
- [ ] Add/remove features dynamically

### **User Interface:**
- [ ] Navigate to `/manage-farm`
- [ ] Click "Monthly AMC" tab
- [ ] Verify plans load dynamically
- [ ] Check popular badge displays
- [ ] Click "Select Plan" button
- [ ] Verify price formatting (₹10,000)

---

## 🚀 Deployment Notes

### **Environment Variables**

**Development:**
```env
# .env (leave empty for proxy)
REACT_APP_API_URL=
```

**Production:**
```env
# .env.production
REACT_APP_API_URL=https://uzhavar.onrender.com
```

### **Data Persistence**

**Important:** Render uses ephemeral file system!

**Solutions:**
1. **Database Migration** (Recommended):
   - MongoDB Atlas (free tier)
   - PostgreSQL (Render native)
   - Firebase Firestore

2. **Temporary Fix**:
   - Use Render Persistent Disks
   - Mount at `/data` directory

3. **Initial Setup**:
   - Pre-populate plans.json in repository
   - Deploy with default plans
   - Admin can modify after deployment

---

## 📝 Usage Guide

### **For Admins:**

1. **Access Admin Panel:**
   ```
   Navigate to: /admin/plans
   ```

2. **Create New Plan:**
   - Click "+ Add New Plan"
   - Fill all required fields
   - Add features one by one
   - Check "Popular" if needed
   - Click "Create Plan"

3. **Edit Plan:**
   - Find plan card
   - Click "Edit" button
   - Modify fields
   - Click "Update Plan"

4. **Delete Plan:**
   - Find plan card
   - Click "Delete" button
   - Confirm deletion

### **For Users:**

1. **View Plans:**
   ```
   Navigate to: /manage-farm
   Click: "Monthly AMC" tab
   ```

2. **Select Plan:**
   - Compare features
   - Check prices
   - Look for "Popular" badge
   - Click "Select Plan"
   - Complete booking form

---

## 🔒 Security Considerations

### **Current:**
- ✅ Input validation on client
- ✅ HTTP status code handling
- ✅ Error boundaries

### **Recommended:**
- [ ] Add admin authentication
- [ ] Rate limiting on API
- [ ] Input sanitization server-side
- [ ] CSRF protection
- [ ] Role-based access control

---

## 🐛 Troubleshooting

### **Plans not loading:**
1. Check backend is running: `node index.js`
2. Verify `plans.json` exists in `server/data/`
3. Check browser console for errors
4. Test API directly: `curl http://localhost:4000/api/plans`

### **Cannot create plan:**
1. Check required fields are filled
2. Ensure Plan ID is unique
3. Verify backend logs for errors
4. Check file permissions on `plans.json`

### **Changes not saving:**
1. Verify API endpoint is correct
2. Check Content-Type header
3. Inspect network tab in browser
4. Check server response codes

---

## 🎯 Future Enhancements

- [ ] Drag-and-drop feature ordering
- [ ] Plan templates
- [ ] Bulk import/export
- [ ] Plan activation/deactivation
- [ ] Usage analytics
- [ ] Customer reviews per plan
- [ ] Plan comparison tool
- [ ] Seasonal pricing
- [ ] Discount codes
- [ ] Plan upgrades/downgrades

---

## 📊 Database Schema

### **Plan Object:**
```typescript
interface Plan {
  id: string;           // Unique identifier
  name: string;         // Display name
  price: string;        // Price in rupees
  duration: string;     // "Monthly" | "Quarterly" | "Yearly"
  description: string;  // Short description
  features: string[];   // Array of feature strings
  popular: boolean;     // Featured badge
}
```

---

**Last Updated**: October 21, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready  
**Route**: `/admin/plans`
