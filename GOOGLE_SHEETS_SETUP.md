# Google Sheets Database Setup Guide

This project has been configured to use Google Sheets as a database instead of MongoDB. Follow these steps to get started.

## 🚀 Quick Setup

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 2. Share the Sheet with Service Account
1. Click "Share" in your Google Sheet
2. Add this email: `varnave-25@varnave25.iam.gserviceaccount.com`
3. Give it "Editor" permissions

### 3. Update Environment Variables
Update your `.env` file:
```env
GOOGLE_SHEET_ID=your_actual_spreadsheet_id_here
```

### 4. Run Setup Script
```bash
npm run setup-sheets
```

### 5. Start the Server
```bash
npm start
```

## 📊 Database Structure

The following sheets will be automatically created:

| Sheet Name | Purpose |
|------------|---------|
| Users | User authentication and profiles |
| Events | Event management |
| Volunteers | Volunteer registration |
| Registrations | Event registrations |
| Committee | Committee member management |
| Applications | Volunteer applications |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin/committee only)
- `PUT /api/events/:id` - Update event (admin/committee only)
- `DELETE /api/events/:id` - Delete event (admin/committee only)
- `POST /api/events/:eventId/register` - Register for event (requires auth)

### Health Check
- `GET /api/health-check` - Check database connection

## 📝 Example Usage

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create an Event (requires admin/committee role)
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Cultural Festival",
    "description": "Annual cultural celebration",
    "date": "2024-12-25",
    "time": "18:00",
    "location": "Main Auditorium",
    "category": "cultural",
    "maxParticipants": 100
  }'
```

## 🔍 Troubleshooting

### Common Issues

1. **"Google Sheets not initialized" error**
   - Make sure you've run the setup script: `npm run setup-sheets`
   - Check that your service account file exists

2. **"Permission denied" error**
   - Ensure your Google Sheet is shared with: `varnave-25@varnave25.iam.gserviceaccount.com`
   - Give the service account "Editor" permissions

3. **"Spreadsheet not found" error**
   - Verify the `GOOGLE_SHEET_ID` in your `.env` file
   - Make sure the spreadsheet exists and is accessible

### Health Check
Visit `http://localhost:8080/api/health-check` to verify your database connection.

## 🔄 Migration from MongoDB

If you're migrating from MongoDB, the API interface remains the same. The Google Sheets database service provides MongoDB-like methods:

- `find()` - Find documents with filters
- `findOne()` - Find single document
- `findById()` - Find by ID
- `create()` - Insert new document
- `findByIdAndUpdate()` - Update document by ID
- `findByIdAndDelete()` - Delete document by ID

## 📈 Performance Notes

- Google Sheets API has rate limits (100 requests per 100 seconds per user)
- For high-traffic applications, consider implementing caching
- Each operation may take 200-500ms due to API calls
- Best suited for small to medium-scale applications

## 🔐 Security

- Service account credentials are stored in `varnave25-e79675851ceb.json`
- Never commit this file to version control
- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
