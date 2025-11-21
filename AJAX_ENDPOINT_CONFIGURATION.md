# AJAX Endpoint Configuration Guide

## Current Endpoint Structure

The ajax folder uses these endpoints for save/replay functionality:

### Endpoints Used:
1. **GET `/chess/getRecord`** - Load all saved games
2. **POST `/chess/saveRecord`** - Save a new game
3. **POST `/chess/delete?id=xxx`** - Delete a saved game

## Expected Response Formats

### Current Server Format (Old):
```json
{
  "code": 200,
  "content": "record-id"  // or array for getRecord
}
```

### Possible New Server Formats:

**Format 1: Direct Response**
```json
{
  "id": "record-id",
  "name": "Game Name",
  "value": [...],
  "createdAt": "..."
}
```

**Format 2: Success Wrapper**
```json
{
  "success": true,
  "data": {
    "id": "record-id",
    ...
  }
}
```

**Format 3: Direct Array (for getRecord)**
```json
[
  {"id": "...", "name": "...", "value": [...]},
  ...
]
```

## What to Check with Your Developer

Ask your developer these questions:

1. **What is the new server URL?**
   - Update `REACT_APP_API_URL` in `.env` file
   - Example: `REACT_APP_API_URL=http://new-server-url:port`

2. **What is the response format for `/chess/saveRecord`?**
   - Does it return `{code: 200, content: "id"}`?
   - Or `{id: "...", ...}`?
   - Or `{success: true, data: {...}}`?

3. **What is the response format for `/chess/getRecord`?**
   - Does it return `{code: 200, content: [...]}`?
   - Or direct array `[{...}, ...]`?

4. **Are the endpoint paths the same?**
   - `/chess/saveRecord`
   - `/chess/getRecord`
   - `/chess/delete`

5. **What authentication is required?**
   - API keys?
   - Tokens?
   - Headers?

## Testing the New Server

### Test Save Endpoint:
```bash
curl -X POST http://new-server-url/chess/saveRecord \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","value":[{"from":"e2","to":"e4"}]}'
```

**Check the response format** - this tells us what to expect.

### Test Get Endpoint:
```bash
curl http://new-server-url/chess/getRecord
```

**Check the response format** - should be an array or wrapped object.

## Code Updates Made

I've updated the code to handle multiple response formats:

1. **`src/ajax/request.js`** - Response interceptor now handles:
   - `{code: 200, content: ...}` (old format)
   - Direct data response
   - `{success: true, data: ...}` format
   - Direct object with `id` property

2. **`src/routes/Board/record.jsx`** - Save function now handles:
   - String ID response
   - Object with `id` property
   - Nested `data.id` property

## Next Steps

1. **Get the new server URL from your developer**
2. **Update `.env` file:**
   ```env
   REACT_APP_API_URL=http://new-server-url:port
   ```
3. **Test the endpoints** (use curl commands above)
4. **Check browser console** when saving - it will log the actual response
5. **Update code if needed** based on actual response format

## Debugging

Open browser console (F12) and check:
- Network tab → Find `/chess/saveRecord` request
- Check Request URL (is it correct?)
- Check Request Payload (is data correct?)
- Check Response (what format is it?)
- Check Console for error messages

The code now logs more details to help debug:
- `console.error('Save failed - result:', result)` - shows what was returned
- `console.warn('API returned non-200 code:', ...)` - shows error responses

## Common Issues

### Issue 1: Wrong Endpoint URL
**Symptom:** Network error or 404
**Fix:** Update `REACT_APP_API_URL` in `.env`

### Issue 2: Different Response Format
**Symptom:** "Failed to save game" but server returns 200
**Fix:** Check response format and update interceptor if needed

### Issue 3: CORS Error
**Symptom:** CORS error in console
**Fix:** Server needs to allow your frontend origin

### Issue 4: Authentication Required
**Symptom:** 401 or 403 errors
**Fix:** Add authentication headers to request.js

---

**Please share the new server URL and response format so I can update the code accordingly!**

