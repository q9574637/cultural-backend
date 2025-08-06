# Nuvoriya Cultural Festival - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... } // or array for multiple items
}
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user", // optional, defaults to "user"
  "phone": "+91 9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profile": {
      "phone": "+91 9876543210"
    }
  }
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "assignedEventId": null
  }
}
```

---

## 🎪 Event Endpoints

### Get All Events
**GET** `/events`

**Query Parameters:**
- `category` - Filter by category (optional)
- `status` - Filter by status (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "event_id",
      "title": "Parampara Parade",
      "category": "Fashion",
      "description": "Showcase of ethnic fashion",
      "fullDescription": "Full description...",
      "prize": "₹15,000",
      "date": "September 20",
      "time": "2:00 PM",
      "participants": "6-8 per team",
      "venue": "Main Auditorium",
      "duration": "7 minutes",
      "posterImage": "image_url",
      "rules": ["Rule 1", "Rule 2"],
      "status": "active",
      "currentParticipants": 25,
      "maxParticipants": 50
    }
  ]
}
```

### Get Event by ID
**GET** `/events/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "event_id",
    "title": "Parampara Parade",
    // ... all event fields
  }
}
```

### Get Events by Category
**GET** `/events/category/:category`

**Response:** Same as Get All Events, but filtered by category

### Create Event (Admin Only)
**POST** `/events`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Event",
  "category": "Dance",
  "description": "Event description",
  "fullDescription": "Full event description",
  "prize": "₹10,000",
  "date": "September 22",
  "time": "3:00 PM",
  "participants": "Individual",
  "venue": "Dance Studio",
  "duration": "4 minutes",
  "posterImage": "image_url",
  "rules": ["Rule 1", "Rule 2"],
  "maxParticipants": 30,
  "registrationDeadline": "2025-09-15T00:00:00.000Z"
}
```

### Update Event (Admin Only)
**PUT** `/events/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Event (all fields optional)

### Delete Event (Super Admin Only)
**DELETE** `/events/:id`

**Headers:** `Authorization: Bearer <token>`

---

## 👥 Committee Member Endpoints

### Get All Committee Members
**GET** `/committee`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "member_id",
      "name": "Arjun Kumar",
      "position": "Festival Director",
      "phone": "+91 98765 43210",
      "email": "arjun@nuvoriya.com",
      "image": "image_url",
      "bio": "Bio text",
      "socialLinks": {
        "linkedin": "linkedin_url",
        "twitter": "twitter_url",
        "instagram": "instagram_url"
      },
      "order": 1
    }
  ]
}
```

### Get Committee Member by ID
**GET** `/committee/:id`

### Create Committee Member (Super Admin Only)
**POST** `/committee`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Member",
  "position": "Position Title",
  "phone": "+91 9876543210",
  "email": "member@nuvoriya.com",
  "image": "image_url",
  "bio": "Member bio",
  "socialLinks": {
    "linkedin": "linkedin_url",
    "twitter": "twitter_url",
    "instagram": "instagram_url"
  },
  "order": 7
}
```

### Update Committee Member (Super Admin Only)
**PUT** `/committee/:id`

### Delete Committee Member (Super Admin Only)
**DELETE** `/committee/:id`

### Update Committee Member Order (Super Admin Only)
**PUT** `/committee/order/update`

**Request Body:**
```json
{
  "members": [
    { "id": "member_id_1", "order": 1 },
    { "id": "member_id_2", "order": 2 }
  ]
}
```

---

## 📝 Registration Endpoints

### Create Registration (Public)
**POST** `/registrations`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "college": "ABC College",
  "specialRequirements": "Vegetarian meal",
  "eventId": "event_id",
  "totalFee": 449
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "_id": "registration_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "college": "ABC College",
    "specialRequirements": "Vegetarian meal",
    "eventId": "event_id",
    "eventName": "Parampara Parade",
    "registrationDate": "2025-01-15T10:30:00.000Z",
    "totalFee": 449,
    "paymentStatus": "pending",
    "status": "registered"
  }
}
```

### Get All Registrations (Admin Only)
**GET** `/registrations`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `eventId` - Filter by event (optional)
- `status` - Filter by status (optional)
- `paymentStatus` - Filter by payment status (optional)

### Get Registration Statistics (Admin Only)
**GET** `/registrations/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 150,
    "paidRegistrations": 120,
    "pendingRegistrations": 25,
    "unpaidRegistrations": 30
  }
}
```

### Get Registration by ID (Admin Only)
**GET** `/registrations/:id`

### Update Registration Status (Admin Only)
**PUT** `/registrations/:id/status`

**Request Body:**
```json
{
  "status": "attended", // registered, cancelled, attended, refunded
  "notes": "Optional notes"
}
```

### Delete Registration (Super Admin Only)
**DELETE** `/registrations/:id`

---

## 👤 User Management Endpoints (Super Admin Only)

### Get All Users
**GET** `/auth/users`

**Headers:** `Authorization: Bearer <token>`

### Get User by ID
**GET** `/auth/users/:id`

### Create User
**POST** `/auth/users`

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "admin",
  "assignedEventId": "event_id", // optional, for admin role
  "phone": "+91 9876543210"
}
```

### Update User
**PUT** `/auth/users/:id`

### Delete User
**DELETE** `/auth/users/:id`

---

## 🔒 Role-Based Access Control

### Super Admin
- Full system access
- Can manage all users, events, committee members, and registrations
- Can delete any entity
- Can assign events to admin users

### Admin
- Can manage assigned events only
- Can view and update registrations for assigned events
- Cannot delete events or users
- Cannot manage committee members

### User
- Can view public events and committee members
- Can register for events
- Cannot access admin features

---

## 📊 Error Responses

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Event not found"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## 🧪 Testing Examples

### Using curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@nuvoriya.com","password":"admin123"}'
```

**Get Events:**
```bash
curl -X GET http://localhost:3000/api/events
```

**Create Event (with token):**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Event","category":"Dance","description":"Test"}'
```

### Using Postman

1. Set base URL: `http://localhost:3000/api`
2. For protected endpoints, add header: `Authorization: Bearer <token>`
3. Set Content-Type: `application/json` for POST/PUT requests

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- ObjectIds are MongoDB ObjectId strings
- File uploads are not yet implemented (use placeholder URLs)
- Payment integration is planned for future versions
- Email notifications are planned for future versions 