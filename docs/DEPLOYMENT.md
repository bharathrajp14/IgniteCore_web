# Deployment Guide

Complete step-by-step guide to deploy your pitch deck website.

---

## Deployment Platforms

### 1. Vercel (Recommended)

**Why Vercel?**
- Made by Next.js creators
- 1-click deployments
- Free tier with generous limits
- Automatic HTTPS, CDN, serverless functions
- ₹0 for small projects

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your/repo
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Click Import

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add each variable from `.env.local`:
     ```
     RESEND_API_KEY=re_xxxxx
     ADMIN_EMAIL=admin@yourdomain.com
     ```

4. **Deploy**
   - Click Deploy
   - Done! Your site is live

5. **Custom Domain**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records (Vercel shows instructions)

---

### 2. Netlify

**Steps:**

1. **Connect GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Authorize GitHub
   - Select your repo

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add your variables

4. **Deploy**
   - Automatic deployment on every git push

---

### 3. AWS (For Scale)

**If you need advanced features:**
- AWS Amplify
- AWS CloudFront + S3 (static export)
- EC2 + Load Balancer (custom VPS)

Not recommended for MVP unless you have specific AWS requirements.

---

## Domain Setup

### 1. Buy Domain
- [namecheap.com](https://namecheap.com) (affordable)
- [google.com/domains](https://google.com/domains) (simple)
- [route53.aws](https://route53.aws) (if using AWS)

### 2. Point to Vercel
Example for `aistudio.com`:

**In Vercel (Settings → Domains):**
- Add domain `aistudio.com`
- Copy nameserver addresses

**In your domain registrar:**
- Update nameservers to Vercel's
- Wait 24-48 hours for DNS propagation

**Or use CNAME (faster):**
- Create CNAME record: `aistudio.com` → `cname.vercel-dns.com`
- Verify in Vercel dashboard

---

## SSL Certificate

**Automatic (Free):**
- Vercel automatically issues SSL via Let's Encrypt
- No action needed
- Auto-renews

**Custom certificate:**
- Upload to Vercel in Settings → Security → SSL

---

## Performance Optimization

### 1. Enable Compression
Already enabled by default in Next.js/Vercel.

### 2. Image Optimization
Next.js Image component already handles this.

### 3. Monitor Performance
```bash
npm run build
npm run start
# Open http://localhost:3000 and test
```

Use Lighthouse in Chrome DevTools to check:
- Performance
- SEO
- Best Practices

---

## Analytics & Monitoring

### Google Analytics

1. **Create GA Account**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create property for your domain
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to `.env.local`**
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Add to `src/app/layout.tsx`**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
         </body>
       </html>
     )
   }
   ```

### Vercel Analytics
- Automatic in paid plans
- Shows page performance, error rates
- No setup needed

---

## Security Checklist

- [ ] SSL certificate enabled (automatic on Vercel)
- [ ] Environment variables set (never commit secrets)
- [ ] CORS configured (if needed)
- [ ] Form validation on server & client
- [ ] Rate limiting on contact API
- [ ] HTTPS redirect (automatic)
- [ ] Security headers enabled (Vercel default)

---

## Continuous Deployment

### Automatic Deployments
- Every git push to `main` → auto-deploy to production
- Every PR → preview deployment

### Manual Deployments
Vercel: Click "Redeploy" in dashboard
Netlify: Automatic or manual trigger

---

## Backup Strategy

### GitHub as Backup
- Code is already in GitHub
- Push regularly with meaningful commits
- Tag releases for important versions

Example:
```bash
git tag -a v1.0.0 -m "Initial launch"
git push origin v1.0.0
```

### Database Backups (if using Supabase)
- Supabase handles automatic daily backups
- Download manual backups from dashboard
- Retention: 7 days on free tier

---

## Team Collaboration

### Environment Variables (Shared)
Team members should have `.env.local` with:
- Same email service credentials
- Same database connection strings

**Never commit `.env.local` to git**

### Git Workflow
1. Create feature branch: `git checkout -b feature/new-section`
2. Make changes
3. Commit: `git commit -m "Add team section"`
4. Push: `git push origin feature/new-section`
5. Create PR on GitHub
6. Merge after review

---

## Scaling Considerations

### Current Setup Handles
- ✅ 1,000 visitors/month
- ✅ 500 form submissions/month
- ✅ 99.99% uptime

### When to Upgrade
- If you need advanced analytics → Vercel Pro ($20/mo)
- If you need database scale → Supabase Pro ($25/mo)
- If you need redundancy → Multi-region deployment

---

## Cost Estimate

| Service | Free Tier | Production |
|---------|-----------|-----------|
| Hosting (Vercel) | Yes | $20-100/mo |
| Domain | $10/year | $10/year |
| Email (Resend) | 100/day | Pay per email |
| Analytics (GA) | Free | Free |
| Database (Supabase) | 500MB | $25-100/mo |
| **Total** | **~$10/year** | **$50-150/mo** |

---

## Troubleshooting Deployment

**Problem: Deployment fails**
- Check build logs in Vercel dashboard
- Verify all imports are correct
- Run `npm run build` locally to debug

**Problem: Environment variables not working**
- Re-check spelling in Vercel dashboard
- Add to both `Production` and `Preview` environments
- Redeploy after adding variables

**Problem: Site loads slow**
- Check network tab in browser DevTools
- Use Lighthouse to audit
- Optimize images (Next.js Image component)

**Problem: Form submissions not working**
- Check API endpoint logs
- Verify email service credentials
- Check `console.log` in `/api/contact` response

---

## Post-Launch Checklist

- [ ] Domain configured and pointing to site
- [ ] SSL certificate verified (green lock)
- [ ] Contact form tested and working
- [ ] All sections load correctly
- [ ] Mobile responsive verified
- [ ] Analytics tracking code installed
- [ ] Email notifications working
- [ ] Backup strategy in place
- [ ] Team members have access
- [ ] Monitoring/alerts configured

---

## Next Steps

1. **Add Content**
   - Update all text in `businessData.ts`
   - Add real client logos/testimonials
   - Add case studies section

2. **Integrate Email**
   - Set up Resend/SendGrid
   - Test form submissions
   - Monitor delivery

3. **Monitor Performance**
   - Watch Vercel analytics
   - Monitor form submissions
   - Track GA for visitor behavior

4. **Iterate & Improve**
   - A/B test CTAs
   - Optimize conversion funnel
   - Add retargeting pixels

---

## Questions?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Resend Docs: [resend.com/docs](https://resend.com/docs)

