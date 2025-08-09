import express from 'express';
import { getSheets, SPREADSHEET_ID } from '../config/googleSheets.js';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Test Google Sheets connection
    const sheets = getSheets();
    await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    res.json({
      success: true,
      message: 'Server is healthy',
      database: 'Google Sheets',
      timestamp: new Date().toISOString(),
      status: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      database: 'Google Sheets',
      timestamp: new Date().toISOString(),
      status: 'Disconnected',
      error: error.message
    });
  }
});

export default router;
