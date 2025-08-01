# 🤖 AGENT TASK LIST - MANAS VISION IMPLEMENTATION
## 📋 SUPREME DIRECTIVE: ZERO DEFECT DEVELOPMENT

**MANDATORY READ**: This document is the **PRIME DIRECTIVE** for all AI agents working on Manas Vision implementation. **FOLLOW EXACTLY AS WRITTEN**.

---

## 🚨 CRITICAL OPERATING PRINCIPLES

### **🔒 RELIABILITY PROTOCOL**
1. **NEVER modify code without first reading the entire relevant section**
2. **ALWAYS backup existing functionality before changes**
3. **MANDATORY testing after every single change**
4. **ZERO tolerance for breaking existing features**
5. **Each task MUST be completed and verified before proceeding**

### **⚡ EFFICIENCY PROTOCOL**
1. **Focus on ONE task at a time - no parallel execution**
2. **Use minimal context - only what's needed for current task**
3. **REUSE existing Papa Parse BOM import - DO NOT rebuild**
4. **Extend existing patterns and functions where possible**
5. **No refactoring unless explicitly required**

### **🎯 QUALITY ASSURANCE PROTOCOL**
1. **Every task requires validation checkpoint**
2. **Test in browser after each modification**
3. **Verify CSV integration remains functional**
4. **Check mobile responsiveness**
5. **Confirm no JavaScript console errors**

### **📁 REPOSITORY ORGANIZATION PROTOCOL**
1. **ZERO new documentation files in root directory**
2. **Minimal documentation overhead - combine related tasks**
3. **Use code comments for minor changes tracking**
4. **Only create `.agent-work/phase-X-summary.md` for major milestones**
5. **Keep root directory clean and minimal**

---

## 📊 PHASE EXECUTION ORDER

**⚠️ CRITICAL**: Execute phases sequentially. **DO NOT** skip ahead or work on multiple phases simultaneously.

---

## 🔍 PHASE 0: FOUNDATION ASSESSMENT
**Duration**: 1 session  
**Status**: ✅ COMPLETED (2025-07-31)  
**Priority**: CRITICAL - Must complete before any development

### **TASK 0.1**: CODEBASE AUDIT
**Context Files**: `KPN_System_Workbook.html` (Assembly tab section only)
**Objective**: Document current Assembly tab structure and functionality

**Agent Instructions**:
1. Read lines 800-1200 of `KPN_System_Workbook.html` (approximate Assembly section)
2. Identify all Assembly-related HTML elements and JavaScript functions
3. Map current data flow: Component selection → BOM building → Assembly creation
4. Document in `.agent-work/task-0.1-audit.md` (NOT in root directory)

**Success Criteria**:
- [x] Complete code section mapping documented in `.agent-work/`
- [x] All assembly functions identified and documented
- [x] Data flow diagram created
- [x] No modifications made - ASSESSMENT ONLY

**Validation**: 
```bash
# No code changes - documentation only
# Verify: Assembly tab still works exactly as before
```

### **TASK 0.2**: BOM CSV SYSTEM ANALYSIS  
**Context Files**: BOM CSV import code section
**Objective**: Document the recently implemented BOM CSV functionality

**Agent Instructions**:
1. Locate Papa Parse integration code in `KPN_System_Workbook.html`
2. Analyze BOM CSV import workflow and validation logic
3. Test with sample BOM CSV file
4. Document findings in `.agent-work/task-0.2-bom-analysis.md`

**Success Criteria**:
- [x] CSV import process fully documented
- [x] Test CSV file created and import verified
- [x] KPN validation logic understood
- [x] Error scenarios tested and documented

### **TASK 0.3**: SYSTEM INTEGRATION AUDIT
**Context Files**: Systems tab section, Component linking code
**Objective**: Understand how Assemblies integrate with Systems and Components

**Agent Instructions**:
1. Read Systems tab code section
2. Trace how assemblies link to components (KPN references)
3. Examine localStorage data structure for assemblies
4. Document in `.agent-work/task-0.3-integration.md`

**Success Criteria**:
- [x] Component referencing mechanism documented
- [x] System integration points identified
- [x] Data storage patterns understood
- [x] CSV sync verification completed

---

## 🎨 PHASE 1: ASSEMBLY TYPE ARCHITECTURE
**Duration**: 1 session  
**Status**: ✅ COMPLETED (2025-07-31)  
**Priority**: HIGH

### **TASK 1.1**: ADD ASSEMBLY TYPE SELECTOR
**Context Files**: Assembly form HTML section (from Phase 0 mapping)
**Objective**: Add dropdown for PCB Assembly vs Cable Assembly types

**Prerequisites**: ✅ Phase 0 completed and validated

**Agent Instructions**:
1. Locate assembly form section identified in Phase 0
2. Add assembly type dropdown after assembly name field
3. Use existing form styling patterns
4. Test dropdown functionality
5. Document changes in `.agent-work/task-1.1-type-selector.md`

**Code Specifications**:
```html
<!-- Add after assembly name field -->
<div class="form-group">
    <label for="assemblyType">Assembly Type <span class="text-danger">*</span></label>
    <select id="assemblyType" class="form-control" required>
        <option value="pcb">PCB Assembly</option>
        <option value="cable">Cable Assembly</option>
    </select>
</div>
```

**Success Criteria**:
- [x] Dropdown appears in assembly form
- [x] Selection triggers appropriate UI changes  
- [x] Existing assemblies continue to work
- [x] Form validation includes assembly type
- [x] Mobile view displays correctly

### **TASK 1.2**: IMPLEMENT TYPE-SPECIFIC FIELDS
**Context Files**: Assembly form section, CSS styling
**Objective**: Show/hide relevant fields based on assembly type selection

**Agent Instructions**:
1. Create cable assembly specific fields (hidden by default)
2. Add JavaScript to show/hide fields based on type selection
3. Maintain all existing PCB assembly functionality
4. Test field switching without data loss
5. Document in `.agent-work/task-1.2-specific-fields.md`

**Code Specifications**:
```html
<!-- Cable Assembly specific fields -->
<div id="cableFields" class="cable-assembly-fields" style="display: none;">
    <div class="form-group">
        <label for="cableLength">Cable Length (mm)</label>
        <input type="number" id="cableLength" class="form-control">
    </div>
    <div class="form-group">
        <label for="cableType">Cable Type</label>
        <input type="text" id="cableType" class="form-control">
    </div>
</div>
```

**Success Criteria**:
- [x] PCB Assembly: All existing fields visible and functional
- [x] Cable Assembly: Cable-specific fields appear when selected
- [x] Field switching works smoothly without data loss
- [x] Validation adjusts correctly per type
- [x] CSS styling consistent with existing design

### **TASK 1.3**: EXTEND DATA MODEL
**Context Files**: JavaScript data structures, localStorage handling
**Objective**: Update assembly objects to include type and type-specific data

**Agent Instructions**:
1. Locate current assembly object creation code
2. Add `assemblyType` field to assembly objects
3. Create migration logic for existing assemblies (default to PCB)
4. Test data persistence and retrieval
5. Document in `.agent-work/task-1.3-data-model.md`

**Code Specifications**:
```javascript
// Updated assembly object structure
const assembly = {
    id: generateId(),
    name: assemblyName,
    type: assemblyType, // 'pcb' or 'cable'
    version: version,
    description: description,
    status: status,
    // Type-specific data
    pcbData: assemblyType === 'pcb' ? {
        pcbId: selectedPCB,
        bom: bomItems
    } : null,
    cableData: assemblyType === 'cable' ? {
        length: cableLength,
        cableType: cableType,
        connectors: connectorList
    } : null
};
```

**Success Criteria**:
- [x] New assembly objects include type field
- [x] Type-specific data stored appropriately
- [x] Existing assemblies migrated successfully
- [x] CSV sync includes new fields
- [x] Data integrity maintained throughout

### **TASK 1.4**: ENHANCE BOM CSV IMPORT
**Context Files**: Papa Parse integration, CSV validation code
**Objective**: Extend CSV import to handle cable assembly formats

**Agent Instructions**:
1. Locate existing Papa Parse CSV import code
2. Add type-specific validation logic
3. Create template generation for both assembly types
4. Test with sample cable assembly CSV
5. Document in `.agent-work/task-1.4-csv-import.md`

**Success Criteria**:
- [x] PCB Assembly CSV import unchanged and functional
- [x] Cable Assembly CSV import working with appropriate validation
- [x] Template generation works for both types
- [x] Error messages clear and type-specific
- [x] Import preview shows relevant columns per type

---

## 🏗️ PHASE 2: HIERARCHICAL BOM STRUCTURE
**Duration**: 1 session  
**Status**: ✅ COMPLETED (2025-07-31)  
**Priority**: HIGH

### **TASK 2.1**: IMPLEMENT CHILD VIEW BOM
**Prerequisites**: ✅ Phase 1 completed and validated
**Objective**: Create expandable child view for PCB-level components
**Documentation**: `.agent-work/task-2.1-child-view.md`

**Success Criteria**:
- [x] Expandable assembly rows with toggle buttons implemented
- [x] Card-based component display with responsive grid layout
- [x] Rich component information display (KPN, RefDes, quantity, notes)
- [x] CSS styling integrated with existing design system

### **TASK 2.2**: IMPLEMENT MOTHER VIEW COMPONENTS  
**Objective**: Add manual component entry at assembly level (enclosures, screws, standoffs)
**Documentation**: `.agent-work/task-2.2-mother-view.md`

**Success Criteria**:
- [x] UI section for assembly-level component entry added
- [x] Mother components stored separately from child BOM
- [x] Component type categorization (enclosure, hardware, mounting, cable, other)
- [x] Mother components visible in assembly detail view
- [x] Quantity rollups include both mother and child components
- [x] Form validation and state management integrated

### **TASK 2.3**: BUILD QUANTITY CALCULATION ENGINE
**Objective**: Implement assembly quantity × component quantity calculations
**Documentation**: `.agent-work/task-2.3-calculations.md`

**Success Criteria**:
- [x] Modular calculation engine with dedicated helper functions
- [x] Assembly quantity × component quantity multiplication working
- [x] Calculations include both child (BOM) and mother components
- [x] UI displays calculated quantities in assembly detail views
- [x] System-level aggregation showing consolidated component totals
- [x] Real-time updates when quantities change
- [x] Calculation logic ready for reuse in later phases

### **TASK 2.4**: CREATE QUANTITY ROLLUP DISPLAYS
**Objective**: Show assembly-level statistics and component summaries
**Documentation**: `.agent-work/task-2.4-rollups.md`

**Success Criteria**:
- [x] Assembly-level quantity summaries with component type breakdowns
- [x] System-level consolidated views showing cross-assembly component totals
- [x] Purchase planning displays with sorted components by usage
- [x] Visual quantity rollups at multiple hierarchy levels

---

## 🏢 PHASE 3: SYSTEMS MANAGEMENT OVERHAUL
**Duration**: 2-3 weeks  
**Status**: 🟡 READY TO BEGIN (Phase 2 completed)  
**Priority**: HIGH

### **TASK 3.1**: REDESIGN SYSTEMS UI
**Prerequisites**: ✅ Phase 2 completed and validated
**Status**: ✅ COMPLETED (2025-07-31)
**Documentation**: `.agent-work/task-3.1-systems-ui.md`

**Success Criteria**:
- [x] Assembly quantity management enhanced at system level
- [x] System item addition improved with better UX
- [x] System table enhanced with bulk operation capabilities
- [x] Phase 2 quantity calculation engine fully leveraged
- [x] All existing system features preserved and functional

### **TASK 3.2**: IMPLEMENT SYSTEM-LEVEL QUANTITY MANAGEMENT
**Status**: ✅ COMPLETED (2025-07-31)
**Documentation**: `.agent-work/task-3.2-quantities.md`

**Success Criteria**:
- [x] Cross-system quantity analysis shows assembly usage patterns
- [x] Live persistence options available for immediate saves
- [x] Multi-system impact visible before committing changes
- [x] Inline quantity editing with proper validation
- [x] System-wide quantity dashboard implemented

### **TASK 3.3**: ASSEMBLY MANAGEMENT IN SYSTEMS
**Documentation**: `.agent-work/task-3.3-assembly-mgmt.md`

### **TASK 3.4**: SYSTEM BOM ROLLUP CALCULATIONS
**Status**: ✅ COMPLETED (2025-08-01)
**Documentation**: `.agent-work/task-3.4-system-bom.md`

**Success Criteria**:
- [x] Enhanced recursive system BOM calculation with nested system support
- [x] Comprehensive system BOM export with component traceability
- [x] System BOM preview interface with real-time generation
- [x] Cross-system BOM analytics with component reuse analysis
- [x] Purchase BOM generator with vendor organization
- [x] CSV export integration matching existing formats
- [x] Circular reference prevention for system-of-systems
- [x] Zero breaking changes to existing functionality

---

## 🛒 PHASE 4: CART & CONSOLIDATED BOM
**Duration**: 1-2 weeks  
**Status**: 🔴 BLOCKED (Requires Phase 3 completion)  
**Priority**: HIGH

### **TASK 4.1**: BUILD SYSTEM SELECTION INTERFACE
**Prerequisites**: ✅ Phase 3 completed and validated
**Documentation**: `.agent-work/task-4.1-cart-interface.md`

### **TASK 4.2**: MULTI-SYSTEM QUANTITY MANAGEMENT
**Documentation**: `.agent-work/task-4.2-multi-quantities.md`

### **TASK 4.3**: CONSOLIDATED BOM GENERATOR
**Documentation**: `.agent-work/task-4.3-consolidated-bom.md`

### **TASK 4.4**: STRUCTURED BOM EXPORT
**Documentation**: `.agent-work/task-4.4-bom-export.md`

---

## 🌐 PHASE 5: SYSTEM-OF-SYSTEMS
**Duration**: 1-2 weeks  
**Status**: 🔴 BLOCKED (Requires Phase 4 completion)  
**Priority**: MEDIUM

### **TASK 5.1**: ENABLE SYSTEM-IN-SYSTEM SELECTION
**Prerequisites**: ✅ Phase 4 completed and validated
**Documentation**: `.agent-work/task-5.1-nested-systems.md`

### **TASK 5.2**: MULTI-LEVEL QUANTITY CASCADING
**Documentation**: `.agent-work/task-5.2-cascading.md`

### **TASK 5.3**: PREVENT CIRCULAR REFERENCES
**Documentation**: `.agent-work/task-5.3-circular-prevention.md`

### **TASK 5.4**: ADVANCED BOM CONSOLIDATION
**Documentation**: `.agent-work/task-5.4-advanced-consolidation.md`

---

## 🔒 MANDATORY VALIDATION PROTOCOLS

### **PER-TASK VALIDATION CHECKLIST**
**Execute after EVERY task completion**:

```bash
# 1. FUNCTIONALITY CHECK
✅ Open KPN_System_Workbook.html in browser
✅ Navigate to affected tabs
✅ Test modified functionality
✅ Verify no console errors
✅ Check mobile responsiveness

# 2. INTEGRATION CHECK  
✅ Test CSV import/export still works
✅ Verify component linking functional
✅ Check system-assembly relationships
✅ Confirm data persistence (localStorage)

# 3. REGRESSION CHECK
✅ Test unmodified features still work
✅ Verify existing data not corrupted
✅ Check all tabs navigate properly
✅ Confirm UI styling unchanged where not modified

# 4. DATA INTEGRITY CHECK
✅ Create test data for new features
✅ Export and re-import data
✅ Verify all relationships maintained
✅ Check edge cases and error handling
```

### **DOCUMENTATION PROTOCOL**
1. **Per-Task Documentation**: Only in `.agent-work/task-X.Y-name.md`
2. **No Root Directory Files**: Never create files in project root
3. **Minimal Documentation**: Only essential technical notes
4. **Code Snippets**: Before/after code changes only
5. **No User Guides**: Focus on technical implementation only

### **PHASE COMPLETION PROTOCOL**
1. **Phase Summary**: Create `.agent-work/phase-X-summary.md` when all phase tasks complete
2. **User Verification**: Wait for user confirmation that phase is working correctly
3. **Git Commit**: After verification, commit changes to `assembly-bom-import-v2` branch
4. **Commit Message Format**: `📋 Complete [Phase Name] - [Brief description of features]`
5. **Branch Management**: Always commit to `assembly-bom-import-v2` branch, never `master`

### **ROLLBACK PROTOCOL**
**If ANY validation fails**:

1. **STOP all development immediately**
2. **Document the failure in `.agent-work/rollback-log.md`**
3. **Revert to last known good state**
4. **Analyze root cause**
5. **Fix issue before proceeding**
6. **Re-run full validation**

---

## 🚨 CRITICAL SUCCESS METRICS

### **ZERO TOLERANCE FAILURES**
- **Breaking existing functionality**: IMMEDIATE ROLLBACK
- **Data corruption or loss**: IMMEDIATE ROLLBACK  
- **Console errors in production**: IMMEDIATE FIX REQUIRED
- **Mobile view breaking**: FIX WITHIN SAME SESSION
- **CSV integration failure**: IMMEDIATE ROLLBACK
- **Creating root directory files**: IMMEDIATE DELETION

### **PERFORMANCE REQUIREMENTS**
- **Page load time**: < 3 seconds
- **Tab switching**: < 1 second
- **BOM calculations**: < 2 seconds for 1000 components
- **CSV import**: < 5 seconds for 500 component BOM
- **Export generation**: < 10 seconds for complex system

---

## 🎯 AGENT EXECUTION COMMANDS

### **STARTING A TASK**
```
I am starting TASK X.Y: [Task Name]
I have read the context files and understand the requirements.
I will document my work in .agent-work/task-X.Y-notes.md
I will now implement the specified functionality.
```

### **COMPLETING A TASK**
```
TASK X.Y COMPLETED: [Task Name]
✅ Implementation complete
✅ Validation checklist passed
✅ Documentation saved in .agent-work/task-X.Y-notes.md
✅ Master task list updated with completion status
✅ Ready for next task
```

### **COMPLETING A PHASE**
```
PHASE X COMPLETED: [Phase Name]
✅ All phase tasks completed successfully
✅ Phase summary documentation created in .agent-work/phase-X-summary.md
✅ Master task list updated with phase completion status
✅ User verification received confirming successful completion
✅ Changes committed to assembly-bom-import-v2 branch with descriptive commit message
✅ Ready for next phase
```

### **REPORTING ISSUES**
```
TASK X.Y BLOCKED: [Issue Description]
Problem: [Specific problem encountered]
Impact: [How this affects the task]
Documentation: .agent-work/task-X.Y-blocked.md
Recommendation: [Suggested solution or escalation]
```

---

**📅 Document Version**: 1.0  
**🔄 Last Updated**: 2025-07-31  
**👤 Created By**: Manas Vision Implementation Team  
**🎯 Status**: ACTIVE - READY FOR AGENT EXECUTION

**🚨 REMEMBER: This is not just a task list - it's the LAW for reliable, efficient, bug-free development. Follow it exactly.**

**📁 ORGANIZATION RULE: All agent work files go in `.agent-work/` folder. NEVER create files in project root.**