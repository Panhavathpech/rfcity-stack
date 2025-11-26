# R&F City Contact Form Architecture

## How It Works (When Properly Configured)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
│                                                                 │
│  Visits: https://rfcity.twd.digital                           │
│  Fills out contact form                                        │
│  Clicks "Send Message"                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ POST request to:
                     │ https://rfcity-admin.vercel.app/api/contact
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              VERCEL (Admin Portal)                              │
│              https://rfcity-admin.vercel.app                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/contact Route Handler                              │  │
│  │  (admin-portal/src/app/api/contact/route.ts)            │  │
│  │                                                           │  │
│  │  1. Validates CORS (CONTACT_ALLOWED_ORIGIN)             │  │
│  │  2. Validates form data                                  │  │
│  │  3. Saves to InstantDB ───────┐                         │  │
│  │  4. Sends email via Resend ───┼──┐                      │  │
│  │  5. Returns success response   │  │                      │  │
│  └────────────────────────────────┼──┼──────────────────────┘  │
│                                   │  │                          │
└───────────────────────────────────┼──┼──────────────────────────┘
                                    │  │
                     ┌──────────────┘  └──────────────┐
                     │                                 │
                     ▼                                 ▼
        ┌────────────────────────┐      ┌────────────────────────┐
        │     InstantDB          │      │      Resend            │
        │                        │      │                        │
        │  Stores contact        │      │  Sends email to:       │
        │  submission in         │      │  CONTACT_ALERT_        │
        │  'contacts' table      │      │  RECIPIENT             │
        │                        │      │                        │
        │  Viewable at:          │      │  From:                 │
        │  /contacts page        │      │  SUPPORT_FROM_EMAIL    │
        └────────────────────────┘      └────────────────────────┘
```

## Current Status: ❌ NOT WORKING

### Why It's Broken

```
Landing Page (https://rfcity.twd.digital)
    │
    │ Trying to POST to: ???
    │ (VITE_CONTACT_API not configured)
    │
    ▼
Admin Portal (https://rfcity-admin.vercel.app)
    │
    ├─ ❌ Missing: INSTANT_APP_ID
    ├─ ❌ Missing: INSTANT_ADMIN_TOKEN
    ├─ ❌ Missing: RESEND_API_KEY
    ├─ ❌ Missing: SUPPORT_FROM_EMAIL
    ├─ ❌ Missing: CONTACT_ALERT_RECIPIENT
    ├─ ❌ Missing: NEXTAUTH_SECRET
    ├─ ❌ Missing: NEXTAUTH_URL
    ├─ ❌ Missing: PASSWORD_PEPPER
    ├─ ❌ Missing: CONTACT_ALLOWED_ORIGIN
    └─ ❌ Missing: SITE_BASE_URL
    │
    └─ Result: API route fails or blocks requests
```

## What Needs to Happen

### 1. Landing Page Configuration

**File:** `.env` (in project root)

```env
VITE_CONTACT_API=https://rfcity-admin.vercel.app/api
```

This tells the contact form where to send submissions.

**Location in code:** `src/components/ContactSection.jsx` line 24
```javascript
const CONTACT_API_BASE = (import.meta.env.VITE_CONTACT_API || '/api')
```

### 2. Vercel Environment Variables

**Location:** Vercel Dashboard → Project → Settings → Environment Variables

These 10 variables enable the API to:
- ✅ Save data to InstantDB
- ✅ Send email notifications
- ✅ Authenticate requests
- ✅ Handle CORS properly

### 3. GitHub Secrets

**Location:** GitHub → Repository → Settings → Secrets and variables → Actions

These allow GitHub Actions to build the landing page with the correct API URL.

## Data Flow (When Working)

```
1. User fills form on landing page
   ↓
2. JavaScript sends POST to VITE_CONTACT_API
   ↓
3. Vercel receives request at /api/contact
   ↓
4. Checks CONTACT_ALLOWED_ORIGIN (CORS)
   ↓
5. Validates form data (Zod schema)
   ↓
6. Saves to InstantDB using INSTANT_APP_ID + INSTANT_ADMIN_TOKEN
   ↓
7. Sends email using RESEND_API_KEY
   - From: SUPPORT_FROM_EMAIL
   - To: CONTACT_ALERT_RECIPIENT
   ↓
8. Returns success response
   ↓
9. User sees: "Thanks for reaching out!"
```

## Environment Variables Explained

### Landing Page (.env)
```env
# Where to send contact form submissions
VITE_CONTACT_API=https://rfcity-admin.vercel.app/api

# Optional: Show admin portal link in navbar
VITE_SHOW_ADMIN_LINK=false

# Optional: URL for admin portal link
VITE_ADMIN_PORTAL_URL=https://rfcity-admin.vercel.app
```

### Admin Portal (Vercel)

**Database:**
- `INSTANT_APP_ID` - Your InstantDB app identifier
- `INSTANT_ADMIN_TOKEN` - Admin access token for writes

**Email:**
- `RESEND_API_KEY` - API key from Resend
- `SUPPORT_FROM_EMAIL` - Verified sender email
- `CONTACT_ALERT_RECIPIENT` - Where to send notifications

**Authentication:**
- `NEXTAUTH_SECRET` - Encrypts JWT tokens
- `NEXTAUTH_URL` - Your Vercel deployment URL
- `PASSWORD_PEPPER` - Extra password security

**CORS:**
- `CONTACT_ALLOWED_ORIGIN` - Who can POST to /api/contact
- `SITE_BASE_URL` - Base URL for email links

## CORS Explained

CORS (Cross-Origin Resource Sharing) is a security feature that prevents unauthorized websites from making requests to your API.

```
Landing Page Domain:  https://rfcity.twd.digital
Admin Portal Domain:  https://rfcity-admin.vercel.app

These are DIFFERENT domains (cross-origin)!

Without CONTACT_ALLOWED_ORIGIN, the browser blocks the request.
```

**Solution:** Set `CONTACT_ALLOWED_ORIGIN=https://rfcity.twd.digital`

This tells the browser: "Yes, rfcity.twd.digital is allowed to POST to this API."

## Testing Flow

```
1. Configure all environment variables
   ↓
2. Redeploy Vercel (without cache)
   ↓
3. Rebuild landing page with new VITE_CONTACT_API
   ↓
4. Deploy landing page
   ↓
5. Open https://rfcity.twd.digital
   ↓
6. Fill out contact form
   ↓
7. Submit
   ↓
8. Check for success message ✓
   ↓
9. Check email inbox ✓
   ↓
10. Log into admin portal ✓
   ↓
11. Check /contacts page ✓
```

## Quick Commands

```bash
# Navigate to project
cd "/Users/macbookpro/Documents/Personal Works/Vibe Coding/Antigravity/R&F City"

# Run setup script
./setup-env.sh

# Generate secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 32  # For PASSWORD_PEPPER

# Build landing page
npm run build

# Check if build includes env vars
grep -r "VITE_CONTACT_API" dist/

# Test API endpoint (after Vercel is configured)
curl -X POST https://rfcity-admin.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://rfcity.twd.digital" \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"123456789","message":"Test message"}'
```

## Files You Need to Edit

1. **`.env`** (create this) - Landing page configuration
2. **Vercel Environment Variables** (via dashboard) - Admin portal configuration
3. **GitHub Secrets** (via GitHub settings) - Build-time configuration

## Files I've Created to Help You

- `CONTACT_FORM_FIX_SUMMARY.md` - Overview (start here)
- `QUICK_FIX.md` - Step-by-step 10-minute fix
- `VERCEL_SETUP.md` - Detailed deployment guide
- `ARCHITECTURE.md` - This file (architecture explanation)
- `setup-env.sh` - Automated setup script

---

**Next Step:** Run `./setup-env.sh` or read `QUICK_FIX.md`

