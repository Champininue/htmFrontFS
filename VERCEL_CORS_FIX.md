# 🔧 CORS Fix for Protected Vercel API

## Problem
Your Vercel API has deployment protection enabled and doesn't allow CORS requests from your Netlify domain.

## Solution
We need to add CORS headers to your Vercel API function. Here's the code you need to add to your `/api/contact.js` file:

```javascript
// Add this at the very beginning of your API function, before any other code

export default async function handler(req, res) {
  // CORS Headers - ADD THESE FIRST
  const allowedOrigins = [
    'https://spontaneous-sunshine-67cc77.netlify.app',
    'https://apinet-cpxlhij2x-rs-projects-27d1b92f.vercel.app',
    'http://localhost:3000' // for local development
  ];

  const origin = req.headers.origin;
  
  // Set CORS headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Your existing API code goes here...
  if (req.method === 'POST') {
    try {
      // Your contact form handling logic
      const { name, email, subject, message, recaptcha, updates } = req.body;
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      // Here you would typically:
      // 1. Validate reCAPTCHA token if provided
      // 2. Send email using your preferred service (SendGrid, Nodemailer, etc.)
      // 3. Save to database if needed
      
      // For now, just return success
      return res.status(200).json({ 
        success: true, 
        message: 'Message received successfully!' 
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed' 
  });
}
```

## How to Apply This Fix

1. **Access your Vercel project**:
   - Go to https://vercel.com/dashboard
   - Find your project: `apinet-cpxlhij2x-rs-projects-27d1b92f`
   - Click on it to open

2. **Edit the API function**:
   - Go to the **Functions** tab or **Source** tab
   - Find `/api/contact.js` (or whatever your contact function is named)
   - Click **Edit** or **View Source**

3. **Add the CORS headers**:
   - Copy the code above
   - Replace or modify your existing function
   - Make sure the CORS headers are at the very top

4. **Deploy the changes**:
   - Save the file
   - Vercel will automatically redeploy
   - Your API will now accept requests from your Netlify domain

## Alternative: Environment Variables

If you want to make the allowed origins configurable, add this to your Vercel environment variables:

```
ALLOWED_ORIGINS=https://spontaneous-sunshine-67cc77.netlify.app,https://apinet-cpxlhij2x-rs-projects-27d1b92f.vercel.app
```

Then in your code:
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://spontaneous-sunshine-67cc77.netlify.app'
];
```