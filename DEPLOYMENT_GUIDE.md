# Weight Tracker - Deployment Scripts

## Pre-Deployment Build Test

Test if your app is ready to deploy:

```powershell
# Test backend
cd backend
npm install
npm start

# Test frontend build (in new terminal)
cd frontend
npm install
npm run build
npm run preview
```

## Environment Setup

### Backend .env
```powershell
cd backend
cp .env.example .env
# Edit .env and add your MongoDB connection string
```

### Frontend .env
```powershell
cd frontend
cp .env.example .env
# Edit .env with your backend URL
```

## Seed Database

After deploying backend:
```powershell
cd backend
npm run seed
```

## Local Testing Before Deploy

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

## Deployment URLs

After deployment, update these:

1. **Backend CORS** (`backend/server.js`):
   ```javascript
   origin: [
     'http://localhost:5173',
     'https://YOUR-VERCEL-APP.vercel.app'
   ]
   ```

2. **Frontend API** (`frontend/.env`):
   ```
   VITE_API_URL=https://YOUR-RENDER-APP.onrender.com/api
   ```

## Health Check

Test your deployed backend:
```powershell
curl https://YOUR-RENDER-APP.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Weight Tracker API is running",
  "timestamp": "2026-01-07T..."
}
```

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS updated with Vercel URL
- [ ] Database seeded
- [ ] Health check returns OK
- [ ] Can log in to app
- [ ] Can log food items
- [ ] Charts display correctly

## Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string in MONGODB_URI
- Check database user has read/write permissions

### Frontend can't reach backend
- Verify VITE_API_URL is correct
- Check CORS includes your Vercel URL
- Test backend health endpoint directly

### App works locally but not in production
- Clear browser cache
- Check environment variables in platform dashboards
- Rebuild after changing environment variables
- Check browser console for errors

## Useful Commands

### Render (in Shell)
```bash
cd backend && npm run seed    # Seed database
cd backend && npm start        # Start server
```

### Vercel CLI (optional)
```powershell
npm i -g vercel
vercel --prod
```

### Check Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments → View logs
- **MongoDB**: Atlas → Clusters → Metrics

## Production Monitoring

### Check These Regularly
1. Backend health: `https://YOUR-APP.onrender.com/api/health`
2. Frontend loads: `https://YOUR-APP.vercel.app`
3. MongoDB Atlas metrics
4. Render logs for errors
5. Vercel analytics

### Performance Notes
- First request after 15min may be slow (Render free tier sleeps)
- Subsequent requests are fast
- Consider upgrading if you have consistent traffic

---

**Ready to deploy?** Follow the steps in `DEPLOY_NOW.md`!
