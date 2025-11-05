#!/bin/bash

# API Connection Test Script
# Test your Vercel API before deploying to Netlify

API_URL="https://apinet-cpxlhij2x-rs-projects-27d1b92f.vercel.app/api/contact"
HEALTH_URL="https://apinet-cpxlhij2x-rs-projects-27d1b92f.vercel.app/api/health"

echo "🔌 Testing API Connection..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n${BLUE}1. Testing Health Endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" "$HEALTH_URL")
HEALTH_BODY=$(echo $HEALTH_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed (Status: $HEALTH_STATUS)${NC}"
    echo -e "${GREEN}Response: $HEALTH_BODY${NC}"
else
    echo -e "${RED}❌ Health check failed (Status: $HEALTH_STATUS)${NC}"
    echo -e "${RED}Response: $HEALTH_BODY${NC}"
fi

# Test 2: CORS Check
echo -e "\n${BLUE}2. Testing CORS Configuration...${NC}"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$API_URL")
if echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
    echo -e "${GREEN}✅ CORS is properly configured${NC}"
    echo "$CORS_RESPONSE" | grep -i "access-control"
else
    echo -e "${YELLOW}⚠️  CORS headers not found - this might cause issues${NC}"
fi

# Test 3: Contact Form Test
echo -e "\n${BLUE}3. Testing Contact Form Submission...${NC}"

TEST_DATA='{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "test",
  "message": "This is a test message from the API connection tester.",
  "updates": false,
  "recaptcha": "test_token",
  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
  "source": "api_connection_test"
}'

CONTACT_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$API_URL")

CONTACT_BODY=$(echo $CONTACT_RESPONSE | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
CONTACT_STATUS=$(echo $CONTACT_RESPONSE | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

if [ "$CONTACT_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Contact form test passed (Status: $CONTACT_STATUS)${NC}"
    echo -e "${GREEN}Response: $CONTACT_BODY${NC}"
elif [ "$CONTACT_STATUS" -eq 400 ]; then
    echo -e "${YELLOW}⚠️  API returned 400 - might be reCAPTCHA validation${NC}"
    echo -e "${YELLOW}Response: $CONTACT_BODY${NC}"
    echo -e "${YELLOW}This is expected if reCAPTCHA validation is required${NC}"
else
    echo -e "${RED}❌ Contact form test failed (Status: $CONTACT_STATUS)${NC}"
    echo -e "${RED}Response: $CONTACT_BODY${NC}"
fi

# Test 4: Response Time
echo -e "\n${BLUE}4. Testing Response Time...${NC}"
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$HEALTH_URL")
echo -e "${GREEN}⏱️  Response time: ${RESPONSE_TIME}s${NC}"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ Response time is good${NC}"
else
    echo -e "${YELLOW}⚠️  Response time is a bit slow${NC}"
fi

# Summary
echo -e "\n${BLUE}📋 Test Summary:${NC}"
echo "================================"
echo -e "API URL: $API_URL"
echo -e "Health Status: $HEALTH_STATUS"
echo -e "Contact Status: $CONTACT_STATUS"
echo -e "Response Time: ${RESPONSE_TIME}s"

if [ "$HEALTH_STATUS" -eq 200 ] && [ "$CONTACT_STATUS" -eq 200 -o "$CONTACT_STATUS" -eq 400 ]; then
    echo -e "\n${GREEN}🎉 Your API is ready for production!${NC}"
    echo -e "${GREEN}You can safely deploy to Netlify.${NC}"
else
    echo -e "\n${RED}🔧 Some issues found. Please check your API configuration.${NC}"
fi

echo -e "\n${BLUE}💡 Next Steps:${NC}"
echo "1. If CORS issues: Add your Netlify domain to CORS settings"
echo "2. If reCAPTCHA issues: Update reCAPTCHA keys for production"
echo "3. If health check fails: Check your Vercel deployment"
echo "4. Open test-api-connection.html in browser for detailed testing"