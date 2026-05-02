# How to Add a Custom Song to Aleah's Birthday Tribute

There are two ways to add a custom song to the website:

## Option 1: Upload Song to Cloud Storage (Recommended)

This is the easiest method for production use.

### Steps:

1. **Prepare Your Song File**
   - Format: MP3, WAV, or OGG
   - Recommended: MP3 format for best browser compatibility
   - File size: Keep under 10MB for fast loading

2. **Upload the Song**
   - Use the command: `manus-upload-file --webdev your-song.mp3`
   - This will return a cloud URL like: `https://cdn.example.com/song_abc123.mp3`
   - Copy this URL

3. **Update the LetterSection Component**
   - Open `client/src/components/LetterSection.tsx`
   - Find this line near the top:
     ```typescript
     const SONG_URL = ''; // Add your song URL here
     ```
   - Replace with your URL:
     ```typescript
     const SONG_URL = 'https://cdn.example.com/song_abc123.mp3';
     ```

4. **The song will automatically play** when users click the "Play Song" button

---

## Option 2: Add Local Song File (For Development)

This method works for testing locally but won't work in production.

### Steps:

1. **Prepare Your Song**
   - Place your audio file in: `client/public/audio/`
   - Create the folder if it doesn't exist
   - Example: `client/public/audio/birthday-song.mp3`

2. **Update the LetterSection Component**
   - Open `client/src/components/LetterSection.tsx`
   - Find the SONG_URL constant
   - Replace with:
     ```typescript
     const SONG_URL = '/audio/birthday-song.mp3';
     ```

3. **Test locally** - the song will play when you click the button

---

## Current Implementation

The `LetterSection.tsx` component includes:
- A "Play Song" button with music icon
- Automatic playback when clicked
- Visual feedback showing "Playing..." state
- Support for any audio format that browsers support

### Supported Audio Formats:
- MP3 (best compatibility)
- WAV
- OGG
- M4A
- WebM

---

## Example: Step-by-Step for Cloud Upload

```bash
# 1. Prepare your song file (e.g., birthday-song.mp3)

# 2. Upload to cloud storage
manus-upload-file --webdev birthday-song.mp3

# 3. You'll get output like:
# https://cdn.manus.space/birthday-song_a1b2c3d4.mp3

# 4. Copy that URL and update LetterSection.tsx:
# const SONG_URL = 'https://cdn.manus.space/birthday-song_a1b2c3d4.mp3';

# 5. Save and refresh the website - done!
```

---

## Troubleshooting

**Song doesn't play?**
- Check that the URL is correct and accessible
- Verify the audio file format is supported
- Check browser console for CORS errors
- Make sure the file isn't too large

**Song cuts off?**
- The current implementation plays the full audio file
- If you want to loop the song, let me know and I can update the code

**Want to add multiple songs?**
- You can add more buttons or a playlist feature
- Let me know if you'd like this functionality

---

## Need Help?

If you have a specific song file you want to add, just:
1. Tell me the song details (name, format)
2. Share the file or URL
3. I'll integrate it for you!
