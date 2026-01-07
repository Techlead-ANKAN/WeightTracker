# 🚀 Vercel Deployment Guide - Frontend

## ✅ Fixed Configuration

The `vercel.json` has been updated with the correct configuration for Vercel.

## 📝 Step-by-Step Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Find and select your GitHub repository
   - Click "Import"

3. **Configure Project Settings**
   
   **IMPORTANT**: Use these exact settings:
   
   ```
   Framework Preset: Vite
   Root Directory: frontend          ← IMPORTANT!
   Build Command: npm run build      (auto-detected)
   Output Directory: dist            (auto-detected)
   Install Command: npm install      (auto-detected)
   ```

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend.onrender.com/api`
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - ✅ Done!

### Method 2: Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: weight-tracker
# - Directory: ./ (current directory)
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

## ⚠️ Common Issues & Solutions

### Issue 1: "Build Failed" Error
**Solution**: Make sure Root Directory is set to `frontend`
- Go to Project Settings → General
- Set Root Directory: `frontend`
- Redeploy

### Issue 2: "Module not found" Errors
**Solution**: Clear build cache
- Go to Project Settings → General
- Scroll to "Build & Development Settings"
- Click "Clear Cache"
- Redeploy

### Issue 3: 404 on Page Refresh
**Solution**: Already fixed! `vercel.json` has rewrite rules for SPA routing

### Issue 4: Environment Variable Not Working
**Solution**: 
- Verify it starts with `VITE_` prefix
- Redeploy after adding environment variables
- Check in Settings → Environment Variables

### Issue 5: Can't Connect to Backend
**Solution**:
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check backend CORS includes your Vercel URL
3. Test backend health: `https://your-backend.onrender.com/api/health`

## 🔍 Verify Deployment

After deployment:

1. **Check Build Logs**
   - Deployments tab → Click latest deployment
   - Check for errors in build logs

2. **Test Your App**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Check for API connection errors

3. **Test API Connection**
   - Open Network tab in browser dev tools
   - Try logging food or weight
   - Verify requests go to correct backend URL

## 📋 Deployment Checklist

- [ ] Root Directory set to `frontend`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Backend URL ends with `/api`
- [ ] Backend is deployed and running
- [ ] Backend CORS includes Vercel URL
- [ ] Build completes successfully
- [ ] App loads in browser
- [ ] Can make API requests
- [ ] No console errors

## 🔄 Update CORS in Backend

After getting your Vercel URL, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-actual-app.vercel.app'  // ← Add your Vercel URL
  ],
  credentials: true
}));
```

Then commit and push - Render will auto-deploy!

## 💡 Pro Tips

1. **Auto-deploy on push**: Vercel automatically redeploys when you push to GitHub
2. **Preview deployments**: Every PR gets a unique preview URL
3. **Instant rollback**: Can rollback to any previous deployment instantly
4. **Custom domain**: Can add your own domain in Settings → Domains
5. **Analytics**: Enable Web Analytics in Settings for visitor insights

## 🆘 Still Having Issues?

### Check These:

1. **Vercel Dashboard Logs**
   ```
   Deployments → Latest → View Function Logs
   ```

2. **Browser Console**
   ```
   F12 → Console tab
   Look for red errors
   ```

3. **Network Tab**
   ```
   F12 → Network tab
   Check API request URLs
   ```

4. **Environment Variables**
   ```
   Settings → Environment Variables
   Make sure VITE_API_URL is there
   ```

### Quick Test Commands:

```powershell
# Test if backend is accessible
curl https://your-backend.onrender.com/api/health

# Should return: {"status":"ok",...}
```

## 📞 Need Help?

Common error messages and fixes:

- **"Failed to compile"** → Check build logs, might be missing dependency
- **"Network Error"** → Backend URL wrong or backend is down
- **"CORS Error"** → Update backend CORS with your Vercel URL
- **"404 on refresh"** → Make sure vercel.json rewrites are in root directory

---

**Your app should now be live on Vercel!** 🎉

Test it at: `https://your-app.vercel.app`
