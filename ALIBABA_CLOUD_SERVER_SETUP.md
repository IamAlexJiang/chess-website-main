# Alibaba Cloud Simple Application Server Setup Guide

## Finding Your Server Details

From your Alibaba Cloud console dashboard at:
https://swasnext.console.aliyun.com/servers/us-west-1/7347678115614d199e95e3acc52b39da/dashboard

You need to find:

1. **Public IP Address** - Look for "Public IP" or "Internet IP" in the dashboard
2. **Server Domain** (if assigned) - Some servers have a domain like `xxx.swas.aliyun.com`
3. **Port** - Usually port 3001 for your chess API server

## Step 1: Get Server Information

### Option A: From Alibaba Cloud Console
1. Go to your server dashboard
2. Look for **"Public IP"** or **"Internet IP Address"**
   - Example: `47.xxx.xxx.xxx`
3. Check if there's a domain assigned
   - Example: `xxx.swas.aliyun.com`

### Option B: SSH into Your Server
```bash
# SSH into your server (get IP from console)
ssh root@your-server-ip

# Once connected, check the IP
curl ifconfig.me
# or
hostname -I
```

## Step 2: Configure Frontend to Use Your Server

Create a `.env` file in your project root (`/Users/alexjiang/chess-website-main/.env`):

```env
# Alibaba Cloud Simple Application Server API URL
# Replace YOUR_SERVER_IP with your actual server IP from the dashboard
REACT_APP_API_URL=http://YOUR_SERVER_IP:3001

# Examples:
# REACT_APP_API_URL=http://47.254.123.45:3001
# REACT_APP_API_URL=http://xxx.swas.aliyun.com:3001
# REACT_APP_API_URL=https://your-domain.com:3001  (if you have SSL/HTTPS)
```

**Important Notes:**
- Replace `YOUR_SERVER_IP` with your actual server IP address
- Port 3001 is the default, change if your server uses a different port
- If your server uses HTTPS, use `https://` instead of `http://`
- Make sure to **restart** your React dev server after creating/updating `.env`

## Step 3: Verify Server is Running on Alibaba Cloud

### On Your Alibaba Cloud Server:
```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to your project
cd /path/to/chess-website-main

# Make sure Node.js is installed
node --version

# Install dependencies
npm install

# Start the server
npm run server

# Or run it in the background with PM2 (recommended)
npm install -g pm2
pm2 start server/server.js --name chess-api
pm2 save
pm2 startup
```

### Test Server from Your Local Machine:
```bash
# Replace YOUR_SERVER_IP with your actual IP
curl http://YOUR_SERVER_IP:3001/health

# Should return: {"status":"OK","message":"Chess AI server is running"}
```

## Step 4: Configure Firewall/Security Group

### In Alibaba Cloud Console:
1. Go to your server dashboard
2. Find **"Security Group"** or **"Firewall Rules"**
3. Add inbound rule:
   - **Protocol:** TCP
   - **Port:** 3001
   - **Source:** 0.0.0.0/0 (or your specific IP for security)
   - **Description:** Chess API Server

## Step 5: Test the Connection

### 1. Update `.env` file with your server IP
```env
REACT_APP_API_URL=http://YOUR_SERVER_IP:3001
```

### 2. Restart React App
```bash
# Stop current server (Ctrl+C)
# Then restart
npm start
```

### 3. Test Save Function
1. Go to Board page
2. Make some moves
3. Enter a name
4. Click Save
5. Check browser console (F12) for `API Response received:`

### 4. Check Network Tab
- Open Developer Tools (F12)
- Go to Network tab
- Click Save
- Find `/chess/saveRecord` request
- Check the Request URL - should be: `http://YOUR_SERVER_IP:3001/chess/saveRecord`

## Troubleshooting

### Issue 1: Cannot Connect to Server
**Check:**
- Server IP is correct in `.env`
- Server is running on Alibaba Cloud (`npm run server`)
- Firewall allows port 3001
- Server is accessible: `curl http://YOUR_SERVER_IP:3001/health`

### Issue 2: CORS Error
**Solution:** The server already has CORS enabled, but if you still see errors:
- Verify server allows your frontend origin
- Check server logs for CORS errors

### Issue 3: Save Still Fails
**Check:**
- Browser console for actual response format
- Network tab for response data
- Server logs for errors
- File permissions on `server/chess-records.json`

### Issue 4: Connection Timeout
**Possible causes:**
- Firewall blocking port 3001
- Server not running
- Wrong IP address
- Network connectivity issues

## Common Alibaba Cloud Server IPs

Alibaba Cloud Simple Application Servers typically have:
- Public IP address format: `47.xxx.xxx.xxx` or `47.xxx.xxx.xxx`
- Sometimes have domains: `xxx.swas.aliyun.com`

**Find your exact IP in the Alibaba Cloud console dashboard.**

## Security Recommendations

1. **Use HTTPS** if possible (requires SSL certificate)
2. **Restrict Firewall** to specific IPs instead of 0.0.0.0/0
3. **Use API Authentication** if your new server requires it
4. **Keep Server Updated** with security patches

---

**Next Step: Get your server IP from the Alibaba Cloud console and update the `.env` file!**

