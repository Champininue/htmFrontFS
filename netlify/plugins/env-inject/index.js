const fs = require('fs');
const path = require('path');

module.exports = {
  onBuild: ({ constants, inputs }) => {
    console.log('🔧 Injecting environment variables into HTML files...');
    
    // Get environment variables
    const envVars = {
      BREVO_API_KEY: process.env.BREVO_API_KEY || '',
      FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@ship.brevo.com',
      TO_EMAIL: process.env.TO_EMAIL || '',
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || ''
    };
    
    // Files to process
    const filesToProcess = [
      path.join(constants.PUBLISH_DIR, 'index.html')
    ];
    
    filesToProcess.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace environment variable placeholders
        Object.entries(envVars).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          content = content.replace(new RegExp(placeholder, 'g'), value);
          console.log(`✅ Replaced ${placeholder} with ${value ? '***' : '(empty)'}`);
        });
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Processed: ${filePath}`);
      } else {
        console.log(`⚠️ File not found: ${filePath}`);
      }
    });
    
    console.log('✨ Environment variables injected successfully!');
  }
};