# دليل البدء السريع - تطبيق الزبائن

## التثبيت والتشغيل (5 دقائق)

### 1. تثبيت المكتبات
```bash
cd customer-app
npm install
```

### 2. إعداد البيئة
أنشئ ملف `.env.local` في المجلد الرئيسي:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**مهم**: استبدل `http://localhost:5000` برابط الباك إند الخاص بك.

### 3. تشغيل التطبيق
```bash
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

---

## البنية الأساسية

### الصفحات الرئيسية

1. **الصفحة الرئيسية** `/`
   - نقطة البداية
   - تحويل تلقائي للقائمة إذا كانت هناك جلسة نشطة

2. **بدء الجلسة** `/table/[qrCode]`
   - مسح QR Code
   - إدخال عدد الأشخاص
   - بدء جلسة جديدة

3. **القائمة** `/menu`
   - عرض الأقسام
   - عرض جميع الأصناف
   - التصفح حسب القسم

4. **تفاصيل الصنف** `/item/[itemId]`
   - صورة وتفاصيل كاملة
   - اختيار الكمية
   - إضافة للسلة

5. **السلة** `/cart`
   - عرض الأصناف المختارة
   - تعديل الكميات
   - إضافة ملاحظات
   - إرسال الطلب

6. **ملاحظات الباك إند** `/backend-notes`
   - أداة تطوير
   - تسجيل المشاكل
   - تحميل الملاحظات

---

## المميزات الرئيسية

### ✅ دعم لغتين (عربي/إنجليزي)
- تبديل اللغة من زر في الأعلى
- دعم RTL للعربية تلقائياً
- جميع النصوص من ملفات الترجمة

### ✅ إدارة الحالة Redux
- **Session**: بيانات الجلسة
- **Cart**: السلة والأصناف
- **Auth**: المصادقة (اختياري)

### ✅ Atomic Design
- **Atoms**: مكونات أساسية (Button, Input, Card)
- **Molecules**: مكونات مركبة (MenuItemCard, CartItemCard)
- **Organisms**: مكونات معقدة (Header)
- **Templates**: قوالب الصفحات (MainLayout)

### ✅ TypeScript كامل
- جميع الملفات مكتوبة بـ TypeScript
- أنواع محددة للـ API
- Type Safety في كل مكان

---

## التكامل مع API

### Endpoints المستخدمة

```typescript
// بدء الجلسة
POST /api/sessions/start/:qrCode

// القائمة
GET /api/menu/categories
GET /api/menu/categories/:id/items
GET /api/menu/items
GET /api/menu/items/:id

// الطلبات
POST /api/orders
```

### Postman Collection
الملف `postmN.txt` يحتوي على جميع الـ Endpoints:
1. افتح Postman
2. Import → اختر الملف `postmN.txt`
3. اضبط `base_url` على رابط الباك إند

---

## هيكل المشروع

```
customer-app/
├── src/
│   ├── app/              # صفحات Next.js
│   ├── api/              # استدعاءات API
│   ├── components/       # مكونات Atomic Design
│   ├── store/            # Redux Store
│   ├── hooks/            # Custom Hooks
│   ├── utils/            # وظائف مساعدة
│   └── translations/     # ملفات الترجمة
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local
```

---

## الألوان المستخدمة

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| Primary | #3A86FF | الأزرار الرئيسية |
| Secondary | #6C63FF | أزرار ثانوية |
| Accent | #FFBE0B | التميز |
| Background | #F7F8FA | خلفية الصفحة |
| Surface | #FFFFFF | الكروت |
| Text | #0F172A | النصوص |
| Success | #16A34A | النجاح |
| Error | #EF4444 | الأخطاء |

---

## الـ Custom Hooks

### `useI18n()`
إدارة اللغات والترجمة
```typescript
const { t, language, changeLanguage, isRTL } = useI18n();
```

### `useSessionGuard()`
حماية الصفحات (تتطلب جلسة نشطة)
```typescript
const { sessionId, hasSession } = useSessionGuard();
```

### `useNotification()`
عرض الإشعارات
```typescript
const { success, error, info } = useNotification();
success('تم بنجاح!');
```

### `useFetch()`
جلب البيانات من API
```typescript
const { data, loading, error, refetch } = useFetch(() => menuApi.getAllItems());
```

---

## الأوامر المتاحة

```bash
# تشغيل التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start

# فحص الكود
npm run lint
```

---

## حل المشاكل الشائعة

### ❌ خطأ CORS
**الحل**: فعّل CORS في الباك إند وأضف رابط الفرونت إند للـ allowed origins

### ❌ الجلسة لا تُحفظ
**الحل**: تحقق من localStorage في المتصفح وتأكد من حفظ `sessionId`

### ❌ الصور لا تظهر
**الحل**: تحقق من `next.config.js` وأضف domains الصور المسموح بها

### ❌ الترجمة لا تعمل
**الحل**: تأكد من وجود ملفات `ar.json` و `en.json` في `src/translations/`

---

## اختبار التطبيق

### قائمة الاختبار
- ✅ بدء جلسة عبر QR
- ✅ تصفح القائمة
- ✅ عرض تفاصيل صنف
- ✅ إضافة للسلة
- ✅ تعديل الكميات
- ✅ إضافة ملاحظات
- ✅ إرسال طلب
- ✅ تبديل اللغة
- ✅ الاختبار على الجوال
- ✅ اختبار RTL/LTR

---

## الدعم

للمشاكل أو الاستفسارات، راجع:
- `README.md` - توثيق كامل بالإنجليزية
- `SETUP_GUIDE.md` - دليل تفصيلي للإعداد
- `PROJECT_STRUCTURE.md` - هيكل المشروع الكامل

---

## الرخصة
خاص - نظام طلبات المطاعم
