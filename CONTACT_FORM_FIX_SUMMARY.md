# Contact Form Fix - Summary

## Problem Identified ✅

Your contact form isn't working because:

1. **Missing Environment Variables on Vercel** - Your admin portal deployed on Vercel needs 10 environment variables to function properly
2. **Landing Page Configuration** - Your landing page doesn't know where to send contact form submissions
3. **GitHub Secrets** - GitHub Actions needs to know the Vercel URL to build with the correct API endpoint

## What I've Done ✅

I've created the following files to help you fix this:

### 1. **QUICK_FIX.md** 
   - Step-by-step guide to fix the issue in ~10 minutes
   - Lists all 10 required environment variables
   - Includes troubleshooting section

### 2. **VERCEL_SETUP.md**
   - Comprehensive deployment guide
   - Detailed explanations of each environment variable
   - Troubleshooting common CORS and configuration issues

### 3. **setup-env.sh**
   - Interactive script to create your `.env` file
   - Generates random secrets for you
   - Run with: `./setup-env.sh`

### 4. **Updated .gitignore**
   - Added `.env` files to prevent committing secrets

### 5. **Updated GitHub Workflow**
   - Modified `.github/workflows/deploy-landing.yml`
   - Now passes environment variables during build

## What You Need to Do 🚀

### Quick Start (Option 1: Automated Script)

Run this command:

```bash
cd "/Users/macbookpro/Documents/Personal Works/Vibe Coding/Antigravity/R&F City"
./setup-env.sh
```

Then follow the on-screen instructions.

### Manual Setup (Option 2: Step-by-Step)

Follow the instructions in **QUICK_FIX.md** - it will take about 10 minutes.

## The 10 Required Vercel Environment Variables

You need to add these to your Vercel project:

1. ✅ **INSTANT_APP_ID** - From InstantDB dashboard
2. ✅ **INSTANT_ADMIN_TOKEN** - From InstantDB dashboard (Admin section)
3. ✅ **RESEND_API_KEY** - From Resend.com dashboard
4. ✅ **SUPPORT_FROM_EMAIL** - Verified email in Resend (e.g., `admin@rfcity.twd.digital`)
5. ✅ **CONTACT_ALERT_RECIPIENT** - Where to send notifications (e.g., `rfcambodia@163.com`)
6. ✅ **NEXTAUTH_SECRET** - Generate with: `openssl rand -base64 32`
7. ✅ **NEXTAUTH_URL** - Your Vercel URL (e.g., `https://rfcity-admin.vercel.app`)
8. ✅ **PASSWORD_PEPPER** - Generate with: `openssl rand -base64 32`
9. ✅ **CONTACT_ALLOWED_ORIGIN** - Your landing page URL (e.g., `https://rfcity.twd.digital`)
10. ✅ **SITE_BASE_URL** - Same as NEXTAUTH_URL

## GitHub Secrets (For Landing Page Build)

Add these to your GitHub repository secrets (Settings → Secrets and variables → Actions):

1. **VITE_CONTACT_API** - Your Vercel URL + `/api` (e.g., `https://rfcity-admin.vercel.app/api`)
2. **VITE_SHOW_ADMIN_LINK** - `false` (or `true` if you want admin link in navbar)
3. **VITE_ADMIN_PORTAL_URL** - Your Vercel URL (e.g., `https://rfcity-admin.vercel.app`)

## Testing Checklist

After setup, test everything:

- [ ] Visit: https://rfcity.twd.digital
- [ ] Scroll to contact form
- [ ] Fill out all fields
- [ ] Submit the form
- [ ] See success message: "Thanks for reaching out! Our team will respond shortly."
- [ ] Check email (CONTACT_ALERT_RECIPIENT) for notification
- [ ] Log into admin portal at your Vercel URL
- [ ] Go to `/contacts` page
- [ ] Verify your test submission appears there

## Common Issues & Solutions

### Issue: CORS Error
**Symptom:** Browser console shows "blocked by CORS policy"

**Solution:** 
- Make sure `CONTACT_ALLOWED_ORIGIN` in Vercel exactly matches your landing page domain
- No trailing slashes!
- Example: `https://rfcity.twd.digital` (NOT `https://rfcity.twd.digital/`)

### Issue: Form Shows "Unable to send message"
**Symptoms:** Form submission fails immediately

**Solutions:**
1. Check browser console for specific error
2. Verify all 10 Vercel environment variables are set
3. Check Vercel deployment logs for errors
4. Make sure you redeployed after adding env vars

### Issue: No Email Received
**Symptoms:** Form submits successfully but no email notification

**Solutions:**
1. Verify `SUPPORT_FROM_EMAIL` is verified in Resend dashboard
2. Check Resend logs for delivery failures
3. Check spam/junk folder
4. Verify `CONTACT_ALERT_RECIPIENT` email is correct

### Issue: 500 Server Error
**Symptoms:** Form submits but returns error 500

**Solutions:**
1. Check Vercel logs (Dashboard → Project → Latest Deployment → Functions)
2. Look for missing environment variable errors
3. Verify InstantDB credentials are correct
4. Make sure Resend API key is valid

## Files Created

```
/Users/macbookpro/Documents/Personal Works/Vibe Coding/Antigravity/R&F City/
├── QUICK_FIX.md                    ← Start here! 10-minute fix guide
├── VERCEL_SETUP.md                 ← Detailed deployment guide
├── CONTACT_FORM_FIX_SUMMARY.md     ← This file (overview)
├── setup-env.sh                    ← Run this to create .env
├── .gitignore                      ← Updated to ignore .env files
└── .github/workflows/
    └── deploy-landing.yml          ← Updated to use env vars
```

## Next Steps

1. **Read QUICK_FIX.md** - Follow the step-by-step guide
2. **Run setup-env.sh** - Create your .env file (or create it manually)
3. **Configure Vercel** - Add the 10 environment variables
4. **Configure GitHub** - Add the 3 GitHub secrets
5. **Test** - Submit a test contact form

## Need Help?

- **Quick fix:** See `QUICK_FIX.md`
- **Detailed guide:** See `VERCEL_SETUP.md`
- **Check logs:** Vercel Dashboard → Your Project → Deployments → Functions
- **Browser console:** Press F12 and check for errors

## Current Status

- ✅ Identified the problem
- ✅ Created comprehensive documentation
- ✅ Created setup scripts
- ✅ Updated configuration files
- ⏳ **Waiting for you to configure Vercel environment variables**
- ⏳ **Waiting for you to add GitHub secrets**
- ⏳ **Waiting for you to test**

---

**Start with:** `./setup-env.sh` or read `QUICK_FIX.md`

