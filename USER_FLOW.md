# User Flow - Customer Ordering Journey

## Complete User Journey Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    1. CUSTOMER ARRIVAL                      │
│                                                             │
│  Customer scans QR Code on table                           │
│           ↓                                                 │
│  Opens: /table/QR-1-T1-xyz                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    2. START SESSION                         │
│                                                             │
│  Page: /table/[qrCode]                                     │
│  Actions:                                                   │
│    - Enter number of guests (1-20)                         │
│    - Click "Start Session" button                          │
│                                                             │
│  API Call: POST /api/sessions/start/:qrCode                │
│  Request: { numberOfGuests: number }                       │
│  Response: { session: Session }                            │
│                                                             │
│  Storage:                                                   │
│    - sessionId → localStorage                              │
│    - session → Redux store                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
                  Auto Redirect to /menu
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    3. BROWSE MENU                           │
│                                                             │
│  Page: /menu                                               │
│  API Calls:                                                │
│    - GET /api/menu/categories                              │
│    - GET /api/menu/items                                   │
│                                                             │
│  Display:                                                   │
│    - All categories (cards)                                │
│    - All menu items (grid)                                 │
│                                                             │
│  User Can:                                                  │
│    A) Click category → /menu/:categoryId                   │
│    B) Click item → /item/:itemId                           │
│    C) Click "Add to Cart" on any item                      │
└─────────────────────────────────────────────────────────────┘
        ↓                    ↓                    ↓
   [Option A]           [Option B]           [Option C]
        ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  4A. CATEGORY    │  │  4B. ITEM        │  │  4C. ADD TO      │
│      VIEW        │  │      DETAILS     │  │      CART        │
│                  │  │                  │  │                  │
│ /menu/:catId     │  │ /item/:itemId    │  │ - Redux action   │
│                  │  │                  │  │ - Toast message  │
│ API:             │  │ API:             │  │ - Cart updated   │
│ GET /api/menu/   │  │ GET /api/menu/   │  │                  │
│ categories/:id/  │  │ items/:id        │  │ Continue         │
│ items            │  │                  │  │ shopping         │
│                  │  │ Display:         │  │                  │
│ Shows items in   │  │ - Full image     │  │                  │
│ selected         │  │ - Description    │  │                  │
│ category only    │  │ - Price          │  │                  │
│                  │  │ - Prep time      │  │                  │
│                  │  │ - Qty selector   │  │                  │
│                  │  │                  │  │                  │
│ User clicks      │  │ User:            │  │                  │
│ item to view     │  │ - Selects qty    │  │                  │
│ details or       │  │ - Adds to cart   │  │                  │
│ add to cart      │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ↓                    ↓                    ↓
        └────────────────────┴────────────────────┘
                           ↓
              Continue browsing or go to cart
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    5. VIEW CART                             │
│                                                             │
│  Page: /cart                                               │
│  Access: Click cart icon in header (shows item count)      │
│                                                             │
│  Display:                                                   │
│    - All cart items                                         │
│    - Item details, quantities, prices                      │
│    - Individual item notes fields                          │
│    - General order notes field                             │
│    - Total amount calculation                              │
│                                                             │
│  User Can:                                                  │
│    - Adjust quantities (+ / -)                             │
│    - Add notes per item                                     │
│    - Add general order notes                               │
│    - Remove items from cart                                │
│    - Place order                                            │
│                                                             │
│  Empty Cart → Shows message + "Add Items" button           │
└─────────────────────────────────────────────────────────────┘
                           ↓
                  User clicks "Place Order"
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    6. PLACE ORDER                           │
│                                                             │
│  API Call: POST /api/orders                                │
│  Request Body:                                              │
│  {                                                          │
│    sessionId: number,                                       │
│    items: [                                                 │
│      {                                                      │
│        itemId: number,                                      │
│        quantity: number,                                    │
│        notes?: string                                       │
│      }                                                      │
│    ],                                                       │
│    notes?: string                                           │
│  }                                                          │
│                                                             │
│  Response: { order: Order }                                │
│                                                             │
│  On Success:                                                │
│    - Show success toast message                            │
│    - Clear cart (Redux)                                     │
│    - Redirect to /menu                                      │
│                                                             │
│  On Error:                                                  │
│    - Show error toast                                       │
│    - Keep items in cart                                     │
│    - Allow retry                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
                 Order Sent to Kitchen
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    7. POST-ORDER                            │
│                                                             │
│  Customer:                                                  │
│    - Returns to menu                                        │
│    - Can place another order                               │
│    - Same session continues                                 │
│                                                             │
│  No Order Tracking UI                                       │
│    - Customer waits for food                               │
│    - Kitchen manages order status                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Page Flows

### 1. QR Scan → Session Start

**Entry Point:** Customer scans QR code
**URL:** `/table/QR-1-T1-demo`

```
User arrives at table
    ↓
Scans QR code
    ↓
Phone opens: /table/[qrCode]
    ↓
See: "Start Session" page
    ↓
Input: Number of guests (1-20)
    ↓
Click: "Start Session" button
    ↓
API: POST /api/sessions/start/:qrCode
    ↓
Response: session object with ID
    ↓
Store: sessionId in localStorage + Redux
    ↓
Redirect: /menu
```

### 2. Browse Menu

**Page:** `/menu`

```
Load categories (API)
    ↓
Load all items (API)
    ↓
Display:
  - Category cards (clickable)
  - Item cards with:
    • Image
    • Name (AR/EN)
    • Price
    • Prep time
    • "View Details" button
    • "Add to Cart" button
    ↓
User chooses action:
  A) Click category → filter view
  B) Click item → details page
  C) Add to cart directly
```

### 3. Category Filtering

**Page:** `/menu/[categoryId]`

```
API: GET /api/menu/categories/:id/items
    ↓
Display: Only items in this category
    ↓
User can:
  - View item details
  - Add to cart
  - Go back to full menu
```

### 4. Item Details

**Page:** `/item/[itemId]`

```
API: GET /api/menu/items/:id
    ↓
Display:
  - Large image
  - Full description
  - Price
  - Preparation time
  - Availability status
  - Quantity selector (+ / -)
    ↓
User selects quantity
    ↓
Clicks "Add to Cart"
    ↓
Redux: addToCart action
    ↓
Show: Success toast
    ↓
Return to menu
```

### 5. Shopping Cart

**Page:** `/cart`

```
Display cart items from Redux
    ↓
For each item show:
  - Name & image
  - Price × quantity
  - Quantity adjuster
  - Notes field
  - Remove button
    ↓
Show order notes field
    ↓
Calculate total
    ↓
Display "Place Order" button
    ↓
User reviews & clicks "Place Order"
    ↓
API: POST /api/orders
    ↓
Success:
  - Toast: "Order placed successfully!"
  - Clear cart
  - Redirect to /menu
    ↓
Error:
  - Toast: Error message
  - Keep cart intact
  - Allow retry
```

---

## State Management Flow

### Session State

```
Initial: null
    ↓
User starts session
    ↓
API response → Redux: setSession()
    ↓
localStorage: save sessionId
    ↓
State persists across page reloads
```

### Cart State

```
Initial: []
    ↓
User adds item → Redux: addToCart()
    ↓
State updates:
  - items array
  - Calculate total
    ↓
User adjusts qty → Redux: updateQuantity()
    ↓
User adds notes → Redux: updateItemNotes()
    ↓
User places order → API call → Redux: clearCart()
```

### Language State

```
Default: 'ar' (Arabic)
    ↓
User clicks language toggle
    ↓
i18n.changeLanguage()
    ↓
Update:
  - All text translations
  - dir attribute (rtl/ltr)
  - localStorage: save preference
```

---

## Protected Routes

Routes that require active session:

```
/menu → Check sessionId
    ↓
    If null → Redirect to /
    ↓
    If exists → Allow access

/cart → Check sessionId
    ↓
    If null → Redirect to /
    ↓
    If exists → Allow access
```

Implementation: `useSessionGuard()` hook

---

## API Call Sequence

### Full Order Journey

```
1. POST /api/sessions/start/:qrCode
   → Get session ID

2. GET /api/menu/categories
   → Display categories

3. GET /api/menu/items
   → Display all items

4. (Optional) GET /api/menu/categories/:id/items
   → Filter by category

5. (Optional) GET /api/menu/items/:id
   → View item details

6. POST /api/orders
   → Submit order
```

---

## No Features (As Per Requirements)

❌ **NOT INCLUDED:**
- Order status tracking
- Order history
- Payment processing
- Customer authentication (optional)
- Kitchen/admin interfaces
- Real-time order updates
- Push notifications

✅ **INCLUDED:**
- QR session start
- Menu browsing
- Cart management
- Order placement
- Success notification only

---

## Mobile-First Experience

```
1. QR Scan → Opens in phone browser
2. Touch-friendly buttons (large tap targets)
3. Swipe-friendly cards
4. Bottom-fixed cart icon
5. Responsive grid (1 col mobile, 3 cols desktop)
6. Easy quantity adjusters
7. Full-screen item images
8. Comfortable text sizes
```

---

## Error Handling

```
API Error
    ↓
Catch in API client
    ↓
Display error toast
    ↓
Allow user to retry
    ↓
Log to console (dev mode)
```

**Common Errors:**
- Network failure → "Connection error, please retry"
- Invalid session → Redirect to start
- Item unavailable → Disable add to cart
- Order failed → Keep cart, show error, allow retry

---

## End of User Flow Documentation
