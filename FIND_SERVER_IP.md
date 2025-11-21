# How to Find Your Alibaba Cloud Server IP

## From Alibaba Cloud Console Dashboard

Go to your dashboard:
https://swasnext.console.aliyun.com/servers/us-west-1/7347678115614d199e95e3acc52b39da/dashboard

### What to Look For:

1. **Public IP** or **Internet IP**
   - Usually shown on the main dashboard
   - Format: `47.xxx.xxx.xxx` or similar
   - This is what you need for `REACT_APP_API_URL`

2. **Domain Name** (optional, if assigned)
   - Some servers have a domain like `xxx.swas.aliyun.com`
   - You can use this instead of IP

3. **Port Number**
   - Default is 3001 for the chess API server
   - Check your server.js configuration

### Example Dashboard Locations:

- **Overview Tab:** Look for "Public IP Address"
- **Network Tab:** Check "Internet IP" section
- **Instance Information:** Find "Public IP" field

## Quick Check via SSH

If you have SSH access:

```bash
# SSH into your server
ssh root@your-server-ip

# Check public IP
curl ifconfig.me

# Check listening ports
netstat -tlnp | grep 3001
```

## Once You Have the IP

1. Create `.env` file in project root
2. Add: `REACT_APP_API_URL=http://YOUR_IP:3001`
3. Replace `YOUR_IP` with actual IP
4. Restart React app: `npm start`

## Testing

After setting up, test the connection:

```bash
# Replace with your actual IP
curl http://YOUR_IP:3001/health

# Should return: {"status":"OK","message":"Chess AI server is running"}
```

---

**Once you have the IP, I can help you configure the `.env` file!**

