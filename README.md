# 🌐 Portfolio Website - GitHub Pages

## 🚀 100% Free GitHub Pages Deployment

Professional portfolio with contact form using **GitHub Pages** and **Brevo Email API**.

### 📍 **Live Site:**
`https://champininue.github.io/htmFrontFS/`

### 🛠 **Tech Stack:**
- **GitHub Pages** - Free hosting
- **GitHub Actions** - Automated deployment  
- **Brevo API** - Professional email delivery
- **Environment Variables** - Secure configuration

## ⚙️ **Setup Environment Variables (2 minutes):**

### 1. **Go to Repository Settings:**
- Visit: `https://github.com/Champininue/htmFrontFS/settings`
- Click **"Secrets and variables"** → **"Actions"**

### 2. **Add Repository Secrets:**
Click **"New repository secret"** and add:

```
Name: BREVO_API_KEY
Value: your-brevo-api-key-here
```

```  
Name: RECAPTCHA_SITE_KEY
Value: your-recaptcha-key-here (optional)
```

### 3. **Add Repository Variables:**
Click **"Variables"** tab, then **"New repository variable"**:

```
Name: FROM_EMAIL  
Value: NOREPLAY@R.app
```

```
Name: TO_EMAIL
Value: your.email@example.com
```

### 4. **Enable GitHub Pages:**
- Go to **Settings** → **Pages**
- Source: **"GitHub Actions"**
- Save

## 🎯 **Deployment:**

### **Automatic Deployment:**
- ✅ **Push to main branch** → Site automatically updates
- ✅ **Environment variables** injected during build
- ✅ **Professional contact form** with Brevo emails
- ✅ **100% free hosting**

### **Manual Deployment:**
- Go to **"Actions"** tab in your repo
- Click **"Deploy to GitHub Pages"**  
- Click **"Run workflow"**

## 📊 **Features:**
- ✅ **Free unlimited hosting** via GitHub Pages
- ✅ **Custom domain support** (optional)
- ✅ **HTTPS by default**
- ✅ **Environment variable injection**
- ✅ **Professional contact form** with Brevo API
- ✅ **Automatic deployments** on every push

## 🔍 **Check Deployment Status:**
- Visit: `https://github.com/Champininue/htmFrontFS/actions`
- Green checkmark = successful deployment
- Red X = check logs for issues

## 🌐 **Access Your Site:**
After setup: `https://champininue.github.io/htmFrontFS/`

---

**No more Netlify costs! GitHub Pages is completely free forever.** 🎉