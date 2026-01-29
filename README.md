# 🛂 Visa Slot Tracker - The Flying Panda

A modern, full-stack internal tool for tracking visa slot alerts with a beautiful UI and robust backend.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)

## 🚀 Features

### Backend (Node.js + Express + Drizzle ORM)

- ✅ **RESTful API** with proper HTTP status codes
- ✅ **CRUD Operations** for visa alerts
- ✅ **Query Filters** (country, status)
- ✅ **Pagination** support
- ✅ **Custom Middleware** (logger & validator)
- ✅ **Centralized Error Handling**
- ✅ **PostgreSQL** with Neon DB
- ✅ **Drizzle ORM** for type-safe database queries

### Frontend (Vite + React + shadcn/ui)

- ✅ **Modern UI** with Tailwind CSS & shadcn/ui
- ✅ **Form Validation** with React Hook Form & Zod
- ✅ **Real-time Updates** with optimistic UI
- ✅ **Pagination** with customizable page size
- ✅ **Filters** for country and status
- ✅ **Inline Status Updates**
- ✅ **Delete Confirmation** dialogs
- ✅ **Toast Notifications**
- ✅ **Responsive Design**
- ✅ **Dark Mode** support
- ✅ **Premium Glassmorphism** effects

## 📋 Data Model

Each alert contains:

- `id` - Auto-incrementing primary key
- `country` - Country name (max 100 chars)
- `city` - City name (max 100 chars)
- `visaType` - Tourist | Business | Student
- `status` - Active | Booked | Expired
- `createdAt` - Timestamp

## 🛠️ Tech Stack

**Backend:**

- Node.js & Express
- TypeScript
- Drizzle ORM
- Neon PostgreSQL
- Zod (validation)

**Frontend:**

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- date-fns

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Neon DB account

### 1. Clone & Install

`cd visa-tracker
pnpm install`

### 2. Environment Setup

Create a `.env` file in the root directory:

`DATABASE_URL=your_neon_database_url
PORT=3000
NODE_ENV=development`

### 3. Database Setup

# Generate migration files

```bash
pnpm db:generate
```

# Push schema to database

```bash
pnpm db:push
```

# (Optional) Open Drizzle Studio to view your database

```bash
pnpm db:studio
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```
pnpm server
```

**Terminal 2 - Frontend:**

```
pnpm dev
```

The backend will run on `http://localhost:3000`  
The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### GET `/alerts`

Get all alerts with optional filters and pagination

**Query Parameters:**

- `country` (optional) - Filter by country
- `status` (optional) - Filter by status
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response:**

```
{
"data": [...],
"pagination": {
"page": 1,
"limit": 10,
"total": 50,
"totalPages": 5
}
}
```

### POST `/alerts`

Create a new alert

**Request Body:**

```
{
"country": "United States",
"city": "New York",
"visaType": "Tourist",
"status": "Active"
}
```

### PUT `/alerts/:id`

Update an existing alert

**Request Body:** (all fields optional)

```
{
"status": "Booked"
}
```

### DELETE `/alerts/:id`

Delete an alert

**Response:**

```
{
"message": "Alert deleted successfully"
}
```

## 🎨 UI Features

- **Gradient Backgrounds** - Beautiful blue-to-indigo gradients
- **Glassmorphism** - Frosted glass effects on cards
- **Color-Coded Badges** - Visual status indicators
- **Smooth Animations** - Loading states and transitions
- **Responsive Design** - Works on all screen sizes
- **Dark Mode** - Full dark theme support

## 📁 Project Structure

```
visa-tracker/
├── backend/
│ ├── db/
│ │ └── schema.ts # Database schema
│ ├── middleware/
│ │ ├── logger.ts # Request logger
│ │ └── validator.ts # Zod validators
│ ├── routes/
│ │ └── alerts.ts # Alert routes
│ ├── drizzle.config.ts # Drizzle configuration
│ ├── index.ts # Database connection
│ └── server.ts # Express server
├── src/
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ ├── alert-form.tsx # Create alert form
│ │ ├── alerts-table.tsx # Alerts table
│ │ └── pagination.tsx # Pagination component
│ ├── services/
│ │ └── alertService.ts # API service layer
│ ├── App.tsx # Main app component
│ └── index.css # Global styles
└── package.json
```

## 🔧 Available Scripts

- `pnpm dev` - Start frontend dev server
- `pnpm server` - Start backend server
- `pnpm build` - Build for production
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio

## 🎯 Key Features Implemented

### Backend

✅ Custom middleware (logger + validator)  
✅ Query filters (country, status)  
✅ Pagination with customizable limit  
✅ Proper HTTP status codes (200, 201, 400, 404, 500)  
✅ Centralized error handling  
✅ Input validation with Zod  
✅ Type-safe database queries with Drizzle ORM

### Frontend

✅ Form with validation  
✅ Table/List view  
✅ Update status button  
✅ Delete with confirmation  
✅ Pagination controls  
✅ Filters (country, status)  
✅ API integration  
✅ Toast notifications  
✅ Loading states  
✅ Premium design



**Built with ❤️ by Jeet Das**
