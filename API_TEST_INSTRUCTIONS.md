# Test API Connection via Browser

Since your Vercel API has deployment protection, let's test it through the browser console:

## 🌐 Browser Test Instructions:

1. **Open your browser's Developer Console** (F12 → Console tab)

2. **Copy and paste this test code:**

```javascript
// Test your Vercel API from browser console
async function testVercelAPI() {
    const API_URL = 'https://apinet-cpxlhij2x-rs-projects-27d1b92f.vercel.app/api/contact';
    
    console.log('🔍 Testing Vercel API connection...');
    
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'test',
        message: 'This is a browser console test',
        updates: false,
        recaptcha: 'test_token',
        timestamp: new Date().toISOString(),
        source: 'browser_console_test'
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = responseText;
        }
        
        console.log('📊 API Response:', {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers),
            data: responseData
        });
        
        if (response.ok) {
            console.log('✅ API is working correctly!');
            return true;
        } else {
            console.log('⚠️ API returned an error, but it is reachable');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Network error:', error);
        return false;
    }
}

// Run the test
testVercelAPI();
```

3. **Check the console output** for results

## 🚀 Alternative: Quick Deploy Test

**The fastest way to test** is to deploy to Netlify and test the live connection:

### Step 1: Deploy to Netlify
```bash
# In your project directory
git add .
git commit -m "Portfolio with API integration"
git push origin main
```

### Step 2: Connect to Netlify
- Go to [Netlify Dashboard](https://app.netlify.com)
- Import your GitHub repository
- Use these build settings:
  - **Build command:** (empty)
  - **Publish directory:** `.`
  - **Branch:** `main`

### Step 3: Test Live Connection
Once deployed, visit your Netlify URL and try the contact form.

## 🔧 Expected Behavior:

- **✅ Success (200):** Form works perfectly
- **⚠️ 400 Error:** reCAPTCHA validation issue (expected with test token)
- **❌ 401 Error:** Deployment protection still blocking
- **❌ CORS Error:** Need to add Netlify domain to Vercel CORS settings

## 💡 Pro Tips:

1. **Vercel deployment protection** is actually good for security
2. **Your API will work** once deployed to a proper domain
3. **Add your Netlify domain** to Vercel's allowed origins
4. **Update reCAPTCHA** with your production domain

The API architecture looks solid - the 401 responses show your security is working correctly! 🛡️