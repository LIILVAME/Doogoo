## 🐛 Bug Fixes

This PR resolves critical Vue.js runtime errors preventing the application from functioning correctly.

### Changes Made

#### `src/pages/BiensPage.vue`
- ✅ Fixed missing component import: Changed `DeleteConfirmationModal` to `ConfirmModal`
- ✅ Fixed PropertyModal bindings: Replaced undefined `modalProp` and `modals.propertyModal` with existing reactive refs
- ✅ Added missing `handlePropertySaved` method to handle save events from PropertyModal
- ✅ Fixed modal open state to use `isAddModalOpen || isEditModalOpen`

#### `src/layouts/AuthLayout.vue`
- ✅ Wrapped all template content in a single root `<div>` to fix Vue Transition warning
- ✅ Resolves: "Component inside `<Transition>` renders non-element root node that cannot be animated"

### Errors Resolved

**Before:**
```
[Vue warn]: Failed to resolve component: ConfirmModal
[Vue warn]: Property "modalProp" was accessed during render but is not defined
[Vue warn]: Property "modals" was accessed during render but is not defined
TypeError: Cannot read properties of undefined (reading 'propertyModal')
[Vue warn]: Component inside <Transition> renders non-element root node
```

**After:**
All console errors cleared ✅

### Testing Checklist
- [x] No console errors on BiensPage
- [x] No console errors on Login/Signup pages  
- [x] Transition animations work correctly
- [x] PropertyModal opens and closes properly
- [x] ConfirmModal displays for delete confirmations
- [x] All modal functionality preserved

### Impact
- 🟢 **Low risk:** Only fixes existing bugs
- 🟢 **No breaking changes**
- 🟢 **Improves stability and UX**

### Related Issues
Closes #vue-warnings
