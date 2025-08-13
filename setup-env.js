const fs = require('fs');
const path = require('path');

const envTemplate = `# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret-key-here-make-it-long-and-random
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# API Tokens
PROPTX_IDX_TOKEN=your-proptx-idx-token
PROPTX_VOW_TOKEN=your-proptx-vow-token
PROPTX_DLA_TOKEN=your-proptx-dla-token
PROPTX_IDX_URL=https://query.ampre.ca/odata

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# AWS Configuration
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# RESO API
RESO_API_KEY=your-reso-api-key
RESO_API_URL=your-reso-api-url

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="file:./dev.db"
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('Please update your existing .env.local file with the required variables.');
} else {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file with template variables.');
  console.log('📝 Please update the values in .env.local with your actual API keys and configuration.');
}

console.log('\n🔧 To fix the current errors, you need to:');
console.log('1. Update .env.local with your actual API keys');
console.log('2. For development, you can use dummy values for Auth0 (the app will show auth errors but won\'t crash)');
console.log('3. For PROPTX_IDX_TOKEN, you can leave it empty for now (the app will show empty results)');
console.log('\n🚀 After updating .env.local, restart your development server with: npm run dev'); 