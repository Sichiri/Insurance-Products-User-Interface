# Insurance Products Management System

A full-stack application for managing and displaying insurance products with OAuth 2.0 authentication, built with Laravel (Backend) and Vue.js (Frontend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [OAuth 2.0 Configuration](#oauth-20-configuration)
- [Testing](#testing)
- [Project Structure](#project-structure)

## ✨ Features

- **Responsive UI**: Display insurance products in a beautiful grid layout (mobile, tablet, desktop)
- **OAuth 2.0 Authentication**: Secure API endpoints using Resource Owner Password Credentials Grant
- **Product Filtering**: Filter products by type (Health, Life, Auto, Home, Travel, Pet)
- **REST API**: Well-structured API for product management
- **SQLite Database**: Lightweight in-memory database for easy setup

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 12.x
- **Authentication**: Laravel Passport (OAuth 2.0)
- **Database**: SQLite
- **PHP**: 8.2+

### Frontend
- **Framework**: Vue.js 3.x (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4.x
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Vite 7.x

## 📦 Prerequisites

- PHP 8.2 or higher
- Composer 2.x
- Node.js 18.x or higher
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ims
```

### 2. Install Backend Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup

```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Install Passport keys
php artisan passport:install

# Seed the database with sample data
php artisan db:seed
```

## ⚙️ Configuration

### Environment Variables

The `.env` file is pre-configured for local development:

```env
APP_NAME="Insurance Products Management"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
```

### OAuth 2.0 Configuration

The application uses hardcoded credentials for testing (as per requirements):

| Parameter | Value |
|-----------|-------|
| Client ID | `test_client` |
| Client Secret | `test_secret` |
| Grant Type | `password` |

### Test User Credentials

| Username | Password |
|----------|----------|
| `user1` | `pass1` |
| `admin@example.com` | `admin123` |

## 🏃 Running the Application

### Development Mode

Run both backend and frontend in development mode:

```bash
# Terminal 1: Start Laravel backend
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api

### Production Build

```bash
# Build frontend assets
npm run build

# Serve with Laravel
php artisan serve
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/oauth/token`
Issue an access token using OAuth 2.0 Resource Owner Password Credentials Grant.

**Request:**
```json
{
    "grant_type": "password",
    "client_id": "test_client",
    "client_secret": "test_secret",
    "username": "user1",
    "password": "pass1"
}
```

**Response (200 OK):**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 31536000,
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "user1"
    }
}
```

**Error Response (401 Unauthorized):**
```json
{
    "error": "invalid_grant",
    "error_description": "The user credentials were incorrect"
}
```

### Product Endpoints

All product endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

#### GET `/api/products`
Retrieve all insurance products.

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "product_id": "prod_001",
            "name": "Premium Health Plan",
            "type": "HEALTH",
            "coverage": "Full medical + dental",
            "price": "200.00",
            "description": "Comprehensive health insurance...",
            "is_active": true
        }
    ],
    "message": "Products retrieved successfully"
}
```

#### GET `/api/products/{id}`
Retrieve a specific product by product_id.

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "product_id": "prod_001",
        "name": "Premium Health Plan",
        "type": "HEALTH",
        "coverage": "Full medical + dental",
        "price": "200.00"
    },
    "message": "Product retrieved successfully"
}
```

#### GET `/api/user`
Get the authenticated user's information.

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "Test User",
    "email": "user1"
}
```

### Sample API Requests with cURL

```bash
# 1. Get access token
curl -X POST http://localhost:8000/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "client_id": "test_client",
    "client_secret": "test_secret",
    "username": "user1",
    "password": "pass1"
  }'

# 2. Get products (replace <token> with actual token)
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"

# 3. Get single product
curl -X GET http://localhost:8000/api/products/prod_001 \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

## 🧪 Testing

### Run All Tests

```bash
# Run all tests (backend + frontend)
composer test && npm test
```

### Backend Tests (PHPUnit)

```bash
# Run all backend tests
php artisan test

# Or using PHPUnit directly
./vendor/bin/phpunit

# Run specific test file
php artisan test --filter=ProductApiTest
php artisan test --filter=OAuthTest
```

### Frontend Tests (Vitest)

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

**Backend Tests:**
- `tests/Feature/ProductApiTest.php` - Product API endpoint tests
- `tests/Feature/OAuthTest.php` - OAuth 2.0 authentication tests

**Frontend Tests:**
- `resources/js/__tests__/Login.test.js` - Login component tests
- `resources/js/__tests__/ProductCard.test.js` - Product card component tests
- `resources/js/__tests__/authStore.test.js` - Auth store tests
- `resources/js/__tests__/productStore.test.js` - Product store tests

## 📁 Project Structure

```
ims/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php      # OAuth token endpoint
│   │           └── ProductController.php   # Product CRUD operations
│   ├── Models/
│   │   ├── Product.php                     # Product model
│   │   └── User.php                        # User model with Passport
│   └── Providers/
│       └── AuthServiceProvider.php         # Passport configuration
├── config/
│   └── auth.php                            # Auth guards configuration
├── database/
│   ├── migrations/
│   │   └── 2024_01_01_000001_create_products_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── ProductSeeder.php               # Sample products
│       └── UserSeeder.php                  # Test users
├── resources/
│   ├── css/
│   │   └── app.css                         # Tailwind CSS
│   ├── js/
│   │   ├── __tests__/                      # Frontend tests
│   │   │   ├── Login.test.js
│   │   │   ├── ProductCard.test.js
│   │   │   ├── authStore.test.js
│   │   │   └── productStore.test.js
│   │   ├── components/
│   │   │   └── ProductCard.vue             # Product display card
│   │   ├── router/
│   │   │   └── index.js                    # Vue Router configuration
│   │   ├── services/
│   │   │   └── api.js                      # Axios HTTP client
│   │   ├── stores/
│   │   │   ├── auth.js                     # Authentication store
│   │   │   └── products.js                 # Products store
│   │   ├── views/
│   │   │   ├── Login.vue                   # Login page
│   │   │   └── Products.vue                # Products listing page
│   │   ├── App.vue                         # Root Vue component
│   │   └── app.js                          # Vue app entry point
│   └── views/
│       └── app.blade.php                   # Laravel blade template
├── routes/
│   ├── api.php                             # API routes
│   └── web.php                             # Web routes (SPA)
├── tests/
│   └── Feature/
│       ├── OAuthTest.php                   # OAuth endpoint tests
│       └── ProductApiTest.php              # Product API tests
├── .env                                    # Environment configuration
├── composer.json                           # PHP dependencies
├── package.json                            # Node.js dependencies
├── vite.config.js                          # Vite configuration
└── README.md                               # This file
```

## 🔐 OAuth 2.0 Flow

1. **User Login**: User enters credentials on the login page
2. **Token Request**: Frontend sends POST request to `/api/oauth/token` with:
   - `grant_type`: "password"
   - `client_id`: "test_client"
   - `client_secret`: "test_secret"
   - `username`: user's email/username
   - `password`: user's password
3. **Token Response**: Server validates credentials and returns access token
4. **API Access**: Frontend includes token in Authorization header for protected routes
5. **Token Storage**: Token is stored in localStorage for persistence

## 📱 Responsive Design

The UI is fully responsive and optimized for:
- **Mobile**: Single column layout (< 640px)
- **Tablet**: Two column grid (640px - 1024px)
- **Desktop**: Three to four column grid (> 1024px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

For any questions or issues, please open a GitHub issue.
