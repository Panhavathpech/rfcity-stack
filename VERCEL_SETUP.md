# Vercel Deployment Setup Guide

## Issue
The contact form is not working because the admin portal needs proper environment variables configured on Vercel.

## Step 1: Configure Environment Variables on Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add the following:

### Required Variables

1. **INSTANT_APP_ID**
   - Get this from your InstantDB dashboard
   - Example: `abc123-def456-ghi789`

2. **INSTANT_ADMIN_TOKEN**
   - Get this from your InstantDB dashboard (Admin section)
   - This is a long token that allows write access to your database

3. **RESEND_API_KEY**
   - Get this from your Resend dashboard (https://resend.com)
   - Format: `re_xxxxxxxxxxxxxxxxxx`

4. **SUPPORT_FROM_EMAIL**
   - The email address that will send notifications
   - Must be verified in Resend
   - Example: `admin@rfcity.twd.digital`

5. **CONTACT_ALERT_RECIPIENT**
   - The email address that will receive contact form submissions
   - Example: `rfcambodia@163.com` or your preferred inbox

6. **NEXTAUTH_SECRET**
   - Generate a random secret:
   ```bash
   openssl rand -base64 32
   ```
   - Or use: https://generate-secret.vercel.app/32

7. **NEXTAUTH_URL**
   - Your Vercel deployment URL
   - Example: `https://your-admin-portal.vercel.app`

8. **PASSWORD_PEPPER**
   - Another random secret for password security:
   ```bash
   openssl rand -base64 32
   ```

9. **CONTACT_ALLOWED_ORIGIN**
   - The origin of your landing page that's allowed to submit contact forms
   - Example: `https://rfcity.twd.digital`
   - Or use `*` for testing (not recommended for production)

10. **SITE_BASE_URL**
    - Same as NEXTAUTH_URL
    - Example: `https://your-admin-portal.vercel.app`

## Step 2: Redeploy on Vercel

After adding all environment variables:
1. Go to the Deployments tab
2. Click the three dots on the latest deployment
3. Select "Redeploy"
4. Make sure "Use existing Build Cache" is **unchecked**

## Step 3: Configure Landing Page

Your landing page needs to know where the admin portal is deployed.

### Option A: Environment Variable (Recommended)
Add to your landing page deployment (A2 Hosting or wherever it's hosted):

Create/update `.env` file:
```env
VITE_CONTACT_API=https://your-admin-portal.vercel.app/api
```

### Option B: Direct Configuration
Update `src/components/ContactSection.jsx` line 24:
```javascript
const CONTACT_API_BASE = 'https://your-admin-portal.vercel.app/api';
```

## Step 4: Test the Contact Form

1. Open your landing page
2. Fill out the contact form
3. Submit it
4. Check:
   - The form shows "Thanks for reaching out!"
   - You receive an email at CONTACT_ALERT_RECIPIENT
   - The submission appears in your admin portal at `/contacts`

## Troubleshooting

### Form shows "Unable to send message"
- Check browser console for CORS errors
- Verify CONTACT_ALLOWED_ORIGIN matches your landing page domain exactly
- Check Vercel logs for errors

### No email received
- Verify RESEND_API_KEY is correct
- Verify SUPPORT_FROM_EMAIL is verified in Resend
- Check Resend logs for delivery issues

### "Environment variable missing" error
- Double-check all 10 environment variables are set on Vercel
- Make sure there are no typos in variable names
- Redeploy after adding variables

### CORS Error
The error will look like:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Fix:** Set `CONTACT_ALLOWED_ORIGIN` to your exact landing page domain:
- ✅ Correct: `https://rfcity.twd.digital`
- ❌ Wrong: `https://rfcity.twd.digital/`
- ❌ Wrong: `rfcity.twd.digital`

## Quick Checklist

- [ ] All 10 environment variables added to Vercel
- [ ] Vercel project redeployed (without cache)
- [ ] Landing page configured with `VITE_CONTACT_API`
- [ ] Landing page redeployed
- [ ] InstantDB tables created (contacts, users, content_blocks)
- [ ] Resend domain verified
- [ ] Initial admin user created in InstantDB
- [ ] Contact form tested end-to-end

## Need Your Current Vercel URL?

Run this command to find your Vercel deployment URL:
```bash
cd admin-portal
npx vercel ls
```

Or check your Vercel dashboard: https://vercel.com/dashboard

