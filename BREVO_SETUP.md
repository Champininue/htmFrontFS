# 📧 Brevo Email API Setup Guide

Your contact form is now configured to use Brevo (formerly Sendinblue) for reliable email delivery. Follow these steps to complete the setup:

## 🚀 Quick Setup (5 minutes)

### 1. Create Brevo Account
- Visit [https://app.brevo.com](https://app.brevo.com)
- Sign up for a free account (300 emails/day limit)
- Verify your email address

### 2. Get Your API Key
- Log in to Brevo dashboard
- Go to [Settings > API Keys](https://app.brevo.com/settings/keys/api)
- Click "Create a new API key"
- Copy the generated API key

### 3. Configure Your Files

#### Update `index.html`:
```javascript
// Replace these values in the API_CONFIG object:
BREVO_API_KEY: 'YOUR_ACTUAL_BREVO_API_KEY_HERE', // Paste your API key
FROM_EMAIL: 'noreply@yourdomain.com', // Use your domain or Brevo default
TO_EMAIL: 'your.actual.email@example.com', // Your email where you want to receive messages
```

#### Update `public/index.html`:
```javascript
// Replace the same values in public/index.html:
BREVO_API_KEY: 'YOUR_ACTUAL_BREVO_API_KEY_HERE',
FROM_EMAIL: 'noreply@yourdomain.com',
TO_EMAIL: 'your.actual.email@example.com',
```

### 4. Email Configuration Options

#### Option A: Use Brevo Default Sender (Easiest)
```javascript
FROM_EMAIL: 'noreply@ship.brevo.com', // Brevo's default sender
```

#### Option B: Use Your Domain (Requires Domain Verification)
1. In Brevo dashboard, go to Settings > Senders & IP
2. Add and verify your domain
3. Use: `FROM_EMAIL: 'noreply@yourdomain.com'`

### 5. Test Your Setup
1. Save both files with your configuration
2. Deploy to Netlify (or test locally)
3. Fill out the contact form and submit
4. Check your email inbox for the message

## 🎯 Expected Behavior

### When Working:
- Form submits successfully
- You receive a beautifully formatted HTML email
- User sees: "ההודעה נשלחה בהצלחה! ✅ תודה על פנייתך"

### Fallback (if Brevo fails):
- Automatically opens user's email client with pre-filled message
- User sees: "🔄 נפתח חלון אימייל חדש! אנא שלח את ההודעה מהאימייל שלך"

## 🔧 Troubleshooting

### Common Issues:

1. **Invalid API Key Error**
   - Double-check your API key is correct
   - Ensure no extra spaces or characters

2. **Sender Email Rejected**
   - Use `noreply@ship.brevo.com` for quick testing
   - Or verify your domain in Brevo settings

3. **Rate Limit Exceeded**
   - Free plan allows 300 emails/day
   - Upgrade plan if needed

### Debug Steps:
1. Open browser Developer Tools (F12)
2. Check Console tab for error messages
3. Test with Brevo's default sender email first

## 📊 Brevo Free Plan Limits
- ✅ 300 emails per day
- ✅ Unlimited contacts
- ✅ Email templates
- ✅ Basic analytics
- ✅ No Brevo branding in emails

## 🔒 Security Notes
- Keep your API key private
- Don't commit API keys to public repositories
- Consider using environment variables for production

## 🎨 Email Features
Your contact form emails include:
- Professional HTML formatting
- Right-to-left Hebrew support
- Contact details with icons
- Message formatting with line breaks
- Submission timestamp
- Responsive design

---

**Need Help?** Check the browser console for error messages or test with the mailto fallback first.