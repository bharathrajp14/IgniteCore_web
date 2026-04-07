# Email Service Configuration Guide

This guide helps you set up email notifications for the contact form.

## Option 1: Resend (Recommended - Simplest)

### Setup
1. Create account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

### Implementation
Install Resend:
```bash
npm install resend
```

Update `src/app/api/contact/route.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In the POST handler:
await resend.emails.send({
  from: 'inquiries@yourdomain.com',
  to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
  subject: `New inquiry from ${body.name} (${body.interestType})`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${body.name}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Company:</strong> ${body.company}</p>
    <p><strong>Interest Type:</strong> ${body.interestType}</p>
    <p><strong>Message:</strong></p>
    <p>${body.message.replace(/\n/g, '<br>')}</p>
  `,
});

// Send confirmation to user
await resend.emails.send({
  from: 'inquiries@yourdomain.com',
  to: body.email,
  subject: 'We received your message',
  html: `<p>Hi ${body.name}, thanks for reaching out! We'll get back to you within 24 hours.</p>`,
});
```

---

## Option 2: SendGrid

### Setup
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key with "Mail Send" access
3. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

### Implementation
Install SendGrid:
```bash
npm install @sendgrid/mail
```

Update `src/app/api/contact/route.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// In the POST handler:
await sgMail.send({
  to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
  from: 'inquiries@yourdomain.com',
  subject: `New inquiry from ${body.name}`,
  html: `...email content...`,
});
```

---

## Option 3: Supabase (Database + Email)

### Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create a project, then add `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
   SUPABASE_SERVICE_KEY=eyJxxxxxx
   ```

### Implementation
Install Supabase:
```bash
npm install @supabase/supabase-js
```

Create table in Supabase SQL Editor:
```sql
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  created_at timestamp DEFAULT now()
);
```

Update `src/app/api/contact/route.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// In the POST handler:
const { error } = await supabase
  .from('contacts')
  .insert([{
    name: body.name,
    email: body.email,
    company: body.company,
    message: body.message,
    interest_type: body.interestType,
  }]);

if (error) throw error;
```

---

## Production Environment Variables

Create `.env.production.local` with:
```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=admin@yourdomain.com

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
SUPABASE_SERVICE_KEY=eyJxxxxxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Testing Email Service Locally

1. Update `.env.local` with service credentials
2. Update `src/app/api/contact/route.ts` with your chosen service
3. Run dev server: `npm run dev`
4. Test contact form at http://localhost:3000/#contact
5. Check inbox for test email

---

## Deployment on Vercel

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY` or `SENDGRID_API_KEY`
   - `ADMIN_EMAIL`
   - Any other service keys
4. Deploy!

---

## Monitoring Form Submissions

### Supabase Dashboard
- View all submissions in `contacts` table
- Export CSV for analysis
- Set up alerts for new submissions

### Email Logs
- Resend: Dashboard shows delivery status
- SendGrid: Activity feed tracks bounces, opens
- Supabase: Query database for statistics

### Optional: Add Webhook to Slack
Get notified in Slack when someone submits:
```typescript
// In POST handler after successful submission
await fetch(process.env.SLACK_WEBHOOK_URL!, {
  method: 'POST',
  body: JSON.stringify({
    text: `New inquiry from ${body.name} (${body.interestType})\n${body.company}`,
  }),
});
```

---

## Troubleshooting

**Email not sending?**
- Check API key is valid
- Verify sender domain is verified (Resend, SendGrid)
- Look at service logs for error details

**Wrong recipient?**
- Verify `ADMIN_EMAIL` environment variable
- Check for typos in email addresses

**CORS errors?**
- These shouldn't happen (API calls are server-side)
- Check that endpoint path is correct

**Rate limiting?**
- Resend: 100/day free, then paid
- SendGrid: Check plan limits
- Solution: Upgrade plan or implement rate limiting

