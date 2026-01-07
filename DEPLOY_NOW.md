# 🎯 QUICK DEPLOY GUIDE

Your Weight Tracker app is **READY FOR DEPLOYMENT**! ✅

## ⚡ Fast Deploy (15 minutes)

### 1️⃣ Setup MongoDB Atlas (5 min)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Set network access to `0.0.0.0/0` (Allow from anywhere)
5. Get connection string

### 2️⃣ Deploy Backend to Render (5 min)
1. Go to [render.com](https://render.com) → Sign in with GitHub
2. New + → Web Service → Connect repository
3. Settings:
   - Name: `weight-tracker-api`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. Environment Variables → Add:
   ```
   MONGODB_URI=<paste-your-mongodb-uri>
   NODE_ENV=production
   PORT=5000
   ```
5. Create Web Service → **Copy the URL** (e.g., `https://weight-tracker-api.onrender.com`)

### 3️⃣ Deploy Frontend to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Add New → Project → Import your repo
3. Settings:
   - Framework: Vite
   - Root Directory: `frontend`
4. Environment Variables → Add:
   ```
   VITE_API_URL=<paste-your-render-url>/api
   ```
   Example: `https://weight-tracker-api.onrender.com/api`
5. Deploy → Done! 🎉

### 4️⃣ Update CORS (2 min)
1. After Vercel deploys, copy your Vercel URL
2. Edit `backend/server.js` line 15-20:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-app.vercel.app'  // ← Add your Vercel URL here
     ],
     credentials: true
   }));
   ```
3. Commit & push → Render auto-deploys!

### 5️⃣ Seed Database (1 min)
In Render dashboard → Shell → Run:
```bash
cd backend && npm run seed
```

## ✅ That's it! Your app is LIVE!

Visit your Vercel URL and start tracking! 📊

---

## 📋 Deployment Files Created

- ✅ `vercel.json` - Vercel configuration
- ✅ `render.yaml` - Render configuration  
- ✅ `.deployment-checklist.md` - Detailed deployment guide
- ✅ `.env.example` files - Environment variable templates

## 🔍 Health Check

After deployment, test these URLs:
- Frontend: `https://your-app.vercel.app`
- Backend health: `https://your-backend.onrender.com/api/health`

## ⚠️ Important Notes

- **First deploy**: Render may take 5-10 minutes
- **Free tier**: Backend sleeps after 15 min inactivity (cold start: ~30s)
- **Auto-deploy**: Both platforms redeploy on git push
- **Environment vars**: If changed, redeploy manually

## 🆘 Issues?

Check `.deployment-checklist.md` for detailed troubleshooting steps!
