# 🌟 APNA BRAND — Premium Streetwear E-Commerce Platform

A complete, high-fashion e-commerce platform featuring **Dynamic T-Shirt Color Ambiance**, authentic philosophical streetwear aesthetics, live order tracking, customer authentication, and dedicated administrative studio.

---

## 🔗 Live Deployed URLs

| Service | Live Deployment URL | Description |
| :--- | :--- | :--- |
| 🛍️ **Customer Storefront** | [https://apna-brand-tshirt-frontend.onrender.com](https://apna-brand-tshirt-frontend.onrender.com) | Customer shopping portal, cart, live tracking & authentication |
| ⚙️ **Admin Portal & Studio** | [https://apna-brand-tshirt-admin.onrender.com](https://apna-brand-tshirt-admin.onrender.com) | Superuser control panel for catalog, drops, tracking & chat desk |
| ⚡ **Backend REST API** | [https://apna-brand-tshirt.onrender.com](https://apna-brand-tshirt.onrender.com) | Node.js + Express API server with resilient dual-engine data storage |

> **Admin Access Credentials**:
> - **Username**: `admin`
> - **Password**: `admin`
> - *(Or click the **"⚡ 1-Click Superuser Access"** button on the login screen)*

---

## 📁 Project Architecture

```
Tshirts/
├── backend/          # Node.js + Express REST API & MongoDB Database
│   ├── config/       # Database connection config
│   ├── data/         # Fallback JSON storage for products, orders, chats, users
│   ├── middleware/   # Express logger, error handling
│   ├── models/       # Mongoose Schemas (User, Order)
│   ├── routes/       # API Routes (auth, orders, products, chats, stats)
│   ├── server.js     # Express server entry point
│   └── package.json
│
├── frontend/         # Customer Storefront (React + Vite + Tailwind CSS)
│   ├── public/       # Static assets and SPA _redirects
│   ├── src/
│   │   ├── components/  # Navbar, HeroBanner, ProductView, CartDrawer, TrackOrderView, etc.
│   │   ├── context/     # ThemeColorContext & CartContext
│   │   ├── data/        # Seeded authentic products
│   │   ├── config.js    # API endpoints & environment config
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── adminPanel/       # Store Management & Atmosphere Studio (React + Vite)
    ├── public/       # Brand logo and SPA _redirects
    ├── src/
    │   ├── App.jsx   # Product CRUD, Orders fulfillment & Live tracking studio
    │   ├── config.js # Storefront URL & API endpoints
    │   └── index.css
    └── package.json
```

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm --prefix adminPanel install
```

### 2. Environment Variables
Create a `.env` file in `backend/` (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Run Applications
- **Backend Server**: `npm --prefix backend run dev` (Runs on http://localhost:5000)
- **Frontend Store**: `npm --prefix frontend run dev` (Runs on http://localhost:5173)
- **Admin Panel**: `npm --prefix adminPanel run dev` (Runs on http://localhost:5174)

---

## 🌐 Deployed Services on Render

### 1. Backend Web Service (`apna-brand-tshirt`)
- **Live URL**: `https://apna-brand-tshirt.onrender.com`
- **Health Check**: `https://apna-brand-tshirt.onrender.com/api/health`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (or `node server.js`)

### 2. Frontend Static Site (`apna-brand-tshirt-frontend`)
- **Live URL**: `https://apna-brand-tshirt-frontend.onrender.com`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Routing**: Handled via `public/_redirects` (`/* /index.html 200`)

### 3. Admin Panel Static Site (`apna-brand-tshirt-admin`)
- **Live URL**: `https://apna-brand-tshirt-admin.onrender.com`
- **Root Directory**: `adminPanel`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Routing**: Handled via `public/_redirects` (`/* /index.html 200`)
