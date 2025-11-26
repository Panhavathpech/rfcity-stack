# Quick Fix for Contact Form Issue

## The Problem
Your contact form isn't working because:
1. ❌ The admin portal on Vercel is missing required environment variables
2. ❌ The landing page doesn't know where your Vercel admin portal is deployed

## Quick Fix Steps

### Step 1: Find Your Vercel URL (1 minute)
1. Go to https://vercel.com/dashboard
2. Click on your admin portal project
3. Copy the deployment URL (e.g., `https://rfcity-admin.vercel.app`)

### Step 2: Add Environment Variables to Vercel (5 minutes)

Go to your Vercel project → **Settings** → **Environment Variables** and add these **10 required variables**:

| Variable Name | Where to Get It | Example |
|---------------|-----------------|---------|
| `INSTANT_APP_ID` | InstantDB Dashboard | `abc123-def456-ghi789` |
| `INSTANT_ADMIN_TOKEN` | InstantDB Dashboard → Admin | Long token string |
| `RESEND_API_KEY` | Resend.com Dashboard | `re_xxxxxxxxx` |
| `SUPPORT_FROM_EMAIL` | Verified email in Resend | `admin@rfcity.twd.digital` |
| `CONTACT_ALERT_RECIPIENT` | Your email | `rfcambodia@163.com` |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | Random string |
| `NEXTAUTH_URL` | Your Vercel URL | `https://rfcity-admin.vercel.app` |
| `PASSWORD_PEPPER` | Generate: `openssl rand -base64 32` | Random string |
| `CONTACT_ALLOWED_ORIGIN` | Your landing page URL | `https://rfcity.twd.digital` |
| `SITE_BASE_URL` | Same as NEXTAUTH_URL | `https://rfcity-admin.vercel.app` |

**Important:** 
- Make sure there are NO trailing slashes in URLs
- `CONTACT_ALLOWED_ORIGIN` must match your landing page domain EXACTLY
- Use `*` for `CONTACT_ALLOWED_ORIGIN` only for testing

### Step 3: Redeploy on Vercel (1 minute)
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy** button

### Step 4: Update Landing Page (2 minutes)

Create `.env` file in the root of your project:

```bash
cd "/Users/macbookpro/Documents/Personal Works/Vibe Coding/Antigravity/R&F City"
cp .env.example .env
```

Then edit `.env` and set:
```env
VITE_CONTACT_API=https://YOUR-VERCEL-URL.vercel.app/api
```

Replace `YOUR-VERCEL-URL.vercel.app` with your actual Vercel URL.

### Step 5: Rebuild and Deploy Landing Page (2 minutes)

```bash
npm run build
```

Then deploy the updated `dist/` folder to A2 Hosting (it will happen automatically on next git push to main).

Or manually trigger the GitHub Action:
1. Go to GitHub → Actions
2. Click "Deploy Landing" workflow
3. Click "Run workflow" → "Run workflow"

### Step 6: Test (1 minute)
1. Go to your landing page: `https://rfcity.twd.digital`
2. Scroll to the contact form
3. Fill it out and submit
4. You should see: "Thanks for reaching out! Our team will respond shortly."
5. Check your email (CONTACT_ALERT_RECIPIENT) for the notification
6. Log into your admin portal and check `/contacts` page

## Generate Random Secrets

Run these commands to generate the required secrets:

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For PASSWORD_PEPPER
openssl rand -base64 32
```

## Still Not Working?

### Check Browser Console (F12)
Look for errors like:
- `CORS error` → Fix CONTACT_ALLOWED_ORIGIN
- `422 Invalid payload` → Check form field names
- `500 Server error` → Check Vercel logs

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click **Functions** tab
4. Look for `/api/contact` errors

### Common Issues

**CORS Error:**
```
Access-Control-Allow-Origin header has a value 'https://example.com' that is not equal to the supplied origin
```
→ Make sure CONTACT_ALLOWED_ORIGIN exactly matches your landing page URL (no trailing slash!)

**Environment variable error:**
```
Error: INSTANT_APP_ID is required
```
→ Double-check all 10 environment variables are set on Vercel, then redeploy

**Email not sending:**
→ Verify SUPPORT_FROM_EMAIL is verified in Resend dashboard

## Need Help?

1. Check the detailed guide: `VERCEL_SETUP.md`
2. Check Vercel logs for specific errors
3. Check browser console for CORS/network errors
4. Verify all environment variables are set correctly

## Checklist

- [ ] Got Vercel URL
- [ ] Added all 10 environment variables to Vercel
- [ ] Redeployed Vercel project (without cache)
- [ ] Created `.env` file in landing page root
- [ ] Set `VITE_CONTACT_API` in `.env`
- [ ] Rebuilt landing page (`npm run build`)
- [ ] Deployed updated landing page
- [ ] Tested contact form
- [ ] Received email notification
- [ ] Verified submission in admin portal

