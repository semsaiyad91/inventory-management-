# Project Documentation: Stock Management System

## Project Overview
This project is a modern, responsive **Stock Management System** built with **Next.js**. It is designed for businesses to track inventory, calculate potential profits, and generate customer invoices. The application features a clean, professional UI styled with Tailwind CSS and uses browser `localStorage` for data persistence, making it a "serverless" client-side application.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4.x
- **Icons:** Lucide React
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Persistence:** Browser `localStorage`

## Architecture & Key Components

### 1. Project Structure
- `app/`: Contains the Next.js App Router structure.
  - `billing/`: Sales and invoice generation module.
  - `products/`: Inventory management module.
  - `components/`: Reusable UI components.
    - `Sidebar.jsx`: Main navigation.
    - `Navbar.jsx`: Top navigation/status bar.
    - `AddProductModal.jsx`: Form for adding new inventory items.
    - `ClientLayout.jsx`: Responsive wrapper providing layout structure.
  - `layout.js`: Root layout setting up fonts and global styles.
  - `page.js`: Dashboard view with business analytics.

### 2. Core Modules
- **Dashboard (`/`):** 
  - Displays high-level stats: Total Products, Total Cartons, Total Investment, and Expected Sales.
  - Highlights "Total Expected Profit" based on current inventory and pricing.
- **Inventory Management (`/products`):** 
  - CRUD operations for products (via `localStorage`).
  - Search functionality.
  - Displays stock details: Cartons, Boxes per Carton, Buy Price, and Sell Price.
- **Billing System (`/billing`):** 
  - Point of Sale (POS) interface.
  - Real-time stock validation (prevents selling more than available).
  - Bill generation with customer details.
  - Printable invoice receipt view.

### 3. Data Schema (Local Storage)
The application uses two primary keys in `localStorage`:
- `stock_management_products`: Array of product objects.
  ```json
  {
    "id": 1,
    "name": "Product Name",
    "cartons": 50,
    "boxesPerCarton": 120,
    "buyPrice": 4.5,
    "sellPrice": 5
  }
  ```
- `stock_management_bills`: Array of generated invoices.
  ```json
  {
    "id": "INV-123456789",
    "date": "28/09/2026, 10:00:00 AM",
    "customerName": "Customer Name",
    "items": [...],
    "grandTotal": 5000
  }
  ```

## UI/UX Design Principles
- **Responsive Design:** Fully functional on mobile, tablet, and desktop.
- **Modern Aesthetic:** Uses a slate and emerald color palette for a professional look.
- **Interactive Feedback:** Modals for data entry and real-time calculations in the billing module.
- **Accessibility:** Uses semantic HTML and clear labeling for navigation and forms.

## Getting Started
1. **Install dependencies:** `npm install`
2. **Run development server:** `npm run dev`
3. **Build for production:** `npm run build`
4. **Start production server:** `npm run start`

## Future Roadmap (Potential Enhancements)
- Backend integration (SQL/NoSQL) for multi-user support.
- Authentication (Login/Register).
- Advanced analytics with charts (Recharts/Chart.js).
- Export functionality (Excel/PDF for reports).
- Barcode scanning support for inventory and billing.
