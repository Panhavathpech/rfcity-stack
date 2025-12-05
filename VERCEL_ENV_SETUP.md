# Critical: Set Up Vercel Environment Variables NOW

## 🚨 Issue: Admin Panel Login Fails + Contact Form Not Working

Both issues are caused by **missing or incorrect environment variables on Vercel**.

Your local `admin-portal/.env` file does NOT affect Vercel. Vercel needs its own configuration.

## 📋 Step-by-Step: Add Environment Variables to Vercel

### 1. Go to Vercel Dashboard

Open: https://vercel.com/dashboard

### 2. Select Your Project

Click on: **rfcity-stack** (or whatever your project is named)

### 3. Go to Settings

Click: **Settings** (top menu)

### 4. Click Environment Variables

In the left sidebar, click: **Environment Variables**

### 5. Add These 10 Variables

Click **Add New** for each variable:

---

#### Variable 1: INSTANT_APP_ID
- **Key:** `INSTANT_APP_ID`
- **Value:** (Get from InstantDB dashboard - https://instantdb.com/dash)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 2: INSTANT_ADMIN_TOKEN
- **Key:** `INSTANT_ADMIN_TOKEN`
- **Value:** (Get from InstantDB dashboard → Settings → Admin Token)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 3: RESEND_API_KEY
- **Key:** `RESEND_API_KEY`
- **Value:** (Get from Resend dashboard - https://resend.com/api-keys)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 4: SUPPORT_FROM_EMAIL
- **Key:** `SUPPORT_FROM_EMAIL`
- **Value:** Your verified email (e.g., `admin@rfcity.twd.digital`)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 5: CONTACT_ALERT_RECIPIENT
- **Key:** `CONTACT_ALERT_RECIPIENT`
- **Value:** Email to receive notifications (e.g., `rfcambodia@163.com`)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 6: NEXTAUTH_SECRET ⚠️ IMPORTANT
- **Key:** `NEXTAUTH_SECRET`
- **Value:** `31DLn/ci6+dHFOPMpNFUXxe/aL0LpCtCPdFH4gYFbho=`
  (Copy from your local admin-portal/.env file, or generate a new one)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 7: NEXTAUTH_URL ⚠️ CRITICAL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://rfcity-stack.vercel.app`
  (Use your actual Vercel deployment URL - NOT localhost!)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 8: PASSWORD_PEPPER
- **Key:** `PASSWORD_PEPPER`
- **Value:** Generate a new one with: `openssl rand -base64 32`
  Or reuse from local .env if you have one
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 9: CONTACT_ALLOWED_ORIGIN ⚠️ IMPORTANT
- **Key:** `CONTACT_ALLOWED_ORIGIN`
- **Value:** `https://rfcity.twd.digital`
  (Your landing page domain - NO trailing slash!)
- **Environment:** Production, Preview, Development (check all 3)

---

#### Variable 10: SITE_BASE_URL
- **Key:** `SITE_BASE_URL`
- **Value:** `https://rfcity-stack.vercel.app`
  (Same as NEXTAUTH_URL)
- **Environment:** Production, Preview, Development (check all 3)

---

## 🔍 How to Find Your Values

### Get InstantDB Credentials:
1. Go to: https://instantdb.com/dash
2. Select your app
3. Click **Settings** or **Admin**
4. Copy **App ID** and **Admin Token**

### Get Resend API Key:
1. Go to: https://resend.com/api-keys
2. Copy your API key (starts with `re_`)
3. Make sure your sender email is verified in Resend

### Get Your Vercel URL:
1. In Vercel dashboard, click your project
2. Look at the **Domains** section
3. Copy the `.vercel.app` URL (e.g., `https://rfcity-stack.vercel.app`)

### Generate Secrets:
```bash
# Generate NEXTAUTH_SECRET (if you don't have one)
openssl rand -base64 32

# Generate PASSWORD_PEPPER
openssl rand -base64 32
```

## ⚠️ CRITICAL: Check These Common Mistakes

### Mistake 1: Using localhost URLs
❌ BAD: `NEXTAUTH_URL=http://localhost:3000`
✅ GOOD: `NEXTAUTH_URL=https://rfcity-stack.vercel.app`

### Mistake 2: Trailing slashes
❌ BAD: `CONTACT_ALLOWED_ORIGIN=https://rfcity.twd.digital/`
✅ GOOD: `CONTACT_ALLOWED_ORIGIN=https://rfcity.twd.digital`

### Mistake 3: Wrong environment selected
Make sure to check **ALL THREE**: Production, Preview, Development

### Mistake 4: Typos in variable names
Copy the exact names from this guide (case-sensitive!)

## 🚀 After Adding All Variables

### Step 1: Redeploy
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. **IMPORTANT:** Uncheck "Use existing Build Cache"
5. Click **Redeploy**

### Step 2: Wait
Wait 2-3 minutes for the deployment to complete

### Step 3: Test Admin Login
1. Go to: https://rfcity-stack.vercel.app
2. Try logging in with your credentials
3. Should work now! ✅

### Step 4: Test Contact Form
1. Go to: https://rfcity.twd.digital (after adding GitHub secrets)
2. Submit contact form
3. Should work now! ✅

## 📋 Verification Checklist

Before redeploying, verify:

- [ ] All 10 environment variables added to Vercel
- [ ] NEXTAUTH_URL uses your actual Vercel domain (not localhost)
- [ ] NEXTAUTH_SECRET matches your local .env (or is newly generated)
- [ ] CONTACT_ALLOWED_ORIGIN is your landing page domain
- [ ] No trailing slashes in URLs
- [ ] All variables set for Production, Preview, and Development
- [ ] InstantDB credentials are correct
- [ ] Resend API key is valid
- [ ] SUPPORT_FROM_EMAIL is verified in Resend

## 🐛 If Login Still Fails After Redeploying

### Check Vercel Logs:
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click the latest deployment
4. Click **Functions** tab
5. Look for `/api/auth` errors

### Common Error Messages:

**"INSTANT_APP_ID is required"**
→ Environment variable missing or misspelled

**"Invalid credentials"**
→ Either:
- Wrong email/password
- NEXTAUTH_URL is still set to localhost
- PASSWORD_PEPPER doesn't match what was used to hash your password

**"Cannot find module"**
→ Build failed, check build logs

## 💡 Pro Tip: Copy from Local .env

If you have values in your local `admin-portal/.env` that work locally, you can copy them to Vercel. But remember to change:
- `NEXTAUTH_URL` from localhost to your Vercel URL
- `SITE_BASE_URL` from localhost to your Vercel URL
- `CONTACT_ALLOWED_ORIGIN` to your landing page domain

---

## Quick Copy-Paste Template

Here's what your Vercel environment variables should look like:

```
INSTANT_APP_ID=your-instant-app-id
INSTANT_ADMIN_TOKEN=your-instant-admin-token
RESEND_API_KEY=re_your-resend-api-key
SUPPORT_FROM_EMAIL=admin@rfcity.twd.digital
CONTACT_ALERT_RECIPIENT=rfcambodia@163.com
NEXTAUTH_SECRET=31DLn/ci6+dHFOPMpNFUXxe/aL0LpCtCPdFH4gYFbho=
NEXTAUTH_URL=https://rfcity-stack.vercel.app
PASSWORD_PEPPER=your-password-pepper
CONTACT_ALLOWED_ORIGIN=https://rfcity.twd.digital
SITE_BASE_URL=https://rfcity-stack.vercel.app
```

**Next:** Go to Vercel dashboard and add these variables!



