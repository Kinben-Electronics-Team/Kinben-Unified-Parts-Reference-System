# 📋 Implementation Plan - Manas Vision

## 🎯 Gap Analysis: Current vs Vision

**What Works Now:**
- Basic Assembly tab with manual item entry
- BOM CSV import for assemblies 
- KPN cross-referencing
- Component management system

**Missing for Your Vision:**
- Hierarchical BOM structure (Systems > Assemblies > Components)
- Quantity multiplication through hierarchy
- Cart-like system selection
- Consolidated BOM export
- System-of-Systems capability

## 🚀 Implementation Strategy: 4 Phases

### Phase 1: Enhanced Assembly Management ⭐ (2-3 weeks)
- **Task 1A**: Add assembly types (PCB Assembly, Cable Assembly)
- **Task 1B**: Implement parent-child component view
- **Task 1C**: Add manual component editing within assemblies
- **Task 1D**: Assembly statistics display

### Phase 2: Systems Tab Foundation ⭐ (2-3 weeks)  
- **Task 2A**: Create Systems tab UI
- **Task 2B**: Implement assembly selection for systems
- **Task 2C**: Assembly quantity management in systems
- **Task 2D**: System editing (add/remove assemblies only)

### Phase 3: BOM Calculation Engine ⭐ (2-3 weeks)
- **Task 3A**: Build hierarchical quantity calculation
- **Task 3B**: Create consolidated BOM generator
- **Task 3C**: Implement cart-like system selection
- **Task 3D**: BOM export with structure

### Phase 4: System-of-Systems ⭐ (1-2 weeks)
- **Task 4A**: Enable systems within systems
- **Task 4B**: Multi-level quantity cascading
- **Task 4C**: Advanced BOM consolidation

## 🤖 AI Agent Task Strategy (Low Context)

**Context Minimization Approach:**
1. **Modular Task Files**: Each task references only specific HTML sections
2. **Task Templates**: Standardized instructions for each task type
3. **Reference Sheets**: Single-page summaries for agents
4. **Incremental Builds**: Each task builds on previous without full context

**Sample Task Breakdown:**
```
TASK 1A: Add Assembly Types
- Context: Lines 760-850 of KPN_System_Workbook.html
- Goal: Add dropdown for "PCB Assembly" vs "Cable Assembly"
- Reference: MANAS_VISION.md point 2
- Deliverable: Modified form section only
```