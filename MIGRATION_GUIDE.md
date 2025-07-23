# Data Migration Guide

## 🔄 Migrating from localStorage to Firebase

When transitioning from the hardcoded authentication to Google Auth, existing component data needs to be preserved.

### Automatic Migration

The system includes automatic migration of existing localStorage data:

1. **Data Preservation**: All existing components, PCBs, and systems are preserved
2. **Role Assignment**: Existing users need to sign in with Google and get role assignments
3. **Seamless Transition**: No data loss during authentication upgrade

### Manual Backup (Recommended)

Before enabling Firebase Auth, create a backup:

```javascript
// Run this in browser console to backup data
const backup = {
    components: JSON.parse(localStorage.getItem('kinben-components') || '[]'),
    pcbs: JSON.parse(localStorage.getItem('kinben-pcbs') || '[]'), 
    systems: JSON.parse(localStorage.getItem('kinben-systems') || '[]'),
    vendors: JSON.parse(localStorage.getItem('kinben-vendors') || '[]'),
    timestamp: new Date().toISOString()
};

// Download backup
const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `kinben-backup-${new Date().toISOString().split('T')[0]}.json`;
a.click();
```

### Restore if Needed

If data restoration is needed:

1. Import the backup JSON file
2. Run the restoration script in browser console
3. Verify data integrity

### Rollback Plan

If issues occur, you can temporarily revert:

1. Replace Firebase auth functions with original hardcoded auth
2. Restore from backup if necessary
3. Fix issues and re-deploy

The modular approach ensures easy rollback if needed.