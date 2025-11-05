# CORS Configuration for Your Vercel API

## Problem:
Your contact form is getting CORS errors because your Vercel API doesn't allow requests from your Netlify domain (`https://spontaneous-sunshine-67cc77.netlify.app`).

## Solution:
Add CORS headers to your Vercel API `/api/contact.js` file.

## Updated API Code:

```javascript
// /api/contact.js - Updated with CORS support

export default async function handler(req, res) {
    // CORS Headers - Allow requests from your Netlify domain
    const allowedOrigins = [
        'https://spontaneous-sunshine-67cc77.netlify.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500', // Live Server
        'https://your-custom-domain.com' // Add your custom domain if you have one
    ];
    
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST requests for the contact form
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        const { name, email, subject, message, updates, recaptcha, timestamp, source } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'message']
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Message length validation
        if (message.length < 10) {
            return res.status(400).json({ error: 'Message must be at least 10 characters long' });
        }
        
        // Log the contact form submission
        console.log('Contact form submission:', {
            name,
            email,
            subject,
            messageLength: message.length,
            updates,
            timestamp,
            source,
            hasRecaptcha: !!recaptcha
        });
        
        // Here you would typically:
        // 1. Verify reCAPTCHA token (if provided)
        // 2. Send email notification
        // 3. Save to database
        // 4. Send auto-reply email
        
        // For now, just return success
        return res.status(200).json({ 
            success: true,
            message: 'Contact form submitted successfully',
            id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
        
    } catch (error) {
        console.error('Contact API Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to process contact form submission'
        });
    }
}
```

## Quick Fix Steps:

1. **Go to your Vercel dashboard**
2. **Find your project** (apinet-cpxlhij2x-rs-projects-27d1b92f)
3. **Edit the `/api/contact.js` file**
4. **Replace the content** with the code above
5. **Deploy the changes**

## Alternative Quick Fix:
If you can't edit the Vercel code right now, add this to the top of your existing `/api/contact.js`:

```javascript
// Add CORS headers at the very beginning
res.setHeader('Access-Control-Allow-Origin', 'https://spontaneous-sunshine-67cc77.netlify.app');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
}
```

After making these changes, redeploy your Vercel API and the CORS error should be resolved!