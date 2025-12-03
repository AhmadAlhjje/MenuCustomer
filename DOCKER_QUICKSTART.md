# 🚀 دليل البدء السريع - Docker

## خطوات التشغيل السريع (3 خطوات فقط!)

### 1️⃣ تأكد من تثبيت Docker
```bash
docker --version
docker-compose --version
```

إذا لم يكن مثبتاً:
```bash
# على Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose

# على CentOS/RHEL
sudo yum install docker docker-compose
sudo systemctl start docker
```

### 2️⃣ بناء وتشغيل التطبيق
```bash
# في مجلد المشروع
docker-compose up -d --build
```

### 3️⃣ تحقق من التشغيل
```bash
# انتظر 30 ثانية ثم اختبر
curl http://localhost:4002

# أو افتح المتصفح
# http://your-server-ip:4002
```

---

## ✅ الأوامر الأساسية

```bash
# بدء التطبيق
docker-compose up -d

# إيقاف التطبيق
docker-compose down

# مشاهدة السجلات
docker-compose logs -f

# إعادة تشغيل
docker-compose restart

# التحقق من الحالة
docker-compose ps
```

---

## 🔧 إعدادات سريعة

### تغيير البورت
عدل في `docker-compose.yml`:
```yaml
ports:
  - "NEW_PORT:4002"  # غير NEW_PORT للبورت المطلوب
```

### تغيير عنوان API الخادم
عدل في `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_BASE_URL=http://NEW_IP:NEW_PORT
  - NEXT_PUBLIC_API_URL=http://NEW_IP:NEW_PORT
```

ثم أعد التشغيل:
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🆘 حل سريع للمشاكل

### التطبيق لا يعمل؟
```bash
# 1. تحقق من السجلات
docker-compose logs

# 2. أعد البناء من الصفر
docker-compose down
docker system prune -f
docker-compose up -d --build

# 3. تحقق من البورت
sudo netstat -tulpn | grep 4002
```

### لا يمكن الوصول من الخارج؟
```bash
# افتح البورت في جدار الحماية
sudo ufw allow 4002/tcp

# أو على CentOS
sudo firewall-cmd --permanent --add-port=4002/tcp
sudo firewall-cmd --reload
```

### نفاد المساحة؟
```bash
# احذف الملفات غير المستخدمة
docker system prune -a --volumes
```

---

## 📊 الإعدادات الافتراضية

| الإعداد | القيمة |
|--------|--------|
| البورت | 4002 |
| API Backend | http://217.76.53.136:3000 |
| Container Name | menu-customer-app |
| Network | menu-network |

---

## 📖 للمزيد من التفاصيل

راجع [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) للدليل الكامل.

---

**نصيحة:** استخدم `docker-compose logs -f` لمتابعة السجلات مباشرة أثناء التشغيل!
