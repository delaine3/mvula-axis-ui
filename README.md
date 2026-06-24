# Mvula Axis UI

Mvula Axis UI is the React frontend for Mvula Axis, a vendor order and disbursement management system.

The app provides screens for viewing dashboard data, managing orders, creating vendors during order creation, and tracking disbursements.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- TanStack Table
- Axios
- Lucide React
- ESLint

## Current Features

- Dashboard landing page
- App shell with sidebar and topbar layout
- Orders list with search, sorting, pagination, and delete actions
- Order creation flow
- Order update flow
- Order details page
- Vendor selection during order creation
- Inline new vendor creation inside the order form
- Disbursements list with search, sorting, pagination, and delete actions
- Disbursement creation flow
- Disbursement update flow
- Disbursement details page
- Shared data table component
- Shared API client using `VITE_API_BASE_URL`

## Project Structure

```txt
src
├── app
│   ├── providers.tsx
│   └── router.tsx
├── components
│   ├── layout
│   └── ui
├── lib
│   ├── apiClient.ts
│   └── config.ts
├── modules
│   ├── columns
│   ├── dashboard
│   ├── disbursements
│   ├── orders
│   └── vendors
├── styles
│   └── globals.css
└── main.tsx
```

## Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Mvula Axis Backend running locally

The backend should be available at:

```txt
http://localhost:8080
```

## Installation

Clone the repo:

```bash
git clone https://github.com/delaine3/mvula-axis-ui.git
cd mvula-axis-ui
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The frontend uses this value for API requests made through the shared Axios client.

## Run the App

Start the development server:

```bash
npm run dev
```

The app runs at:

```txt
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the TypeScript project and creates a production-ready Vite build.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run preview
```

Serves the production build locally for preview.

## Main Routes

```txt
/
```

Dashboard page.

```txt
/orders
```

Orders list with search, sorting, pagination, row navigation, and delete actions.

```txt
/orders/new
```

Create order page.

```txt
/orders/:orderId
```

Order details page.

```txt
/orders/:orderId/update
```

Update order page.

```txt
/disbursements
```

Disbursements list with search, sorting, pagination, row navigation, and delete actions.

```txt
/disbursements/new
```

Create disbursement page.

```txt
/disbursements/:disbursementId
```

Disbursement details page.

```txt
/disbursements/:disbursementId/update
```

Update disbursement page.

## Orders Module

The orders module supports:

- Listing orders
- Searching orders
- Sorting order table columns
- Paginating order results
- Creating orders
- Updating orders
- Viewing order details
- Deleting orders
- Selecting an existing vendor
- Creating a new vendor inside the order form
- Adding multiple order items
- Setting order status
- Marking an order as paid or unpaid

Order statuses used in the form:

```txt
PENDING
ORDERED
DELIVERED
CANCELLED
```

## Vendors Module

The vendors module supports vendor data used by the order form.

Vendor fields include:

- Name
- Category
- Website
- Tax number
- Address
- Contact person
- Contact number
- Email
- Payment terms
- Preferred currency
- Delivery support
- Notes

## Disbursements Module

The disbursements module supports:

- Listing disbursements
- Searching disbursements
- Sorting disbursement table columns
- Paginating disbursement results
- Creating disbursements
- Updating disbursements
- Viewing disbursement details
- Deleting disbursements
- Tracking payee type
- Tracking total charged
- Tracking currency
- Tracking due date
- Tracking payment status
- Adding payment records through the API layer

Payee types:

```txt
EMPLOYEE
CONTRACTOR
SUPPLIER
SERVICE_PROVIDER
LANDLORD
OTHER
```

Disbursement statuses:

```txt
UNPAID
PARTIALLY_PAID
PAID
OVERPAID
CANCELLED
```

## Backend Pairing

This frontend is designed to work with the Mvula Axis backend.

Recommended local setup:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

Set the frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The backend should allow requests from the frontend development server.

## Roadmap

Possible next additions:

- Authentication screens
- Role-based navigation
- Vendor management pages
- User management pages
- Contract management pages
- Billing pages
- Document upload and document tracking
- Payroll pages
- Form validation helpers
- Toast notifications
- Loading skeletons
- Unit tests for components and API helpers
- End-to-end tests for order and disbursement flows
