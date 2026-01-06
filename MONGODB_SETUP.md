# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (if you don't have one)
3. Create a new project (e.g., "Weight Tracker")

## Step 2: Create a Cluster

1. Click "Build a Cluster"
2. Choose the **FREE tier (M0)**
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click "Create Cluster" (takes 3-5 minutes)

## Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose authentication method: **Username and Password**
4. Enter:
   - Username: `weighttracker` (or your choice)
   - Password: Click "Autogenerate Secure Password" (copy it!)
5. Database User Privileges: Select "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - IP Address: `0.0.0.0/0` (will auto-fill)
4. Click "Confirm"

**Note**: For production, restrict to specific IP addresses.

## Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Backend .env File

1. Open `backend/.env`
2. Replace the placeholder values:
   ```env
   MONGODB_URI=mongodb+srv://weighttracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace:
   - `<username>` → Your database username
   - `<password>` → Your database password
   - `cluster0.xxxxx` → Your actual cluster URL

## Step 7: Test Connection

```bash
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB Atlas
🗑️  Cleared existing food data
✅ Successfully seeded 31 food items
📊 Total food items in database: 31
👋 Disconnected from MongoDB
```

## Common Issues

### Connection Error: Authentication Failed
- Double-check username and password
- Make sure password doesn't contain special characters that need URL encoding
- If password has special chars, encode them (e.g., `@` → `%40`)

### Connection Error: IP Not Whitelisted
- Go to Network Access → Add your current IP
- Or use `0.0.0.0/0` to allow all IPs (development only)

### Connection Timeout
- Check your internet connection
- Try a different region for your cluster
- Wait a few minutes and try again

## Security Tips

✅ **DO**:
- Use strong, unique passwords
- Restrict IP access in production
- Use environment variables (never commit .env)
- Enable 2FA on MongoDB Atlas account

❌ **DON'T**:
- Commit `.env` files to Git
- Share your connection string publicly
- Use the same password for multiple services
- Allow `0.0.0.0/0` in production

## Atlas Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 simultaneous
- **Backups**: Not included

*Perfect for personal projects!*

---

Need help? Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
