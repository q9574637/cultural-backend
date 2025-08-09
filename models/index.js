import GoogleSheetsDB from '../services/googleSheetsDB.js';
import { SHEET_NAMES } from '../config/googleSheets.js';

// Initialize the database
const db = new GoogleSheetsDB();

// Model classes that provide a MongoDB-like interface
class BaseModel {
  constructor(sheetName) {
    this.sheetName = sheetName;
    this.db = db;
  }

  async find(filter = {}) {
    return await this.db.find(this.sheetName, filter);
  }

  async findOne(filter = {}) {
    return await this.db.findOne(this.sheetName, filter);
  }

  async findById(id) {
    return await this.db.findById(this.sheetName, id);
  }

  async create(document) {
    return await this.db.insertOne(this.sheetName, document);
  }

  async findByIdAndUpdate(id, update) {
    return await this.db.updateOne(this.sheetName, { _id: id }, update);
  }

  async findOneAndUpdate(filter, update) {
    return await this.db.updateOne(this.sheetName, filter, update);
  }

  async findByIdAndDelete(id) {
    return await this.db.deleteOne(this.sheetName, { _id: id });
  }

  async deleteOne(filter) {
    return await this.db.deleteOne(this.sheetName, filter);
  }

  async countDocuments(filter = {}) {
    return await this.db.countDocuments(this.sheetName, filter);
  }
}

// Create model instances
export const User = new BaseModel(SHEET_NAMES.USERS);
export const Event = new BaseModel(SHEET_NAMES.EVENTS);
export const Volunteer = new BaseModel(SHEET_NAMES.VOLUNTEERS);
export const Registration = new BaseModel(SHEET_NAMES.REGISTRATIONS);
export const Committee = new BaseModel(SHEET_NAMES.COMMITTEE);
export const Application = new BaseModel(SHEET_NAMES.APPLICATIONS);

// Initialize database connection
export async function connectDB() {
  try {
    await db.initialize();
    console.log('✅ Google Sheets Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to Google Sheets Database:', error);
    throw error;
  }
}

export default {
  User,
  Event,
  Volunteer,
  Registration,
  Committee,
  Application,
  connectDB
};
