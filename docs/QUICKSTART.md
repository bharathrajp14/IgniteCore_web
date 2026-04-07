# Quick Start Cheat Sheet

## 🚀 Get Running in 5 Minutes

### 1. Install & Start
```bash
npm install              # Install dependencies (one time)
npm run dev             # Start dev server
# Open http://localhost:3000
```

### 2. Edit Content
```bash
# Open this file and update text
code src/lib/businessData.ts

# Website auto-reloads in browser
```

### 3. Test Contact Form
1. Scroll to "Let's Talk" section
2. Fill form with test data
3. Submit
4. See success message

### 4. Deploy
```bash
git add .
git commit -m "Update pitch"
git push origin main
# Automatically deploys to Vercel
```

---

## 📁 Key Files to Know

| File | Purpose | How to Edit |
|------|---------|-----------|
| `src/lib/businessData.ts` | All website content | Direct text editing (no code) |
| `src/app/page.tsx` | Main page layout | Only if adding new sections |
| `src/components/` | Reusable UI parts | JavaScript/React knowledge needed |
| `docs/DEPLOYMENT.md` | How to deploy | Reference when going live |
| `docs/EMAIL_SETUP.md` | Email integration | Follow steps when ready |

---

## 🎯 Most Common Tasks

### Update Hero Text
```typescript
// In src/lib/businessData.ts, find this:
hero: {
  headline: "From Manual WhatsApp to AI-Powered Automation",
  // ↑ Change this text
}
```

### Add a New Statistic
```typescript
// In BUSINESS_DATA.opportunity.stats, add:
{
  label: "Your stat name",
  value: "123M",
  description: "What this means",
}
```

### Update Revenue Numbers
```typescript
// In BUSINESS_DATA.businessModel.streams[0]:
{
  name: "Project Work",
  price: "₹5K–₹80K",  // ← Change pricing here
  // ...
}
```

### Fix a Typo
Use Ctrl+F to find the text, then fix it directly in `businessData.ts`.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Website won't start | Run `npm install` first, then `npm run dev` |
| Changes not showing | Save file (Ctrl+S), refresh browser (F5) |
| Styling looks wrong | Check Tailwind is installed: `npm list tailwindcss` |
| Form not working | Check browser console (F12) for errors |
| Build fails | Run locally: `npm run build` to see errors |

---

## 📊 Business Data Structure

```
BUSINESS_DATA
├── hero                      ← Update headlines
├── problem.painPoints        ← Update pain points
├── opportunity.stats         ← Update market numbers
├── solution.pillars          ← Update 3-pillar approach
├── businessModel.streams     ← Update revenue streams & pricing
├── traction.highlights       ← Update metrics
├── roadmap.phases[0-3]       ← Update quarterly goals
└── financialProjection.months ← Update revenue projections
```

---

## 🚢 Deploy Checklist

- [ ] All content updated in `businessData.ts`
- [ ] Website looks good at localhost:3000
- [ ] Contact form works
- [ ] Mobile view tested (Ctrl+Shift+M in Chrome)
- [ ] Typos fixed
- [ ] Ready? Push to GitHub
- [ ] Check Vercel dashboard for deployment status
- [ ] Share live URL with investors!

---

## 📞 Contact Form Setup (Optional)

For production email notifications:

1. **Sign up** at [resend.com](https://resend.com) (free)
2. **Get API key** from dashboard
3. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_xxxxx
   ADMIN_EMAIL=you@company.com
   ```
4. **Update** `src/app/api/contact/route.ts` with Resend code
5. **Test** the form
6. **Deploy** to Vercel

See `docs/EMAIL_SETUP.md` for full guide.

---

## 🎨 Customization Quick Tips

### Change Brand Color (Purple to Blue)
In components, replace:
- `from-purple-500` → `from-blue-500`
- `border-purple-200` → `border-blue-200`
- `text-purple-600` → `text-blue-600`

### Add Your Logo
1. Place logo in `public/logo.png`
2. In `src/components/Navigation.tsx`, replace text with image:
```typescript
<Image src="/logo.png" width={40} height={40} alt="Logo" />
```

### Change Fonts
1. In `src/app/layout.tsx`, import from Google Fonts
2. Update Tailwind config to use new font

---

## 📈 Important: Update These Regularly

- **Traction metrics** → Add real numbers monthly
- **Financial projections** → Adjust as you hit/miss targets
- **Roadmap** → Move completed goals to past, add new ones
- **Team section** → Add new hires or advisors

**Investors want to see momentum. Update at least monthly.**

---

## 🏁 Next Steps After Launch

1. **Share with investors** → Via personalized email or Calendly link
2. **Track responses** → Monitor form submissions
3. **Follow up** → Have a call-booking system ready
4. **Iterate** → Update content based on feedback
5. **Measure** → Use Google Analytics to track visitor behavior

---

## 🎓 Learning Resources

- Next.js: [nextjs.org/learn](https://nextjs.org/learn)
- Tailwind CSS: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- React: [react.dev](https://react.dev)
- Deployment: See `docs/DEPLOYMENT.md`
- Email Setup: See `docs/EMAIL_SETUP.md`
- Content Editing: See `docs/CONTENT_EDITING.md`

---

## 💡 Pro Tips

✅ **Do:**
- Update content regularly
- Test on real phone
- Get feedback from peers
- Monitor analytics
- Track form submissions

❌ **Don't:**
- Commit `.env.local` to git
- Make sections too long
- Use jargon investors don't understand
- Leave outdated metrics
- Copy competitors word-for-word

---

**That's it! You're ready to build something great. 🚀**

