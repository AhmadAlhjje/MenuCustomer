# Setup Guide - Restaurant Customer App

## Quick Start (5 Minutes)

### Step 1: Install Node.js
Make sure you have Node.js 18+ installed:
```bash
node --version
```

### Step 2: Navigate to Project
```bash
cd customer-app
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment
Create `.env.local` file in root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important**: Replace `http://localhost:5000` with your actual backend URL.

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup Instructions

### 1. Backend API Configuration

The frontend requires a running backend API. Make sure your backend is:

- Running on the URL specified in `.env.local`
- Accessible from the frontend
- CORS enabled for your frontend domain

**Test Backend Connection:**
```bash
curl http://localhost:5000/
```

Should return server health status.

### 2. Postman Collection Integration

The file `postmN.txt` contains the complete Postman collection.

**Import to Postman:**
1. Open Postman
2. Click Import → Upload Files
3. Select `postmN.txt`
4. Collection will be imported with all endpoints

**Configure Environment in Postman:**
- Set `base_url` to your backend URL (e.g., `http://localhost:5000`)
- Run endpoints to test backend functionality

### 3. Environment Variables Explained

**Required:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL

**Note:** All environment variables prefixed with `NEXT_PUBLIC_` are accessible in browser code.

### 4. Development vs Production

**Development Mode:**
```bash
npm run dev
```
- Hot reload enabled
- Source maps available
- Detailed error messages

**Production Build:**
```bash
npm run build
npm start
```
- Optimized bundle
- Minified code
- Better performance

---

## Application Flow

### 1. QR Code Session Start

**URL Pattern:** `/table/{qrCode}`

Example: `http://localhost:3000/table/QR-1-T1-demo`

**Flow:**
1. User scans QR code (or opens link)
2. Enters number of guests
3. Click "Start Session"
4. API Call: `POST /api/sessions/start/{qrCode}`
5. Session ID saved to localStorage
6. Redirect to `/menu`

### 2. Browse Menu

**URL:** `/menu`

**Flow:**
1. Fetch categories: `GET /api/menu/categories`
2. Fetch all items: `GET /api/menu/items`
3. Display categories and items
4. Click category → Navigate to `/menu/{categoryId}`
5. Click item → Navigate to `/item/{itemId}`

### 3. Item Details

**URL:** `/item/{itemId}`

**Flow:**
1. Fetch item: `GET /api/menu/items/{itemId}`
2. Display details (image, description, price, preparation time)
3. Select quantity
4. Add to cart (Redux store)
5. Show success notification

### 4. Shopping Cart

**URL:** `/cart`

**Flow:**
1. Display cart items from Redux store
2. Adjust quantities
3. Add notes per item
4. Add general order notes
5. Calculate total
6. Click "Place Order"
7. API Call: `POST /api/orders`
8. Clear cart
9. Show success message
10. Redirect to `/menu`

### 5. Backend Notes Tool

**URL:** `/backend-notes`

**Purpose:** Track backend issues during development

**Flow:**
1. Add note (title, description, endpoint, type)
2. Store in localStorage
3. Display all notes
4. Download as `backend-fixes.txt`

---

## API Integration Details

All API calls match Postman collection exactly:

### Sessions
```typescript
POST /api/sessions/start/:qrCode
Body: { numberOfGuests: number }
Response: { session: Session }
```

### Menu
```typescript
GET /api/menu/categories
Response: Category[]

GET /api/menu/categories/:id/items
Response: MenuItem[]

GET /api/menu/items
Response: MenuItem[]

GET /api/menu/items/:id
Response: MenuItem
```

### Orders
```typescript
POST /api/orders
Body: {
  sessionId: number,
  items: [{ itemId: number, quantity: number, notes?: string }],
  notes?: string
}
Response: { order: Order }
```

---

## State Management

### Redux Store Structure

```typescript
{
  session: {
    session: Session | null,
    sessionId: number | null
  },
  cart: {
    items: CartItem[],
    orderNotes?: string
  },
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean
  }
}
```

### LocalStorage Keys

- `sessionId` - Active session ID
- `token` - Auth token (optional)
- `user` - User data (optional)
- `language` - Selected language (ar/en)
- `backendNotes` - Backend notes array

---

## Internationalization (i18n)

### Supported Languages

- **Arabic (ar)** - Default, RTL
- **English (en)** - LTR

### Language Switching

User can toggle language via button in header. Preference saved to localStorage.

### Adding New Translations

1. Open `src/translations/ar.json` or `en.json`
2. Add new key-value pairs
3. Use in components via `useI18n()` hook:

```typescript
const { t } = useI18n();
<h1>{t('your.new.key')}</h1>
```

---

## Styling Guide

### TailwindCSS Classes

Use semantic color names from config:

```tsx
<div className="bg-primary text-surface">
<button className="bg-accent hover:bg-opacity-90">
<p className="text-muted">
```

### Custom Colors

| Color | Hex | Usage |
|-------|-----|-------|
| primary | #3A86FF | Primary actions, links |
| secondary | #6C63FF | Secondary actions |
| accent | #FFBE0B | Highlights, badges |
| background | #F7F8FA | Page background |
| surface | #FFFFFF | Cards, panels |
| text | #0F172A | Main text |
| muted | #6B7280 | Secondary text |
| success | #16A34A | Success states |
| error | #EF4444 | Error states |

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Common Issues & Solutions

### Issue: API calls fail with CORS error

**Solution:**
- Enable CORS in backend
- Add frontend URL to allowed origins
- Check backend logs

### Issue: Session not persisting

**Solution:**
- Check localStorage in browser DevTools
- Ensure `sessionId` is saved
- Clear cache and try again

### Issue: Images not loading

**Solution:**
- Check `next.config.js` has correct image domains
- Verify image URLs in API response
- Check network tab for 404 errors

### Issue: Translations not working

**Solution:**
- Check translation files exist: `src/translations/ar.json`, `en.json`
- Verify i18n initialization in `src/utils/i18n.ts`
- Check browser console for errors

### Issue: Build fails

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## Testing the Application

### Manual Testing Checklist

- [ ] Start session with QR code
- [ ] Browse menu categories
- [ ] View item details
- [ ] Add items to cart
- [ ] Adjust quantities in cart
- [ ] Add notes to items
- [ ] Place order successfully
- [ ] Switch language (AR ↔ EN)
- [ ] Test on mobile device
- [ ] Test RTL/LTR layouts

### Testing with Postman

1. Import `postmN.txt` collection
2. Set `base_url` variable
3. Test each endpoint
4. Verify responses match expectations

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your production API URL

### Other Platforms

Works on any Node.js hosting:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Redux Toolkit**: https://redux-toolkit.js.org
- **React i18next**: https://react.i18next.com

---

## License

Private - Restaurant Ordering System
