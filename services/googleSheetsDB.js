import { getSheets, SPREADSHEET_ID, SHEET_NAMES } from '../config/googleSheets.js';

class GoogleSheetsDB {
  constructor() {
    this.sheets = null;
  }

  async initialize() {
    this.sheets = getSheets();
  }

  // Helper method to convert array to object based on headers
  arrayToObject(headers, row) {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  }

  // Helper method to convert object to array based on headers
  objectToArray(headers, obj) {
    return headers.map(header => obj[header] || '');
  }

  // Get all data from a sheet
  async findAll(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = this.arrayToObject(headers, row);
        obj._rowIndex = rows.indexOf(row) + 1; // Store row index for updates
        return obj;
      });

      return data;
    } catch (error) {
      console.error(`Error reading from ${sheetName}:`, error);
      throw error;
    }
  }

  // Find data with filter
  async find(sheetName, filter = {}) {
    const allData = await this.findAll(sheetName);
    
    if (Object.keys(filter).length === 0) return allData;

    return allData.filter(item => {
      return Object.keys(filter).every(key => {
        if (typeof filter[key] === 'object' && filter[key].$regex) {
          const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i');
          return regex.test(item[key]);
        }
        return item[key] === filter[key];
      });
    });
  }

  // Find one document
  async findOne(sheetName, filter = {}) {
    const results = await this.find(sheetName, filter);
    return results.length > 0 ? results[0] : null;
  }

  // Find by ID
  async findById(sheetName, id) {
    return await this.findOne(sheetName, { _id: id });
  }

  // Insert new document
  async insertOne(sheetName, document) {
    try {
      // Generate ID if not provided
      if (!document._id) {
        document._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      }

      // Add timestamps
      document.createdAt = new Date().toISOString();
      document.updatedAt = new Date().toISOString();

      // Get existing headers or create new ones
      const existingData = await this.findAll(sheetName);
      let headers = [];

      if (existingData.length > 0) {
        // Get headers from existing data
        const response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!1:1`,
        });
        headers = response.data.values ? response.data.values[0] : [];
      } else {
        // Create headers from document keys
        headers = Object.keys(document);
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!1:1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }

      // Ensure all document keys are in headers
      const newHeaders = [...headers];
      Object.keys(document).forEach(key => {
        if (!newHeaders.includes(key)) {
          newHeaders.push(key);
        }
      });

      // Update headers if new ones were added
      if (newHeaders.length > headers.length) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!1:1`,
          valueInputOption: 'RAW',
          resource: {
            values: [newHeaders]
          }
        });
        headers = newHeaders;
      }

      // Convert document to array based on headers
      const rowData = this.objectToArray(headers, document);

      // Append the new row
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        resource: {
          values: [rowData]
        }
      });

      return document;
    } catch (error) {
      console.error(`Error inserting into ${sheetName}:`, error);
      throw error;
    }
  }

  // Update document
  async updateOne(sheetName, filter, update) {
    try {
      const document = await this.findOne(sheetName, filter);
      if (!document) return null;

      // Update the document
      const updatedDocument = { ...document, ...update };
      updatedDocument.updatedAt = new Date().toISOString();

      // Get headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!1:1`,
      });
      const headers = response.data.values ? response.data.values[0] : [];

      // Convert to array
      const rowData = this.objectToArray(headers, updatedDocument);

      // Update the specific row
      const rowIndex = document._rowIndex + 1; // +1 because _rowIndex is 0-based but sheets are 1-based
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: 'RAW',
        resource: {
          values: [rowData]
        }
      });

      return updatedDocument;
    } catch (error) {
      console.error(`Error updating in ${sheetName}:`, error);
      throw error;
    }
  }

  // Delete document
  async deleteOne(sheetName, filter) {
    try {
      const document = await this.findOne(sheetName, filter);
      if (!document) return null;

      const rowIndex = document._rowIndex + 1; // +1 because _rowIndex is 0-based but sheets are 1-based

      // Delete the row
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId(sheetName),
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex
              }
            }
          }]
        }
      });

      return document;
    } catch (error) {
      console.error(`Error deleting from ${sheetName}:`, error);
      throw error;
    }
  }

  // Get sheet ID by name
  async getSheetId(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
      return sheet ? sheet.properties.sheetId : null;
    } catch (error) {
      console.error(`Error getting sheet ID for ${sheetName}:`, error);
      throw error;
    }
  }

  // Count documents
  async countDocuments(sheetName, filter = {}) {
    const data = await this.find(sheetName, filter);
    return data.length;
  }
}

export default GoogleSheetsDB;
