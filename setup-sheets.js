import { initializeGoogleSheets, initializeAllSheets, SPREADSHEET_ID } from './config/googleSheets.js';

async function setupGoogleSheets() {
  console.log('🚀 Setting up Google Sheets Database...\n');

  try {
    // Step 1: Initialize Google Sheets API
    console.log('1. Initializing Google Sheets API...');
    await initializeGoogleSheets();
    console.log('✅ Google Sheets API initialized\n');

    // Step 2: Create all required sheets
    console.log('2. Creating required sheets...');
    await initializeAllSheets();
    console.log('✅ All sheets created successfully\n');

    // Step 3: Display setup information
    console.log('📊 Google Sheets Database Setup Complete!\n');
    console.log('📋 Setup Information:');
    console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`   Service Account: varnave-25@varnave25.iam.gserviceaccount.com`);
    console.log('\n📝 Created Sheets:');
    console.log('   • Users - For user authentication and profiles');
    console.log('   • Events - For event management');
    console.log('   • Volunteers - For volunteer registration');
    console.log('   • Registrations - For event registrations');
    console.log('   • Committee - For committee member management');
    console.log('   • Applications - For volunteer applications');

    console.log('\n🔧 Next Steps:');
    console.log('1. Update your .env file with the correct GOOGLE_SHEET_ID');
    console.log('2. Make sure your Google Sheet is shared with: varnave-25@varnave25.iam.gserviceaccount.com');
    console.log('3. Run: npm start');

    console.log('\n🌐 API Endpoints Available:');
    console.log('   POST /api/auth/register - Register new user');
    console.log('   POST /api/auth/login - User login');
    console.log('   GET  /api/auth/profile - Get user profile');
    console.log('   GET  /api/events - Get all events');
    console.log('   POST /api/events - Create new event (admin/committee only)');
    console.log('   GET  /api/health-check - Check database connection');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if your service account key file exists');
    console.log('2. Verify the GOOGLE_SHEET_ID in your .env file');
    console.log('3. Ensure the Google Sheet is shared with your service account');
    process.exit(1);
  }
}

// Run setup
setupGoogleSheets();
