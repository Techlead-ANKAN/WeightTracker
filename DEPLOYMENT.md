# Deployment Guide

This guide covers deploying the Weight Tracker application to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas connection string is configured
- [ ] Environment variables are properly set
- [ ] Database is seeded with initial food items
- [ ] Both backend and frontend run without errors locally
- [ ] All secrets are in .env files (not committed to git)
- [ ] .gitignore files are properly configured

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend) + Render (Backend)

#### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up or log in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: weight-tracker-api
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add the following:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the backend URL (e.g., https://weight-tracker-api.onrender.com)

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at https://your-app.vercel.app

### Option 2: Railway (Full Stack)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect the Node.js app
   - Add environment variables in the "Variables" tab:
     ```
     MONGODB_URI=your_connection_string
     NODE_ENV=production
     ```
   - Set root directory to `backend`
   - Your backend will be deployed with a URL

3. **Deploy Frontend**
   - In the same project, click "New Service"
   - Select "GitHub Repo" → Same repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

### Option 3: Netlify (Frontend) + Render (Backend)

Similar to Vercel + Render option, but using Netlify for frontend hosting.

## 🔐 Environment Variables Setup

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weight-tracker?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 📱 Mobile Deployment Considerations

### For Fingerprint Authentication to Work:

1. **HTTPS Required**
   - Web Authentication API only works over HTTPS
   - All deployment platforms provide HTTPS by default

2. **Progressive Web App (PWA)**
   - Consider adding PWA support for better mobile experience
   - Users can "Add to Home Screen"

3. **Testing on Mobile**
   - Use Chrome DevTools remote debugging
   - Test on actual mobile devices
   - Verify fingerprint authentication works

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Post-Deployment Testing

1. **Test Login**
   - Navigate to deployed URL
   - Login with: ID: "Ankan Maity", Password: "Ankan@1234"

2. **Test Food Logging**
   - Select foods from Today page
   - Verify data persists
   - Check date navigation

3. **Test Weight Entry**
   - Add weight entries
   - Verify they appear in the list

4. **Test Progress Chart**
   - Check if chart loads with data
   - Test time filters

5. **Test Admin Panel**
   - Add new food items
   - Edit existing items
   - Delete items
   - Verify changes reflect on Today page

6. **Mobile Testing**
   - Test responsive design on mobile
   - Verify fingerprint login (on actual device)
   - Test all features on small screens

## 🐛 Common Deployment Issues

### CORS Errors
If you see CORS errors, update backend `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}));
```

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_` for frontend
- Restart/redeploy after adding environment variables
- Check deployment logs for errors

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
- Check connection string format
- Ensure database user has correct permissions

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs for specific errors

## 📊 Monitoring

### Backend Monitoring
- Use Render/Railway built-in logs
- Set up error tracking (e.g., Sentry)
- Monitor response times

### Frontend Monitoring
- Use Vercel Analytics
- Monitor error rates
- Track user interactions

## 🔄 Updates & Maintenance

### Updating the Application
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Deployment platforms auto-deploy from main branch

### Database Maintenance
- Regular backups via MongoDB Atlas
- Monitor database size
- Clean up old logs if needed

## 🎉 Success!

Your Weight Tracker app is now deployed and ready to use!

**Frontend URL:** Your app URL
**Backend URL:** Your API URL

Share the frontend URL with users to access the app from any device!
