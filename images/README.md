# Images Folder

Add your images to this folder, then update `images.json` in the root directory.

## How to Add Images:

1. **Copy your images** to this `images/` folder
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP

2. **Update images.json** in the root directory with your image filenames:
   ```json
   {
     "images": [
       "images/photo1.jpg",
       "images/photo2.png",
       "images/photo3.jpg"
     ]
   }
   ```

3. **Refresh the page** - Images will appear in boxes 2, 3, and 6 (chess pattern)

## Chess Pattern:
- Box 1: Color
- Box 2: **Image** ✓
- Box 3: **Image** ✓
- Box 4: Color
- Box 5: Color
- Box 6: **Image** ✓

The pattern repeats for every 4 boxes (2nd and 3rd positions get images).
