# Restaurant Customer App - Frontend

A complete Next.js 14 customer-facing application for restaurant ordering system built with TypeScript, Redux Toolkit, and TailwindCSS.

## Features

- 🎯 QR Code Session Start
- 🍽️ Browse Menu by Categories
- 🛒 Shopping Cart Management
- 📝 Order Placement
- 🌐 Bilingual Support (Arabic/English)
- 🎨 RTL Support for Arabic
- 📱 Mobile-First Responsive Design
- 🔔 Toast Notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Internationalization**: react-i18next
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx                  # Home page
│   ├── providers.tsx             # Redux & Toast providers
│   ├── globals.css
│   ├── table/[qrCode]/page.tsx   # QR Session start
│   ├── menu/
│   │   ├── page.tsx              # Menu listing
│   │   └── [categoryId]/page.tsx # Category items
│   ├── item/[itemId]/page.tsx    # Item details
│   ├── cart/page.tsx             # Shopping cart
│   └── backend-notes/page.tsx    # Backend notes tool
├── api/                          # API client layer
│   ├── client.ts                 # Axios instance
│   ├── types/                    # TypeScript types
│   ├── auth.ts
│   ├── sessions.ts
│   ├── menu.ts
│   └── orders.ts
├── components/                   # Atomic Design Components
│   ├── atoms/                    # Basic elements
│   ├── molecules/                # Composite components
│   ├── organisms/                # Complex components
│   └── templates/                # Page layouts
├── store/                        # Redux store
│   ├── index.ts
│   └── slices/
│       ├── sessionSlice.ts
│       ├── cartSlice.ts
│       └── authSlice.ts
├── hooks/                        # Custom React hooks
│   ├── useI18n.ts
│   ├── useFetch.ts
│   ├── useSessionGuard.ts
│   └── useNotification.ts
├── utils/                        # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── downloadFile.ts
│   ├── storage.ts
│   └── i18n.ts
└── translations/                 # i18n translations
    ├── ar.json                   # Arabic
    └── en.json                   # English
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your backend API URL.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Integration

The application is fully integrated with the backend API based on the Postman collection. All endpoints are matched exactly:

- **Sessions**: `POST /api/sessions/start/:qrCode`
- **Menu**: `GET /api/menu/categories`, `GET /api/menu/items`
- **Orders**: `POST /api/orders`

### API Configuration

All API calls use the base URL from environment variables. The API client includes:

- Automatic token injection
- Error handling
- Request/Response interceptors

## Key Features Explained

### 1. QR Code Session

Users scan a QR code at their table to start a session:
- Route: `/table/[qrCode]`
- Enter number of guests
- Session ID stored in localStorage

### 2. Menu Browsing

- View all categories
- Browse items by category
- View item details with image, description, price
- Add items to cart with quantity

### 3. Shopping Cart

- View cart items
- Adjust quantities
- Add notes per item
- Add general order notes
- Calculate total automatically
- Place order

### 4. Backend Notes Tool

Development tool for tracking backend issues:
- Add notes with title, description, endpoint, type
- Store locally in browser
- Download as `backend-fixes.txt`

## Internationalization

The app supports Arabic (RTL) and English (LTR):

- Toggle language via top-right button
- All text from JSON translation files
- Automatic RTL/LTR layout switching
- Language preference saved in localStorage

## Color Palette

```css
Primary: #3A86FF
Secondary: #6C63FF
Accent: #FFBE0B
Background: #F7F8FA
Surface: #FFFFFF
Text: #0F172A
Muted: #6B7280
Success: #16A34A
Error: #EF4444
```

## Routes

- `/` - Home (redirects to /menu if session exists)
- `/table/[qrCode]` - Start session
- `/menu` - Browse menu
- `/menu/[categoryId]` - Category items
- `/item/[itemId]` - Item details
- `/cart` - Shopping cart
- `/backend-notes` - Backend notes tool

## State Management

Redux Toolkit slices:

1. **Session**: Stores active session data
2. **Cart**: Manages cart items, quantities, notes
3. **Auth**: User authentication (optional for customers)

## Protected Routes

Routes requiring active session:
- `/menu`
- `/cart`
- All menu-related pages

Redirect to home if no session found.

## Postman Collection

The included Postman collection (`postmN.txt`) contains all API endpoints. Import it to test the backend:

1. Import `postmN.txt` into Postman
2. Set `base_url` variable to your backend URL
3. Test all endpoints

## Development Notes

### No Mock Data

All data comes from real API calls - no mock data included.

### Type Safety

All API responses and component props are fully typed.

### Reusable Components

Atomic design pattern ensures components are modular and reusable.

### Error Handling

- All API errors shown via toast notifications
- Loading states for async operations
- Validation before submission

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - Restaurant Ordering System

## Support

For issues or questions, please create an issue in the repository.
