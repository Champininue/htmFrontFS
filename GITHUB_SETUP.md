# 🚀 GitHub Pages Setup Guide

## Quick 3-Step Setup

### 1. **Enable GitHub Pages**
- Go to: https://github.com/Champininue/htmFrontFS/settings/pages
- **Source**: Select **"GitHub Actions"**
- Click **Save**

### 2. **Add Environment Variables**

#### **Repository Secrets** (Required for Brevo):
https://github.com/Champininue/htmFrontFS/settings/secrets/actions

```
Name: BREVO_API_KEY
Value: your-brevo-api-key-from-app.brevo.com
```

#### **Repository Variables** (Email Configuration):
Click "Variables" tab:

```
Name: TO_EMAIL
Value: ireactpro@gmail.com

Name: FROM_EMAIL  
Value: noreply@ship.brevo.com
```

### 3. **Deploy**
- Go to: https://github.com/Champininue/htmFrontFS/actions
- Click **"Deploy to GitHub Pages"**
- Click **"Run workflow"**

## 🎯 **Result:**
- ✅ **Free hosting** at `https://champininue.github.io/htmFrontFS/`
- ✅ **Professional contact form** with Brevo email delivery
- ✅ **Automatic deployments** on every push
- ✅ **Secure environment variables**

## 📧 **Contact Form Behavior:**
- **With API key**: Professional HTML emails via Brevo
- **Without API key**: Opens user's email client (mailto fallback)

## 🔧 **Get Brevo API Key:**
1. Visit: https://app.brevo.com/settings/keys/api
2. Sign up (free - 300 emails/day)
3. Create new API key
4. Copy to GitHub repository secrets

**That's it! Your portfolio is live and professional.** 🎉