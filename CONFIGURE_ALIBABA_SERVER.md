# Configure AJAX to Use Alibaba Cloud Server

## Quick Setup Instructions

### Step 1: Find Your Server IP

From your Alibaba Cloud console dashboard:
https://swasnext.console.aliyun.com/servers/us-west-1/7347678115614d199e95e3acc52b39da/dashboard

**Look for:**
- **Public IP** or **Internet IP Address**
- Example: `47.254.123.45` or `123.456.789.012`

### Step 2: Create `.env` File

Create a file named `.env` in your project root (`/Users/alexjiang/chess-website-main/.env`):

```env
REACT_APP_API_URL=http://YOUR_SERVER_IP:3001
```

**Replace `YOUR_SERVER_IP` with your actual server IP from Step 1.**

**Example:**
```env
REACT_APP_API_URL=http://47.254.123.45:3001
```

**If your server uses HTTPS:**
```env
REACT_APP_API_URL=https://your-domain.com:3001
```

### Step 3: Restart React App

After creating/updating `.env`, restart your React development server:

```bash
# Stop current server (Ctrl+C if running)
# Then restart
npm start
```

### Step 4: Verify It Works

1. Open browser console (F12)
2. Try to save a game
3. Check Network tab - Request URL should show: `http://YOUR_SERVER_IP:3001/chess/saveRecord`
4. Check console for: `API Response received:` log

## Important Notes

- ✅ The `.env` file should be in the project root (same folder as `package.json`)
- ✅ Variable must start with `REACT_APP_` to be accessible in React
- ✅ Must restart React app after changing `.env`
- ✅ Server must be running on Alibaba Cloud with port 3001 accessible
- ✅ Firewall must allow port 3001 inbound connections

## Testing Your Server

Before configuring, test if your server is accessible:

```bash
# Replace YOUR_SERVER_IP with actual IP from Alibaba Cloud console
curl http://YOUR_SERVER_IP:3001/health
```

**If it works:** You'll see `{"status":"OK","message":"Chess AI server is running"}`
**If it fails:** Check firewall rules and make sure server is running

## What This Does

Once configured, all ajax API calls will use your Alibaba Cloud server:
- ✅ `/chess/saveRecord` - Save games
- ✅ `/chess/getRecord` - Load saved games  
- ✅ `/chess/delete` - Delete games
- ✅ `/chess/analyze` - AI analysis (if configured)
- ✅ `/chess/predict-move` - Move prediction (if configured)

## Troubleshooting

### "Failed to save game. Please try again."

**Check:**
1. `.env` file exists with correct IP
2. React app restarted after creating `.env`
3. Server is running on Alibaba Cloud
4. Firewall allows port 3001
5. Browser console shows correct Request URL

**Debug Steps:**
1. Open browser console (F12)
2. Look for `API Response received:` log
3. Check Network tab for actual response
4. Verify server IP in `.env` matches your Alibaba Cloud server

---

**Get your server IP from the Alibaba Cloud console and update `.env`!**

