





# Event Management Backend API

A comprehensive Node.js + Express.js + MongoDB backend for the Nuvoriya Cultural Festival event management system.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** with JWT tokens
- **Role-based Access Control**:
  - `super_admin`: Full system access
  - `admin`: Event-specific management
  - `user`: Basic access

### Event Management
- **CRUD Operations** for events
- **Category-based filtering** (Dance, Music, Drama, Visual Arts, Gaming, Fashion)
- **Event status management** (active, inactive, completed)
- **Participant limits** and registration deadlines
- **Event statistics** tracking

### Committee Management
- **Committee member profiles** with positions and contact info
- **Order management** for display
- **Social media links** and bio information

### Registration System
- **Event registration** with participant details
- **Payment status tracking** (pending, paid, failed, refunded)
- **Registration status management** (registered, cancelled, attended, refunded)
- **Statistics and reporting** for admins

### Admin Dashboard
- **Super Admin**: Full system management
- **Event Admin**: Assigned event management only
- **User management** (super admin only)
- **Registration management** with filtering

## 📁 Project Structure

```
Backend/
├── Config/
│   ├── Connection.js          # Database connection
│   ├── emailService.js        # Email service configuration
│   └── serviceAccountKey.json # Service account keys
├── controllers/
│   ├── authController.js      # Authentication & user management
│   ├── eventController.js     # Event operations
│   ├── committeeController.js # Committee member operations
│   └── registrationController.js # Registration operations
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── adminAuth.js          # Role-based authorization
├── models/
│   ├── User.js               # User model
│   ├── Events.js             # Event model
│   ├── CommitteeMember.js    # Committee member model
│   └── EventRegistration.js  # Registration model
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── events.js             # Event routes
│   ├── committee.js          # Committee routes
│   └── registrations.js      # Registration routes
├── index.js                  # Main server file
├── seed.js                   # Database seeding script
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-managemet-server/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/nuvoriya_festival
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running)
   mongod
   
   # Seed the database with initial data
   node seed.js
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 🔐 Authentication

### Login Credentials (after seeding)
- **Super Admin**: `superadmin@nuvoriya.com` / `admin123`
- **Event Admin**: `admin@nuvoriya.com` / `admin123`

### JWT Token Usage
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/me           # Get current user (protected)
```

### Events
```
GET    /api/events                    # Get all events (public)
GET    /api/events/:id                # Get event by ID (public)
GET    /api/events/category/:category # Get events by category (public)
GET    /api/events/admin/events       # Get events for admin (protected)
POST   /api/events                    # Create event (protected)
PUT    /api/events/:id                # Update event (protected)
DELETE /api/events/:id                # Delete event (protected)
```

### Committee Members
```
GET    /api/committee                 # Get all committee members (public)
GET    /api/committee/:id             # Get member by ID (public)
POST   /api/committee                 # Create member (super admin only)
PUT    /api/committee/:id             # Update member (super admin only)
DELETE /api/committee/:id             # Delete member (super admin only)
PUT    /api/committee/order/update    # Update member order (super admin only)
```

### Registrations
```
GET    /api/registrations             # Get all registrations (admin only)
GET    /api/registrations/stats       # Get registration stats (admin only)
GET    /api/registrations/:id         # Get registration by ID (admin only)
POST   /api/registrations             # Create registration (public)
PUT    /api/registrations/:id/status  # Update status (admin only)
DELETE /api/registrations/:id         # Delete registration (super admin only)
```

### User Management (Super Admin Only)
```
GET    /api/auth/users                # Get all users
GET    /api/auth/users/:id            # Get user by ID
POST   /api/auth/users                # Create user
PUT    /api/auth/users/:id            # Update user
DELETE /api/auth/users/:id            # Delete user
```

## 🔒 Role-Based Access Control

### Super Admin
- Full system access
- Can create, update, delete all entities
- Can manage all users and events
- Can view all registrations and statistics

### Admin
- Can manage assigned events only
- Can view registrations for assigned events
- Can update registration statuses
- Cannot delete events or users

### User
- Can view public events and committee members
- Can register for events
- Cannot access admin features

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "super_admin" | "admin" | "user",
  assignedEventId: ObjectId (for admins),
  profile: {
    phone: String,
    avatar: String
  },
  isActive: Boolean
}
```

### Event
```javascript
{
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
  status: "active" | "inactive" | "completed",
  organizer: ObjectId (ref: User),
  currentParticipants: Number,
  maxParticipants: Number,
  registrationDeadline: Date
}
```

### CommitteeMember
```javascript
{
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
  order: Number
}
```

### EventRegistration
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  college: String,
  specialRequirements: String,
  eventId: ObjectId (ref: Event),
  eventName: String,
  registrationDate: Date,
  totalFee: Number,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentMethod: "cash" | "card" | "bank_transfer" | "upi",
  status: "registered" | "cancelled" | "attended" | "refunded",
  transactionId: String
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nuvoriya_festival
JWT_SECRET=your_very_secure_jwt_secret
NODE_ENV=production
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start index.js --name "nuvoriya-backend"
pm2 save
pm2 startup
```

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Database Seeding
```bash
node seed.js
```

### API Testing
Use tools like Postman or curl to test the API endpoints.

## 📝 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for registrations
- [ ] File upload for event posters and committee member images
- [ ] Real-time notifications using WebSockets
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
# cultural-backend
