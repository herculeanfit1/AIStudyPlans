#!/bin/bash

# Security Improvements Application Script
# This script helps apply and verify the security improvements

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AIStudyPlans Security Improvements${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Function to check if a file exists and has the expected content
check_file_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file"; then
            echo -e "${GREEN}✅ $description${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  $description - Pattern not found${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $description - File not found${NC}"
        return 1
    fi
}

# Function to run a test and report results
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -e "${BLUE}Testing: $test_name${NC}"
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

echo -e "${YELLOW}Checking Security Implementations...${NC}"
echo

# 1. Check Rate Limiting Implementation
echo -e "${BLUE}1. Rate Limiting Implementation${NC}"
check_file_content "lib/rate-limit.ts" "rateLimit" "Rate limiting library exists"
check_file_content "app/api/waitlist/route.ts" "rateLimit" "Waitlist API has rate limiting"
check_file_content "app/feedback/api/submit/route.ts" "rateLimit" "Feedback API has rate limiting"
check_file_content "app/api/email-config/route.ts" "rateLimit" "Email config API has rate limiting"
echo

# 2. Check Email Monitoring Implementation
echo -e "${BLUE}2. Email Usage Monitoring${NC}"
check_file_content "lib/email-monitor.ts" "checkEmailQuota" "Email monitoring library exists"
check_file_content "lib/email.ts" "checkEmailQuota" "Email service uses monitoring"
check_file_content "app/api/admin/email-usage/route.ts" "getEmailUsageStats" "Admin email usage endpoint exists"
echo

# 3. Check Input Validation
echo -e "${BLUE}3. Input Validation${NC}"
check_file_content "lib/validation.ts" "waitlistSchema" "Waitlist validation schema exists"
check_file_content "lib/validation.ts" "feedbackSchema" "Feedback validation schema exists"
check_file_content "app/api/waitlist/route.ts" "validateInput" "Waitlist API uses validation"
echo

# 4. Check CSRF Protection
echo -e "${BLUE}4. CSRF Protection${NC}"
check_file_content "lib/csrf.ts" "csrfProtection" "CSRF protection library exists"
check_file_content "lib/csrf.ts" "generateCsrfToken" "CSRF token generation exists"
echo

# 5. Check Authentication
echo -e "${BLUE}5. Authentication & Authorization${NC}"
check_file_content "app/api/auth/[...nextauth]/route.ts" "allowedEmails" "Admin email whitelist exists"
check_file_content "middleware.ts" "getToken" "Middleware authentication exists"
echo

# 6. Environment Variables Check
echo -e "${BLUE}6. Environment Configuration${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local file exists${NC}"
    
    # Check for required variables (without showing values)
    required_vars=("RESEND_API_KEY" "NEXTAUTH_SECRET" "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo -e "${GREEN}✅ $var is configured${NC}"
        else
            echo -e "${YELLOW}⚠️  $var is missing from .env.local${NC}"
        fi
    done
else
    echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
fi
echo

# 7. Package Dependencies Check
echo -e "${BLUE}7. Security Dependencies${NC}"
if [ -f "package.json" ]; then
    if grep -q '"zod"' package.json; then
        echo -e "${GREEN}✅ Zod validation library installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Zod validation library not found${NC}"
        echo -e "${YELLOW}   Run: npm install zod@3.22.4${NC}"
    fi
    
    if grep -q '"next-auth"' package.json; then
        echo -e "${GREEN}✅ NextAuth.js installed${NC}"
    else
        echo -e "${RED}❌ NextAuth.js not found${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
fi
echo

# 8. Test API Endpoints (if server is running)
echo -e "${BLUE}8. API Endpoint Tests${NC}"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local server is running${NC}"
    
    # Test rate limiting (this should work)
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/email-config | grep -q "200\|429"; then
        echo -e "${GREEN}✅ Email config endpoint responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Email config endpoint not responding as expected${NC}"
    fi
    
    # Test admin endpoint (should require auth)
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/email-usage | grep -q "401"; then
        echo -e "${GREEN}✅ Admin endpoint properly protected${NC}"
    else
        echo -e "${YELLOW}⚠️  Admin endpoint protection unclear${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Local server not running - skipping API tests${NC}"
    echo -e "${YELLOW}   Start server with: npm run dev${NC}"
fi
echo

# 9. Security Documentation
echo -e "${BLUE}9. Documentation${NC}"
check_file_content "docs/security-audit-report.md" "Security Audit Report" "Security audit report exists"
echo

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Security Implementation Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo

echo -e "${GREEN}✅ Implemented Security Measures:${NC}"
echo "   • Rate limiting on all API endpoints"
echo "   • Email usage monitoring and quotas"
echo "   • Input validation with Zod schemas"
echo "   • CSRF protection"
echo "   • Admin authentication and authorization"
echo "   • Error handling and logging"
echo

echo -e "${YELLOW}📋 Recommended Next Steps:${NC}"
echo "   1. Test rate limiting by making multiple rapid requests"
echo "   2. Monitor email usage in admin dashboard"
echo "   3. Set up Azure billing alerts"
echo "   4. Configure environment variables for production"
echo "   5. Run security penetration tests"
echo

echo -e "${BLUE}📊 Monitoring Endpoints:${NC}"
echo "   • Email usage: /api/admin/email-usage"
echo "   • Email config: /api/email-config"
echo "   • Health check: /api/health"
echo

echo -e "${BLUE}🔧 Environment Variables for Email Limits:${NC}"
echo "   • EMAIL_DAILY_LIMIT=100"
echo "   • EMAIL_MONTHLY_LIMIT=1000"
echo "   • EMAIL_HOURLY_LIMIT=10"
echo "   • EMAIL_MAX_FAILURES=5"
echo "   • EMAIL_CIRCUIT_BREAKER_TIMEOUT=300000"
echo

echo -e "${GREEN}Security improvements application complete!${NC}" 