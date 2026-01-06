# 🎯 Getting Started - Weight Tracker

Welcome to your personal Weight Tracker app! This guide will help you get started in under 10 minutes.

---

## 📚 Documentation Overview

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup guide | Starting fresh |
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | Step-by-step verification | During setup |
| [MONGODB_SETUP.md](MONGODB_SETUP.md) | MongoDB Atlas tutorial | Need database help |
| [README.md](README.md) | Full documentation | Want all details |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code organization | Understanding codebase |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & fixes | Having problems |
| [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) | Build summary | Curious about implementation |

---

## ⚡ Quick Setup (3 Steps)

### 1. Setup MongoDB Atlas (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account + cluster
3. Get connection string
4. Update `backend/.env`

📖 **Detailed guide**: [MONGODB_SETUP.md](MONGODB_SETUP.md)

### 2. Seed Database & Start Backend (1 minute)
```bash
cd backend
npm run seed    # ⚠️ MUST DO THIS ONCE
npm run dev     # Start backend server
```

### 3. Start Frontend (1 minute)
```bash
cd frontend
npm run dev     # Start frontend server
```

🌐 **Open**: http://localhost:5173

---

## ✅ Quick Verification

After setup, you should see:

✅ Backend terminal: `✅ Connected to MongoDB Atlas`  
✅ Backend terminal: `🚀 Server running on http://localhost:5000`  
✅ Frontend loads at http://localhost:5173  
✅ Navigation shows: Today, Weight, Progress  
✅ Today page shows 31 food items (7 + 14 + 10)  
✅ No errors in browser console (F12)  

---

## 🎯 First Steps

### 1. Track Today's Food
- Go to "Today" page
- Select foods for breakfast, lunch, dinner
- See real-time gram totals
- Click "Save Food Log"

### 2. Log Your Weight
- Go to "Weight" page
- Enter your current weight (kg)
- Click "Save Weight Entry"

### 3. View Progress
- Go to "Progress" page
- See your weight chart
- Toggle between 30 days / all time

---

## 📖 What This App Does

### ✅ Included Features
- **Food Tracking**: Select from 31 pre-defined foods with fixed portions
- **Weight Tracking**: Manual weight entry with date selection
- **Progress Chart**: Visualize weight trends over time
- **Dark Mode**: Light/dark theme with persistence
- **Date Navigation**: Browse and edit past food logs
- **Real-time Totals**: Automatic gram calculations per meal

### ❌ What's NOT Included (By Design)
- No calorie tracking or display
- No manual quantity input (portions are fixed!)
- No gym/exercise tracking
- No water intake tracking
- No oil or sweets tracking
- No multi-user authentication

---

## 🍽️ Food Master List

### Breakfast (7 items)
Bread (2 slices), Peanut Butter, Boiled Egg, Omelette, Roti (2), Dal, Sabji

### Lunch (14 items)
Rice, Mixed Rice, Khichdi, Dal, Sabji, Fish Fry, Fish Curry, Chicken Curry, Chicken Fry, Egg Curry, Boiled Egg, Paneer Sabji, Curd, Salad

### Dinner (10 items)
Roti (3), Dal, Sabji, Fish Curry, Chicken Curry, Egg Curry, Boiled Egg, Paneer Sabji, Curd, Salad

**All portions are HARDCODED - you can only SELECT foods, not enter quantities.**

---

## 🚨 Common Issues

### "No foods showing"
→ You forgot to run `npm run seed` in backend folder

### Backend won't start
→ Check MongoDB URI in `backend/.env`

### Frontend blank page
→ Make sure backend is running first

### Chart not showing
→ Need at least 2 weight entries on different dates

📖 **Full guide**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎨 Features Overview

### Today Food Log Page
- ✅ Select foods with checkboxes
- ✅ Grouped by meal type (Breakfast/Lunch/Dinner)
- ✅ Real-time total grams per meal
- ✅ Date navigation (prev/next day)
- ✅ "Go to Today" button
- ✅ Save button with loading state
- ✅ Toast notifications

### Weight Entry Page
- ✅ Date picker (defaults to today)
- ✅ Weight input in kg (supports decimals)
- ✅ Warning for existing entries
- ✅ Recent entries list (last 10)
- ✅ Highlight today's entry
- ✅ Empty state message

### Progress Page
- ✅ Line chart with Recharts
- ✅ Statistics cards:
  - Current Weight
  - Highest Weight
  - Lowest Weight
  - Total Change
- ✅ Time filters: Last 30 Days / All Time
- ✅ Hover tooltip on chart
- ✅ Empty state when no data

### Theme & Layout
- ✅ Light and Dark mode
- ✅ Theme toggle in header
- ✅ Persists to localStorage
- ✅ Desktop navigation (horizontal)
- ✅ Mobile navigation (bottom tabs)
- ✅ Fully responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, TailwindCSS 3.4 |
| **Routing** | React Router DOM 7.2 |
| **State** | React Query 5.6 (server state) |
| **HTTP** | Axios |
| **Charts** | Recharts |
| **Backend** | Node.js, Express 5.2 |
| **Database** | MongoDB Atlas (Mongoose 9.1) |
| **Styling** | TailwindCSS + Road2DSA Design System |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast |
| **Date** | dayjs |

---

## 📱 Responsive Design

Optimized for:
- 🖥️ **PC**: 2560×1440 (wide layouts)
- 💻 **Laptop**: 1920×1080 (standard)
- 📱 **Mobile**: 1080×2412 (tall screens)

Breakpoints:
- `sm`: 640px
- `md`: 768px (navigation switches)
- `lg`: 1024px
- `xl`: 1280px

---

## 🎓 Learning Resources

### Want to understand the code?
→ Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Need full documentation?
→ Read [README.md](README.md)

### Having issues?
→ Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Setting up MongoDB?
→ Read [MONGODB_SETUP.md](MONGODB_SETUP.md)

### Want step-by-step verification?
→ Read [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

---

## 🎉 You're Ready!

Your app is complete and ready to use. Just:

1. ✅ Setup MongoDB Atlas
2. ✅ Run seed script once
3. ✅ Start both servers
4. ✅ Open browser
5. ✅ Start tracking!

---

## 💡 Tips for Daily Use

### Starting the App
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2 (new terminal)
cd frontend
npm run dev
```

Then open: http://localhost:5173

### Stopping the App
Press `Ctrl + C` in both terminals

### Best Practices
- Track food right after meals (don't forget!)
- Weigh yourself at same time each day (morning recommended)
- Check Progress page weekly to see trends
- Use date navigation to edit past entries if needed

---

## 🌟 Features in Detail

### Real-time Gram Totals
As you select foods, totals update instantly:
```
Breakfast: 0g → 59g → 109g → 159g
```

### Date Navigation
- **Previous Day**: Click left arrow ←
- **Next Day**: Click right arrow →
- **Today**: Click "Go to Today" button
- **Any Date**: Edit past food logs

### Chart Interactions
- **Hover**: See exact weight and date
- **Toggle**: Switch between 30 days / all time
- **Responsive**: Chart adapts to screen size

### Dark Mode
- **Toggle**: Click moon/sun icon
- **Persist**: Theme saved to localStorage
- **Auto**: Respects system preference on first load

---

## 🔐 Security & Privacy

- ✅ Personal use app (single user)
- ✅ No authentication required
- ✅ Data stored in your MongoDB Atlas
- ✅ Environment variables for sensitive data
- ✅ .gitignore protects .env files
- ✅ CORS enabled for local development

**Note**: Use IP whitelist (0.0.0.0/0) only in development!

---

## 🎯 Project Goals Achieved

✅ MERN stack (MongoDB, Express, React, Node.js)  
✅ Plain JavaScript (NO TypeScript)  
✅ Selection-based food tracking  
✅ Hardcoded food portions (31 items)  
✅ Manual weight entry  
✅ Progress visualization with charts  
✅ Dark mode support  
✅ Fully responsive design  
✅ Road2DSA design system  
✅ Complete documentation  

---

## 📞 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
2. Check browser console (F12) for errors
3. Check terminal output for backend errors
4. Verify MongoDB Atlas connection
5. Try clean reinstall (see troubleshooting guide)

---

## 🎓 Understanding the Codebase

```
Weight Tracker/
├── backend/          → Node.js + Express API
│   ├── models/       → Mongoose schemas (3 files)
│   ├── routes/       → API endpoints (3 files)
│   ├── seed/         → Database seeding
│   └── server.js     → Express server
│
└── frontend/         → React + Vite app
    └── src/
        ├── api/      → API calls (axios)
        ├── context/  → Theme context
        ├── layout/   → Header + layout
        ├── pages/    → 3 main pages
        └── App.jsx   → Router setup
```

---

## 🚀 Next Steps

After getting the app running:

1. **Customize** (if needed):
   - Adjust colors in `tailwind.config.js`
   - Modify food list in `backend/seed/seedFoods.js`
   - Change port numbers in `.env` files

2. **Deploy** (optional):
   - Backend: Heroku, Railway, DigitalOcean
   - Frontend: Vercel, Netlify, GitHub Pages
   - Keep MongoDB Atlas as database

3. **Extend** (optional):
   - Add notes field to food logs
   - Add photos to weight entries
   - Export data to CSV
   - Add meal timing tracking

---

## ✨ Enjoy Your Weight Tracker!

You now have a fully functional MERN stack application for tracking your food and weight. Use it daily to:

- 🍽️ Know exactly what you eat
- ⚖️ Monitor your weight trends
- 📊 Make data-driven health decisions
- 🎯 Stay consistent with your goals

**Start today!** Open the app and log your first meal. 🚀

---

**Built with ❤️ for personal health tracking**

Last Updated: January 6, 2026
