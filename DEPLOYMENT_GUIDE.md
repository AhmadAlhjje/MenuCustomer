# Deployment Guide - Restaurant Customer App

## Overview

This guide covers deploying the Next.js customer app to various platforms.

---

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)
### Option 2: Netlify
### Option 3: Docker
### Option 4: Traditional VPS (DigitalOcean, AWS, etc.)

---

## 1️⃣ Deploy to Vercel

**Best for:** Quick deployment, automatic CI/CD, great Next.js support

### Prerequisites
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)

### Method A: Vercel Dashboard (GUI)

1. **Push to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your Git repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL`
   - Set value to your production API URL

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Get your live URL: `your-app.vercel.app`

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd customer-app
vercel

# Follow prompts:
# - Project name
# - Environment variables

# Production deployment
vercel --prod
```

### Environment Variables on Vercel

```bash
# Via CLI
vercel env add NEXT_PUBLIC_API_URL production

# Via Dashboard
Project Settings → Environment Variables
```

---

## 2️⃣ Deploy to Netlify

**Best for:** Alternative to Vercel, great free tier

### Method A: Netlify Dashboard

1. **Push to Git** (same as Vercel)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from Git

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   - Site Settings → Build & deploy → Environment
   - Add `NEXT_PUBLIC_API_URL`

5. **Deploy**
   - Netlify builds and deploys
   - Get URL: `your-app.netlify.app`

### Method B: Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### netlify.toml Configuration

Create `netlify.toml` in root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://your-api.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 3️⃣ Deploy with Docker

**Best for:** Self-hosting, full control, consistent environments

### Dockerfile

Create `Dockerfile` in root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### .dockerignore

Create `.dockerignore`:

```
node_modules
.next
.git
.env.local
*.md
Dockerfile
.dockerignore
```

### Build & Run

```bash
# Build image
docker build -t restaurant-customer-app .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api.com \
  restaurant-customer-app

# Or with docker-compose
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  customer-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5000
    restart: unless-stopped
    depends_on:
      - api

  api:
    image: your-backend-image
    ports:
      - "5000:5000"
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## 4️⃣ Deploy to VPS (DigitalOcean, AWS, etc.)

**Best for:** Full control, custom infrastructure

### Prerequisites
- VPS with Ubuntu 20.04+ or similar
- SSH access
- Domain name (optional but recommended)

### Step 1: Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Git
apt install -y git
```

### Step 2: Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/your-repo/customer-app.git
cd customer-app

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://your-api-domain.com" > .env.local

# Build application
npm run build

# Start with PM2
pm2 start npm --name "customer-app" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/customer-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
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

Enable site:
```bash
ln -s /etc/nginx/sites-available/customer-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

### Step 5: Continuous Deployment

Create deployment script `deploy.sh`:

```bash
#!/bin/bash

cd /var/www/customer-app

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart PM2
pm2 restart customer-app

echo "Deployment completed!"
```

Make executable:
```bash
chmod +x deploy.sh
```

---

## 🔧 Environment Variables

### Production Environment

Required variables:

```env
# Production API URL
NEXT_PUBLIC_API_URL=https://api.your-restaurant.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git
- Use platform-specific environment variable management
- Rotate secrets regularly
- Use HTTPS in production
- Enable CORS on backend for your frontend domain

---

## 📊 Performance Optimization

### Before Deployment

```bash
# Analyze bundle size
npm run build

# Check for unused dependencies
npx depcheck

# Run production build locally
npm run build && npm start
```

### Next.js Optimizations

1. **Image Optimization**
   - Next.js optimizes images automatically
   - Ensure `next.config.js` has correct image domains

2. **Code Splitting**
   - Already handled by Next.js
   - Dynamic imports where needed

3. **Caching**
   - Configure cache headers in `next.config.js`

4. **Compression**
   - Enable gzip/brotli in Nginx or Vercel automatically

---

## 🔍 Monitoring & Debugging

### Check Deployment Status

**Vercel:**
```bash
vercel ls
vercel logs <deployment-url>
```

**Docker:**
```bash
docker ps
docker logs <container-id>
```

**PM2:**
```bash
pm2 status
pm2 logs customer-app
pm2 monit
```

### Common Issues

**Issue: Build fails**
- Check Node.js version (must be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check environment variables

**Issue: API calls fail**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Verify API is accessible from production server

**Issue: Images not loading**
- Add image domains to `next.config.js`
- Check image URLs in API responses

---

## 🚦 Health Checks

### Create Health Check Endpoint

Add to `src/app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

Access at: `https://your-domain.com/api/health`

---

## 📱 Mobile App Deployment (Optional)

### Convert to PWA

1. Add `manifest.json` to `public/`
2. Configure service worker
3. Add meta tags for mobile

### Deploy as Mobile App

- Use Capacitor or React Native Web
- Build native apps for iOS/Android
- Deploy to App Store / Play Store

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Scaling

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Session stickiness not required (stateless)

### CDN Integration

- Use Vercel Edge Network (automatic)
- Or Cloudflare CDN
- Cache static assets

### Database Considerations

- Backend should handle sessions
- Frontend is stateless (except localStorage)
- No database connection needed in frontend

---

## 🔐 Security Checklist

Before deploying:

- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting on API
- [ ] Input validation on all forms
- [ ] XSS protection
- [ ] CSRF tokens (if needed)
- [ ] Secure headers configured
- [ ] Environment variables secured
- [ ] Error messages don't leak info
- [ ] Logging configured

---

## 📞 Support After Deployment

### Monitoring Tools

- **Vercel Analytics** - Built-in
- **Google Analytics** - Add tracking ID
- **Sentry** - Error tracking
- **LogRocket** - Session replay

### Backup Strategy

- Git repository is source of truth
- Regular database backups (backend)
- Environment variables documented

---

## 🎉 Post-Deployment

1. **Test all functionality**
   - QR code scanning
   - Menu browsing
   - Cart operations
   - Order placement

2. **Performance testing**
   - Lighthouse score
   - Page load times
   - Mobile performance

3. **User acceptance testing**
   - Test with real devices
   - Multiple browsers
   - Different screen sizes

---

## End of Deployment Guide

Your app is now deployed and ready for customers! 🎊
