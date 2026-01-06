# 🚀 Quick Setup Instructions

## ⚡ Fast Setup (5 minutes)

### 1️⃣ Setup MongoDB Atlas (2 minutes)

See `MONGODB_SETUP.md` for detailed instructions, or quick steps:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create free account
2. Create a free cluster (M0)
3. Create database user with password
4. Allow IP access: 0.0.0.0/0 (for development)
5. Get connection string

### 2️⃣ Configure Backend (1 minute)

```bash
cd backend
```

Edit `.env` file:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Seed the database (MUST DO THIS ONCE):**
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB Atlas
✅ Successfully seeded 31 food items
```

### 3️⃣ Start Backend (30 seconds)

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 4️⃣ Start Frontend (30 seconds)

Open a **NEW terminal**:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 5️⃣ Open Browser

Go to: **http://localhost:5173**

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend shows: `✅ Connected to MongoDB Atlas` and `🚀 Server running on http://localhost:5000`
- [ ] Frontend opens in browser at `http://localhost:5173`
- [ ] You can see three navigation items: Today, Weight, Progress
- [ ] "Today" page shows Breakfast, Lunch, Dinner sections with foods
- [ ] Dark mode toggle works (moon/sun icon)
- [ ] No errors in browser console

---

## 🎯 First Steps After Setup

1. **Track Today's Food**:
   - Go to "Today" page
   - Select foods you ate for each meal
   - Click "Save Food Log"

2. **Enter Your Weight**:
   - Go to "Weight" page
   - Enter your current weight in kg
   - Click "Save Weight Entry"

3. **View Progress**:
   - Go to "Progress" page
   - See your weight chart (add more entries to see trends)

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Make sure port 5000 is not in use
- Run `npm install` in backend folder

### Frontend won't load
- Make sure backend is running first
- Check if port 5173 is not in use
- Run `npm install` in frontend folder
- Clear browser cache and reload

### "No foods available"
- You forgot to run: `npm run seed` in backend folder
- Check MongoDB Atlas network access settings
- Verify connection string is correct

### Database connection errors
- Double-check username and password in MongoDB URI
- Make sure IP whitelist includes your IP or 0.0.0.0/0
- Wait 2-3 minutes after creating cluster (initial setup)

---

## 📝 Daily Usage

### Starting the App

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

### Stopping the App

Press `Ctrl + C` in both terminals

---

## 🎨 Features Overview

### Today Food Log
- ✅ Select foods from pre-defined list (no typing!)
- ✅ Navigate between dates
- ✅ Real-time gram totals per meal
- ✅ Edit past days

### Weight Entry
- ✅ Enter weight in kg
- ✅ Select any date
- ✅ View recent entries
- ✅ Update existing entries

### Progress
- ✅ Line chart of weight over time
- ✅ Filter: Last 30 days or All time
- ✅ Statistics: Current, Highest, Lowest, Change
- ✅ Hover for details

### Theme
- ✅ Light and Dark mode
- ✅ Persists across sessions
- ✅ Toggle with moon/sun icon

---

## 📱 Responsive Design

The app is fully responsive and optimized for:

- 🖥️ **PC**: 2560×1440 (wide screen)
- 💻 **Laptop**: 1920×1080 (standard)
- 📱 **Mobile**: 1080×2412 (tall mobile)

Try resizing your browser to see the responsive design in action!

---

## 🔒 Important Notes

- **Personal Use**: This app is for single-user (you!)
- **No Authentication**: No login required
- **Fixed Portions**: All food portions are hardcoded (can't be changed)
- **Selection Only**: You only select foods, never type quantities
- **Offline**: Requires internet for MongoDB Atlas connection

---

## 📚 Project Details

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + TailwindCSS
- **State**: React Query for data fetching
- **Charts**: Recharts for visualization
- **Icons**: Lucide React
- **Styling**: TailwindCSS with Road2DSA design system

---

## 🎉 You're All Set!

Start tracking your food and weight today. The app will help you:

- Know exactly what you eat each day
- Track your weight progress over time
- See trends and make better decisions

Enjoy! 🚀

---

**Need more help?** Check:
- `README.md` - Full documentation
- `MONGODB_SETUP.md` - Detailed MongoDB setup
- Browser console - For error messages
