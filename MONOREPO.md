# Kinben Unified Parts Reference System - Monorepo

A modern, modular monorepo architecture for the Kinben Unified Parts Reference System.

## 🏗️ Architecture

This project has been refactored from a single HTML file into a scalable monorepo with the following structure:

```
kinben-unified-parts-reference-system/
├── apps/
│   ├── web/              # Next.js public UI (exact replica of original)
│   └── admin/            # Admin interface (React Admin)
├── packages/
│   ├── shared-types/     # TypeScript interfaces + Zod schemas
│   ├── data-model/       # Data queries + client helpers
│   └── api-functions/    # Firebase Cloud Functions (CRUD endpoints)
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # Workspace definition
├── turbo.json           # Build pipeline configuration
└── tsconfig.json        # Shared TypeScript config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install all dependencies across the monorepo
pnpm install

# Build all packages
pnpm build

# Run the web app in development mode
pnpm web:dev

# Run the admin app in development mode  
pnpm admin:dev
```

## 📦 Packages

### `@kinben/shared-types`
TypeScript interfaces and Zod validation schemas for all data models.

### `@kinben/data-model`
Client-side data management with search, filtering, and statistics.

### `@kinben/api-functions`
Firebase Cloud Functions for backend CRUD operations.

## 🖥️ Applications

### Web App (`apps/web`)
Next.js application that replicates the original UI pixel-for-pixel.

**Features:**
- ✅ Exact visual replica of original Parts list view
- ✅ Tab-based navigation with all 16 component categories
- ✅ Advanced filtering and search
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript throughout

### Admin App (`apps/admin`)
Administrative interface for managing the parts database.

## 🛠️ Development Workflow

### Working on a Single Package

```bash
# Install dependencies for specific package
pnpm install --filter @kinben/web

# Run development server for web app only
pnpm --filter @kinben/web dev

# Build specific package
pnpm --filter @kinben/shared-types build
```

### Building Everything

```bash
# Build all packages in dependency order
pnpm build

# Build and cache with Turbo
turbo run build

# Clean all build artifacts
turbo run clean
```

## 🎯 Visual Parity Achievement

The `apps/web` package demonstrates **exact visual replication** of the original Parts list view:

- **Identical Layout**: Tab-based navigation matches original pixel-for-pixel
- **Component Tables**: Exact table structure for all 16 component categories
- **Filter Controls**: Search and category filtering with original styling
- **Color Scheme**: Preserved Kinben brand colors (#0078d4 primary, gradients)
- **Typography**: Calibri font family maintained
- **Interactive Elements**: Hover effects, button styling, and transitions

## 🔧 Toolchain

- **Node.js** v18 (LTS)
- **TypeScript** v5.x
- **Monorepo**: pnpm workspaces
- **Task runner**: Turborepo v1 for affected builds/tests
- **UI Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS v4 (matching original colors)
- **API**: Firebase Cloud Functions (Node.js 18)
- **Validation**: Zod schemas

## 🧪 Proof of Concept

This refactor demonstrates:

1. **Zero Visual Regression**: The Parts list view looks and behaves identically
2. **Modular Architecture**: Clear separation of concerns across packages
3. **Developer Experience**: VS Code Copilot can work efficiently in isolated packages
4. **Modern Tooling**: TypeScript, React, Tailwind while preserving original UX
5. **Scalability**: Easy to add new features without affecting existing functionality

## 🔄 Legacy Support

The original HTML-based system remains functional:

```bash
# Run legacy system
pnpm legacy:start

# Build legacy system
pnpm legacy:build

# Test legacy system
pnpm legacy:test
```

## 📈 Benefits Achieved

✅ **Faster CI builds** - Only affected packages rebuild  
✅ **Better Copilot support** - Focused context per package  
✅ **Reduced breakage** - Isolated changes  
✅ **Maintained UX** - Pixel-perfect visual preservation  
✅ **Modern codebase** - TypeScript, React, Tailwind  
✅ **Scalable architecture** - Easy to extend and maintain

---

## 🌟 **Original System Still Available**

The original production system remains fully operational at: https://the-clever-studio-f3b16.web.app/

This monorepo provides the foundation for future development while preserving all existing functionality.