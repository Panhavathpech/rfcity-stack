# Contact Form Test Checklist

## ✅ What You've Completed So Far

- [x] Deployed admin portal to Vercel
- [x] Added environment variables to Vercel
- [x] Configured landing page `.env` file
- [x] Rebuilt landing page with Vercel API URL
- [x] Pushed changes to GitHub
- [x] GitHub Action deployment triggered

## 🧪 Testing Steps

### 1. Wait for Deployment to Complete
- Go to: https://github.com/Panhavathpech/rfcity-stack/actions
- Wait for the "Deploy Landing" workflow to finish (green checkmark)
- This usually takes 2-5 minutes

### 2. Test the Contact Form

#### Step-by-Step Test:

1. **Open your website:**
   ```
   https://rfcity.twd.digital
   ```

2. **Scroll down to the Contact Section**

3. **Fill out the form:**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone Number: `012345678`
   - Message: `Testing contact form after Vercel deployment`

4. **Click "Send Message"**

5. **Expected Result:**
   - Button changes to "Sending..."
   - Then shows: "Thanks for reaching out! Our team will respond shortly."
   - Form clears automatically

### 3. Verify Backend

#### Check Email:
- Open the inbox for: **CONTACT_ALERT_RECIPIENT** (the email you set in Vercel)
- You should receive an email notification with the contact form details
- From: Your **SUPPORT_FROM_EMAIL**

#### Check Admin Portal:
1. Go to: https://rfcity-stack.vercel.app
2. Log in with your admin credentials
3. Click "Contact submissions" in the sidebar
4. You should see your test submission appear there

### 4. Check Browser Console (if there are issues)

If the form doesn't work:

1. Press **F12** (or `Cmd + Option + I` on Mac)
2. Go to **Console** tab
3. Submit the form again
4. Look for errors:
   - ❌ CORS error → Check CONTACT_ALLOWED_ORIGIN in Vercel
   - ❌ 422 error → Form validation issue
   - ❌ 500 error → Check Vercel logs

### 5. Check Vercel Logs (if there are issues)

1. Go to: https://vercel.com/dashboard
2. Click your project: `rfcity-stack`
3. Click **Deployments** tab
4. Click on the latest deployment
5. Click **Functions** tab
6. Look for `/api/contact` errors

## 🐛 Common Issues & Fixes

### Issue: CORS Error
**Error:** `Access to fetch has been blocked by CORS policy`

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Check `CONTACT_ALLOWED_ORIGIN` is set to: `https://rfcity.twd.digital`
3. **Important:** No trailing slash!
4. Redeploy Vercel

### Issue: "Unable to send message"
**Error:** Form shows error message immediately

**Fix:**
1. Open browser console (F12)
2. Look for specific error message
3. Most likely: CORS or missing Vercel env vars
4. Double-check all 10 Vercel environment variables are set

### Issue: Email Not Received
**Error:** Form submits successfully but no email

**Fix:**
1. Check Resend dashboard for delivery logs
2. Verify `SUPPORT_FROM_EMAIL` is verified in Resend
3. Check spam/junk folder
4. Verify `CONTACT_ALERT_RECIPIENT` email is correct

### Issue: 500 Server Error
**Error:** Server returns 500 error

**Fix:**
1. Check Vercel logs (see Step 5 above)
2. Look for missing environment variables
3. Verify InstantDB credentials
4. Verify Resend API key

## 📋 Quick Debug Checklist

If the form doesn't work, verify:

- [ ] GitHub Action deployment completed successfully
- [ ] Opened correct URL: https://rfcity.twd.digital
- [ ] Browser console shows no errors
- [ ] All 10 Vercel environment variables are set:
  - [ ] INSTANT_APP_ID
  - [ ] INSTANT_ADMIN_TOKEN
  - [ ] RESEND_API_KEY
  - [ ] SUPPORT_FROM_EMAIL
  - [ ] CONTACT_ALERT_RECIPIENT
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
  - [ ] PASSWORD_PEPPER
  - [ ] CONTACT_ALLOWED_ORIGIN
  - [ ] SITE_BASE_URL
- [ ] CONTACT_ALLOWED_ORIGIN = `https://rfcity.twd.digital` (no trailing slash)
- [ ] Resend email domain is verified
- [ ] InstantDB credentials are correct

## 🎉 Success Criteria

You'll know everything is working when:

✅ Form submits without errors
✅ Success message appears
✅ Email notification received
✅ Submission appears in admin portal `/contacts` page
✅ No errors in browser console
✅ No errors in Vercel logs

## 📞 Need Help?

If you're still having issues:

1. Check browser console for specific error messages
2. Check Vercel logs for backend errors
3. Verify all environment variables are correct
4. Try submitting from an incognito/private browser window
5. Check the detailed troubleshooting in `VERCEL_SETUP.md`

---

**Next:** Wait for GitHub Action to complete, then test at https://rfcity.twd.digital

