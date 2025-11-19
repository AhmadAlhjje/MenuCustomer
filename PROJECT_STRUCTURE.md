# Complete Project File Structure

```
customer-app/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
│
└── src/
    ├── api/
    │   ├── client.ts
    │   ├── auth.ts
    │   ├── sessions.ts
    │   ├── menu.ts
    │   ├── orders.ts
    │   └── types/
    │       └── index.ts
    │
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── providers.tsx
    │   ├── globals.css
    │   ├── table/
    │   │   └── [qrCode]/
    │   │       └── page.tsx
    │   ├── menu/
    │   │   ├── page.tsx
    │   │   └── [categoryId]/
    │   │       └── page.tsx
    │   ├── item/
    │   │   └── [itemId]/
    │   │       └── page.tsx
    │   ├── cart/
    │   │   └── page.tsx
    │   └── backend-notes/
    │       └── page.tsx
    │
    ├── components/
    │   ├── atoms/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── Select.tsx
    │   │   ├── Card.tsx
    │   │   └── Loading.tsx
    │   ├── molecules/
    │   │   ├── MenuItemCard.tsx
    │   │   ├── CategoryCard.tsx
    │   │   ├── CartItemCard.tsx
    │   │   └── LanguageSwitcher.tsx
    │   ├── organisms/
    │   │   └── Header.tsx
    │   └── templates/
    │       └── MainLayout.tsx
    │
    ├── hooks/
    │   ├── useI18n.ts
    │   ├── useFetch.ts
    │   ├── useSessionGuard.ts
    │   └── useNotification.ts
    │
    ├── store/
    │   ├── index.ts
    │   └── slices/
    │       ├── sessionSlice.ts
    │       ├── cartSlice.ts
    │       └── authSlice.ts
    │
    ├── translations/
    │   ├── ar.json
    │   └── en.json
    │
    └── utils/
        ├── formatters.ts
        ├── validators.ts
        ├── downloadFile.ts
        ├── storage.ts
        └── i18n.ts
```

## File Count Summary

- **Configuration Files**: 7
- **API Layer**: 6 files
- **App Routes**: 7 pages
- **Components**: 15 files
- **Hooks**: 4 files
- **Store**: 4 files
- **Utils**: 5 files
- **Translations**: 2 files

**Total**: ~50 files

## Key Files Description

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - TailwindCSS with custom colors
- `next.config.js` - Next.js configuration
- `.env.local.example` - Environment variables template

### API Layer
- `client.ts` - Axios instance with interceptors
- `auth.ts`, `sessions.ts`, `menu.ts`, `orders.ts` - API endpoints
- `types/index.ts` - All TypeScript interfaces

### App Routes (Next.js App Router)
- `/` - Home page
- `/table/[qrCode]` - QR session start
- `/menu` - Menu listing
- `/menu/[categoryId]` - Category items
- `/item/[itemId]` - Item details
- `/cart` - Shopping cart
- `/backend-notes` - Backend notes tool

### Components (Atomic Design)
**Atoms**: Button, Input, Textarea, Select, Card, Loading
**Molecules**: MenuItemCard, CategoryCard, CartItemCard, LanguageSwitcher
**Organisms**: Header
**Templates**: MainLayout

### Store (Redux Toolkit)
- `sessionSlice` - Session management
- `cartSlice` - Cart state
- `authSlice` - Authentication (optional)

### Hooks
- `useI18n` - Internationalization
- `useFetch` - Data fetching
- `useSessionGuard` - Route protection
- `useNotification` - Toast notifications

### Utils
- `formatters` - Currency and date formatting
- `validators` - Input validation
- `downloadFile` - File download helper
- `storage` - LocalStorage wrapper
- `i18n` - i18next configuration
