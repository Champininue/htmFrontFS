#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting GitHub environment variables into HTML files...');
console.log('🔍 Raw environment variables from process.env:');
console.log('  BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
console.log('  FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('  TO_EMAIL:', process.env.TO_EMAIL);
console.log('  RECAPTCHA_SITE_KEY exists:', !!process.env.RECAPTCHA_SITE_KEY);
console.log('  All env vars:', Object.keys(process.env).filter(key => 
    key.includes('BREVO') || key.includes('FROM_EMAIL') || key.includes('TO_EMAIL') || key.includes('RECAPTCHA')
));

// Get environment variables from GitHub Actions (with fallbacks)
const envVars = {
    BREVO_API_KEY: process.env.BREVO_API_KEY || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@ship.brevo.com',
    TO_EMAIL: process.env.TO_EMAIL || 'ireactpro@gmail.com',
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || ''
};

// Log what we're working with
console.log('🔍 Environment variable status:');
console.log(`  BREVO_API_KEY: ${envVars.BREVO_API_KEY ? '✅ Set' : '❌ Missing (will use fallback)'}`);
console.log(`  FROM_EMAIL: ${envVars.FROM_EMAIL}`);
console.log(`  TO_EMAIL: ${envVars.TO_EMAIL}`);
console.log(`  RECAPTCHA_SITE_KEY: ${envVars.RECAPTCHA_SITE_KEY ? '✅ Set' : '❌ Missing'}`);
console.log('');

console.log('Environment variables:');
Object.entries(envVars).forEach(([key, value]) => {
    if (key === 'BREVO_API_KEY') {
        console.log(`  ${key}: ${value ? `✅ Set (${value.length} chars)` : '❌ Not set'}`);
    } else {
        console.log(`  ${key}: ${value || '(empty)'}`);
    }
});

// File to process
const htmlFile = path.join(__dirname, '../public/index.html');

if (fs.existsSync(htmlFile)) {
    console.log(`✅ Processing: ${htmlFile}`);
    
    let content = fs.readFileSync(htmlFile, 'utf8');
    
    // Replace environment variable placeholders
    Object.entries(envVars).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const oldContent = content;
        content = content.replace(regex, value);
        
        if (content !== oldContent) {
            console.log(`✅ Replaced ${placeholder} with ${key === 'BREVO_API_KEY' && value ? '[HIDDEN API KEY]' : value || '(empty)'}`);
        } else if (value) {
            console.log(`⚠️  ${placeholder} not found in file`);
        }
    });
    
    fs.writeFileSync(htmlFile, content, 'utf8');
    console.log('✨ Environment variables injected successfully!');
} else {
    console.error(`❌ File not found: ${htmlFile}`);
    process.exit(1);
}