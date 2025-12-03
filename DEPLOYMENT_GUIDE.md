# دليل نشر التطبيق على السيرفر باستخدام Docker

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من توفر:

- ✅ Docker مثبت على السيرفر (الإصدار 20.10 أو أحدث)
- ✅ Docker Compose مثبت (الإصدار 1.29 أو أحدث)
- ✅ Git مثبت على السيرفر
- ✅ الوصول إلى السيرفر عبر SSH
- ✅ البورت 4002 متاح وغير محجوب بجدار الحماية

## 🚀 خطوات النشر

### الطريقة 1: النشر المباشر على السيرفر

#### 1️⃣ الاتصال بالسيرفر
```bash
ssh user@your-server-ip
```

#### 2️⃣ استنساخ المشروع
```bash
# إذا كان المشروع على GitHub
git clone <repository-url>
cd MenuCustomer

# أو رفع الملفات مباشرة باستخدام scp/rsync
```

#### 3️⃣ بناء وتشغيل الـ Container
```bash
# بناء الصورة وتشغيل الـ Container
docker-compose up -d --build

# التحقق من الحالة
docker-compose ps

# مشاهدة السجلات
docker-compose logs -f
```

#### 4️⃣ التحقق من التشغيل
```bash
# اختبار محلياً
curl http://localhost:4002

# من جهاز خارجي
curl http://server-ip:4002
```

### الطريقة 2: بناء الصورة محلياً ورفعها

#### 1️⃣ بناء الصورة محلياً
```bash
# على جهازك المحلي
docker build -t menu-customer-app:latest .

# حفظ الصورة كملف
docker save menu-customer-app:latest > menu-customer-app.tar
```

#### 2️⃣ رفع الصورة للسيرفر
```bash
# نقل الملف للسيرفر
scp menu-customer-app.tar user@server-ip:/path/to/destination/

# على السيرفر: تحميل الصورة
docker load < menu-customer-app.tar
```

#### 3️⃣ تشغيل الـ Container
```bash
docker-compose up -d
```

## ⚙️ إعدادات البيئة

### ملف `.env.production`
```env
NEXT_PUBLIC_API_BASE_URL=http://217.76.53.136:3000
NEXT_PUBLIC_API_URL=http://217.76.53.136:3000
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
PORT=4002
```

### تعديل الإعدادات
إذا كنت تريد تغيير عنوان الـ API أو البورت:

1. عدل ملف `docker-compose.yml`
2. غير قيم `environment` المطلوبة
3. أعد بناء وتشغيل الـ Container:
```bash
docker-compose down
docker-compose up -d --build
```

## 🔍 الأوامر المفيدة

### إدارة الـ Containers

```bash
# عرض الـ Containers العاملة
docker-compose ps

# إيقاف الـ Container
docker-compose stop

# بدء الـ Container
docker-compose start

# إعادة تشغيل الـ Container
docker-compose restart

# إيقاف وحذف الـ Container
docker-compose down

# حذف الـ Container والصور
docker-compose down --rmi all
```

### مراقبة السجلات

```bash
# عرض السجلات الحالية
docker-compose logs

# متابعة السجلات مباشرة
docker-compose logs -f

# عرض آخر 100 سطر
docker-compose logs --tail=100

# سجلات خدمة معينة
docker-compose logs menu-customer-frontend
```

### دخول إلى الـ Container

```bash
# دخول للـ Container
docker-compose exec menu-customer-frontend sh

# تنفيذ أمر واحد
docker-compose exec menu-customer-frontend ls -la
```

### التحقق من الصحة

```bash
# التحقق من استجابة التطبيق
curl http://localhost:4002

# التحقق من healthcheck
docker inspect menu-customer-app | grep Health -A 10

# عرض استهلاك الموارد
docker stats menu-customer-app
```

## 🔧 استكشاف الأخطاء

### المشكلة 1: Container لا يبدأ

```bash
# التحقق من السجلات
docker-compose logs

# التحقق من حالة الـ Container
docker-compose ps

# إعادة البناء من الصفر
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### المشكلة 2: لا يمكن الوصول إلى التطبيق

```bash
# التحقق من البورت
netstat -tulpn | grep 4002

# التحقق من جدار الحماية
sudo ufw status
sudo ufw allow 4002/tcp

# التحقق من أن الـ Container يستمع
docker-compose exec menu-customer-frontend netstat -tulpn
```

### المشكلة 3: خطأ في الاتصال بالـ Backend

```bash
# التحقق من إعدادات البيئة
docker-compose exec menu-customer-frontend env | grep API

# اختبار الاتصال من داخل الـ Container
docker-compose exec menu-customer-frontend wget -O- http://217.76.53.136:3000/api/health

# التحقق من شبكة Docker
docker network inspect menu-customer_menu-network
```

### المشكلة 4: نفاد مساحة القرص

```bash
# حذف الصور غير المستخدمة
docker image prune -a

# حذف الـ Containers المتوقفة
docker container prune

# حذف الشبكات غير المستخدمة
docker network prune

# حذف كل شيء غير مستخدم
docker system prune -a --volumes
```

## 🔄 تحديث التطبيق

### تحديث من Git

```bash
# سحب آخر التحديثات
git pull origin main

# إعادة بناء وتشغيل
docker-compose up -d --build
```

### تحديث يدوي

```bash
# إيقاف الـ Container
docker-compose down

# بناء صورة جديدة
docker-compose build --no-cache

# تشغيل النسخة الجديدة
docker-compose up -d

# التحقق من السجلات
docker-compose logs -f
```

## 📊 المراقبة والصيانة

### النسخ الاحتياطي

```bash
# نسخ احتياطي للصورة
docker save menu-customer-app:latest > backup-$(date +%Y%m%d).tar

# نسخ احتياطي للبيانات (إذا كان هناك volumes)
docker run --rm -v menu-customer-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup-$(date +%Y%m%d).tar.gz /data
```

### تنظيف دوري

قم بإضافة هذا إلى crontab للتنظيف الأسبوعي:

```bash
# تحرير crontab
crontab -e

# إضافة السطر التالي (كل أحد الساعة 3 صباحاً)
0 3 * * 0 docker system prune -f
```

## 🌐 إعداد Reverse Proxy (اختياري)

### استخدام Nginx

```nginx
# /etc/nginx/sites-available/menu-customer
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

تفعيل الإعداد:
```bash
sudo ln -s /etc/nginx/sites-available/menu-customer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### استخدام SSL مع Certbot

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com

# تجديد تلقائي
sudo certbot renew --dry-run
```

## 🔐 الأمان

### توصيات أمنية

1. **استخدم جدار حماية**
```bash
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 4002/tcp  # التطبيق
```

2. **حدد موارد الـ Container**
أضف إلى `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

3. **استخدم متغيرات بيئة آمنة**
لا تضع بيانات حساسة في الكود المصدري

4. **حدّث بانتظام**
```bash
# تحديث Docker
sudo apt update && sudo apt upgrade docker-ce

# تحديث الصور الأساسية
docker-compose pull
docker-compose up -d
```

## 📞 الدعم والمساعدة

### معلومات التطبيق

- **البورت:** 4002
- **عنوان الـ Backend:** http://217.76.53.136:3000
- **البيئة:** Production
- **Container Name:** menu-customer-app

### روابط مفيدة

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**ملاحظة:** تأكد من تحديث جدار الحماية للسماح بالبورت 4002 قبل التشغيل!
