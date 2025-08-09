# Varnave'25 Cultural Festival Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Environment Setup](#environment-setup)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Frontend Integration Guide](#frontend-integration-guide)

## Overview

This is the backend API for the Varnave'25 Cultural Festival management system. It provides endpoints for user authentication, event management, volunteer registration, committee member management, and file uploads.

## Base URL

```
Development: http://localhost:8080/api
Production: [Your production URL]/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `super_admin`: Full access to all endpoints
- `admin`: Limited admin access, can manage assigned events
- `volunteer`: Volunteer access
- `user`: Basic user access

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Server
PORT=8080
JWT_SECRET=your-super-secure-jwt-secret

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database (optional)
npm run seed
```

## API Endpoints

### 1. Health Check

#### GET /api/health-check
Check if the server is running.

**Response:**
```json
{
  "message": "Server is running smoothly!"
}
```

---

### 2. Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user", // Optional: "user", "admin", "volunteer"
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profile": {
      "phone": "1234567890"
    }
  }
}
```

#### POST /api/auth/login
Login user.

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
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### GET /api/auth/me
Get current user profile. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### GET /api/auth/users
Get all users. **Requires Super Admin**

#### GET /api/auth/users/:id
Get user by ID. **Requires Authentication**

#### POST /api/auth/users
Create new user. **Requires Super Admin**

#### PUT /api/auth/users/:id
Update user. **Requires Authentication**

#### DELETE /api/auth/users/:id
Delete user. **Requires Super Admin**

---

### 3. Event Routes (`/api/events`)

#### GET /api/events
Get all active events.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "event_id",
      "title": "Dance Competition",
      "category": "Dance",
      "description": "Show your moves",
      "prize": "₹15,000",
      "date": "September 20",
      "time": "2:00 PM",
      "venue": "Main Auditorium",
      "posterImage": "image_url",
      "rules": ["Rule 1", "Rule 2"]
    }
  ]
}
```

#### GET /api/events/:id
Get event by ID.

#### GET /api/events/category/:category
Get events by category.

#### POST /api/events
Create new event. **Requires Authentication**

**Request Body:**
```json
{
  "title": "Dance Competition",
  "category": "Dance",
  "description": "Show your moves",
  "fullDescription": "Detailed description...",
  "prize": "₹15,000",
  "date": "September 20",
  "time": "2:00 PM",
  "participants": "6-8 per team",
  "venue": "Main Auditorium",
  "duration": "7 minutes",
  "posterImage": "image_url",
  "rules": ["Rule 1", "Rule 2"],
  "registrationDeadline": "2024-09-15T00:00:00.000Z",
  "maxParticipants": 100
}
```

#### PUT /api/events/:id
Update event. **Requires Authentication**

#### DELETE /api/events/:id
Delete event. **Requires Authentication**

#### GET /api/events/admin/events
Get events for admin (filtered by assigned event if admin). **Requires Authentication**

---

### 4. Registration Routes (`/api/registrations`)

#### POST /api/registrations
Register for an event.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "college": "ABC University",
  "specialRequirements": "None",
  "eventId": "event_id",
  "eventName": "Dance Competition",
  "totalFee": 500,
  "paymentMethod": "upi"
}
```

#### GET /api/registrations
Get all registrations. **Requires Authentication (Admin)**

#### GET /api/registrations/stats
Get registration statistics. **Requires Authentication (Admin)**

#### GET /api/registrations/:id
Get registration by ID. **Requires Authentication**

#### PUT /api/registrations/:id/status
Update registration status. **Requires Authentication (Admin)**

#### DELETE /api/registrations/:id
Delete registration. **Requires Authentication (Admin)**

---

### 5. Volunteer Routes (`/api/volunteers`)

#### POST /api/volunteers/register
Register as volunteer.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "1234567890",
  "rolePreference": ["Stage Management", "Registration"],
  "events": ["Dance", "Music"]
}
```

**Response:**
```json
{
  "message": "Volunteer registered successfully!",
  "volunteer": {
    "_id": "volunteer_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "applicationStatus": "Pending"
  }
}
```

#### GET /api/volunteers
Get all volunteers. **Requires Authentication**

#### PUT /api/volunteers/status/:id
Update volunteer application status. **Requires Authentication**

**Request Body:**
```json
{
  "applicationStatus": "Accepted" // "Pending", "Accepted", "Rejected"
}
```

---

### 6. Committee Routes (`/api/committee`)

#### GET /api/committee
Get all committee members.

**Response:**
```json
[
  {
    "_id": "member_id",
    "name": "Committee Member",
    "position": "Festival Director",
    "phone": "1234567890",
    "email": "member@example.com",
    "image": "image_url",
    "bio": "Bio text",
    "socialLinks": {
      "linkedin": "linkedin_url",
      "instagram": "instagram_url"
    }
  }
]
```

#### GET /api/committee/:id
Get committee member by ID.

#### POST /api/committee
Create committee member. **Requires Super Admin**

#### PUT /api/committee/:id
Update committee member. **Requires Super Admin**

#### DELETE /api/committee/:id
Delete committee member. **Requires Super Admin**

#### PUT /api/committee/:id/order
Update committee member display order. **Requires Super Admin**

---

### 7. File Upload (`/api/upload`)

#### POST /api/upload
Upload file to Cloudinary.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`

**Response:**
```json
{
  "message": "Upload successful",
  "url": "https://cloudinary-url",
  "public_id": "cloudinary-public-id"
}
```

---

### 8. Application Routes (`/api/applications`)

#### PUT /api/applications/accept/:id
Accept volunteer application and create user account. **Requires Authentication**

**Response:**
```json
{
  "message": "Application accepted, user created, email sent",
  "user": {
    "_id": "user_id",
    "name": "Volunteer Name",
    "email": "volunteer@example.com"
  }
}
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // Hashed
  role: String, // "super_admin", "admin", "user", "volunteer"
  assignedEventId: ObjectId, // For admins
  profile: {
    phone: String,
    avatar: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  _id: ObjectId,
  title: String,
  category: String,
  description: String,
  fullDescription: String,
  prize: String,
  date: String,
  time: String,
  participants: String,
  venue: String,
  duration: String,
  posterImage: String,
  rules: [String],
  status: String, // "active", "inactive", "completed"
  registrationDeadline: Date,
  maxParticipants: Number,
  currentParticipants: Number,
  organizer: ObjectId,
  stats: {
    totalRegistrations: Number,
    rating: Number,
    reviewCount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Volunteer Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  rolePreference: [String],
  events: [String],
  applicationStatus: String, // "Pending", "Accepted", "Rejected"
  createdAt: Date
}
```

### EventRegistration Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  college: String,
  specialRequirements: String,
  eventId: ObjectId,
  eventName: String,
  registrationDate: Date,
  totalFee: Number,
  paymentStatus: String, // "pending", "paid", "failed", "refunded"
  paymentMethod: String, // "cash", "card", "bank_transfer", "upi"
  transactionId: String,
  status: String, // "registered", "cancelled", "attended", "refunded"
  createdAt: Date,
  updatedAt: Date
}
```

### CommitteeMember Model
```javascript
{
  _id: ObjectId,
  name: String,
  position: String,
  phone: String,
  email: String,
  image: String,
  bio: String,
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String
  },
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Frontend Integration Guide

### 1. Setting up API Client

```javascript
// api.js
const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Event methods
  async getEvents() {
    return this.request('/events');
  }

  async getEventById(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Registration methods
  async registerForEvent(registrationData) {
    return this.request('/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  // Volunteer methods
  async registerVolunteer(volunteerData) {
    return this.request('/volunteers/register', {
      method: 'POST',
      body: JSON.stringify(volunteerData),
    });
  }

  // File upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it
      body: formData,
    });
  }
}

export default new ApiClient();
```

### 2. React Integration Examples

```jsx
// Login Component
import React, { useState } from 'react';
import apiClient from './api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await apiClient.login(email, password);
      console.log('Login successful:', data);
      // Redirect or update state
    } catch (error) {
      console.error('Login failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

```jsx
// Events List Component
import React, { useState, useEffect } from 'react';
import apiClient from './api';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.getEvents();
        setEvents(data.data);
      } catch (error) {
        console.error('Failed to fetch events:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Prize: {event.prize}</p>
          <p>Date: {event.date} at {event.time}</p>
          <p>Venue: {event.venue}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Error Handling in Frontend

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Forbidden - show access denied message
    alert('Access denied. You do not have permission to perform this action.');
  } else {
    // General error
    alert(error.message || 'An error occurred. Please try again.');
  }
};
```

### 4. Authentication Context (React)

```jsx
// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const data = await apiClient.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiClient.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    apiClient.setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

---

## Security Notes

1. **JWT Tokens**: Store securely (preferably in httpOnly cookies for production)
2. **Environment Variables**: Never commit `.env` files to version control
3. **Password Hashing**: All passwords are hashed using bcrypt
4. **Input Validation**: Implement client-side validation, but always validate on server-side
5. **Rate Limiting**: Consider implementing rate limiting for production

---

## Support

For any issues or questions regarding the API, please contact the development team or create an issue in the project repository.
