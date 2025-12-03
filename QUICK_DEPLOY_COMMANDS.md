# 🎯 أوامر النشر السريع

## نسخ المشروع للسيرفر

```bash
# من جهازك المحلي - نسخ المشروع للسيرفر
scp -r MenuCustomer user@server-ip:/path/to/destination/

# أو باستخدام rsync (أسرع)
rsync -avz --progress MenuCustomer/ user@server-ip:/path/to/destination/MenuCustomer/
```

## على السيرفر - التثبيت والتشغيل

```bash
# 1. الاتصال بالسيرفر
ssh user@server-ip

# 2. الانتقال للمجلد
cd /path/to/MenuCustomer

# 3. جعل السكريبت قابل للتنفيذ
chmod +x deploy.sh

# 4. تشغيل التطبيق
./deploy.sh deploy
```

## الأوامر الأساسية

```bash
# بدء التطبيق
docker-compose up -d

# إيقاف التطبيق
docker-compose down

# إعادة التشغيل
docker-compose restart

# عرض السجلات
docker-compose logs -f

# التحقق من الحالة
docker-compose ps
```

## اختبار التطبيق

```bash
# من السيرفر نفسه
curl http://localhost:4002

# من جهاز آخر
curl http://SERVER_IP:4002

# أو افتح المتصفح
http://SERVER_IP:4002
```

## فتح البورت في جدار الحماية

```bash
# Ubuntu/Debian
sudo ufw allow 4002/tcp
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=4002/tcp
sudo firewall-cmd --reload
```

## التحديث

```bash
# سحب آخر التغييرات
git pull

# إعادة البناء والتشغيل
docker-compose down
docker-compose up -d --build
```

## حل المشاكل السريع

```bash
# إعادة البناء الكاملة
docker-compose down
docker system prune -f
docker-compose up -d --build

# عرض السجلات التفصيلية
docker-compose logs --tail=100
```

---

**ملاحظة:** استبدل `user@server-ip` و `SERVER_IP` بالقيم الفعلية!
