# System Architecture & Technical Specifications

> **Architecture Reference**: Detailed specifications for frontend stack, Apple HIG mobile layout system, backend API design, authentication flow, and route protection.

---

## 1. System Overview

```
                                  [ Internet / Users ]
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     │ HTTPS (Port 443)                         │
                     ▼                                          ▼
      [ getashokaazjewels.shop ]                 [ getashokaazjewels.shop/api/* ]
                     │                                          │
                     ▼                                          ▼
         [ Nginx 1.24 (Reverse Proxy) ] ──────────────► [ PM2: global-exim ]
                     │                                   (Node.js / Express :3004)
                     ▼                                          │
        [ Static Web Root: /dist ]                              ▼
     (React 19 + Vite + Tailwind CSS 4)                [ MySQL Database ]
                                                       (global_exim :3306)
```

---

## 2. Frontend Architecture

- **Core Framework**: React 19 + Vite 7 + React Router v7 (`react-router-dom`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`) + Redux Persist + RTK Query
  - `authSlice.js`: Authentication state, user object, token in `localStorage`, `isAdmin` flag
  - `cartSlice.js`: Shopping cart state, slide-over drawer toggle, local items array, total
  - `productsApi.js`: RTK Query endpoints for `/api/products` and `/api/products/featured`
  - `adminApi.js`: RTK Query endpoints for categories, users, orders, admin analytics
- **Styling & Design System**: Tailwind CSS 4 + Apple HIG (Human Interface Guidelines)
  - Color Palette:
    - Deep Luxury Teal Base: `#081E23` / `#0A2830`
    - Vivid Teal Accent: `#25CCC8`
    - Royal Gold Bright: `#E0C280` / `#C8A96E`
    - Deep Burgundy: `#5C1A28`
  - Glassmorphic Utilities: `.apple-glass`, `.apple-glass-card`, `.apple-press` (scale 0.97 tactile feedback)
  - Layout Geometry: `min-h-[44px]` touch targets, `rounded-2xl` cards, safe bottom inset padding (`pb-safe`)

### Mobile-First Navigation Architecture
- **Desktop Navbar (`Navbar.jsx`)**:
  - Logo on left
  - Navigation links: `HOME`, `PRODUCTS`, `ABOUT`, `CONTACT`
  - `ADMIN` button: **Strictly conditional** (`isUserAdmin = Boolean(token && user && (isAdmin || user.role === 'admin'))`)
  - Cart toggle button with live item count badge
  - User profile / Login pill
- **Mobile Fixed Bottom Dock (`Navbar.jsx`)**:
  - `position: fixed !important; bottom: 0 !important; z-index: 99999 !important;`
  - 5 Primary Dock Items:
    1. **Home** (`/`)
    2. **Products** (`/products`)
    3. **Cart** (Opens slide-over cart with live badge)
    4. **Account** (`/profile` or `/login`)
    5. **Explore** (Opens Apple HIG Bottom Action Sheet)
  - **Top Mobile Header**: Cleaned up — hamburger button and duplicate cart button removed on mobile screens.

---

## 3. Route Protection & Security Guards

### `AdminRoute.jsx`
All admin management routes in `App.jsx` are wrapped inside the `<AdminRoute>` security component:
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/users`
- `/admin/categories`
- `/admin/contacts`
- `/admin/payments`
- `/admin/analytics`
- `/admin/settings`

**Guard Logic**:
1. If no `token` exists in `localStorage`: Immediately redirects to `/login` with `replace: true`.
2. If `token` exists but profile verification is pending: Renders the full-screen loader (`Verifying credentials...`).
3. If user is authenticated but `user.role !== 'admin'`: Redirects to `/login` with unauthorized flag.
4. Only when `token && user && user.role === 'admin'`: Children components are rendered.

### `AdminLayout.jsx`
- Second-tier guard inside the layout: Returns `null` and calls `navigate('/login')` if unauthenticated.
- All hooks (`useState`, `useCallback`, `useLocation`) are declared strictly before any returns to guarantee 100% compliance with React Rules of Hooks (preventing React Error #310).

---

## 4. Backend Architecture

- **Runtime**: Node.js v18+ / Express.js
- **Process Management**: PM2 cluster running under `root` (`global-exim`, port `3004`)
- **Key Middleware**:
  - `helmet`: Secure HTTP headers
  - `cors`: Allowed origins (`*`, preflight caching)
  - `auth`: JWT token verification (`Bearer <token>`) & database user fetching (`req.user = await User.getById(...)`)
  - `adminAuth`: Role verification (`req.user.role === 'admin'`)
- **Controller Layer**:
  - `authController.js`: Registration, login, profile retrieval, profile updates
  - `productController.js`: Product listing, single product, featured products, admin CRUD
  - `categoryController.js`: Category management
  - `orderController.js` & `paymentController.js`: Orders and Razorpay integration
