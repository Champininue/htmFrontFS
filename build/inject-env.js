#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting GitHub environment variables into HTML files...');
console.log('🔍 Raw environment variables from process.env:');
console.log('  BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
console.log('  BREVO_API_KEY length:', process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 0);
console.log('  FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('  TO_EMAIL:', process.env.TO_EMAIL);
console.log('  RECAPTCHA_SITE_KEY exists:', !!process.env.RECAPTCHA_SITE_KEY);
console.log('  All matching env vars:', Object.keys(process.env).filter(key => 
    key.includes('BREVO') || key.includes('FROM_EMAIL') || key.includes('TO_EMAIL') || key.includes('RECAPTCHA')
));
console.log('  Total env vars count:', Object.keys(process.env).length);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  CI environment:', process.env.CI);
console.log('  GITHUB_ACTIONS:', process.env.GITHUB_ACTIONS);

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

// Files to process (process both if they exist)
const files = [
    path.join(__dirname, '../public/index.html'),
    path.join(__dirname, '../index.html'),
];

let processedAny = false;
for (const htmlFile of files) {
    if (!fs.existsSync(htmlFile)) {
        console.log(`⏭️  Skipping missing file: ${htmlFile}`);
        continue;
    }
    processedAny = true;
    console.log(`✅ Processing: ${htmlFile}`);
  
        let content = fs.readFileSync(htmlFile, 'utf8');
    
        // Replace environment variable placeholders (support both INJECT_* and {{VAR}} styles)
        Object.entries(envVars).forEach(([key, value]) => {
            const oldContent = content;
            const valLog = key === 'BREVO_API_KEY' && value ? '[HIDDEN API KEY]' : (value || '(empty)');

            // INJECT_KEY
            const injectToken = `INJECT_${key}`;
            const injectRegex = new RegExp(injectToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            content = content.replace(injectRegex, value);

            // {{ KEY }} with optional spaces
            const mustacheRegex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`,'g');
            content = content.replace(mustacheRegex, value);

            if (content !== oldContent) {
                console.log(`✅ Replaced placeholders for ${key} with ${valLog}`);
            } else {
                console.log(`ℹ️  No ${key} placeholders found in ${path.basename(htmlFile)}`);
            }
        });
    
    // Append a build marker comment to verify injection ran and aid cache busting
    content += `\n<!-- build: ${new Date().toISOString()} -->\n`;

    // Sanity check: ensure no placeholders remain
        const placeholderRegex = /(INJECT_(BREVO_API_KEY|FROM_EMAIL|TO_EMAIL|RECAPTCHA_SITE_KEY))|\{\{\s*(BREVO_API_KEY|FROM_EMAIL|TO_EMAIL|RECAPTCHA_SITE_KEY)\s*\}\}/g;
    const leftovers = content.match(placeholderRegex);
    if (leftovers) {
        console.error('❌ Placeholder tokens still present after injection:', Array.from(new Set(leftovers)));
        fs.writeFileSync(htmlFile, content, 'utf8');
        const idx = content.indexOf(leftovers[0]);
        const start = Math.max(0, idx - 200);
        const end = Math.min(content.length, idx + 200);
        console.error('🔎 Context around first leftover token in', htmlFile, '\n', content.slice(start, end));
        process.exit(2);
    }

    fs.writeFileSync(htmlFile, content, 'utf8');
    console.log('✨ Environment variables injected successfully!');
    console.log('📝 File written to:', htmlFile);
    console.log('📊 Final content length:', content.length);
}

if (!processedAny) {
    console.error('❌ No target HTML files found to inject. Checked:', files);
    process.exit(1);
}