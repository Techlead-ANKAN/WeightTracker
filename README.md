# Weight Tracker - MERN Stack Application

A personal food and weight tracking web application built with MongoDB, Express, React, and Node.js. Track your daily food intake with pre-defined portions and monitor your weight progress over time.

![Weight Tracker](https://img.shields.io/badge/Version-1.0.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node](https://img.shields.io/badge/Node-Express-green)

## 🎯 Features

- **Food Tracking**: Selection-based food logging with hardcoded portions (no manual quantity input)
- **Weight Tracking**: Manual weight entry with date selection
- **Progress Visualization**: Interactive line chart showing weight trends over time
- **Date Navigation**: Browse and edit past food logs
- **Real-time Totals**: Automatic calculation of daily gram intake per meal
- **Dark Mode**: Full theme support with system preference detection
- **Responsive Design**: Optimized for PC (2560×1440), laptop (1920×1080), and mobile (1080×2412)
- **Single User**: No authentication required - personal use app

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (free tier works great)
- npm or yarn

### 1. Clone and Setup

```bash
cd "Weight Tracker"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Configure MongoDB Atlas
# Edit .env file and add your MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority

# Seed the food database (IMPORTANT - Run this once)
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies (already done)
npm install

# Start the frontend dev server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Weight Tracker/
├── backend/
│   ├── models/
│   │   ├── Food.js              # Food master schema
│   │   ├── DailyFoodLog.js      # Daily food log schema
│   │   └── WeightLog.js         # Weight entry schema
│   ├── routes/
│   │   ├── foods.js             # GET /api/foods
│   │   ├── dailyLog.js          # POST/GET /api/daily-log
│   │   └── weight.js            # POST/GET /api/weight
│   ├── seed/
│   │   └── seedFoods.js         # Database seeding script
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.js        # Axios configuration
    │   │   └── api.js           # API functions
    │   ├── context/
    │   │   └── ThemeContext.jsx # Dark mode context
    │   ├── layout/
    │   │   ├── AppLayout.jsx    # Main layout wrapper
    │   │   └── Header.jsx       # Navigation header
    │   ├── pages/
    │   │   ├── TodayFoodLog.jsx # Food tracking page
    │   │   ├── WeightEntry.jsx  # Weight entry page
    │   │   └── Progress.jsx     # Progress chart page
    │   ├── App.jsx              # Root component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── .env                     # API URL configuration
    ├── tailwind.config.js       # Tailwind design tokens
    └── package.json
```

## 🍽️ Food Master Database

The application includes **31 hardcoded food items** across three meal types:

### Breakfast (7 items)
- Bread, Peanut Butter, Boiled Egg, Omelette, Roti, Dal, Sabji

### Lunch (14 items)
- Rice, Mixed Rice, Khichdi, Dal, Sabji, Fish Fry, Fish Curry, Chicken Curry, Chicken Fry, Egg Curry, Boiled Egg, Paneer Sabji, Curd, Salad

### Dinner (10 items)
- Roti, Dal, Sabji, Fish Curry, Chicken Curry, Egg Curry, Boiled Egg, Paneer Sabji, Curd, Salad

**All portions are FIXED and cannot be modified by the user.**

## 🎨 Design System

Following the Road2DSA design system with:

- **Colors**: Primary blue (#2563eb), surface whites/grays, semantic colors for states
- **Typography**: Inter font, consistent sizing scale
- **Components**: Cards with shadow-card, rounded-2xl borders
- **Spacing**: Tailwind scale (gap-4, gap-6, etc.)
- **Dark Mode**: Class-based dark mode with localStorage persistence
- **Icons**: Lucide React icon library
- **Charts**: Recharts for data visualization

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Foods
- `GET /api/foods` - Fetch all foods grouped by meal type

### Daily Log
- `GET /api/daily-log/:date` - Fetch food log for a specific date
- `POST /api/daily-log` - Save/update food log

### Weight
- `GET /api/weight` - Fetch all weight entries
- `POST /api/weight` - Save/update weight entry

### Health Check
- `GET /api/health` - Server health status

## 🎯 Usage Guide

### 1. Today Food Log
- Navigate using date picker or prev/next buttons
- Check food items you consumed for each meal
- View real-time gram totals per meal
- Click "Save Food Log" to persist changes

### 2. Weight Entry
- Select date (defaults to today)
- Enter weight in kilograms
- Submit to save (will update if entry exists)
- View recent entries below

### 3. Progress
- View weight trend line chart
- Toggle between "Last 30 Days" and "All Time"
- See statistics: current, highest, lowest, total change
- Hover over chart points for details

## 🎨 Responsive Breakpoints

- **Mobile**: < 768px (vertical navigation, stacked layout)
- **Laptop**: 1920×1080 (standard 2-3 column grids)
- **PC**: 2560×1440 (wider grids, more columns)
- **Ultra Mobile**: 1080×2412 (optimized for tall displays)

## 🛠️ Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed food database (run once)
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚧 Important Notes

### First-Time Setup
1. **MUST run seed script**: `npm run seed` in backend folder before using the app
2. Configure MongoDB Atlas connection string in `backend/.env`
3. Ensure both backend (5000) and frontend (5173) ports are available

### Data Constraints
- ❌ NO user input for food quantities (always from database)
- ❌ NO calorie input or display
- ❌ NO oil tracking
- ❌ NO sweets/desserts in the system
- ❌ NO gym/exercise tracking
- ❌ NO water tracking
- ✅ ONLY food selection and weight entry

### Design Rules
- All food portions are HARDCODED in the database
- Users can ONLY select food items via checkboxes
- Quantity (grams) is ALWAYS fetched from the database
- NO manual quantity input fields

## 🧪 Testing Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Food database seeded (31 items)
- [ ] Frontend loads correctly
- [ ] All three pages accessible
- [ ] Food selection works
- [ ] Weight entry saves
- [ ] Chart displays data
- [ ] Dark mode toggles
- [ ] Responsive on all screen sizes
- [ ] Toast notifications appear
- [ ] Date navigation works

## 🔮 Future Enhancements (Not in Scope)

The following features are intentionally excluded:
- Multi-user authentication
- Calorie calculation/display
- Macro tracking (protein, carbs, fats)
- Recipe management
- Meal planning
- Social features
- Export/import data
- Mobile apps (native)

## 📄 License

This is a personal project for individual use. Not licensed for commercial distribution.

## 🙏 Acknowledgments

- Design system inspired by Road2DSA project
- Built with Vite, React, Express, and MongoDB
- UI components styled with TailwindCSS
- Icons from Lucide React
- Charts powered by Recharts

---

**Built with ❤️ for personal health tracking**

For questions or issues, check the console logs or MongoDB Atlas dashboard.
