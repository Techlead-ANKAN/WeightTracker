# 🔧 Troubleshooting Guide

Common issues and their solutions for the Weight Tracker app.

---

## 🚨 Backend Issues

### Issue: "Cannot connect to MongoDB"

**Error Message**:
```
❌ MongoDB connection error: MongoServerError: bad auth
```

**Solutions**:
1. Check username and password in `backend/.env`
2. Make sure password doesn't contain special characters (or URL encode them)
3. Verify MongoDB Atlas cluster is running (not paused)
4. Check Network Access in MongoDB Atlas (should include your IP or 0.0.0.0/0)

**URL Encoding for Special Characters**:
```
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
[ → %5B
] → %5D
```

---

### Issue: "Port 5000 already in use"

**Error Message**:
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:

**Option 1: Kill process on port 5000**
```powershell
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Option 2: Change port**
Edit `backend/.env`:
```env
PORT=5001
```

Then update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

### Issue: "Food database is empty"

**Symptom**: Frontend shows "No foods available" for all meals

**Solutions**:
1. Make sure you ran the seed script:
   ```bash
   cd backend
   npm run seed
   ```

2. Check seed output for errors

3. Verify in MongoDB Atlas:
   - Go to "Browse Collections"
   - Look for "foods" collection
   - Should have 31 documents

4. If seed fails, check MongoDB connection first

---

### Issue: "CORS error in browser console"

**Error Message**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions**:
1. Make sure backend is running
2. Check backend console for CORS middleware
3. Verify `frontend/.env` has correct API URL
4. Restart both servers

---

### Issue: "Module not found" errors

**Error Message**:
```
Error: Cannot find module 'express'
```

**Solutions**:
```bash
cd backend
npm install
```

If still failing:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Frontend Issues

### Issue: "Blank white page"

**Solutions**:
1. Check browser console (F12) for errors
2. Make sure backend is running first
3. Check if `VITE_API_URL` is set in `frontend/.env`
4. Clear browser cache and hard reload (Ctrl+Shift+R)
5. Check terminal for frontend errors

---

### Issue: "Vite server won't start"

**Error Message**:
```
Port 5173 is in use, trying another one...
```

**Solutions**:

**Option 1: Kill process on port 5173**
```powershell
# Find process
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

**Option 2: Let Vite choose another port** (it will auto-increment)

---

### Issue: "TailwindCSS styles not working"

**Symptom**: Page loads but has no styling

**Solutions**:
1. Check `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Verify `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Restart frontend server
5. Clear browser cache

---

### Issue: "Module not found: Can't resolve 'react-router-dom'"

**Solutions**:
```bash
cd frontend
npm install
```

If still failing:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Chart not displaying"

**Symptom**: Progress page shows empty state even with weight data

**Solutions**:
1. Check browser console for errors
2. Verify you have at least 2 weight entries
3. Make sure entries are on different dates
4. Try toggling "All Time" filter
5. Check if Recharts is installed:
   ```bash
   npm list recharts
   ```

---

## 🗄️ Database Issues

### Issue: "Cannot seed database - connection timeout"

**Solutions**:
1. Check internet connection
2. Wait 2-3 minutes (MongoDB Atlas cluster might be provisioning)
3. Verify connection string format:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Check MongoDB Atlas status page for outages
5. Try using a different network (mobile hotspot, VPN)

---

### Issue: "Duplicate key error"

**Error Message**:
```
E11000 duplicate key error collection
```

**Solutions**:
1. This means you're trying to create a document that already exists
2. For weight entries: Each date can only have one entry (by design)
3. For food logs: Each date can only have one log (by design)
4. The app should update existing entries, not create duplicates
5. If persists, check the upsert logic in routes

---

### Issue: "Data not persisting after save"

**Symptom**: Save successful but data disappears on refresh

**Solutions**:
1. Check MongoDB Atlas "Browse Collections"
2. Verify data is actually being saved
3. Check Network tab in browser (F12) for API calls
4. Look at response status codes
5. Check backend terminal for errors during save

---

## 🌐 Network Issues

### Issue: "Failed to fetch" or "Network Error"

**Solutions**:
1. Check if backend is running (http://localhost:5000)
2. Check if port 5000 is accessible:
   ```
   curl http://localhost:5000/api/health
   ```
3. Firewall might be blocking port
4. Try different port numbers
5. Check `frontend/.env` matches backend port

---

### Issue: "API returns 404 Not Found"

**Solutions**:
1. Verify route exists in backend
2. Check URL spelling in API calls
3. Check route registration in `server.js`
4. Backend logs should show the attempted route
5. Verify base URL in `api/client.js`

---

## 🎨 UI/UX Issues

### Issue: "Dark mode not working"

**Solutions**:
1. Check if 'dark' class is added to `<html>` element (inspect)
2. Clear localStorage: `localStorage.clear()`
3. Check ThemeContext is wrapping App
4. Verify Tailwind config has `darkMode: 'class'`
5. Check if dark: variants are in Tailwind classes

---

### Issue: "Mobile navigation not showing"

**Solutions**:
1. Check browser width (should be < 768px)
2. Inspect element to see if it has `md:hidden` class
3. Clear browser cache
4. Try in mobile device mode (F12 → Device Toolbar)

---

### Issue: "Checkboxes not working"

**Symptom**: Can't select foods in Today page

**Solutions**:
1. Check browser console for errors
2. Verify foods data is loaded (check Network tab)
3. Check if onChange handler is attached
4. Look for JavaScript errors blocking event handlers

---

### Issue: "Toast notifications not appearing"

**Solutions**:
1. Check if react-hot-toast is installed:
   ```bash
   npm list react-hot-toast
   ```
2. Verify `<Toaster />` is in App.jsx
3. Check z-index conflicts (toast should be z-50+)
4. Try different position:
   ```jsx
   <Toaster position="top-center" />
   ```

---

## 📱 Performance Issues

### Issue: "App is slow"

**Solutions**:
1. Check MongoDB Atlas free tier limits (512MB)
2. Optimize chart data (use time filters)
3. Check for memory leaks (React DevTools)
4. Enable React Query devtools to debug queries
5. Check Network tab for slow API calls

---

### Issue: "Chart is laggy"

**Solutions**:
1. Reduce data points (use 30-day filter)
2. Increase `staleTime` in React Query
3. Memoize chart calculations
4. Check if too many re-renders
5. Consider pagination for large datasets

---

## 🔐 Environment Variables Issues

### Issue: "Environment variables not loading"

**Solutions**:

**Backend (.env)**:
1. File must be named exactly `.env`
2. No spaces around `=`: `PORT=5000` ✅ not `PORT = 5000` ❌
3. No quotes needed for values
4. Must be in `backend/` folder
5. Restart server after changing

**Frontend (.env)**:
1. Variables must start with `VITE_`
2. File must be named exactly `.env`
3. Must be in `frontend/` folder
4. Restart Vite after changing
5. Access with `import.meta.env.VITE_API_URL`

---

## 🧹 Clean Install

If all else fails, try a clean reinstall:

### Backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

---

## 🐛 Debugging Tips

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Weight Tracker API is running",
  "timestamp": "2026-01-06T..."
}
```

### Check Foods Endpoint
```bash
curl http://localhost:5000/api/foods
```

Should return JSON with breakfast, lunch, dinner arrays.

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Check Network tab for failed requests

### Check Backend Logs
Look at terminal running backend for:
- Connection errors
- Route errors
- Database errors
- Stack traces

### Enable Detailed Logging

In `server.js`, add:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

---

## 💡 Prevention Tips

### Best Practices
✅ Always run backend before frontend
✅ Keep terminal windows open to see errors
✅ Check console frequently during development
✅ Test in incognito mode to avoid cache issues
✅ Use MongoDB Atlas monitoring dashboard
✅ Keep .env files secure (never commit to Git)
✅ Restart servers after config changes
✅ Clear browser cache when seeing stale data

### Before Asking for Help
1. Check all terminals for error messages
2. Check browser console (F12)
3. Verify MongoDB Atlas is accessible
4. Confirm all dependencies installed
5. Try clean reinstall
6. Check this troubleshooting guide
7. Read error messages carefully
8. Search error message online

---

## 📞 Still Need Help?

### Useful Information to Provide
- Operating system (Windows, Mac, Linux)
- Node.js version: `node --version`
- npm version: `npm --version`
- Error message (full text)
- Screenshot of error
- What you were trying to do
- Steps you've already tried

### Useful Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
cd backend && npm list --depth=0
cd frontend && npm list --depth=0

# Check ports in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## ✅ Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Backend won't start | Check MongoDB URI, run `npm install` |
| Frontend blank page | Check backend is running, clear cache |
| No foods showing | Run `npm run seed` in backend |
| CORS error | Verify both servers running |
| Port in use | Kill process or change port |
| Dark mode broken | Clear localStorage |
| Chart not showing | Add 2+ weight entries |
| Styles missing | Check Tailwind config, restart |
| Can't save data | Check MongoDB connection |
| Module not found | Run `npm install` |

---

**Remember**: 90% of issues are solved by:
1. Restarting both servers
2. Clearing browser cache
3. Checking MongoDB connection
4. Running `npm install`
5. Reading error messages carefully

Good luck! 🍀
