# MiniCom - E-commerce Application

A modern e-commerce web application built with Next.js, featuring office supplies sales with full shopping cart functionality, user authentication, and payment processing.

## 🚀 Features

- **Product Catalog**: Browse office supplies across multiple categories (Pens, Notebooks, Staplers, Sticky Notes, Organizers)
- **User Authentication**: Email/password and Google OAuth authentication
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Product Search**: Search functionality across all products
- **Admin Panel**: Product management (create, edit, delete) for administrators
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **File Upload**: Image upload functionality for product management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payment**: Stripe
- **File Storage**: Vercel Blob
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Heroicons, Lucide React, Font Awesome


## 📱 Key Pages

- **Home** (`/`) - Product categories overview
- **Categories** (`/categories/[category]`) - Product listings by category
- **Product Details** (`/categories/products/[productId]`) - Individual product pages
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Payment processing
- **Authentication** (`/login`, `/register`) - User authentication
- **Admin Panel** (`/admin`) - Product management (admin only)

## 🔒 Authentication & Authorization

- **User Roles**: `user` (default) and `admin`
- **Admin Access**: Protected routes for product management
- **Session Management**: Firebase Auth with persistent sessions
- **Google OAuth**: One-click authentication option

## 💳 Payment Integration

- **Stripe Checkout**: Secure payment processing
- **Webhook Handling**: Order confirmation and inventory updates
- **Payment Status**: Success and cancellation page handling

## 🎨 UI/UX Features

- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Toast Notifications**: User feedback for actions
- **Color Scheme**: Cyan-based theme with professional styling

## 🔧 Development Notes

- **State Management**: React Context for cart and authentication
- **Form Validation**: Zod schemas with React Hook Form
- **Type Safety**: Full TypeScript implementation
- **SSR/Client Hydration**: Proper handling of server-side rendering
- **Image Optimization**: Next.js Image component with responsive sizing

## 📦 Key Dependencies

- `next`: React framework with App Router
- `firebase`: Backend services (Auth, Firestore)
- `stripe`: Payment processing
- `@vercel/blob`: File storage
- `react-hook-form`: Form management
- `zod`: Schema validation
- `tailwindcss`: Utility-first CSS framework


## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please follow the established code style and patterns when making changes.
