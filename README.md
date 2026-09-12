# ShewaCraft Furniture

Furniture storefront and admin dashboard. Customers browse the catalog, check out with a bank-transfer payment proof, track orders, message the shop, and rate delivered pieces. Admins manage products, orders, customers, live chat, and homepage testimonials.

```
ShewaCraft-Furniture/
├── ShewaCraft-furniture-Frontend/   # React + Vite storefront and admin UI (port 5173)
└── ShewaCraft-furniture-Backend/    # Express + MongoDB API and Socket.IO (port 5000)
```

## Features

**Storefront**
- Catalog, favorites, cart, and product details
- Bank-transfer checkout with payment-proof upload
- Orders, receipt confirmation, and star ratings / written reviews
- Customer–admin messaging (REST + Socket.IO)
- Forgot password via Gmail SMTP
- Homepage featured products, featured testimonials, and live About stats

**Admin**
- Dashboard, products (including featured items), stock, and Cloudinary images
- Orders and status transitions
- Customers (block / unblock)
- Testimonials (feature written reviews on the homepage)
- Messages

## Prerequisites

- Node.js 20+
- MongoDB locally or [Atlas](https://www.mongodb.com/atlas)
- npm

Optional for full flows:
- [Cloudinary](https://cloudinary.com/) for product and payment-proof images
- Gmail App Password for password-reset email

## Setup

### Backend

```bash
cd ShewaCraft-furniture-Backend
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:5000`

Edit `.env` at minimum:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Local or Atlas connection string |
| `JWT_SECRET` | Long random secret |
| `CORS_ORIGIN` | Frontend origin (`http://localhost:5173`) |
| `CLIENT_URL` | Used in password-reset links |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin account on first start |
| `CLOUDINARY_*` | Required for image uploads and checkout screenshots |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + [App Password](https://myaccount.google.com/apppasswords) |

On startup the API seeds an admin (from env), demo customers, catalog products, and a delivered demo order if they are missing.

### Frontend

```bash
cd ShewaCraft-furniture-Frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

`.env`:

```
VITE_API_URL=http://localhost:5000
```

Keep both servers running. CORS is set to the Vite origin.

## Demo logins

Created automatically when the backend starts (if they do not already exist):

| Role | Email | Password |
| --- | --- | --- |
| Admin | value of `ADMIN_EMAIL` (example: `admin@shewacraft.com`) | value of `ADMIN_PASSWORD` |
| Customer | `customer@shewacraft.com` | `Customer123!` |
| Blocked | `blocked@shewacraft.com` | `Blocked123!` |

Change the admin password in `.env` before any real deployment. Do not commit `.env` files.

## Scripts

**Backend**

```bash
npm run dev    # watch mode
npm start      # production
```

**Frontend**

```bash
npm run dev      # Vite
npm run build    # production build
npm run preview  # serve the build
npm run lint
```

## API (high level)

| Area | Base |
| --- | --- |
| Auth | `/api/auth` |
| Products | `/api/products` |
| Cart / favorites | `/api/cart`, `/api/favorites` |
| Orders / checkout | `/api/orders`, `/api/checkout` |
| Messages | `/api/conversations` + Socket.IO |
| Testimonials / stats | `/api/testimonials`, `/api/stats` |
| Admin | `/api/admin` (admin JWT required) |
| Uploads | `/api/uploads/images` (admin) |

Auth uses a Bearer JWT. Role comes from the user record (`customer` or `admin`).

## Notes

- New product and payment-proof images go to Cloudinary. Missing Cloudinary env vars return **503** on those uploads.
- Forgot password returns **503** until `SMTP_USER` and `SMTP_PASS` are set. Use a Gmail App Password, not the account password.
- Homepage testimonials are written customer reviews that an admin has featured. Ratings without text are not testimonials.
- About-page review count and average rating come from real order ratings, not catalog seed numbers.

## License

Private project. All rights reserved.
