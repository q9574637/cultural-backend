import { initializeGoogleSheets, SPREADSHEET_ID } from './config/googleSheets.js';
import { connectDB } from './models/index.js';

async function testConnection() {
  try {
    console.log('🔍 Testing Google Sheets connection...\n');
    
    console.log(`📊 Using Sheet ID: ${SPREADSHEET_ID}`);
    
    // Initialize Google Sheets
    await initializeGoogleSheets();
    console.log('✅ Google Sheets API initialized');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connection established');
    
    console.log('\n🎉 Connection test successful!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run setup-sheets (to create sheets)');
    console.log('2. Run: npm run seed (to add mock data)');
    console.log('3. Run: npm start (to start the server)');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you created a Google Sheet and copied the ID');
    console.log('2. Ensure the sheet is shared with: varnave-25@varnave25.iam.gserviceaccount.com');
    console.log('3. Verify the GOOGLE_SHEET_ID in your .env file');
    process.exit(1);
  }
}

testConnection();
