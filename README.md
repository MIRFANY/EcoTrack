# 🌍 EcoTrack - Student Sustainability App

A modern, full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that helps students track their carbon footprint, complete sustainability challenges, and compete in "The Syndicate" leaderboard system.

## 📋 Features

### 1. **Carbon Footprint Tracking**

- Log daily activities across three categories:
  - 🚗 **Transportation**: Walking, cycling, bus, train, car, electric vehicles
  - 🍽️ **Meals**: Vegan, vegetarian, fish, and meat consumption
  - 📱 **Digital Waste**: Email count and video streaming hours
- Real-time CO₂ emission calculations
- Historical data visualization with charts

### 2. **User Dashboard**

- Daily sustainability score (0-100 scale)
- Visual statistics: total carbon, level, points, days logged
- 7, 30, and 90-day emission trends
- Category breakdown charts
- Personal achievements and badges

### 3. **Gamification - "The Syndicate"**

- **Global Leaderboard**: Compete with all users
- **University Leaderboard**: Compete within your institution
- **Department Leaderboard**: Compete within your department
- Points-based ranking system
- Level progression (every 100 points = 1 level)
- Badges and achievements system

### 4. **Daily Habit Logger**

- User-friendly form with instant feedback
- Real-time CO₂ emission preview
- Multiple meal entries
- Sustainability score calculation
- Success notifications and error handling

### 5. **Challenge System**

- Time-based sustainability challenges
- Difficulty levels: Easy, Medium, Hard
- Points rewards upon completion
- Challenge categories: transportation, diet, digital, general
- Track challenge progress

## 🏗️ Project Architecture

### Folder Structure

```
EcoTrack/
├── server/                          # Node.js/Express backend
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                 # User schema with auth
│   │   ├── DailyLog.js             # Daily activity records
│   │   └── Challenge.js            # Challenge data
│   ├── routes/                      # API endpoints
│   │   ├── carbonRoutes.js         # Carbon tracking endpoints
│   │   ├── leaderboardRoutes.js    # Leaderboard & challenges
│   │   └── userRoutes.js           # User management
│   ├── controllers/                 # Business logic
│   │   ├── carbonController.js     # Carbon calculations
│   │   └── leaderboardController.js# Rankings & challenges
│   ├── utils/                       # Helper functions
│   │   └── carbonCalculator.js     # Emission factor calculations
│   ├── .env                         # Environment variables
│   ├── server.js                    # Main server entry point
│   └── package.json
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Dashboard.jsx       # Main user dashboard
│   │   │   ├── DailyHabitForm.jsx  # Activity logging form
│   │   │   └── Leaderboard.jsx     # Rankings display
│   │   ├── pages/                  # Page components
│   │   ├── utils/                  # Client utilities
│   │   │   ├── api.js              # API client calls
│   │   │   └── carbonCalculator.js # Client-side calculations
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Tailwind + global styles
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── postcss.config.js           # PostCSS config
│   └── package.json
├── .github/
│   └── copilot-instructions.md     # Project guidelines
├── package.json                     # Root package.json
└── README.md                        # This file
```

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  university: String,
  department: String,
  totalCarbonFootprint: Number (kg),
  dailyScore: Number (0-100),
  level: Number (starts at 1),
  points: Number (accumulated),
  badges: [{ name: String, earnedAt: Date }],
  createdAt: Date
}
```

### DailyLog Model

```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  transportation: {
    type: String (enum: walking|cycling|bus|train|car|electric_vehicle),
    distance: Number (km),
    carbonEmission: Number (kg)
  },
  meals: [{
    type: String (enum: vegan|vegetarian|meat|fish),
    carbonEmission: Number (kg)
  }],
  digitalWaste: {
    emails: Number,
    streamingHours: Number,
    carbonEmission: Number (kg)
  },
  totalCarbonForDay: Number (kg),
  challengesCompleted: [String],
  createdAt: Date
}
```

### Challenge Model

```javascript
{
  name: String (required),
  description: String,
  category: String (transportation|diet|digital|general),
  difficulty: String (easy|medium|hard),
  pointsReward: Number,
  targetValue: Number,
  startDate: Date,
  endDate: Date,
  participants: [{
    userId: ObjectId,
    progress: Number,
    completed: Boolean,
    completedAt: Date
  }],
  createdAt: Date
}
```

## 🧮 Carbon Calculation Logic

### Emission Factors (kg CO₂e per unit)

**Transportation** (per km):

- Walking: 0 kg
- Cycling: 0 kg
- Bus: 0.089 kg
- Train: 0.041 kg
- Car: 0.21 kg
- Electric Vehicle: 0.05 kg

**Meals** (per meal):

- Vegan: 1.5 kg
- Vegetarian: 2.0 kg
- Fish: 3.5 kg
- Meat: 5.0 kg

**Digital** (per unit):

- Email: 0.004 kg per email
- Video Streaming: 0.036 kg per hour (1080p)

**Sustainability Score Formula:**

```
Score = max(0, 100 - (totalEmissions / 25) * 100)
Where 25 kg is the EU daily baseline
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)
- VS Code (optional but recommended)

### 1. Clone & Install Dependencies

```bash
# Navigate to project directory
cd EcoTrack

# Install all dependencies
npm run install-all
```

### 2. Configure Environment Variables

Create/edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ecotrack
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# Then start the MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecotrack?retryWrites=true&w=majority
```

### 4. Start the Application

```bash
# From project root, run both server and client
npm run dev
```

This will start:

- **Server**: http://localhost:5000
- **Client**: http://localhost:3000

### 5. Verify Setup

```bash
# Check server health
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "Server is running" }
```

## 📡 API Endpoints

### Carbon Tracking

- `POST /api/carbon/log` - Log daily activities
- `GET /api/carbon/history/:userId?days=30` - Get emission history
- `GET /api/carbon/today/:userId` - Get today's footprint
- `GET /api/carbon/stats/:userId` - Get user statistics

### Leaderboard

- `GET /api/leaderboard?sortBy=points&limit=50` - Global leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user's rank
- `GET /api/leaderboard/university?university=name` - University ranking
- `GET /api/leaderboard/department?department=name` - Department ranking
- `GET /api/leaderboard/challenges/active` - Active challenges
- `POST /api/leaderboard/challenges/join` - Join a challenge

## 🎨 UI Components

### Dashboard Component

- Real-time statistics display
- Emission trend charts (7/30/90 days)
- Category breakdown bar chart
- Personal stats summary

### DailyHabitForm Component

- Transportation type selector
- Meal logging (add/remove multiple)
- Digital waste input
- Real-time emission preview
- Sustainability score display

### Leaderboard Component

- Global/University/Department rankings
- User rank with progress to next level
- Sortable by Points/Level/Daily Score
- Badge display system

## 🛠️ Technology Stack

### Frontend

- **React 18.2**: UI library
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Recharts 2.8**: Data visualization
- **Axios 1.5**: HTTP client
- **React Router 6**: Client-side routing

### Backend

- **Express.js 4.18**: Web framework
- **Node.js**: JavaScript runtime
- **MongoDB 7.5**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing

### Development

- **Nodemon**: Auto-restart on file changes
- **Concurrently**: Run multiple processes

---

**Happy Tracking! 🌱 Let's reduce our carbon footprint together!**
