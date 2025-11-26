# Debug Contact Form - Step by Step

## ✅ Good News: API is Working!

I tested your API and it's working perfectly:
```bash
curl -k -X POST https://rfcity-stack.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://rfcity.twd.digital" \
  -d '{"fullName":"Test User","email":"test@example.com"}'

# Response: Success! Contact created.
```

So the issue is with the **landing page**, not the API.

## 🔍 Step 1: Check What Error You're Getting

1. Open https://rfcity.twd.digital
2. Press **F12** (or `Cmd + Option + I` on Mac)
3. Click the **Console** tab
4. Click **Clear Console** button (🚫 icon)
5. Fill out and submit the contact form
6. Look for the error message

### Common Errors You Might See:

#### Error Type 1: Network Error / CORS
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```
**Fix:** Add GitHub secrets (see below)

#### Error Type 2: 404 Not Found
```
POST https://rfcity.twd.digital/api/contact 404 (Not Found)
```
**Fix:** Landing page is using wrong URL (needs to be redeployed)

#### Error Type 3: Connection Failed
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```
**Fix:** API endpoint not accessible

## 🔧 Step 2: Force Browser to Load New Version

The browser might be showing a cached version:

1. Go to https://rfcity.twd.digital
2. Press **`Cmd + Shift + R`** (Mac) or **`Ctrl + Shift + R`** (Windows)
3. Or right-click → **Inspect** → **Network** tab → Check **Disable cache**
4. Refresh the page
5. Try the contact form again

## ✅ Step 3: Verify GitHub Action Completed

Check if the deployment finished:

1. Go to: https://github.com/Panhavathpech/rfcity-stack/actions
2. Look for the latest "Deploy Landing" workflow
3. Should have a green checkmark ✅
4. Click on it to see details
5. Make sure all steps completed successfully

## 🔐 Step 4: Add GitHub Secrets (Important!)

The GitHub Action needs these secrets to build with the correct API URL:

1. Go to: https://github.com/Panhavathpech/rfcity-stack/settings/secrets/actions
2. Click **New repository secret**
3. Add these three secrets:

| Name | Value |
|------|-------|
| `VITE_CONTACT_API` | `https://rfcity-stack.vercel.app/api` |
| `VITE_SHOW_ADMIN_LINK` | `false` |
| `VITE_ADMIN_PORTAL_URL` | `https://rfcity-stack.vercel.app` |

4. After adding secrets, manually trigger a new deployment:
   - Go to: https://github.com/Panhavathpech/rfcity-stack/actions
   - Click "Deploy Landing"
   - Click "Run workflow" → "Run workflow"

## 🧪 Step 5: Test Again

After adding GitHub secrets and redeploying:

1. Wait for deployment to complete (2-5 minutes)
2. Hard refresh: **`Cmd + Shift + R`**
3. Open browser console (F12)
4. Submit contact form
5. Check console for errors

## 📋 Quick Checklist

Check these off as you verify:

- [ ] Hard refreshed the page (Cmd + Shift + R)
- [ ] Checked browser console for errors
- [ ] GitHub Action deployment completed successfully
- [ ] Added 3 GitHub secrets (VITE_CONTACT_API, etc.)
- [ ] Manually triggered new deployment after adding secrets
- [ ] Waited for new deployment to complete
- [ ] Tested contact form again

## 🎯 Expected Behavior When Working

When everything is configured correctly:

1. Fill out form and click "Send Message"
2. Button changes to "Sending..."
3. Success message appears: "Thanks for reaching out! Our team will respond shortly."
4. Form clears automatically
5. **Browser Console shows:**
   ```
   POST https://rfcity-stack.vercel.app/api/contact 200 (OK)
   ```
6. Email notification received
7. Submission appears in admin portal

## 🚨 Tell Me What Error You See

After checking the browser console, tell me exactly what error you see. The error message will help me identify the exact issue.

Common scenarios:

**Scenario A: "POST .../api/contact 404"**
→ Landing page not deployed with new URL yet

**Scenario B: "CORS policy" error**
→ Need to add GitHub secrets and redeploy

**Scenario C: "Failed to fetch"**
→ Network/firewall issue

**Scenario D: "422 Invalid payload"**
→ Form data validation issue (less likely)

**Scenario E: "500 Server error"**
→ Vercel environment variables issue (but we tested and API works)

---

**Next Step:** 
1. Hard refresh (Cmd + Shift + R)
2. Open console (F12)
3. Try form
4. Tell me what error you see

