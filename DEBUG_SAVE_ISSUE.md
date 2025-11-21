# Debugging Save Function Issue

## Problem
"Failed to save game. Please try again." error when trying to save.

## What I've Updated

### 1. Enhanced Response Handling
Updated `src/ajax/request.js` to handle multiple response formats:
- `{code: 200, content: "id"}` (old format)
- `{id: "...", ...}` (direct object)
- `{success: true, data: {...}}` (success wrapper)
- Direct arrays
- Direct strings

### 2. Enhanced Save Function
Updated `src/routes/Board/record.jsx` to handle different ID formats:
- String ID
- Object with `id` property
- Nested `data.id`

### 3. Better Error Logging
Added console logging to see actual API responses.

## How to Debug

### Step 1: Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try to save a game
4. Look for these logs:
   - `API Response received:` - Shows the actual response
   - `Save failed - result:` - Shows what was returned
   - Any error messages

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to save a game
4. Find the `/chess/saveRecord` request
5. Check:
   - **Request URL** - Is it correct? (should be your server URL)
   - **Request Method** - Should be POST
   - **Request Payload** - Should have `{name: "...", value: [...]}`
   - **Response** - What does the server actually return?
   - **Status Code** - Should be 200

### Step 3: Test API Directly
```bash
# Test with your new server URL
curl -X POST http://your-new-server-url/chess/saveRecord \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Game","value":[{"from":"e2","to":"e4"}]}'
```

**Share the response** - this will tell us the exact format.

## Questions for Your Developer

1. **What is the new server URL?**
   - Need to update `REACT_APP_API_URL` in `.env`

2. **What is the exact response format?**
   - Example: `{"id": "123"}` or `{"code": 200, "content": "123"}` or something else?

3. **Are the endpoints the same?**
   - `/chess/saveRecord`
   - `/chess/getRecord`
   - `/chess/delete`

4. **Any authentication required?**
   - API keys, tokens, headers?

5. **Any CORS configuration needed?**

## Quick Fixes to Try

### Fix 1: Update API URL
Create/update `.env` file in project root:
```env
REACT_APP_API_URL=http://your-new-server-url:port
```
Then restart: `npm start`

### Fix 2: Check Response Format
Based on what the server returns, we may need to update the interceptor.

### Fix 3: Check Endpoint Paths
If endpoints changed, update `src/ajax/api/board.js`:
```javascript
const postBoard = (name, value) => {
    return request.post('/new-endpoint-path', {  // Update this
      name,
      value
  });
};
```

## What to Share

Please share:
1. **Browser console output** when saving (especially the "API Response received" log)
2. **Network tab response** from the save request
3. **New server URL** from your developer
4. **Response format** from your developer

This will help me update the code to match the new server exactly!

