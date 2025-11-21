# AJAX Save and Replay Functionality - Fixed Issues

## Issues Fixed

### 1. State Mutation Bug in Save Callback
**Problem:** Using `manualList.push(list)` mutates state directly, which doesn't trigger React re-renders.

**Fixed:** Changed to `setManualList([...manualList, savedGame])` to create a new array.

**Location:** `src/routes/Board/board.js` line 497

**Before:**
```javascript
onSave={(id, list) => { 
  manualList.push(list); 
  setManualList(manualList); 
}}
```

**After:**
```javascript
onSave={(id, savedGame) => { 
  setManualList([...manualList, savedGame]); 
}}
```

### 2. Missing Error Handling in init()
**Problem:** If API call fails, `init()` could crash or set invalid state.

**Fixed:** Added try-catch and proper error handling.

**Location:** `src/routes/Board/board.js` lines 245-253

**Before:**
```javascript
const init = async () => {
  const result = await api.board.getBoards() || [];
  setManualList(result);
}
```

**After:**
```javascript
const init = async () => {
  try {
    const result = await api.board.getBoards();
    if (result && Array.isArray(result)) {
      setManualList(result);
    } else {
      setManualList([]);
    }
  } catch (error) {
    console.error('Error loading saved games:', error);
    setManualList([]);
  }
}
```

### 3. Missing Feedback on Delete
**Problem:** No user feedback when deleting games.

**Fixed:** Added success/error messages.

**Location:** `src/routes/Board/board.js` lines 249-268

### 4. Manual List Not Refreshing
**Problem:** When selecting a manual, the list wasn't refreshed if it changed on server.

**Fixed:** Added `init()` call to refresh the list when selecting a manual.

**Location:** `src/routes/Board/board.js` line 502

## How It Works Now

### Save Flow (Record Mode)
1. User makes moves → stored in `record` array
2. User enters name → clicks "Save" button
3. `Record.save()` → calls `api.board.postBoard(name, list)`
4. API request → `POST /chess/saveRecord`
5. Server saves to `server/chess-records.json`
6. Server returns: `{code: 200, content: "record-id"}`
7. Request interceptor extracts `content` (the ID)
8. `onSave` callback receives: `(id, savedGame)`
9. Updates state: `setManualList([...manualList, savedGame])`
10. Switches to Manual mode automatically
11. Shows saved game in the list

### Load Flow (Manual Mode)
1. Component mounts → `init()` called
2. `api.board.getBoards()` → `GET /chess/getRecord`
3. Server reads `server/chess-records.json`
4. Server returns: `{code: 200, content: [array of saved games]}`
5. Request interceptor extracts `content` (the array)
6. `setManualList(result)` updates state
7. Manuals component displays list of saved games

### Replay Flow (Manual Mode)
1. User clicks on a saved game → `onSelect(manualId)` called
2. `setManualId(value)` sets the selected manual
3. `resetAll()` resets the board to starting position
4. User makes moves → `onSquareClick()` checks against `manual[step]`
5. If move matches → auto-plays opponent's next move
6. If move doesn't match → undo after 300ms
7. Step counter advances: `setStep(newStep)`
8. Game completes when all moves are played

### Delete Flow (Manual Mode)
1. User clicks delete button → `onDelete(id)` called
2. `api.board.deleteBoard(id)` → `POST /chess/delete?id=xxx`
3. Server removes record from JSON file
4. Server returns: `{code: 200, content: "Record deleted successfully"}`
5. Local state updated: `setManualList(filteredList)`
6. If deleted game was selected → reset selection
7. Success message shown

## Data Flow

```
Record Mode:
  User moves → record array → Save button → POST /chess/saveRecord
  → Server saves → Returns ID → onSave callback → Updates manualList
  → Switches to Manual mode

Manual Mode:
  Component mount → GET /chess/getRecord → Server returns array
  → Sets manualList → User selects game → setManualId
  → User makes moves → Validates against manual[step]
  → Auto-plays opponent moves → Completes when done
```

## API Endpoints Used

1. **GET /chess/getRecord**
   - Returns all saved games
   - Response: `{code: 200, content: [{id, name, value, createdAt}, ...]}`

2. **POST /chess/saveRecord**
   - Saves a new game
   - Request body: `{name: string, value: array of moves}`
   - Response: `{code: 200, content: "record-id"}`

3. **POST /chess/delete?id=xxx**
   - Deletes a saved game
   - Response: `{code: 200, content: "Record deleted successfully"}`

## Testing the Save/Replay Functionality

### Test 1: Save a Game
1. Go to Board page
2. Make a few moves (e.g., e2-e4, e7-e5)
3. Enter a name in the save field
4. Click "Save" button
5. Should see success message
6. Should automatically switch to Manual mode
7. Saved game should appear in the list

### Test 2: Load Saved Games
1. Switch to Manual mode (toggle switch)
2. Saved games should appear in the list
3. Click on a saved game
4. Board should reset
5. Step indicator should show at step 1

### Test 3: Replay a Game
1. Select a saved game in Manual mode
2. Make the first move from the saved game
3. Board should auto-play the opponent's move
4. Continue making moves matching the saved sequence
5. Step indicator should advance
6. Game completes when all moves are played

### Test 4: Delete a Game
1. In Manual mode, click delete button on a saved game
2. Should see success message
3. Game should disappear from the list
4. If it was selected, selection should clear

### Test 5: Error Handling
1. Stop the backend server
2. Try to save a game
3. Should see error message
4. Try to load games
5. Should handle gracefully (empty list)

## Verification Checklist

- [ ] Save function works (creates record in server/chess-records.json)
- [ ] Load function works (displays saved games in Manual mode)
- [ ] Replay function works (validates moves against saved sequence)
- [ ] Delete function works (removes game from list and server)
- [ ] State updates correctly (React re-renders work)
- [ ] Error handling works (network errors, invalid responses)
- [ ] Manual mode auto-plays opponent moves correctly
- [ ] Step indicator shows current position correctly

## Files Modified

1. `src/routes/Board/board.js`
   - Fixed state mutation in `onSave` callback
   - Added error handling in `init()`
   - Improved delete function with feedback
   - Added manual list refresh on select

2. `src/ajax/request.js`
   - Already uses environment variable for API URL
   - Response interceptor handles `{code: 200, content: ...}` format

3. `src/ajax/api/board.js`
   - API functions are correct

## Still Not Working?

Check these common issues:

1. **Save button does nothing:**
   - Check browser console for errors
   - Verify backend server is running
   - Check network tab for API request/response

2. **Saved games not appearing:**
   - Check `server/chess-records.json` file exists and has data
   - Verify API returns correct format: `{code: 200, content: [...]}`
   - Check browser console for errors

3. **Manual replay not working:**
   - Verify `manualId` is set when selecting a game
   - Check `manualList` contains the selected game
   - Verify `manual[step]` matches the expected move

4. **Delete not working:**
   - Check server logs for errors
   - Verify file permissions on `server/chess-records.json`
   - Check API response format

---

**All AJAX save/replay functionality should now work correctly!**

