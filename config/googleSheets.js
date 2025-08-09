import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'varnave25-e79675851ceb.json');

// Your Google Sheet ID (you'll need to create a sheet and add this ID)
export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';

// Sheet names for different collections
export const SHEET_NAMES = {
  USERS: 'Users',
  EVENTS: 'Events', 
  VOLUNTEERS: 'Volunteers',
  REGISTRATIONS: 'Registrations',
  COMMITTEE: 'Committee',
  APPLICATIONS: 'Applications'
};

let auth = null;
let sheets = null;

// Initialize Google Sheets API
export async function initializeGoogleSheets() {
  try {
    auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    sheets = google.sheets({ version: 'v4', auth: authClient });
    
    console.log('✅ Google Sheets API initialized successfully');
    return sheets;
  } catch (error) {
    console.error('❌ Error initializing Google Sheets API:', error);
    throw error;
  }
}

// Get Google Sheets instance
export function getSheets() {
  if (!sheets) {
    throw new Error('Google Sheets not initialized. Call initializeGoogleSheets() first.');
  }
  return sheets;
}

// Create sheet if it doesn't exist
export async function createSheetIfNotExists(sheetName) {
  try {
    const sheetsInstance = getSheets();
    
    // Get existing sheets
    const response = await sheetsInstance.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const existingSheets = response.data.sheets.map(sheet => sheet.properties.title);
    
    if (!existingSheets.includes(sheetName)) {
      // Create new sheet
      await sheetsInstance.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }
      });
      console.log(`✅ Created sheet: ${sheetName}`);
    }
  } catch (error) {
    console.error(`❌ Error creating sheet ${sheetName}:`, error);
    throw error;
  }
}

// Initialize all required sheets
export async function initializeAllSheets() {
  try {
    for (const sheetName of Object.values(SHEET_NAMES)) {
      await createSheetIfNotExists(sheetName);
    }
    console.log('✅ All sheets initialized');
  } catch (error) {
    console.error('❌ Error initializing sheets:', error);
    throw error;
  }
}
