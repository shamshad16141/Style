# Style Saloon - Node.js & MongoDB Backend

## Project Setup

This is a full-stack application with an HTML frontend and Node.js backend with MongoDB database.

### Project Structure
```
├── public/               # HTML frontend files
├── config/              # Database configuration
├── models/              # MongoDB schemas
├── controllers/         # Business logic
├── routes/              # API routes
├── middleware/          # Custom middleware (optional)
├── server.js            # Main server file
├── package.json         # Node dependencies
└── .env                 # Environment variables
```

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB**
   - Option A: Local MongoDB
     - Make sure MongoDB is running on your system
     - Default connection: `mongodb://localhost:27017/style`
   
   - Option B: MongoDB Atlas (Cloud)
     - Create a cluster at https://www.mongodb.com/cloud/atlas
     - Update `.env` file with your connection string

3. **Set up environment variables**
   Edit `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/style
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

### API Endpoints

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `POST /api/users/login` - Login user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/user/:userId` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Frontend Integration

Your HTML files in the `public/` folder will be served automatically. To call the API from your frontend:

```javascript
// Example: Create a user
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    password: 'password123',
    role: 'customer'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Database Models

#### User Schema
- firstName (String, required)
- lastName (String, required)
- email (String, required, unique)
- phone (String)
- password (String, required)
- role (String: customer, admin, stylist)

#### Booking Schema
- userId (ObjectId, reference to User)
- serviceName (String, required)
- serviceType (String)
- stylist (String)
- date (Date, required)
- time (String, required)
- duration (Number, in minutes)
- price (Number)
- status (String: pending, confirmed, completed, cancelled)
- notes (String)

### Next Steps

1. Add JWT authentication for secure login
2. Hash passwords using bcrypt
3. Add form validation
4. Create more API endpoints as needed
5. Add unit tests
6. Deploy to production (Heroku, AWS, DigitalOcean, etc.)

### Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running and the connection string is correct
- **Port already in use**: Change `PORT` in `.env` file
- **Module not found**: Run `npm install` again
- **CORS errors**: Configure CORS settings in `server.js` if needed

### Deploy on Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. In Vercel project settings, add environment variable:
  - `MONGODB_URI` = your MongoDB Atlas connection string
4. Deploy.

Notes:
- `vercel.json` is already configured to route all requests to the serverless Express app.
- Frontend API calls use relative paths (`/api/...`), so they work in Vercel without changing code.
