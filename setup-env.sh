#!/bin/bash

# Setup script for R&F City contact form configuration

echo "🚀 R&F City Contact Form Setup"
echo "================================"
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "Creating .env.example..."
    cat > .env.example << 'EOF'
# Marketing Site Environment Variables
# Copy this to .env and fill in the values

# Base URL of your admin portal API (deployed on Vercel)
# Example: https://rfcity-admin.vercel.app/api
VITE_CONTACT_API=

# Optional: Show "Admin Portal" link in navbar (true/false)
VITE_SHOW_ADMIN_LINK=false

# Optional: URL to the admin portal for staff
# Example: https://rfcity-admin.vercel.app
VITE_ADMIN_PORTAL_URL=
EOF
fi

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing it up to .env.backup"
    cp .env .env.backup
fi

echo "📋 Please provide the following information:"
echo ""

# Ask for Vercel URL
read -p "Enter your Vercel admin portal URL (e.g., https://rfcity-admin.vercel.app): " VERCEL_URL

# Remove trailing slash if present
VERCEL_URL=$(echo "$VERCEL_URL" | sed 's:/*$::')

# Create .env file
cat > .env << EOF
# Marketing Site Environment Variables
# Generated on $(date)

# Base URL of your admin portal API (deployed on Vercel)
VITE_CONTACT_API=${VERCEL_URL}/api

# Optional: Show "Admin Portal" link in navbar (true/false)
VITE_SHOW_ADMIN_LINK=false

# Optional: URL to the admin portal for staff
VITE_ADMIN_PORTAL_URL=${VERCEL_URL}
EOF

echo ""
echo "✅ Created .env file with the following configuration:"
echo ""
cat .env
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 NEXT STEPS:"
echo ""
echo "1. Configure Vercel Environment Variables"
echo "   → Go to: https://vercel.com/dashboard"
echo "   → Click your admin portal project"
echo "   → Go to Settings → Environment Variables"
echo "   → Add the following 10 variables:"
echo ""
echo "   • INSTANT_APP_ID"
echo "   • INSTANT_ADMIN_TOKEN"
echo "   • RESEND_API_KEY"
echo "   • SUPPORT_FROM_EMAIL"
echo "   • CONTACT_ALERT_RECIPIENT"
echo "   • NEXTAUTH_SECRET (run: openssl rand -base64 32)"
echo "   • NEXTAUTH_URL = ${VERCEL_URL}"
echo "   • PASSWORD_PEPPER (run: openssl rand -base64 32)"
echo "   • CONTACT_ALLOWED_ORIGIN = https://rfcity.twd.digital"
echo "   • SITE_BASE_URL = ${VERCEL_URL}"
echo ""
echo "2. Redeploy on Vercel"
echo "   → Go to Deployments tab"
echo "   → Click ⋯ on latest deployment → Redeploy"
echo "   → UNCHECK 'Use existing Build Cache'"
echo ""
echo "3. Rebuild and deploy landing page"
echo "   → Run: npm run build"
echo "   → Push to GitHub (auto-deploys via GitHub Actions)"
echo "   → Or manually trigger workflow in GitHub Actions"
echo ""
echo "4. Test the contact form"
echo "   → Visit: https://rfcity.twd.digital"
echo "   → Fill out and submit the contact form"
echo "   → Check for success message"
echo "   → Verify email notification received"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 For detailed instructions, see QUICK_FIX.md or VERCEL_SETUP.md"
echo ""

# Generate secrets for convenience
echo "🔐 Generate these secrets for Vercel:"
echo ""
echo "NEXTAUTH_SECRET:"
openssl rand -base64 32
echo ""
echo "PASSWORD_PEPPER:"
openssl rand -base64 32
echo ""

