#!/bin/bash

echo "🔧 Injecting environment variables into HTML files..."

# Default values if environment variables are not set
BREVO_API_KEY="${BREVO_API_KEY:-}"
FROM_EMAIL="${FROM_EMAIL:-noreply@ship.brevo.com}"
TO_EMAIL="${TO_EMAIL:-ireactpro@gmail.com}"
RECAPTCHA_SITE_KEY="${RECAPTCHA_SITE_KEY:-}"

echo "Environment variables:"
echo "  BREVO_API_KEY: ${BREVO_API_KEY:+✅ Set}"
echo "  FROM_EMAIL: ${FROM_EMAIL}"
echo "  TO_EMAIL: ${TO_EMAIL}"
echo "  RECAPTCHA_SITE_KEY: ${RECAPTCHA_SITE_KEY:+✅ Set}"

# File to process
HTML_FILE="public/index.html"

if [ -f "$HTML_FILE" ]; then
    echo "✅ Processing: $HTML_FILE"
    
    # Create a temporary file
    TEMP_FILE=$(mktemp)
    
    # Replace placeholders with actual values (escape special characters)
    # Use a more robust approach with proper escaping
    cp "$HTML_FILE" "$TEMP_FILE"
    
    # Replace each variable separately to handle special characters
    if [ -n "$BREVO_API_KEY" ]; then
        sed -i "s/{{BREVO_API_KEY}}/$BREVO_API_KEY/g" "$TEMP_FILE"
    fi
    sed -i "s/{{FROM_EMAIL}}/$FROM_EMAIL/g" "$TEMP_FILE"
    sed -i "s/{{TO_EMAIL}}/$TO_EMAIL/g" "$TEMP_FILE"
    if [ -n "$RECAPTCHA_SITE_KEY" ]; then
        sed -i "s/{{RECAPTCHA_SITE_KEY}}/$RECAPTCHA_SITE_KEY/g" "$TEMP_FILE"
    fi
    
    # Move the temporary file back
    mv "$TEMP_FILE" "$HTML_FILE"
    
    echo "✅ Environment variables injected successfully!"
else
    echo "⚠️ File not found: $HTML_FILE"
    exit 1
fi