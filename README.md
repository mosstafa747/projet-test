# Beldi Ameublement — Premium Moroccan Furniture E-Commerce

Full-stack e-commerce platform for Moroccan-inspired luxury furniture (React + Laravel + MySQL).

## Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Zustand, Framer Motion, Axios
- **Backend:** Laravel 12, Laravel Sanctum (API auth)
- **Database:** MySQL

## Prerequisites

- PHP 8.2+, Composer
- Node.js 18+
- MySQL 8+

## Setup

### 1. Backend (Laravel)

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Edit `.env`: set `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` for your MySQL.

```bash
composer install
php artisan migrate
php artisan db:seed
php artisan serve
```

API runs at **http://localhost:8000**.

**Seeded users:**

- Customer: `test@example.com` / `password`
- Admin: `admin@beldi.com` / `password`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` to the Laravel backend.

### 3. First run

1. Start MySQL and create a database: `beldi_ameublement` (or the name you set in `.env`).
2. Start Laravel: `cd backend && php artisan serve`.
3. Start the frontend: `cd frontend && npm run dev`.
4. Open http://localhost:5173 and log in with the seeded users.

## Features

- **Shop:** Product catalog, categories, filters, sort, product detail, cart, checkout (Cash / Card / PayPal placeholders).
- **Custom requests:** Form for bespoke furniture (name, email, type, budget, dimensions, image upload). Stored in DB; admin can view and respond.
- **Auth:** Register, login, logout, profile, order history, wishlist (when logged in).
- **Admin:** Products, orders, custom requests, reviews (view/update status). Access at `/admin` with admin user.
- **Content:** Home (hero, categories, best sellers, craftsmanship, testimonials, newsletter), About, Contact.

## Project structure

```
projet_test/
├── backend/          # Laravel API
│   ├── app/Http/Controllers/Api/
│   ├── app/Models/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   └── index.html
└── README.md
```

## API (examples)

- `GET /api/products` — List products (query: category, sort, page, per_page)
- `GET /api/products/:id` — Product detail
- `POST /api/auth/register`, `POST /api/auth/login` — Auth
- `GET /api/users/profile` — Profile (auth)
- `POST /api/orders` — Create order (auth optional)
- `POST /api/custom-requests` — Submit custom request
- Admin: `GET/POST/PUT/DELETE /api/admin/products`, `GET/PUT /api/admin/orders`, etc. (auth + admin)

## Security

- HTTPS in production
- Laravel validation on all inputs
- JWT-style tokens via Laravel Sanctum
- Passwords hashed with bcrypt
- CORS configured via `FRONTEND_URL` in `.env`

## License

MIT.
