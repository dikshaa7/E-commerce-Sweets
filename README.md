# Indian Sweet Savories — Sweets E-commerce Website (MERN Stack)

A full-stack e-commerce platform for selling premium Indian sweets. It includes a professional customer storefront, a complete user account panel, and a feature-rich admin console for managing the entire business.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features Overview](#features-overview)
- [User Storefront Modules](#user-storefront-modules)
- [User Account Panel Modules](#user-account-panel-modules)
- [Admin Panel Modules](#admin-panel-modules)
- [Backend Modules & API](#backend-modules--api)
- [Default Credentials](#default-credentials)
- [Seed Data](#seed-data)
- [Prerequisites](#prerequisites)
- [Installation & How to Run](#installation--how-to-run)
- [Environment Variables](#environment-variables)
- [Application URLs](#application-urls)
---

## Project Overview

**Indian Sweet Savories** is a MERN stack e-commerce application built for a sweets business. Customers can browse products, add items to cart/wishlist, place orders with Cash on Delivery, manage their profile, and leave reviews. Administrators get a dedicated dashboard to manage catalog, inventory, orders, payments, users, marketing content, and business reports.

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite 5** | Build tool & dev server |
| **React Router 6** | Client-side routing |
| **Tailwind CSS 3** | Styling & responsive design |
| **Axios** | HTTP API requests |
| **React Context API** | Auth & cart state management |
| **React Hot Toast** | Notifications |
| **React Icons** | Icon set |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js 4** | REST API framework |
| **MongoDB** | Database |
| **Mongoose 8** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | Image/file uploads |
| **CORS** | Cross-origin requests |
| **dotenv** | Environment configuration |

### Architecture
- **Pattern:** MERN (MongoDB, Express, React, Node.js)
- **API:** RESTful JSON API
- **Auth:** JWT Bearer token with role-based access (`user` / `admin`)
- **Payment:** Cash on Delivery only (no third-party gateway)

---

## Project Structure

```
Sweets E-commerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Business logic
│   │   ├── authController.js
│   │   ├── brandController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── bannerController.js
│   │   ├── offerController.js
│   │   ├── contactController.js
│   │   ├── dashboardController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protect & admin guard
│   │   └── upload.js             # Multer image upload
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── uploads/                  # Uploaded product/brand images
│   ├── utils/
│   │   └── generateToken.js
│   ├── seed.js                   # Database seeder
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # Admin shared components
│   │   │   ├── user/             # User panel components
│   │   │   └── layout/           # Navbar, Footer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/            # Admin panel pages
│   │   │   ├── user/             # User account panel pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Contact.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── orderHelpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Features Overview

### Authentication & Security
- User registration and login
- Admin login (separate route)
- Password encryption with bcrypt
- JWT-based protected routes
- Role-based access control (user vs admin)
- Block/unblock users (admin)

### E-Commerce Core
- Product catalog with search, filter, and pagination
- Shopping cart with quantity management
- Wishlist
- Checkout with address selection
- Cash on Delivery orders
- Order tracking with status updates
- Product reviews and ratings
- Homepage banners and promotional offers

### Admin Management
- Full CRUD for brands, categories, products, banners, offers
- Stock management with low-stock alerts
- Order and payment management
- User management
- Review moderation
- Contact message inbox
- Sales reports and analytics

---

## User Storefront Modules

Public pages accessible without login (except protected actions).

### 1. Home Page (`/`)
- Hero banner slider with auto-rotation
- Feature highlights (free delivery, COD, etc.)
- Shop by category section
- Latest arrivals, popular sweets, and discounted products
- Call-to-action sections

### 2. Products Listing (`/products`)
- View all available sweets
- Search by product name
- Filter by category, brand, price range, weight, availability
- Sort by price (low/high) and name
- Pagination support

### 3. Product Details (`/products/:id`)
- Product image, name, price, discount price
- Brand, category, weight, stock status
- Description, ingredients, shelf life
- Customer reviews and average rating
- Add to cart and add to wishlist
- Write a product review (logged-in users)

### 4. Login (`/login`)
- Email and password authentication
- Redirects to user account panel after login

### 5. Register (`/register`)
- Create account with name, email, mobile, password
- Auto-login after registration

### 6. Contact Us (`/contact`)
- Submit name, email, subject, and message
- Messages stored for admin review

---

## User Account Panel Modules

Protected panel with sidebar navigation at `/account`.

### 1. Overview Dashboard (`/account`)
- Welcome message and account summary
- Stats: total orders, active orders, wishlist, addresses, reviews, cart items
- Total spent and order breakdown
- Recent orders list
- Quick account details

### 2. My Profile (`/account/profile`)
- View profile avatar and member info
- Update name, email, mobile number
- Change password (current + new password)

### 3. My Orders (`/account/orders`)
- View complete order history
- Search orders by ID or product name
- Filter by order status
- Order summary stats (total, active, delivered, cancelled)
- Cancel pending/confirmed orders
- View order details

### 4. Order Details (`/account/orders/:id`)
- Order tracking timeline (Pending → Confirmed → Packed → Shipped → Delivered)
- Shipping address and payment summary
- Ordered products list with prices
- Cancel order (if eligible)
- Submit product review after delivery

### 5. Addresses (`/account/addresses`)
- View all saved delivery addresses
- Add new address (full name, mobile, street, city, state, pincode)
- Edit existing address
- Delete address
- Set default address

### 6. My Reviews (`/account/reviews`)
- View all reviews written by the user
- Edit rating and comment
- Delete own reviews

### 7. Wishlist (`/account/wishlist`)
- View saved products
- Remove from wishlist
- Move item to cart
- Move all available items to cart
- Stock availability indicator

### 8. Shopping Cart (`/account/cart`)
- View cart items with images and prices
- Increase/decrease quantity
- Remove items
- Order summary with delivery charges
- Free delivery hint (orders above ₹999)
- Proceed to checkout

### 9. Checkout (`/account/checkout`)
- Select saved address or enter new address
- Cash on Delivery payment method
- Order summary review
- Place order

---

## Admin Panel Modules

Professional admin console with grouped sidebar at `/admin`.

### 1. Dashboard (`/admin`)
- KPI cards: total sales, orders, users, products
- Pending orders, delivered orders, daily/monthly orders
- Low stock alerts
- Recent orders table
- Best-selling products
- Quick action links

### 2. Manage Brands (`/admin/brands`)
- **Create:** Add brand name, logo (upload or URL), active status
- **Read:** View brand list with search and status filter
- **Update:** Edit brand details and toggle active/inactive
- **Delete:** Remove brand with confirmation
- View brand detail modal

### 3. Manage Categories (`/admin/categories`)
- **Create:** Add category name, description, image, status
- **Read:** Category list with search and filters
- **Update:** Edit category and toggle active/inactive
- **Delete:** Remove category with confirmation

### 4. Manage Products (`/admin/products`)
- **Create:** Full product form (name, brand, category, price, discount, weight, stock, image, description, ingredients, shelf life, flags)
- **Read:** Product table with search, availability filter, stats
- **Update:** Edit product details, toggle availability
- **Delete:** Remove product with confirmation
- Mark as popular/latest
- Low stock threshold setting
- Product detail view modal

### 5. Stock Management (`/admin/stock`)
- View all product stock levels
- Low stock alert banner
- Update stock quantity per product
- Mark product as out of stock
- Filter by all/low/out of stock

### 6. Manage Users (`/admin/users`)
- View all registered customers
- Search by name, email, mobile
- Filter active/blocked users
- View user detail (profile, addresses)
- Block/unblock user accounts
- Delete user accounts

### 7. Manage Orders (`/admin/orders`)
- View all customer orders
- Search and filter by status
- Status-wise order count cards
- Update order status: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled
- View full order details (customer, address, items, payment)
- Cancel orders from admin side

### 8. Manage Payments (`/admin/payments`)
- View all order payments
- COD order tracking
- Pending vs collected payment stats
- Update payment status: Pending, Paid, Failed, Refunded
- Payment detail modal

### 9. Manage Reviews (`/admin/reviews`)
- View all product reviews
- Search and filter visible/hidden reviews
- Show/hide reviews (moderation)
- Delete inappropriate reviews
- Review detail modal

### 10. Manage Offers & Discounts (`/admin/offers`)
- **Create:** Add offer title, discount %, product/category target, festival flag
- **Read:** Offer list with search
- **Update:** Edit offer details and active status
- **Delete:** Remove offer (resets product discount)
- Festival offer support

### 11. Manage Banners (`/admin/banners`)
- **Create:** Add homepage banner (title, subtitle, image, link, order)
- **Read:** Banner list with preview
- **Update:** Edit banner and toggle active/inactive
- **Delete:** Remove banner
- Banner preview modal

### 12. Contact Messages (`/admin/messages`)
- View all contact form submissions
- Unread message count
- Search and filter read/unread
- Mark messages as read/unread
- View full message content
- Delete messages

### 13. Reports & Analytics (`/admin/reports`)
- Total revenue and order metrics
- Daily and monthly order counts
- Sales overview with progress bars
- Store metrics (users, products, completion rate, avg order value)
- Best-selling products report
- Low stock products report

### 14. Admin Profile (`/admin/profile`)
- View admin account info
- Update name and email
- Change password

### 15. Admin Login (`/admin/login`)
- Secure admin-only authentication
- Separate from customer login

---

## Backend Modules & API

### API Base URL
```
http://localhost:5000/api
```

### Endpoints Summary

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `POST /api/auth/admin/login` | Admin login |
| `GET /api/auth/profile` | Get profile (protected) |
| `PUT /api/auth/profile` | Update profile |
| `PUT /api/auth/change-password` | Change password |
| `POST /api/auth/addresses` | Add address |
| `PUT /api/auth/addresses/:id` | Update address |
| `DELETE /api/auth/addresses/:id` | Delete address |
| `GET /api/auth/users` | Get all users (admin) |
| `PUT /api/auth/users/:id/toggle-block` | Block/unblock user |
| `DELETE /api/auth/users/:id` | Delete user |
| `GET /api/brands` | Get brands |
| `POST /api/brands` | Create brand (admin) |
| `PUT /api/brands/:id` | Update brand (admin) |
| `DELETE /api/brands/:id` | Delete brand (admin) |
| `GET /api/categories` | Get categories |
| `POST /api/categories` | Create category (admin) |
| `GET /api/products` | Get products (search/filter) |
| `GET /api/products/home` | Homepage product data |
| `POST /api/products` | Create product (admin) |
| `GET /api/cart` | Get user cart |
| `POST /api/cart` | Add to cart |
| `GET /api/wishlist` | Get wishlist |
| `POST /api/orders` | Place order |
| `GET /api/orders/my` | User order history |
| `PUT /api/orders/:id/status` | Update order status (admin) |
| `PUT /api/orders/:id/payment` | Update payment status (admin) |
| `GET /api/reviews/product/:id` | Product reviews |
| `GET /api/reviews/my` | User's reviews |
| `GET /api/banners` | Get banners |
| `GET /api/offers` | Get offers |
| `POST /api/contact` | Submit contact message |
| `GET /api/dashboard/stats` | Admin dashboard stats |
| `GET /api/user/dashboard` | User account dashboard stats |

---

## Default Credentials

### Admin Account
| Field | Value |
|-------|-------|
| **URL** | http://localhost:3000/admin/login |
| **Email** | `Diksha@gmail.com` |
| **Password** | `Diksha123` |

### Customer Accounts (Seed Data)
| Name | Email | Password |
|------|-------|----------|
| Nazrul | `Nazrul@gmail.com` | `user123` |
| Rohit | `Rohit@gmail.com` | `user123` |
| Mohit | `Mohit@gmail.com` | `user123` |

> **Note:** Run `npm run seed` in the backend folder to create these accounts and sample data.

---

## Seed Data

Running the seed script populates the database with:

| Data Type | Count | Details |
|-----------|-------|---------|
| Admin | 1 | Diksha@gmail.com |
| Users | 3 | Nazrul, Rohit, Mohit |
| Brands | 4 | Haldiram, Bikano, Ghasitaram, Sweet Bengal |
| Categories | 5 | Mithai, Cakes, Chocolates, Dry Fruit Sweets, Festival Sweets |
| Products | 8 | Kaju Katli, Rasgulla, Chocolate Cake, etc. |
| Banners | 3 | Homepage promotional banners |
| Offers | 2 | Product and festival discounts |

---

## Prerequisites

Before running the project, ensure you have:

1. **Node.js** v18 or higher — [Download](https://nodejs.org/)
2. **MongoDB** v6+ running locally or a MongoDB Atlas connection string
3. **npm** (comes with Node.js)
4. **Git** (optional, for cloning)

---

## Installation & How to Run

### Step 1: Clone or Open the Project

```bash
cd "Sweets E-commerce"
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create environment file (if not present):

```bash
# Copy example env (Windows PowerShell)
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sweets_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your machine:

```bash
# Windows (if installed as service, it usually starts automatically)
# Or start mongod manually
mongod
```

### Step 4: Seed the Database

```bash
cd backend
npm run seed
```

Expected output:
```
========== SEED COMPLETED ==========
Admin Login: Diksha@gmail.com / Diksha123
User Login: Nazrul@gmail.com / user123
====================================
```

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

Backend runs at: **http://localhost:5000**

### Step 6: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### Step 7: Open in Browser

| Application | URL |
|-------------|-----|
| Customer Store | http://localhost:3000 |
| User Account Panel | http://localhost:3000/account |
| Admin Panel | http://localhost:3000/admin/login |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/sweets_ecommerce` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Deployed backend API URL (required for production) | `https://your-backend.onrender.com` |

---

## Application URLs

| Page | Route |
|------|-------|
| Home | `/` |
| Shop | `/products` |
| Product Detail | `/products/:id` |
| Login | `/login` |
| Register | `/register` |
| Contact | `/contact` |
| User Dashboard | `/account` |
| User Profile | `/account/profile` |
| User Orders | `/account/orders` |
| User Addresses | `/account/addresses` |
| User Reviews | `/account/reviews` |
| User Wishlist | `/account/wishlist` |
| User Cart | `/account/cart` |
| User Checkout | `/account/checkout` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |
| Admin Brands | `/admin/brands` |
| Admin Categories | `/admin/categories` |
| Admin Products | `/admin/products` |
| Admin Stock | `/admin/stock` |
| Admin Users | `/admin/users` |
| Admin Orders | `/admin/orders` |
| Admin Payments | `/admin/payments` |
| Admin Reviews | `/admin/reviews` |
| Admin Offers | `/admin/offers` |
| Admin Banners | `/admin/banners` |
| Admin Messages | `/admin/messages` |
| Admin Reports | `/admin/reports` |
| Admin Profile | `/admin/profile` |

---

## Production Build

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Backend

```bash
cd backend
npm start
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running and `MONGO_URI` is correct |
| Port 5000 in use | Change `PORT` in `.env` or stop the conflicting process |
| Port 3000 in use | Vite will suggest an alternate port automatically |
| Empty product list | Run `npm run seed` in the backend folder |
| Admin login fails | Use `Diksha@gmail.com` / `Diksha123` after seeding |
| Images not loading | Backend must be running; uploads served from `/uploads` |

---

## Diksha Final Year BCA project

---

**Indian Sweet Savories** — Premium Indian Sweets E-commerce Platform  
Built with MERN Stack | React + Express + MongoDB + Node.js
