# 🎮 How The Game Flow Works

## 🔄 **Complete Interaction Loop**

### **1️⃣ Game Start (Character Creation)**

**What happens:**
```
Student creates character → Backend generates welcome story → ElevenLabs reads it
```

**Detailed Flow:**
1. **Student** selects name and class (Wizard/Knight/Rogue)
2. **Frontend** calls: `POST /api/game/start`
   ```json
   {
     "kidName": "Emma",
     "characterClass": "wizard",
     "kidId": "emma_123"
   }
   ```
3. **Backend** (Story Agent):
   - Anthropic Claude generates welcome story
   - Example: *"Welcome, Emma the Wizard! Your adventure begins in Sunny Village. The villagers need your help to find the legendary Star Crystal before the Shadow King takes it!"*

4. **Backend** (ElevenLabs):
   - Converts story to speech
   - Uses **Wizard voice** (Antoni - wise, calm)
   - Returns audio URL

5. **Frontend** receives:
   ```json
   {
     "gameId": "game_abc123",
     "welcomeNarration": "Welcome, Emma...",
     "audioUrl": "data:audio/mpeg;base64,..."
   }
   ```

6. **Audio plays automatically** through browser
7. **Text displays** with typewriter effect

---

### **2️⃣ Student Responds (Voice Input)**

**What happens:**
```
Student speaks → Transcript captured → Sent to backend
```

**Detailed Flow:**
1. **Student** clicks microphone 🎤
2. **Web Speech API** starts listening
3. **Student speaks**: *"I want to explore the village"*
4. **Browser captures** speech as text
5. **Auto-sends** to backend when speech ends (or manual send button)

---

### **3️⃣ Backend Processing (AI Agents)**

**What happens:**
```
3 agents run in parallel → Generate response → Create assets
```

**Parallel Processing (~2 seconds total):**

**Story Agent** (1.2s):
- Uses Anthropic Claude Sonnet 4
- Prompt: *"Generate next part of story based on action: I want to explore the village"*
- Generates: *"You step into the bustling village square. Friendly villagers wave at you! An old woman approaches with a mysterious map. 'Young wizard,' she whispers, 'this will guide you to the Crystal Cave!' What do you do?"*

**Safety Agent** (0.6s):
- Reviews story content
- Checks for: violence, scary content, inappropriate themes
- Returns: `{ safe: true }` or suggests alternative

**Rules Agent** (0.8s):
- Validates action is possible
- Updates game state (HP, magic, location, inventory)
- Decides if educational challenge needed

**Then Sequential:**

**Freepik** (3-5s):
- Generates scene image from story
- Prompt: *"Children's storybook illustration, vibrant colors, village square, friendly villagers, wizard character, map, magical fantasy scene"*
- Returns: High-quality 16:9 image URL

**ElevenLabs** (1-2s):
- Converts new story to speech
- Uses character-specific voice (Wizard = Antoni)
- Returns: Audio URL

---

### **4️⃣ Frontend Updates (Display)**

**What happens:**
```
New image fades in → Text types out → Audio plays
```

**Detailed Flow:**
1. **Loading state** shows: "Generating your adventure..."

2. **Image updates**:
   - Freepik URL received
   - Smooth fade transition (0.7s)
   - Fullscreen display

3. **Story text**:
   - Updates with new narrative
   - Typewriter effect (80ms per word)
   - Large, readable font

4. **Audio plays**:
   - ElevenLabs narration starts automatically
   - Character voice reads entire story
   - Student listens

5. **Loading state** disappears

---

### **5️⃣ Loop Continues**

**Student** hears the story → thinks → speaks response → **repeat from step 2**

---

## 🎯 **Example Complete Session**

### **Turn 1: Start**
```
Student: [Creates "Emma the Wizard"]

Backend generates:
├─ Story: "Welcome, Emma the Wizard!..."
├─ Audio: 🔊 (Wizard voice reads welcome)
└─ Image: 🖼️ (Village scene - local fallback initially)

Student hears story and sees village
```

### **Turn 2: First Action**
```
Student: 🎤 "I want to talk to the old woman"

Backend generates:
├─ Story: "You approach the old woman. She smiles..."
├─ Audio: 🔊 (Wizard voice reads story)
└─ Image: 🖼️ (New scene: wizard talking to old woman)

Student hears new story and sees new image
```

### **Turn 3: Continue**
```
Student: 🎤 "I take the map and ask where to go"

Backend generates:
├─ Story: "The map glows in your hands! It shows..."
├─ Audio: 🔊 (Wizard voice reads story)
└─ Image: 🖼️ (Glowing map scene)

Student continues adventure...
```

---

## 🔑 **API Keys Required**

### **Must Have:**
- `ANTHROPIC_API_KEY` - Story generation
- `ELEVENLABS_API_KEY` - Voice narration
- `FREEPIK_API_KEY` - Scene images

### **Optional (have fallbacks):**
- `SENSO_API_KEY` - Memory/learning
- `MACROSCOPE_API_KEY` - Monitoring
- `MODULATE_API_KEY` - Voice emotion
- `TONIC_API_KEY` - Privacy

---

## ⚡ **Response Times**

| Step | Time | What's Happening |
|------|------|------------------|
| Story generation | ~1.2s | Claude generates narrative |
| Safety check | ~0.6s | Content filtered |
| Rules validation | ~0.8s | Game state updated |
| Image generation | ~3-5s | Freepik creates scene |
| Audio generation | ~1-2s | ElevenLabs TTS |
| **Total** | **~2-3s** | Complete response ready |

*Note: Image and audio run in parallel with frontend updates*

---

## 🎤 **Voice Settings**

### **Character Voices (ElevenLabs):**

| Character | Voice ID | Voice Actor | Style |
|-----------|----------|-------------|-------|
| Wizard | Antoni | wise, calm | Sage-like |
| Knight | Josh | strong, brave | Heroic |
| Rogue | Rachel | narrator | Storyteller |

### **Voice Features:**
- ✅ Character-consistent throughout game
- ✅ Auto-plays on every story beat
- ✅ Kid-friendly, clear pronunciation
- ✅ Caching for repeated phrases

---

## 🖼️ **Image Generation**

### **Freepik Settings:**
```javascript
{
  prompt: "Children's storybook illustration, vibrant colors, magical fantasy scene, [story context]",
  negative_prompt: "scary, dark, violent, inappropriate, low quality",
  size: "landscape_16_9",
  style: "digital-art",
  color: "vibrant",
  lightning: "warm"
}
```

### **Display:**
- Fullscreen with `object-cover`
- Updates on every action
- Smooth fade transitions
- High quality, no cropping

---

## 🐛 **Troubleshooting**

### **"undefined" in welcome message:**
- Make sure Anthropic API key is set in `backend/.env`
- Check backend logs for errors
- Fallback message shows if API fails

### **No audio playing:**
- Check ElevenLabs API key
- Browser may block autoplay (click to enable)
- Check browser console for errors

### **No image updates:**
- Check Freepik API key
- Images take 3-5s to generate (be patient)
- Fallback to local image if API fails

### **Voice not capturing:**
- Allow microphone permissions in browser
- Web Speech API requires HTTPS (or localhost)
- Try manual send button if auto-send fails

---

## ✅ **Verification Checklist**

Before testing, verify:

- [ ] Backend running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:8082`
- [ ] API keys in `backend/.env`:
  - [ ] ANTHROPIC_API_KEY
  - [ ] ELEVENLABS_API_KEY
  - [ ] FREEPIK_API_KEY
- [ ] Browser has microphone permission
- [ ] Speakers/headphones working

---

## 🎉 **Ready to Play!**

Open `http://localhost:8082` and enjoy your AI-powered adventure!

