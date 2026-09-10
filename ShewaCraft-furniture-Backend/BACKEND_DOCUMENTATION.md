# ShewaCraft Furniture — Backend

Express + MongoDB API for the ShewaCraft React storefront. Specified by [`FRONTEND_DOCUMENTATION.md`](../FRONTEND_DOCUMENTATION.md). **Phase 1–10** are implemented: configuration, MongoDB, User model, JWT Bearer auth, RBAC, Product catalog, per-user favorites, per-user cart with server totals, checkout, orders, confirm-receipt, ratings, conversations/messages REST, Socket.IO live delivery, admin product/order/customer APIs, dashboard aggregates, Cloudinary product-image and payment-proof uploads, Helmet, auth rate limits, and extra input validation.

The SPA now calls auth, the public catalog, favorites, cart, checkout banks, orders, conversations, and admin inventory/orders/customers through `VITE_API_URL` (default `http://localhost:5000`). Chat updates also arrive over Socket.IO on the same origin after REST persists. The admin Messages inbox, product CRUD, orders table, customers table, and overview cards use live APIs. Product photos and checkout payment proofs use **Cloudinary**. Older local proof URLs under `/uploads/payment-proofs` still resolve.

## Assumptions

- JWT payload is `{ sub: userId }` only. Role and status come from Mongo after `requireAuth` loads the user. The API **ignores** `role` and `userId` in request bodies.
- Sign Up always creates `role: "customer"`. Admins are seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. A demo customer `customer@shewacraft.com` / `Customer123!` is created on boot if that email is missing. A blocked customer `blocked@shewacraft.com` / `Blocked123!` is created for order-create **403** checks.
- Forgot/reset: if SMTP is not configured, a reset URL is logged in development. HTTP always returns a generic success for forgot-password.
- JSON `id` is the string form of Mongo `_id`, except **orders**, where `id` is the public `ORD-######` code.
- Blocked users can still log in and call `GET /api/auth/me`. `POST /api/orders` returns **403**.
- Logout is stateless: the client must discard the token. The server returns `{ ok: true }`.

## Setup

```bash
cd ShewaCraft-furniture-Backend
cp .env.example .env
# set JWT_SECRET, ADMIN_PASSWORD, and MONGODB_URI
npm install
npm run dev
```

`MONGODB_URI` can be local (`mongodb://127.0.0.1:27017/shewacraft`) or Atlas:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/shewacraft?retryWrites=true&w=majority
```

In Atlas, allow your IP (or `0.0.0.0/0` for local dev) under Network Access. The app database name is the path segment (`shewacraft`). Do not commit `.env`.

Health check: `GET http://localhost:5000/api/health` → `{ "ok": true }`.

On boot, if no user exists for `ADMIN_EMAIL`, one admin is created. If `customer@shewacraft.com` is missing, that demo customer is created. If `blocked@shewacraft.com` is missing, that blocked customer is created. If the products collection is empty, the six storefront catalog items are inserted. If the demo customer has no delivered order, `ORD-1004` is inserted so confirm-receipt and rating can be tried without the admin panel.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | no (default 5000) | HTTP port |
| `MONGODB_URI` | yes | Mongo connection |
| `JWT_SECRET` | yes | Access-token signing |
| `JWT_EXPIRES_IN` | no (`8h`) | Default token lifetime |
| `JWT_EXPIRES_IN_REMEMBER` | no (`7d`) | When login `remember: true` |
| `CORS_ORIGIN` | no (`http://localhost:5173`) | Allowed frontend origin |
| `ADMIN_EMAIL` | recommended | Seed admin email |
| `ADMIN_PASSWORD` | recommended | Seed admin password (≥8, letter + number) |
| `CLIENT_URL` | no | Used in logged reset URLs |
| `UPLOAD_DIR` | no (`./uploads`) | Legacy local payment-proof files, still served at `/uploads` |
| `CLOUDINARY_CLOUD_NAME` | for image uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | for image uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | for image uploads | Cloudinary API secret (server-side only) |
| `NODE_ENV` | no | `development` logs reset URLs |

Do not commit `.env`. Optional `SMTP_*` is reserved for a later email-sending phase.

## Authentication

Access token: `Authorization: Bearer <token>`.

Public user object (never includes hashes or reset fields):

```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "fullName": "Demo Customer",
  "email": "customer@shewacraft.com",
  "role": "customer"
}
```

Login / register response:

```json
{
  "user": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Demo Customer",
    "email": "customer@shewacraft.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Endpoints (`/api/auth`)

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| POST | `/api/auth/register` | Public | `{ fullName, email, password }` | **201** `{ user, token }` |
| POST | `/api/auth/login` | Public | `{ email, password, remember? }` | **200** `{ user, token }` |
| POST | `/api/auth/logout` | Bearer | — | **200** `{ ok: true }` |
| GET | `/api/auth/me` | Bearer | — | **200** `{ user }` |
| POST | `/api/auth/forgot-password` | Public | `{ email }` | **200** generic `{ ok: true, message }` |
| POST | `/api/auth/reset-password` | Public | `{ token, password }` | **200** `{ ok: true }` |

Password rules match the SPA: at least 8 characters, one letter, one number, max 128. `fullName` max 80. Duplicate email → **409** `An account with this email already exists`. Bad login → **401** `Invalid email or password`. Missing/invalid Bearer → **401** `Invalid or expired session`. Register, login, and forgot-password are rate-limited (**10 / 15 min / IP** → **429**).

Sending `"role": "admin"` on register does **not** create an admin.

## RBAC

| Middleware | Behavior |
|------------|----------|
| `requireAuth` | Verify JWT, load user from DB, set `req.user` |
| `requireRole('admin')` | **403** if `req.user.role` is not `admin` |

Stub for checks: `GET /api/admin/health` (admin Bearer) → `{ ok: true, role: "admin" }`. Customers receive **403**.

## Security

- **Helmet** is enabled on all responses (`crossOriginResourcePolicy: cross-origin` so the SPA can still load legacy `/uploads` images from another origin).
- **Auth rate limit:** `POST /api/auth/register`, `/login`, and `/forgot-password` share **10 requests / 15 minutes / IP**. Over the limit → **429** `Too many attempts. Try again later.` `/me` and `/logout` are not limited.
- Keys starting with `$` (and `__proto__` / `constructor` / `prototype`) are stripped from JSON body, query, and params.
- Uploads require `image/*` **and** PNG/JPEG/WebP/GIF magic bytes. Fake `.png` files → **415**.
- Length caps: `fullName` 80, password 128, checkout `location` 200 / `phoneNumber` 40, order `review` 2000, `search` 100.

## Error envelope

```json
{
  "error": {
    "message": "Enter a valid email address",
    "fields": { "email": "Enter a valid email address" }
  }
}
```

| Status | Typical cause |
|--------|----------------|
| 400 | Validation, expired reset token, empty cart, invalid status/rating |
| 401 | Missing/invalid token, bad password |
| 403 | Wrong role, blocked user placing an order |
| 404 | Unknown route, product, order, conversation, or customer |
| 409 | Duplicate email |
| 413 | Payment screenshot or product image larger than 10MB |
| 415 | Upload is not an image (MIME or magic bytes) |
| 429 | Auth rate limit on register / login / forgot-password |
| 502 | Cloudinary rejected a product or payment-proof upload |
| 503 | Cloudinary env is missing on `POST /api/uploads/images` or `POST /api/orders` |
| 500 | Unexpected |

## Products (public catalog)

Same documents the storefront will read later. Admin create/update/delete is `POST/PATCH/DELETE /api/admin/products` (admin Bearer). Public routes stay read-only.

On boot, if `products` is empty, six items matching the current SPA catalog are inserted (`stockCount` 12 when in stock, 0 when not). Spec label `Warrenty` is stored as `Warranty`. `inStock` is forced false when `stockCount` is 0. `rating` / `reviews` are denormalized numbers; they are not aggregated from orders yet.

### Endpoints (`/api/products`)

| Method | Path | Auth | Query | Success |
|--------|------|------|-------|---------|
| GET | `/api/products` | Public | `search`, `category`, `priceRange`, `sortBy` | **200** `{ products }` |
| GET | `/api/products/:id` | Public | — | **200** `{ product }` |

Unknown or invalid `:id` → **404** `Not found`. There are no public POST/PATCH/DELETE product routes.

| Query | Values | Behavior |
|-------|--------|----------|
| `search` | string | Case-insensitive substring on `name` and `description` |
| `category` | `Living Room`, `Bedroom`, `Dining`, `Office`, `Outdoor` | Exact match. Omit, `All`, or unknown → no category filter |
| `priceRange` | `Under $500`, `$500-$1000`, `$1000-$2000`, `Over $2000` | Same bounds as the SPA. Omit, `All`, or unknown → no price filter |
| `sortBy` | `featured` (default), `price-asc`, `price-desc`, `rating` | Featured: featured first, then rating desc. Unknown → featured |

Example list item:

```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Luxury Velvet Armchair",
  "price": 899,
  "description": "Experience ultimate comfort…",
  "category": "Living Room",
  "featured": true,
  "images": ["https://…"],
  "inStock": true,
  "stockCount": 12,
  "rating": 4.8,
  "reviews": 124,
  "specifications": [
    { "label": "Dimensions", "value": "32\" W x 34\" D x 36\" H" },
    { "label": "Warranty", "value": "2 years" }
  ],
  "colors": ["Navy", "Emerald", "Burgundy"],
  "assembly": "Minimal assembly required"
}
```

## Favorites

Scoped to `req.user._id` after Bearer auth. The API ignores `userId` in the body. Logged-in customers and admins can save items. Lists never include another user’s rows.

On write, `name`, `image` (first product image), `price`, and `inStock` are copied from the Product. On GET, those fields are overlaid from the live product when it still exists; the snapshot is kept if the product was deleted.

### Endpoints (`/api/favorites`)

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| GET | `/api/favorites` | Bearer | — | **200** `{ favorites }` |
| POST | `/api/favorites` | Bearer | `{ productId }` | **201** `{ favorite }` (or **200** if already saved) |
| DELETE | `/api/favorites/:productId` | Bearer | — | **200** `{ ok: true }` even if missing |
| DELETE | `/api/favorites` | Bearer | — | **200** `{ ok: true }` clears this user’s list |

Missing/invalid `productId` on POST → **400**. Unknown product → **404**. Missing Bearer → **401**.

```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d2",
  "productId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Luxury Velvet Armchair",
  "image": "https://…",
  "price": 899,
  "inStock": true
}
```

## Cart

Scoped to `req.user._id` after Bearer auth. The API ignores `userId` in the body. Logged-in customers and admins can use the storefront cart. Lists never include another user’s rows. First access get-or-creates an empty cart.

Line items merge on **`product` + `color`**. Item `id` is the subdocument `_id` string; `productId` is the catalog product id.

On write, `name`, `image` (first product image), `price`, and `inStock` are copied from the Product. Cart lines also store a fixed **ShewaCraft Support** `owner` snapshot (not a product seller). On GET, live `price` / `inStock` / `name` / `image` are overlaid when the product still exists; the snapshot is kept if it was deleted. Line `owner` is always ShewaCraft Support.

### Totals

Same rules as the SPA mock:

- `subtotal` = Σ `price × quantity`
- `shipping` = `0` if the cart is empty or `subtotal > 500`, else `49`
- `tax` = `subtotal × 0.08`
- `total` = `subtotal + shipping + tax`

Totals use live prices when the product still exists.

### Endpoints (`/api/cart`)

Every success response is `{ items, savedForLater, totals }`.

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| GET | `/api/cart` | Bearer | — | **200** envelope (creates empty cart if missing) |
| POST | `/api/cart/items` | Bearer | `{ productId, quantity?, color? }` | **201** new line, **200** if `product+color` already existed |
| PATCH | `/api/cart/items/:itemId` | Bearer | `{ quantity }` | **200** envelope |
| DELETE | `/api/cart/items/:itemId` | Bearer | — | **200** envelope even if the line is missing |
| POST | `/api/cart/save-for-later/:itemId` | Bearer | — | **200** envelope |
| POST | `/api/cart/move-to-cart/:itemId` | Bearer | — | **200** envelope (from saved; merge if `product+color` exists, color `""`) |
| DELETE | `/api/cart/saved/:itemId` | Bearer | — | **200** envelope even if the saved row is missing |

Default `quantity` is 1, default `color` is `""`. Missing/invalid `productId` or `quantity < 1` on POST → **400**. Unknown product → **404**. Adding a **new** line for an out-of-stock product → **400**. Duplicate `product+color` increments quantity (allowed even if the live product is out of stock). PATCH `quantity < 1` → **400**. Missing cart line on PATCH / save-for-later / move-to-cart → **404**. Missing Bearer → **401**.

```json
{
  "items": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d3",
      "productId": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Luxury Velvet Armchair",
      "image": "https://…",
      "price": 899,
      "quantity": 1,
      "color": "Navy",
      "inStock": true,
      "owner": {
        "name": "ShewaCraft Support",
        "avatar": "",
        "responseTime": "Within 2 hours"
      }
    }
  ],
  "savedForLater": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d4",
      "productId": "65f1a2b3c4d5e6f7a8b9c0d5",
      "name": "Modern Bookshelf Unit",
      "image": "https://…",
      "price": 699,
      "inStock": false
    }
  ],
  "totals": {
    "subtotal": 899,
    "shipping": 49,
    "tax": 71.92,
    "total": 1019.92
  }
}
```

## Checkout banks

Public list matching the storefront checkout accounts. No auth.

| Method | Path | Auth | Success |
|--------|------|------|---------|
| GET | `/api/checkout/banks` | Public | **200** `{ banks }` |

## Orders

Scoped to `req.user._id` after Bearer auth except admin list/get/status. The API ignores `userId` in the body and ignores client `orderRef` / `total`. Totals are computed on the server with the same 500 / 49 / 0.08 cart rules. JSON `id` is `publicId` (`ORD-` plus 6 digits).

Checkout is **bank transfer + screenshot** (`multipart/form-data`). New payment proofs are uploaded to Cloudinary (`shewacraft/payment-proofs`) and stored as HTTPS `secure_url` values on `payment.screenshot`. Missing `CLOUDINARY_*` env → **503**. Cart `items` are cleared after a successful create; `savedForLater` is kept. Older orders may still have local `/uploads/payment-proofs/...` URLs.

Customer confirm-receipt is the only way `delivered` becomes `completed`. Admins use `canTransition` but cannot set `completed`. Ratings do **not** change product `rating` / `reviews`.

On boot, if the demo customer has no delivered order, `ORD-1004` (Luxury Velvet Armchair) is inserted as `delivered`.

### Endpoints (`/api/orders`)

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| GET | `/api/orders` | Bearer | — | **200** `{ orders }` this user, newest first |
| GET | `/api/orders/:id` | Bearer | — | **200** `{ order }` |
| POST | `/api/orders` | Bearer | multipart `bankId`, `location`, `phoneNumber`, `screenshot` | **201** `{ order }` `pending` |
| POST | `/api/orders/:id/confirm-receipt` | Bearer | — | **200** `{ order }` if `delivered` |
| POST | `/api/orders/:id/rating` | Bearer | `{ rating, review? }` | **200** `{ order }` if `completed` and unrated |
| PATCH | `/api/admin/orders/:id/status` | Admin Bearer | `{ status }` | **200** `{ order }` |

`:id` is `publicId` (or Mongo `_id`). Missing or not-owner → **404**. Empty cart → **400**. Blocked user on POST → **403**. Missing screenshot → **400** `Upload a payment screenshot.` Invalid bank/location/phone copy matches the checkout modal. File too large → **413**. Not an image → **415**. Cloudinary not configured → **503**. Confirm-receipt when not delivered, re-rate, or rate before completed → **400**. Admin invalid transition (including `completed`) → **400**.

```json
{
  "id": "ORD-482193",
  "status": "pending",
  "date": "2026-09-10",
  "updatedAt": "2026-09-10T14:02:00.000Z",
  "customer": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Demo Customer",
    "email": "customer@shewacraft.com",
    "phone": "+1234567890",
    "location": "123 Main St, New York, NY 10001",
    "avatar": ""
  },
  "items": [
    {
      "productId": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Luxury Velvet Armchair",
      "image": "https://…",
      "color": "Navy",
      "quantity": 1,
      "unitPrice": 899
    }
  ],
  "totals": { "subtotal": 899, "shipping": 0, "tax": 71.92, "total": 970.92 },
  "payment": {
    "method": "bank_transfer",
    "bank": "Bank of America",
    "screenshot": "https://res.cloudinary.com/…/shewacraft/payment-proofs/….jpg",
    "reference": ""
  },
  "shipping": "Standard - 3-5 days",
  "address": "123 Main St, New York, NY 10001",
  "productId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "quantity": 1,
  "price": 970.92,
  "destinationConfirmedAt": null,
  "customerReceivedAt": null,
  "rating": null,
  "review": ""
}
```

Admin status machine:

```
pending  → approved | rejected
approved → shipped
shipped  → delivered   (sets destinationConfirmedAt)
delivered → completed  (customer confirm-receipt only)
```

`rejected` is terminal.

## Admin APIs

All `/api/admin/*` routes (except the already-documented conversation routes) use `requireAuth` + `requireRole('admin')`. Customers receive **403**. Admin JSON `id` for products and customers is the Mongo `_id` string; orders still use `ORD-######`.

### Product images (`POST /api/uploads/images`)

Admin-only multipart field `image`. Uploads are signed with the Cloudinary API secret (not unsigned client uploads). Folder `shewacraft/products`. Image-only (MIME **and** PNG/JPEG/WebP/GIF magic bytes), 10MB. Missing `CLOUDINARY_*` env → **503**. Success **201** `{ url }` (HTTPS). Product create/update bodies take that URL in `images[]`. Data URLs are rejected. Existing HTTPS (including Unsplash) URLs may stay on edit if not replaced. Checkout payment proofs use the same Cloudinary account in folder `shewacraft/payment-proofs` via `POST /api/orders` (same magic-byte check).

### Products

`rating` / `reviews` on write are ignored (denormalized values are left as-is, default 0 on create). Empty name or invalid category/price → **400**. Missing `:id` → **404**. Deleting a product does not rewrite order line snapshots.

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| GET | `/api/admin/products` | Admin Bearer | — | **200** `{ products }` including `stockCount` |
| POST | `/api/admin/products` | Admin Bearer | JSON product fields; `images[]` HTTPS URLs | **201** `{ product }` |
| PATCH | `/api/admin/products/:id` | Admin Bearer | Partial JSON, same fields | **200** `{ product }` |
| DELETE | `/api/admin/products/:id` | Admin Bearer | — | **200** `{ ok: true }` |
| PATCH | `/api/admin/products/:id/stock` | Admin Bearer | `{ inStock, stockCount? }` | **200** `{ product }` |
| POST | `/api/uploads/images` | Admin Bearer | multipart `image` | **201** `{ url }` |

Stock toggle matches the admin UI: `inStock: true` → `stockCount = max(1, stockCount \|\| 10)` when count is omitted; `inStock: false` → `stockCount 0`. Writable fields: `name`, `price`, `category`, `description`, `images`, `featured`, `inStock`, `stockCount`, `colors`, `specifications`, `assembly`.

### Orders

| Method | Path | Auth | Query / body | Success |
|--------|------|------|--------------|---------|
| GET | `/api/admin/orders` | Admin Bearer | `status`, `search` | **200** `{ orders }` |
| GET | `/api/admin/orders/:id` | Admin Bearer | — | **200** `{ order }` |
| PATCH | `/api/admin/orders/:id/status` | Admin Bearer | `{ status }` | **200** `{ order }` |

`search` matches `publicId`, customer name/email, item name, bank, and `payment.reference`. `:id` is `publicId` or Mongo `_id` with **no** user scope; missing → **404**. `payment.reference` is included on `publicOrder`. Admin cannot set `completed`.

### Customers

Role `customer` only. Admin users are **404** on status PATCH.

| Method | Path | Auth | Query / body | Success |
|--------|------|------|--------------|---------|
| GET | `/api/admin/customers` | Admin Bearer | `status=all\|active\|blocked`, `search` on name/email/phone | **200** `{ customers }` |
| PATCH | `/api/admin/customers/:id/status` | Admin Bearer | `{ status: active\|blocked }` | **200** `{ customer }` |

Each row: `id`, `name` (from `fullName`), `email`, `phone`, `avatar`, `status`, `location`, `notes`, `preferredPayment`, `joinDate` (`createdAt`), plus order aggregates `totalOrders`, `totalSpent` (status ≠ `rejected`), `lastOrder`, `recentOrders[]` (`id`, `product`, `total`, `status`, `date`). Blocked users can still log in; `POST /api/orders` returns **403**.

### Dashboard

`GET /api/admin/dashboard` returns the same metrics the SPA `deriveDashboard` helper computes: revenue excluding rejected, 30-day windows, pipeline counts, low stock (in stock and count 1–5), blocked customers, unread admin threads. The overview UI still derives locally from fetched orders/products/customers plus live conversations so socket unread stays current.

| Method | Path | Auth | Success |
|--------|------|------|---------|
| GET | `/api/admin/dashboard` | Admin Bearer | **200** `{ dashboard }` |

## Conversations

**One thread per customer** (`Conversation.customer` unique). Persist `sender` as `customer` \| `admin`. Storefront JSON maps those to `user` \| `owner`. Contact display is always **ShewaCraft Support**. The API ignores `userId` and `role` in bodies. Send and read stay on REST; Socket.IO only delivers **after** Mongo writes.

Unread: `customerUnread` is a count (admin reply increments it; customer `POST …/read` zeros it). `adminUnread` is a boolean (customer send sets it true; admin `POST …/read` or sending a reply clears it). `POST /api/admin/conversations/read-all` clears every `adminUnread`.

Customer `POST /api/conversations` is get-or-create for `req.user._id` (needed so ChatBox can persist). Optional `{ productId }` snapshots the last product context. Admin `POST /api/admin/conversations` get-or-creates by `customerId` (or `customerEmail` / `email`) and may snapshot `productId` / `productName` / `orderId` from the `chatFocus` payload. Identity always comes from the User document.

Customer routes are scoped to `req.user._id`. Another user’s conversation id → **404** (not 403). Empty `text` → **400**. Admin routes → **403** if not admin.

### Endpoints (`/api/conversations`)

| Method | Path | Auth | Body | Success |
|--------|------|------|------|---------|
| GET | `/api/conversations` | Bearer | — | **200** `{ conversations }` this user (0 or 1), no message bodies |
| POST | `/api/conversations` | Bearer | `{ productId? }` | **200** `{ conversation }` get-or-create + messages |
| GET | `/api/conversations/:id` | Bearer | — | **200** `{ conversation }` + `messages` |
| POST | `/api/conversations/:id/messages` | Bearer | `{ text }` | **201** `{ message, conversation }` as `customer` |
| POST | `/api/conversations/:id/read` | Bearer | — | **200** `{ ok: true, conversation }` zeros `customerUnread` |

### Endpoints (`/api/admin/conversations`)

| Method | Path | Auth | Query / body | Success |
|--------|------|------|--------------|---------|
| GET | `/api/admin/conversations` | Admin Bearer | `filter=all\|unread`, `search` | **200** `{ conversations }` with messages |
| POST | `/api/admin/conversations` | Admin Bearer | `chatFocus` (`customerId` or email, optional product/order) | **200** `{ conversation }` get-or-create + messages |
| GET | `/api/admin/conversations/:id` | Admin Bearer | — | **200** `{ conversation }` + `messages` |
| POST | `/api/admin/conversations/:id/messages` | Admin Bearer | `{ text }` | **201** `{ message, conversation }` as `admin` |
| POST | `/api/admin/conversations/:id/read` | Admin Bearer | — | **200** `{ ok: true, conversation }` |
| POST | `/api/admin/conversations/read-all` | Admin Bearer | — | **200** `{ ok: true }` |

`search` matches customer name/email, product name, order public id, or last message. Unknown `:id` or a customer that is not a real user → **404**.

Storefront conversation:

```json
{
  "id": "65f1a2b3c4d5e6f7a8b9c0d8",
  "contactName": "ShewaCraft Support",
  "productName": "Luxury Velvet Armchair",
  "productId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "productImage": "https://…",
  "productPrice": 899,
  "preview": "Do you have this in Navy?",
  "lastMessage": "Do you have this in Navy?",
  "lastMessageAt": "2026-09-10T15:02:00.000Z",
  "updatedAt": "2026-09-10T15:02:00.000Z",
  "unread": 0,
  "messages": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d9",
      "sender": "user",
      "text": "Do you have this in Navy?",
      "timestamp": "2026-09-10T15:02:00.000Z"
    }
  ]
}
```

Admin conversation uses `unread` as a boolean, `sender` `customer` \| `admin`, plus `customerId`, `customerName`, `customerEmail`, `orderId`.

## Socket.IO

Attached to the same HTTP server as Express (`http://localhost:5000`). CORS matches `CORS_ORIGIN`. Handshake uses the **same JWT** as REST (`{ sub: userId }`): `socket.handshake.auth.token` or `Authorization: Bearer`. Missing/invalid token rejects the handshake with `Invalid or expired session`. Role comes from Mongo; client `role` / `userId` are ignored.

On connect:

- every user joins `user:${userId}`
- admins also join `admin`

| Client event | Payload | Ack |
|--------------|---------|-----|
| `conversation:join` | `{ conversationId }` | `{ ok: true }` or `{ error: "Not found" }` |
| `conversation:leave` | `{ conversationId }` | `{ ok: true }` |

A customer may only join their own thread. Another user’s id → `{ error: "Not found" }` and the socket does **not** join. Admins may join any existing conversation.

REST handlers emit only after a successful save:

| REST | Server event |
|------|----------------|
| `POST …/messages` | `conversation:message` to `conversation:${id}`, `user:${customerId}`, and `admin` |
| `POST …/read` | `conversation:unread` to the same rooms |
| `POST /api/admin/conversations/read-all` | `conversation:unread` `{ all: true, adminUnread: false }` to `admin` |

Canonical `conversation:message` payload (`sender` is `customer` \| `admin`):

```json
{
  "conversationId": "65f1a2b3c4d5e6f7a8b9c0d8",
  "message": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d9",
    "sender": "customer",
    "text": "Do you have this in Navy?",
    "timestamp": "2026-09-10T15:02:00.000Z"
  },
  "conversation": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d8",
    "customerId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "customerName": "Demo Customer",
    "customerUnread": 0,
    "adminUnread": true,
    "lastMessage": "Do you have this in Navy?",
    "lastMessageAt": "2026-09-10T15:02:00.000Z"
  }
}
```

The SPA maps storefront senders to `user` \| `owner` and upserts by `message.id` so a REST response plus the socket echo does not duplicate.

## User model

Fields persisted: `fullName`, `email`, `passwordHash`, `role` (`customer` \| `admin`), `phone`, `location`, `avatar`, `status` (`active` \| `blocked`), `notes`, `preferredPayment`, `passwordResetToken`, `passwordResetExpires`, timestamps.

`passwordHash` and reset fields use `select: false` and are stripped in `toJSON`.

## Product model

Fields persisted: `name`, `price`, `description`, `category` (`Living Room` \| `Bedroom` \| `Dining` \| `Office` \| `Outdoor`), `featured`, `images` (HTTPS URL strings), `inStock`, `stockCount`, `rating`, `reviews`, `specifications` (`label`, `value`), `colors`, `assembly`, timestamps.

ShewaCraft is the seller; products do **not** have an `owner` field. Indexes: `category`, `{ featured, rating }`, `price`.

## Favorite model

Fields persisted: `user`, `product`, `name`, `image`, `price`, `inStock`, timestamps. Unique `{ user, product }`. JSON exposes `id` and `productId`; `user` is not returned.

## Cart model

Fields persisted: `user`, `items[]` (`product`, `name`, `image`, `price`, `quantity` min 1, `color` default `""`, `inStock`, `owner` `{ name, avatar, responseTime }` — always ShewaCraft Support, not a catalog seller), `savedForLater[]` (`product`, `name`, `image`, `price`, `inStock`), timestamps. Unique `{ user: 1 }`. Merge key for line items: `product + color`. JSON exposes line `id` and `productId`; `user` is not returned.

## Order model

Fields persisted: unique `publicId`, `user`, customer snapshot (`name`, `email`, `phone`, `location`), `items[]` (`product`, `name`, `image`, `color`, `quantity`, `unitPrice`), `totals` (`subtotal`, `shipping`, `tax`, `total`), `payment` (`method`, `bank`, `screenshot`, `reference`), `shippingLabel`, `status`, `notes`, `destinationConfirmedAt`, `customerReceivedAt`, `rating`, `review`, `date`, timestamps. Indexes: `{ user, date }`, `{ publicId }`, `{ status }`. JSON `id` is `publicId`.

## Conversation model

Fields persisted: unique `customer` (User), optional `product` plus denormalized `productName` / `productImage` / `productPrice`, optional `order` plus `orderPublicId`, `lastMessage`, `lastMessageAt`, `customerUnread` (Number), `adminUnread` (Boolean), timestamps. Indexes: unique `customer`, `lastMessageAt`, `{ adminUnread, lastMessageAt }`.

## Message model

Fields persisted: `conversation`, `sender` (`customer` \| `admin`), `text`, timestamps. Index: `{ conversation, createdAt }`. JSON `id` is Mongo `_id`. Storefront responses remap sender to `user` \| `owner`.

## Project layout

```
src/app.js
src/server.js
src/config/env.js
src/config/db.js
src/config/cloudinary.js
src/models/User.js
src/models/Product.js
src/models/Favorite.js
src/models/Cart.js
src/models/Order.js
src/models/Conversation.js
src/models/Message.js
src/data/catalogSeed.js
src/data/banks.js
src/middleware/requireAuth.js
src/middleware/requireRole.js
src/middleware/errorHandler.js
src/middleware/uploadPaymentProof.js
src/middleware/uploadProductImage.js
src/middleware/assertImageFile.js
src/middleware/sanitizeMongo.js
src/middleware/authRateLimit.js
src/controllers/authController.js
src/controllers/productController.js
src/controllers/favoriteController.js
src/controllers/cartController.js
src/controllers/orderController.js
src/controllers/conversationController.js
src/controllers/adminProductController.js
src/controllers/adminOrderController.js
src/controllers/adminCustomerController.js
src/controllers/adminDashboardController.js
src/controllers/uploadController.js
src/routes/authRoutes.js
src/routes/productRoutes.js
src/routes/favoriteRoutes.js
src/routes/cartRoutes.js
src/routes/orderRoutes.js
src/routes/checkoutRoutes.js
src/routes/conversationRoutes.js
src/routes/adminRoutes.js
src/routes/uploadRoutes.js
src/services/tokenService.js
src/services/passwordService.js
src/services/resetTokenService.js
src/services/cartTotals.js
src/services/canTransition.js
src/services/orderSerializer.js
src/services/conversationSerializer.js
src/services/productPayload.js
src/services/adminCustomerSerializer.js
src/services/adminDashboard.js
src/utils/readSearch.js
src/realtime/chat.js
src/scripts/seedAdmin.js
src/scripts/seedDemoCustomer.js
src/scripts/seedProducts.js
src/scripts/seedDeliveredOrder.js
```

## Not in this phase

SMTP send, card payments, extra roles, and profile APIs. Those follow `FRONTEND_DOCUMENTATION.md` in later slices.
