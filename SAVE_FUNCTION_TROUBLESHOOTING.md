# Save Function Troubleshooting Guide

## Overview
The save function requires the backend server to be running and accessible. This guide helps diagnose and fix save function issues.

## What the Save Function Requires

### 1. Backend Server Running
- The backend Express.js server must be running on port 3001 (or configured port)
- Endpoint: `POST /chess/saveRecord`
- Server file: `server/server.js`

### 2. File System Access
- The server writes to `server/chess-records.json`
- Server needs **write permissions** for the `server/` directory
- The JSON file is created automatically if it doesn't exist

### 3. Network Connectivity
- Frontend must be able to reach the backend server
- CORS is enabled on the backend (allows cross-origin requests)

### 4. Correct API URL Configuration
- Default: `http://localhost:3001` (for local development)
- For production/remote servers: Set `REACT_APP_API_URL` environment variable

## Current Issues Identified

### Issue 1: Hardcoded API URL
**Problem:** The API URL was hardcoded to `http://localhost:3001`

**Solution:** Now configurable via `REACT_APP_API_URL` environment variable

### Issue 2: Server Not Running
**Symptom:** Save button shows error or nothing happens

**Check:**
```bash
# Check if server is running
curl http://localhost:3001/health

# Should return: {"status":"OK","message":"Chess AI server is running"}
```

**Fix:**
```bash
npm run server
```

### Issue 3: Wrong Server URL (Ubuntu Server)
**Symptom:** Save fails with network error or CORS error

**Solution:**
1. Find your server's IP address or domain
2. Create `.env` file in project root:
   ```env
   REACT_APP_API_URL=http://your-server-ip:3001
   # Example:
   # REACT_APP_API_URL=http://192.168.1.100:3001
   # REACT_APP_API_URL=http://ubuntu-pisu:3001
   # REACT_APP_API_URL=https://yourdomain.com:3001
   ```
3. Restart React dev server: `npm start`

### Issue 4: File Permissions
**Symptom:** Server returns 500 error when saving

**Check server logs:**
```bash
# Check if server can write to chess-records.json
ls -la server/chess-records.json
```

**Fix:**
```bash
# Make sure server directory is writable
chmod 755 server/
chmod 644 server/chess-records.json
# Or create file if it doesn't exist
touch server/chess-records.json
chmod 644 server/chess-records.json
```

### Issue 5: Port Not Accessible
**Symptom:** Connection refused or timeout

**Check:**
1. Server is running: `ps aux | grep node`
2. Port is listening: `netstat -tlnp | grep 3001` (Linux) or `lsof -i :3001` (Mac)
3. Firewall allows port 3001

**Fix:**
```bash
# Linux - Allow port 3001 in firewall
sudo ufw allow 3001
# Or
sudo firewall-cmd --add-port=3001/tcp --permanent
sudo firewall-cmd --reload
```

## Step-by-Step Setup for Ubuntu Server

### 1. Install Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Project Dependencies
```bash
cd /path/to/chess-website-main
npm install
```

### 3. Configure Environment Variables

**On Server (`server/.env`):**
```env
PORT=3001
```

**On Frontend (create `.env` in project root):**
```env
REACT_APP_API_URL=http://your-server-ip-or-domain:3001
```

### 4. Start Backend Server
```bash
# Option 1: Run directly
npm run server

# Option 2: Run in background with PM2 (recommended for production)
npm install -g pm2
pm2 start server/server.js --name chess-api
pm2 save
pm2 startup
```

### 5. Verify Server is Running
```bash
# Check server
curl http://localhost:3001/health

# Check from another machine
curl http://your-server-ip:3001/health
```

### 6. Test Save Function
1. Make some moves on the chess board
2. Enter a name in the save field
3. Click "Save" button
4. Check server console for errors
5. Check `server/chess-records.json` file for saved data

## Debugging Steps

### 1. Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for error messages when clicking Save

### 2. Check Network Tab
- Open Developer Tools (F12)
- Go to Network tab
- Click Save button
- Find the `/chess/saveRecord` request
- Check:
  - Request URL (should be correct)
  - Request Method (should be POST)
  - Status Code (should be 200)
  - Response (should contain `{code: 200, content: "..."}`)

### 3. Check Server Logs
```bash
# If running with npm
# Check terminal where server is running

# If running with PM2
pm2 logs chess-api
```

### 4. Test API Directly
```bash
# Test save endpoint
curl -X POST http://localhost:3001/chess/saveRecord \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Game","value":[{"from":"e2","to":"e4"}]}'

# Should return: {"code":200,"content":"1234567890"}
```

## Common Error Messages

### "Failed to save game. Please try again."
- **Cause:** Server returned code other than 200
- **Check:** Server logs, file permissions, server response

### "Error saving game: NetworkError"
- **Cause:** Cannot reach server
- **Fix:** Check server URL, network connectivity, firewall

### "Error saving game: Failed to fetch"
- **Cause:** Server not running or wrong URL
- **Fix:** Start server or update `REACT_APP_API_URL`

### "Please enter name" or "Please move the chess piece"
- **Cause:** Validation error (not a server issue)
- **Fix:** Enter a name and make at least one move

## Environment Variable Setup

### Development (Local)
No `.env` file needed - defaults to `http://localhost:3001`

### Production/Remote Server
Create `.env` file in project root:
```env
REACT_APP_API_URL=http://your-server-ip:3001
```

**Important:** 
- Variable must start with `REACT_APP_` to be accessible in React
- Restart React dev server after changing `.env`
- Rebuild for production: `npm run build`

## File Structure Check

Ensure these files exist:
```
chess-website-main/
├── server/
│   ├── server.js          ✅ Main server file
│   ├── chess-records.json ✅ Auto-created, stores saved games
│   └── .env              ✅ Optional, for port config
├── src/
│   └── ajax/
│       └── request.js    ✅ API client (updated to use env var)
└── .env                  ✅ Optional, for REACT_APP_API_URL
```

## Quick Test Checklist

- [ ] Backend server is running (`npm run server`)
- [ ] Server responds to `/health` endpoint
- [ ] `.env` file exists with correct `REACT_APP_API_URL` (if needed)
- [ ] `server/chess-records.json` exists and is writable
- [ ] Firewall allows port 3001
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful POST request to `/chess/saveRecord`

## Still Not Working?

1. Check all error messages (browser console + server logs)
2. Verify network connectivity: `curl http://your-server:3001/health`
3. Test API directly with curl (see above)
4. Check file permissions: `ls -la server/chess-records.json`
5. Verify environment variables are loaded (restart dev server)

---

**Last Updated:** After making API URL configurable via environment variables

