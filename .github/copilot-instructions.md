# EcoTrack Project Instructions

## Project Overview

EcoTrack is a student-focused sustainability app with:

- Carbon footprint tracking and calculations
- User dashboard with daily scores
- Gamification with leaderboards and challenges ("The Syndicate")
- Daily habit logging
- MERN Stack (MongoDB, Express, React, Node.js)

## Folder Structure

```
EcoTrack/
├── server/              # Node.js/Express backend
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── controllers/    # Business logic
│   ├── utils/          # Helper functions (carbon calculator)
│   ├── server.js       # Main server file
│   └── package.json
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Client-side utilities
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── package.json        # Root package.json
```

## Setup Instructions

1. Install dependencies: `npm run install-all`
2. Configure MongoDB connection in server/.env
3. Run in development: `npm run dev`
4. Server runs on http://localhost:5000
5. Client runs on http://localhost:3000
