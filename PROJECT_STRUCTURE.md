# 📁 Project Structure Overview

```
Weight Tracker/
│
├── 📄 README.md                      # Complete documentation
├── 📄 QUICKSTART.md                  # 5-minute setup guide
├── 📄 MONGODB_SETUP.md               # MongoDB Atlas tutorial
├── 📄 SETUP_CHECKLIST.md             # Step-by-step verification
├── 📄 PROJECT_COMPLETE.md            # Build summary
│
├── 📂 backend/                       # Node.js + Express API
│   ├── 📂 models/                    # Mongoose schemas
│   │   ├── Food.js                   # Food master schema (31 items)
│   │   ├── DailyFoodLog.js          # Daily food selections
│   │   └── WeightLog.js             # Weight entries
│   │
│   ├── 📂 routes/                    # API endpoints
│   │   ├── foods.js                  # GET /api/foods
│   │   ├── dailyLog.js              # POST/GET /api/daily-log
│   │   └── weight.js                # POST/GET /api/weight
│   │
│   ├── 📂 seed/                      # Database initialization
│   │   └── seedFoods.js             # Seeds 31 food items
│   │
│   ├── server.js                    # Express server entry point
│   ├── .env                         # MongoDB URI, PORT
│   ├── .gitignore                   # node_modules, .env
│   ├── package.json                 # Dependencies & scripts
│   └── package-lock.json
│
└── 📂 frontend/                      # React + Vite app
    ├── 📂 src/
    │   ├── 📂 api/                   # API layer
    │   │   ├── client.js             # Axios configuration
    │   │   └── api.js                # API functions
    │   │
    │   ├── 📂 context/               # React Context
    │   │   └── ThemeContext.jsx      # Dark mode provider
    │   │
    │   ├── 📂 layout/                # Layout components
    │   │   ├── AppLayout.jsx         # Main wrapper
    │   │   └── Header.jsx            # Navigation + theme toggle
    │   │
    │   ├── 📂 pages/                 # Route pages
    │   │   ├── TodayFoodLog.jsx      # Food selection page
    │   │   ├── WeightEntry.jsx       # Weight input page
    │   │   └── Progress.jsx          # Chart page
    │   │
    │   ├── 📂 assets/                # Images, icons
    │   │
    │   ├── App.jsx                   # Root component
    │   ├── main.jsx                  # Entry point
    │   ├── index.css                 # Global styles + Tailwind
    │   └── App.css                   # (Vite default, can delete)
    │
    ├── 📂 public/                    # Static assets
    │
    ├── .env                          # VITE_API_URL
    ├── .gitignore                    # node_modules, dist, .env
    ├── index.html                    # HTML entry
    ├── package.json                  # Dependencies & scripts
    ├── package-lock.json
    ├── tailwind.config.js            # Design tokens
    ├── postcss.config.js             # PostCSS setup
    ├── vite.config.js                # Vite configuration
    └── eslint.config.js              # ESLint rules

```

---

## 🎯 Key Files Explained

### Backend

#### `server.js`
- Express app setup
- MongoDB connection
- Route mounting
- CORS configuration
- Error handling

#### `models/Food.js`
- Schema for food master data
- Fields: _id, name, portionLabel, grams, mealType
- Custom string IDs (e.g., "bf_bread_2")

#### `models/DailyFoodLog.js`
- Schema for daily food selections
- Fields: date (YYYY-MM-DD), breakfast[], lunch[], dinner[]
- References Food model

#### `models/WeightLog.js`
- Schema for weight entries
- Fields: date (YYYY-MM-DD), weight (kg)
- Unique date constraint

#### `routes/foods.js`
- `GET /api/foods`
- Returns foods grouped by mealType
- Structure: `{ breakfast: [], lunch: [], dinner: [] }`

#### `routes/dailyLog.js`
- `GET /api/daily-log/:date` - Fetch log for date
- `POST /api/daily-log` - Save/update log
- Upsert operation (create or update)

#### `routes/weight.js`
- `GET /api/weight` - Fetch all weight entries
- `POST /api/weight` - Save/update weight
- Sorted by date descending

#### `seed/seedFoods.js`
- Seeds 31 food items
- Clears existing data first
- Verifies count after seeding
- Run once: `npm run seed`

---

### Frontend

#### `App.jsx`
- React Router setup
- React Query provider
- Theme provider wrapper
- Toast notification config
- Route definitions

#### `main.jsx`
- React app entry point
- Renders `<App />` to DOM
- StrictMode wrapper

#### `api/client.js`
- Axios instance configuration
- Base URL from env variable
- Default headers

#### `api/api.js`
- API function wrappers
- fetchFoods()
- fetchDailyLog(date)
- saveDailyLog(data)
- fetchWeightLogs()
- saveWeightLog(data)

#### `context/ThemeContext.jsx`
- Theme state management
- localStorage persistence
- toggleTheme function
- Adds/removes 'dark' class on document

#### `layout/Header.jsx`
- Navigation component
- Desktop: horizontal nav
- Mobile: bottom tabs
- Theme toggle button
- Active route highlighting

#### `layout/AppLayout.jsx`
- Main layout wrapper
- Header + main content area
- Max-width container
- Flex column layout

#### `pages/TodayFoodLog.jsx`
- Food selection with checkboxes
- Three meal sections
- Real-time gram totals
- Date navigation
- Save functionality
- React Query for data fetching

#### `pages/WeightEntry.jsx`
- Weight input form
- Date picker
- Form validation
- Recent entries list
- Success/error handling
- React Query mutations

#### `pages/Progress.jsx`
- Recharts line chart
- Time filters (30 days / all time)
- Statistics cards
- Custom tooltip
- Empty state handling
- Responsive chart container

#### `index.css`
- Tailwind directives
- Inter font import
- Global styles
- Dark mode base classes

#### `tailwind.config.js`
- Custom color tokens
- Primary: #2563eb
- Surface colors
- Shadow utilities
- Font configuration
- Dark mode class strategy

---

## 📊 Data Flow

### Food Tracking Flow
```
User Action → TodayFoodLog.jsx
    ↓
Select foods (checkboxes)
    ↓
Calculate totals (useMemo)
    ↓
Click Save → saveDailyLog()
    ↓
POST /api/daily-log
    ↓
MongoDB (upsert DailyFoodLog)
    ↓
React Query invalidates cache
    ↓
UI updates with toast notification
```

### Weight Tracking Flow
```
User Action → WeightEntry.jsx
    ↓
Enter weight + date
    ↓
Submit form → saveWeightLog()
    ↓
POST /api/weight
    ↓
MongoDB (upsert WeightLog)
    ↓
React Query invalidates cache
    ↓
UI updates + chart refreshes
```

### Progress Chart Flow
```
Page Load → Progress.jsx
    ↓
fetchWeightLogs() → GET /api/weight
    ↓
MongoDB returns sorted entries
    ↓
Filter by timeframe (30 days / all)
    ↓
Calculate statistics (useMemo)
    ↓
Format data for Recharts
    ↓
Render line chart + stats cards
```

---

## 🔄 State Management

### Server State (React Query)
- `['foods']` - Food master data
- `['dailyLog', date]` - Daily food log for specific date
- `['weightLogs']` - All weight entries

### UI State (useState)
- Selected date for food log
- Selected foods for each meal
- Form inputs (weight, date)
- Time filter for chart

### Global State (Context)
- Theme (light/dark mode)

### Persistent State (localStorage)
- Theme preference

---

## 🎨 Design Tokens

### Colors
```javascript
primary: {
  DEFAULT: '#2563eb',  // Primary actions, links
  light: '#60a5fa',    // Hover states
  dark: '#1d4ed8'      // Active states
}

surface: {
  DEFAULT: '#ffffff',  // Cards, containers
  muted: '#f8fafc',    // Page background
  border: '#e2e8f0'    // Borders, dividers
}
```

### Typography
```javascript
font-family: 'Inter', sans-serif

Sizes:
- text-xs: 12px
- text-sm: 14px
- text-base: 16px
- text-lg: 18px
- text-xl: 20px
- text-2xl: 24px

Weights:
- font-normal: 400
- font-medium: 500
- font-semibold: 600
- font-bold: 700
```

### Spacing
```javascript
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-6: 24px
gap-8: 32px

p-3: 12px
p-4: 16px
p-5: 20px
p-6: 24px
```

### Borders
```javascript
rounded-lg: 8px
rounded-xl: 12px
rounded-2xl: 16px
rounded-full: 9999px
```

---

## 🚀 NPM Scripts

### Backend
```json
{
  "start": "node server.js",        // Production
  "dev": "nodemon server.js",       // Development
  "seed": "node seed/seedFoods.js"  // Database seed
}
```

### Frontend
```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview build
  "lint": "eslint ."                // Code linting
}
```

---

## 📦 Dependencies Count

### Backend (4 prod + 1 dev)
- express
- mongoose
- cors
- dotenv
- nodemon (dev)

### Frontend (12 prod + 3 dev)
- react, react-dom
- react-router-dom
- @tanstack/react-query
- axios
- react-hot-toast
- recharts
- dayjs
- lucide-react
- clsx
- tailwindcss (dev)
- postcss, autoprefixer (dev)

---

## 🎯 Feature Breakdown

### TodayFoodLog.jsx (298 lines)
- Date navigation component
- 3 meal sections
- Real-time totals
- Save functionality
- Loading/error states

### WeightEntry.jsx (143 lines)
- Form component
- Recent entries list
- Validation
- Toast notifications

### Progress.jsx (211 lines)
- Line chart
- Statistics cards
- Time filters
- Custom tooltip
- Empty state

### Header.jsx (89 lines)
- Desktop navigation
- Mobile navigation
- Theme toggle
- Active highlighting

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/foods | Fetch all foods grouped by meal type |
| GET | /api/daily-log/:date | Fetch food log for specific date |
| POST | /api/daily-log | Save/update daily food log |
| GET | /api/weight | Fetch all weight entries (sorted) |
| POST | /api/weight | Save/update weight entry |
| GET | /api/health | Health check |

---

## 📱 Responsive Breakpoints

| Size | Width | Layout |
|------|-------|--------|
| Mobile | < 768px | Stacked, bottom nav |
| Tablet | 768px - 1024px | 2 columns |
| Laptop | 1024px - 1536px | 3 columns |
| Desktop | > 1536px | Full width, max 7xl |

---

This structure ensures:
✅ Separation of concerns
✅ Reusable components
✅ Maintainable codebase
✅ Scalable architecture
✅ Clear data flow
✅ Type-safe API layer
✅ Responsive design
✅ Dark mode support
