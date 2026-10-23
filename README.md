# 🌟 APNA BRAND — Premium Streetwear E-Commerce Platform

A complete, high-fashion e-commerce platform featuring **Dynamic T-Shirt Color Ambiance**, authentic philosophical streetwear aesthetics, live order tracking, customer authentication, and dedicated administrative studio.

---

## 📁 Project Architecture

```
Tshirts/
├── backend/          # Node.js + Express REST API & MongoDB Database
│   ├── config/       # Database connection config
│   ├── data/         # Fallback JSON storage for products, orders, chats
│   ├── middleware/   # Express logger, error handling
│   ├── models/       # Mongoose Schemas (User, Order)
│   ├── routes/       # API Routes (auth, orders, products, chats, stats)
│   ├── server.js     # Express server entry point
│   └── package.json
│
├── frontend/         # Customer Storefront (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/  # Navbar, HeroBanner, ProductView, CartDrawer, TrackOrderView, etc.
│   │   ├── context/     # ThemeColorContext & CartContext
│   │   ├── data/        # Seeded authentic products
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── adminPanel/       # Store Management & Atmosphere Studio (React + Vite)
    ├── src/
    │   ├── App.jsx   # Product CRUD, Orders fulfillment & Live tracking studio
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

## 🌐 How to Deploy on Render (Step-by-Step)

### Step 1: Deploy Backend (Web Service)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `https://github.com/Kavirawat/apna_brand_Tshirt`.
4. Configure the settings:
   - **Name**: `apna-brand-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `PORT`: `5000` (Render sets its own port automatically, but fallback is good)
   - `MONGODB_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *Your secret JWT key*
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Wait for the build to finish.
7. Note down your backend URL (e.g. `https://apna-brand-backend.onrender.com`).

---

### Step 2: Deploy Frontend Store (Static Site)
1. On Render, click **New +** ➔ **Static Site**.
2. Connect the same repository.
3. Configure the settings:
   - **Name**: `apna-brand-store`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - Add a rewrite rule for Single Page Application routing:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
5. Click **Create Static Site**.

---

### Step 3: Deploy Admin Panel (Static Site)
1. On Render, click **New +** ➔ **Static Site**.
2. Connect the same repository.
3. Configure the settings:
   - **Name**: `apna-brand-admin`
   - **Root Directory**: `adminPanel`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - Add a rewrite rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
5. Click **Create Static Site**.
