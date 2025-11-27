# 🎨 مرجع سريع للألوان

## الاستخدام الأساسي

### 🍊 اللون الأساسي (Primary) - برتقالي دافئ
```tsx
// النص
<h1 className="text-primary">عنوان</h1>

// الخلفية
<div className="bg-primary">محتوى</div>

// الحدود
<div className="border-primary">محتوى</div>

// عند التمرير
<button className="hover:bg-primary">زر</button>

// الدرجات
className="bg-primary-50"      // فاتح جداً
className="bg-primary-100"     // فاتح
className="bg-primary"         // عادي (#FF6B35)
className="bg-primary-light"   // متوسط
className="bg-primary-dark"    // داكن
```

### 🥬 اللون الثانوي (Secondary) - أخضر طبيعي
```tsx
className="text-secondary"     // نص أخضر
className="bg-secondary"       // خلفية خضراء (#4CAF50)
className="bg-secondary-light" // أخضر فاتح
className="bg-secondary-dark"  // أخضر داكن
```

### 🌶️ اللون المميز (Accent) - أحمر فاتح
```tsx
className="text-accent"        // نص أحمر
className="bg-accent"          // خلفية حمراء (#FF5252)
className="bg-accent-light"    // أحمر فاتح
className="bg-accent-dark"     // أحمر داكن
```

### 📄 الخلفيات والأسطح
```tsx
className="bg-background"      // خلفية الصفحة (#FFF8F5)
className="bg-surface"         // خلفية البطاقات (#FFFFFF)
```

### ✍️ النصوص
```tsx
className="text-text"          // نص رئيسي (#2C3E50)
className="text-text-light"    // نص ثانوي (#5D6D7E)
className="text-text-muted"    // نص باهت (#95A5A6)
```

### 🔲 الحدود
```tsx
className="border-border"      // حدود عادية (#F0E6DC)
className="border-border-light"// حدود فاتحة (#F8F1EA)
```

## حالات الاستخدام الشائعة

### زر أساسي
```tsx
<button className="bg-primary text-white hover:bg-primary-dark px-6 py-3 rounded-xl">
  إضافة للطلب
</button>
```

### بطاقة منتج
```tsx
<div className="bg-surface border border-border rounded-xl p-4 hover:shadow-lg">
  <h3 className="text-text font-bold">اسم الطبق</h3>
  <p className="text-text-light">الوصف</p>
  <span className="text-primary text-2xl font-bold">25 ريال</span>
</div>
```

### رسالة نجاح
```tsx
<div className="bg-success text-white p-4 rounded-lg">
  تم إضافة الطبق بنجاح
</div>
```

### رسالة خطأ
```tsx
<div className="bg-error text-white p-4 rounded-lg">
  حدث خطأ ما
</div>
```

### زر ثانوي (Outline)
```tsx
<button className="border-2 border-primary text-primary hover:bg-primary-50 px-6 py-3 rounded-xl">
  عرض التفاصيل
</button>
```

## الألوان الدقيقة (HEX Codes)

```css
/* الألوان الأساسية */
--primary: #FF6B35;
--primary-light: #FF8C61;
--primary-dark: #E85A2A;
--primary-50: #FFF4F0;
--primary-100: #FFE8DD;

/* الألوان الثانوية */
--secondary: #4CAF50;
--secondary-light: #66BB6A;
--secondary-dark: #388E3C;

/* الألوان المميزة */
--accent: #FF5252;
--accent-light: #FF6E6E;
--accent-dark: #E63946;

/* الخلفيات */
--background: #FFF8F5;
--surface: #FFFFFF;

/* النصوص */
--text: #2C3E50;
--text-light: #5D6D7E;
--text-muted: #95A5A6;

/* الحدود */
--border: #F0E6DC;
--border-light: #F8F1EA;

/* الحالات */
--success: #4CAF50;
--error: #FF5252;
--warning: #FFA726;
```

## نصائح سريعة

1. **للأزرار الرئيسية**: استخدم `bg-primary text-white`
2. **للأزرار الثانوية**: استخدم `border-primary text-primary`
3. **للنصوص المهمة**: استخدم `text-text` (الافتراضي)
4. **للنصوص الوصفية**: استخدم `text-text-light`
5. **للخلفيات**: استخدم `bg-surface` للبطاقات و `bg-background` للصفحة
6. **للنجاح**: استخدم `text-success` أو `bg-success`
7. **للأخطاء**: استخدم `text-error` أو `bg-error`

---

**ملاحظة**: جميع هذه الألوان معرّفة في [tailwind.config.ts](./tailwind.config.ts)
