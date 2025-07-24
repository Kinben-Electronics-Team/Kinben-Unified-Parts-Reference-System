# Authentication Guide

## 🔐 Local User Management System

The KPN System uses a local user management system with localStorage persistence.

## 🎯 Default Login

**Administrator Account:**
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin (full access)

## 👥 User Roles

### 🔧 Admin Users
**Permissions:**
- ✅ Create, edit, archive, and **delete** components
- ✅ Create and manage PCBs and systems  
- ✅ **Manage users** (add, edit, delete team users)
- ✅ Update their own profile
- ✅ All system configuration access

### 👤 Team Users  
**Permissions:**
- ✅ Create, edit, and **archive** components (cannot delete)
- ✅ Create and manage PCBs and systems
- ✅ Update their own profile only
- ✅ Access vendor configuration

## ⚙️ User Management

### Adding New Users (Admin Only)

1. Login as admin
2. Go to **Config** tab
3. Find **User Management** section
4. Fill out the **Add New User** form:
   - Username (unique, no spaces)
   - Display Name 
   - Password (minimum 6 characters)
   - Role (Team or Admin)
5. Click **Add User**

### User Limits
- **Maximum 6 users total** (1 admin + 5 others)
- Admin account cannot be deleted (protected)
- All users stored in browser localStorage

### Profile Management

**Admin Users:**
- Can edit any user's display name
- Can delete team users
- Can update their own profile

**Team Users:**
- Can only update their own display name and password
- Must enter current password to make changes

## 🔒 Security Notes

- User data stored in browser localStorage
- Passwords stored in plain text (local system only)
- No network authentication required
- Role-based UI access control
- Input validation and error handling

## 🛠️ Development

For development, you can manage users programmatically:

```javascript
// View current users
console.log(JSON.parse(localStorage.getItem('kpn_users')));

// Reset to default admin only
localStorage.setItem('kpn_users', JSON.stringify({
    'admin': { 
        password: 'admin123', 
        role: 'admin', 
        email: 'admin@kinben.local', 
        displayName: 'Administrator',
        created: new Date().toISOString()
    }
}));
```

## 🔄 Migration from Previous Versions

The system automatically migrates from the old hardcoded team/admin accounts to the new user management system while preserving all component data.