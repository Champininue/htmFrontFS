# 🔧 Netlify Environment Variables Setup

Your contact form is now configured to use **Netlify Environment Variables** for secure API key management. This is the best practice for production deployments.

## 🚀 Quick Setup (3 steps)

### Step 1: Get Your Brevo API Key
1. Visit [https://app.brevo.com](https://app.brevo.com) and sign up (free)
2. Go to [Settings > API Keys](https://app.brevo.com/settings/keys/api)
3. Click "Create a new API key" and copy it

### Step 2: Set Netlify Environment Variables
1. Go to your Netlify dashboard
2. Navigate to: **Site Settings > Environment Variables**
3. Add these variables:

| Variable Name | Value | Required |
|---------------|-------|----------|
| `BREVO_API_KEY` | Your Brevo API key (from Step 1) | ✅ Required |
| `TO_EMAIL` | Your email address (where you want to receive messages) | ✅ Required |
| `FROM_EMAIL` | `noreply@ship.brevo.com` (or your verified domain) | 🔄 Optional |
| `RECAPTCHA_SITE_KEY` | Your reCAPTCHA site key | 🔄 Optional |

### Step 3: Deploy
Push your changes to trigger a new Netlify build. The environment variables will be automatically injected during the build process.

## 📋 Detailed Instructions

### Setting Environment Variables in Netlify:

1. **Access Your Site Settings:**
   - Log in to [Netlify](https://app.netlify.com)
   - Select your site (`htmFrontFS`)
   - Click "Site Settings"

2. **Navigate to Environment Variables:**
   - In the left sidebar, click "Environment Variables"
   - Click "Add a variable"

3. **Add Required Variables:**

   **BREVO_API_KEY:**
   ```
   Key: BREVO_API_KEY
   Value: xkeysib-your-actual-api-key-here
   ```

   **TO_EMAIL:**
   ```
   Key: TO_EMAIL
   Value: your.email@example.com
   ```

   **FROM_EMAIL (Optional):**
   ```
   Key: FROM_EMAIL
   Value: noreply@ship.brevo.com
   ```

4. **Save and Deploy:**
   - Click "Save" for each variable
   - Trigger a new deployment (push to GitHub or manually)

## 🔒 Security Benefits

✅ **API keys never appear in your source code**
✅ **Secure server-side injection during build**
✅ **Different keys for staging/production**
✅ **Easy key rotation without code changes**
✅ **No risk of exposing keys in public repositories**

## 🛠 How It Works

1. **Build Time:** Netlify plugin reads environment variables
2. **Injection:** Replaces `{{VARIABLE_NAME}}` placeholders in HTML
3. **Runtime:** JavaScript accesses injected values via `window.NETLIFY_ENV`
4. **Fallback:** Uses default values if variables not set

## 🔍 Testing Your Setup

### Expected Behavior:
- **Success:** Contact form submits → Professional HTML email received
- **Fallback:** If Brevo fails → Email client opens with pre-filled message

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are set in Netlify
3. Ensure API key is valid in Brevo dashboard
4. Test with a simple contact form submission

## 📊 Environment Variable Status

The contact form will automatically:
- ✅ Use Brevo API if `BREVO_API_KEY` is set
- 🔄 Fall back to mailto if Brevo fails or isn't configured
- 📧 Send emails to address specified in `TO_EMAIL`
- 🏷 Use sender address from `FROM_EMAIL` (or default)

## 🐛 Troubleshooting

### Common Issues:

1. **"Key not found" error:**
   - Verify `BREVO_API_KEY` is correctly set in Netlify
   - Check for spaces or extra characters in the key

2. **Emails not received:**
   - Verify `TO_EMAIL` is your correct email address
   - Check spam folder
   - Ensure Brevo API key has email sending permissions

3. **Sender email rejected:**
   - Use `noreply@ship.brevo.com` for `FROM_EMAIL`
   - Or verify your domain in Brevo settings

4. **Variables not injected:**
   - Ensure plugin is configured in `netlify.toml`
   - Check build logs for plugin execution
   - Redeploy after setting environment variables

### Build Logs:
Look for these messages in your Netlify build logs:
```
🔧 Injecting environment variables into HTML files...
✅ Replaced {{BREVO_API_KEY}} with ***
✅ Replaced {{TO_EMAIL}} with ***
✨ Environment variables injected successfully!
```

## 🎯 Next Steps

1. Set up the environment variables in Netlify
2. Push changes to trigger deployment
3. Test your contact form
4. Monitor email delivery in Brevo dashboard

Your contact form is now production-ready with enterprise-grade security! 🚀

---

**Need Help?** Check your Netlify build logs or contact form browser console for detailed error messages.