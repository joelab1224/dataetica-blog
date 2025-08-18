# DataÉtica Blog - Vercel Production Deployment Guide

## 🚀 Quick Deploy

Your project is now **production-ready** for Vercel! Follow these steps:

### 1. Setup Vercel Postgres Database

```bash
# Install Vercel CLI if not already installed
npm i -g vercel@latest

# Login to Vercel
vercel login

# Link your project to Vercel
vercel link

# Add Vercel Postgres to your project
vercel storage create postgres --project dataetica-blog
```

### 2. Configure Environment Variables

In your Vercel Dashboard, add these environment variables:

**Required Variables:**
```env
# Generate a secure JWT secret (64+ characters)
JWT_SECRET=your-secure-64-character-jwt-secret

# Database configuration (automatically set by Vercel Postgres)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://...  # Auto-populated by Vercel

# Security settings
NODE_ENV=production
FORCE_HTTPS=true
COOKIE_SECURE=true
COOKIE_SAMESITE=strict
DOMAIN=your-domain.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Deploy to Production

```bash
# Deploy to production
vercel --prod
```

## 📁 Project Structure

### New Production Files:
- `vercel.json` - Vercel deployment configuration
- `.env.production` - Production environment template
- `DEPLOYMENT.md` - This deployment guide

### Updated Files:
- `prisma/schema.prisma` - Now supports both SQLite (dev) and PostgreSQL (prod)
- `package.json` - Added production deployment scripts

## 🛠 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database operations
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed the database
npm run db:setup         # Complete database setup

# Deployment
npm run vercel-build     # Full production build with DB setup
```

## 🔧 Environment Configuration

### Development (.env)
```env
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

### Production (Vercel Dashboard)
```env
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://...  # From Vercel Postgres
JWT_SECRET=your-secure-secret
NODE_ENV=production
DOMAIN=your-domain.vercel.app
FORCE_HTTPS=true
COOKIE_SECURE=true
COOKIE_SAMESITE=strict
```

## 🗄 Database Setup

### Local Development
```bash
# Uses SQLite automatically
npm install
npm run db:setup
```

### Production
```bash
# Uses PostgreSQL automatically via DATABASE_PROVIDER=postgresql
# Vercel will run: npm run vercel-build
# Which includes: prisma generate && prisma migrate deploy && next build
```

## 🚨 Security Features

### Implemented Security:
- ✅ JWT Authentication with secure secrets
- ✅ Rate limiting on API endpoints
- ✅ Input sanitization and validation
- ✅ CSRF protection via SameSite cookies
- ✅ HTTPS enforcement in production
- ✅ Secure cookie settings
- ✅ Error message sanitization
- ✅ SQL injection protection via Prisma

### Admin Access:
- Default admin created via seed script
- JWT-based authentication
- Role-based access control
- Secure password hashing with bcrypt

## 🌍 Internationalization

### Supported Languages:
- English (en) - Default
- Spanish (es)

### Features:
- Server-side translation
- Client-side language switching
- Automatic language detection
- SEO-friendly URL structure

## 📊 Performance Optimizations

### Build Optimizations:
- Static page generation for blog posts
- Optimized bundle sizes
- Tree shaking enabled
- Automatic code splitting

### Vercel Features:
- Edge runtime for middleware
- Function timeout optimization (10s)
- Automatic deployments from Git
- Preview deployments for branches

## 🔍 Monitoring & Debugging

### Available Logs:
- Vercel function logs
- Application audit logs
- Security event logging
- Database query logging (via Prisma)

### Health Checks:
- API endpoint monitoring
- Database connection status
- Authentication system status

## 📋 Pre-Deployment Checklist

- ✅ Build passes locally (`npm run build`)
- ✅ Environment variables configured
- ✅ Database connection tested
- ✅ JWT secret generated and secure
- ✅ Domain configured correctly
- ✅ SSL/HTTPS enabled
- ✅ Admin user can be created/accessed

## 🆘 Troubleshooting

### Common Issues:

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Database connection issues:**
```bash
# Check environment variables
vercel env ls
# Pull latest env vars
vercel env pull .env.local
```

**Authentication issues:**
- Verify JWT_SECRET is set and secure
- Check cookie settings match your domain
- Ensure HTTPS is enabled in production

## 🎉 Post-Deployment

After successful deployment:

1. **Test admin login** at `https://your-domain.vercel.app/admin/login`
2. **Create your first blog post**
3. **Configure your domain** (optional)
4. **Set up monitoring** (optional)

Your DataÉtica Blog is now live and production-ready! 🚀

---

**Need help?** Check the logs in your Vercel dashboard or run `vercel logs` locally.
