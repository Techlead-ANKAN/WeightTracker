# 📋 Setup Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Setup

- [ ] Node.js installed (v18 or higher)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] Internet connection active
- [ ] Two terminal windows ready

## MongoDB Atlas Setup

- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0)
- [ ] Cluster is active (not provisioning)
- [ ] Created database user with username and password
- [ ] Noted username and password securely
- [ ] Added IP whitelist (0.0.0.0/0 for development)
- [ ] Obtained connection string
- [ ] Replaced `<username>` in connection string
- [ ] Replaced `<password>` in connection string
- [ ] Updated `backend/.env` with correct MONGODB_URI

## Backend Setup

- [ ] Opened terminal in project root
- [ ] Navigated to backend: `cd backend`
- [ ] Dependencies installed (already done): `npm install`
- [ ] `.env` file configured with MongoDB URI
- [ ] Ran seed script: `npm run seed`
- [ ] Seed successful (saw "✅ Successfully seeded 31 food items")
- [ ] Started dev server: `npm run dev`
- [ ] Saw "✅ Connected to MongoDB Atlas"
- [ ] Saw "🚀 Server running on http://localhost:5000"
- [ ] No errors in terminal

## Frontend Setup

- [ ] Opened NEW terminal window
- [ ] Navigated to frontend: `cd frontend`
- [ ] Dependencies installed (already done): `npm install`
- [ ] Started dev server: `npm run dev`
- [ ] Saw "➜ Local: http://localhost:5173/"
- [ ] No errors in terminal

## Browser Verification

- [ ] Opened browser at http://localhost:5173
- [ ] Page loads without errors
- [ ] Can see "Weight Tracker" logo
- [ ] Can see navigation: Today, Weight, Progress
- [ ] Theme toggle (moon/sun icon) visible
- [ ] No errors in browser console (F12)

## Today Page (Food Tracking)

- [ ] "Today" page displays
- [ ] See date with navigation arrows
- [ ] See "Breakfast" section
- [ ] Breakfast has 7 food items with checkboxes
- [ ] See "Lunch" section
- [ ] Lunch has 14 food items with checkboxes
- [ ] See "Dinner" section
- [ ] Dinner has 10 food items with checkboxes
- [ ] Each food shows: name + portion label + grams
- [ ] Can check/uncheck foods
- [ ] Total grams updates in real-time
- [ ] "Save Food Log" button visible
- [ ] Clicking save shows success toast

## Weight Page

- [ ] "Weight" page accessible via navigation
- [ ] Date picker shows today's date
- [ ] Weight input field visible
- [ ] Can enter weight (e.g., 75.5)
- [ ] "Save Weight Entry" button visible
- [ ] Clicking save shows success toast
- [ ] "Recent Entries" section appears
- [ ] Entry shows in recent list

## Progress Page

- [ ] "Progress" page accessible via navigation
- [ ] Statistics cards show (Current, Highest, Lowest, Change)
- [ ] If no data: Shows "No weight data" message
- [ ] After adding weight: Chart displays
- [ ] Line chart shows weight trend
- [ ] Can toggle "Last 30 Days" / "All Time"
- [ ] Hover over chart shows tooltip

## Dark Mode

- [ ] Click moon/sun icon in header
- [ ] Theme toggles between light and dark
- [ ] All pages work in dark mode
- [ ] Refresh page - theme persists
- [ ] Close and reopen browser - theme persists

## Responsive Design

- [ ] Resize browser to mobile width (~400px)
- [ ] Navigation moves to bottom (icons + labels)
- [ ] Cards stack vertically
- [ ] All content readable and accessible
- [ ] Resize to tablet width (~768px)
- [ ] Layout adjusts appropriately
- [ ] Resize to desktop (~1920px)
- [ ] Layout uses full width with max-w-7xl
- [ ] No horizontal scrollbars at any width

## Data Persistence

- [ ] Add food log for today
- [ ] Refresh page
- [ ] Food log still shows selections
- [ ] Add weight entry
- [ ] Refresh page
- [ ] Weight entry still shows in recent list
- [ ] Navigate to Progress
- [ ] Weight shows in chart

## Error Handling

- [ ] Stop backend server (Ctrl+C)
- [ ] Try to save food log in frontend
- [ ] See error toast notification
- [ ] Restart backend server
- [ ] Try save again - works

## Final Checks

- [ ] All 31 food items visible (7 + 14 + 10)
- [ ] No console errors in browser
- [ ] No terminal errors in backend
- [ ] No terminal errors in frontend
- [ ] Can navigate between all 3 pages
- [ ] All features work smoothly
- [ ] Ready to use for daily tracking!

---

## If Any Item Fails

### Seed Script Failed
**Problem**: Database not seeded
**Solution**:
1. Check MongoDB URI in `backend/.env`
2. Verify network access in MongoDB Atlas
3. Run `npm run seed` again

### Backend Won't Start
**Problem**: Port 5000 in use or MongoDB connection failed
**Solution**:
1. Check if another app uses port 5000
2. Change PORT in `backend/.env`
3. Verify MongoDB URI is correct
4. Check internet connection

### Frontend Won't Load
**Problem**: Port 5173 in use or build failed
**Solution**:
1. Check if another app uses port 5173
2. Stop and restart: Ctrl+C then `npm run dev`
3. Clear browser cache
4. Check backend is running first

### No Foods Showing
**Problem**: Seed script not run or API not connecting
**Solution**:
1. Run `npm run seed` in backend
2. Check backend terminal for errors
3. Visit http://localhost:5000/api/foods
4. Should see JSON with foods grouped

### Chart Not Showing
**Problem**: No weight data entered
**Solution**:
1. Go to Weight page
2. Enter at least 2 weight entries on different dates
3. Go back to Progress page
4. Chart should now display

---

## Quick Commands Reference

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run seed         # Seed food database (run once)
npm start           # Start production server
```

### Frontend
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Success!

✅ All items checked? **Congratulations!**

Your Weight Tracker app is fully set up and ready for daily use.

Start tracking your food and weight today! 🎉

---

**Need help?** Check:
- `QUICKSTART.md` - Quick setup guide
- `README.md` - Full documentation
- `MONGODB_SETUP.md` - Database setup
- Browser console (F12) - For frontend errors
- Terminal output - For backend errors
