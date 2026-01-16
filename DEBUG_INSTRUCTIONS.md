# 🐛 Debug Instructions

## Issue: Audio Not Playing & Screen Not Updating

Let me help you debug this. Follow these steps:

### **Step 1: Open Browser Console**

1. Open the game: `http://localhost:8092`
2. Press **F12** (or right-click → Inspect)
3. Click **Console** tab
4. Keep it open

### **Step 2: Create Character**

1. Enter name: "Emma"
2. Select class: "Wizard"
3. Click "Start Adventure"

### **Step 3: Look for These Logs**

You should see in the console:
```
Failed to start game: ...
OR
Created game with ID: game_xxx
```

**Copy and paste ANY errors you see in red!**

---

## Quick Tests

### **Test 1: Check if Backend is Connected**

Open a new terminal and run:
```bash
curl -X POST http://localhost:3001/api/game/start \
  -H "Content-Type: application/json" \
  -d '{"kidName":"TestUser","characterClass":"wizard","kidId":"test"}' \
  | head -20
```

**You should see:** Story text and game data

---

### **Test 2: Check Browser Audio Permissions**

1. Click the **🔒** lock icon in your browser address bar
2. Make sure **Sound** is set to "Allow"
3. Try clicking the page before starting (browsers block auto-play until user interacts)

---

### **Test 3: Manual Audio Test**

Open browser console (F12) and paste this:
```javascript
const audio = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAA');
audio.play().then(() => console.log('✅ Audio works!')).catch(e => console.error('❌ Audio blocked:', e));
```

**What happens?**
- ✅ "Audio works!" → Audio is enabled
- ❌ "Audio blocked" → Browser is blocking audio (need user interaction first)

---

## Common Issues & Solutions

### **Issue 1: "Audio blocked" / NotAllowedError**

**Solution:** 
- Click anywhere on the page BEFORE the audio tries to play
- Or add a "Start" button that users click before audio begins
- Browsers require user interaction before auto-playing audio

### **Issue 2: CORS Error**

**Solution:** Already fixed - backend allows port 8092

### **Issue 3: Backend Not Responding**

**Check:**
```bash
# Is backend running?
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

**If not running:**
```bash
cd /Users/justink/GMAI/backend
npm start
```

---

## Frontend Audio Fix (If Needed)

If browser is blocking auto-play, we need to:

1. **Add a "Click to Start" button** before audio plays
2. **Or** require user to click microphone first

Would you like me to add this fix?

---

## What to Check Right Now

1. **Open browser console (F12)**
2. **Create a character**
3. **Tell me what errors you see**
4. **Try the manual audio test above**

Then I can fix the exact issue! 🔧

