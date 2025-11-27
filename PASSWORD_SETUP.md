# Password Protection Setup

## 🔒 Current Configuration

**Password**: `corner2024`

The site is now protected with a password screen. Visitors must enter the password to access the content.

## 🔧 How to Change the Password

1. Open `index.html`
2. Find this line (around line 404):
   ```javascript
   const SITE_PASSWORD = 'corner2024';
   ```
3. Change `'corner2024'` to your desired password
4. Save and deploy

## 📋 How It Works

### Client-Side Protection
- Password check happens in the browser
- Uses `sessionStorage` to remember authentication during the browser session
- Password is reset when browser tab/window is closed
- Simple but not highly secure (password is visible in source code)

### Features
- Clean, modern password interface
- Error messages for incorrect passwords
- Shake animation on wrong password
- Auto-focus on password input
- Session persistence (no re-entry needed during session)

## 🔐 Security Level

**Current Implementation**: Basic Protection
- Good for: Casual protection, demos, keeping casual visitors out
- Not good for: Sensitive data, high-security needs

### Security Considerations

⚠️ **Important**: The password is visible in the HTML source code. Anyone who views the page source can see it.

### For Higher Security

If you need stronger security, consider:

1. **Netlify Password Protection** (Recommended for production)
   - Requires: Netlify Pro plan ($19/month)
   - Setup: Project configuration > Access & security > Visitor access
   - Benefit: Password is server-side, much more secure
   - [Documentation](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/)

2. **Netlify Identity**
   - Free tier available
   - Full user authentication system
   - More complex to set up

3. **Third-party auth** (Auth0, Firebase Auth, etc.)
   - Professional authentication
   - Requires more development

## 🎯 Removing Password Protection

To remove password protection entirely:

1. Open `index.html`
2. Delete the password overlay section (lines ~343-365)
3. Delete the password script section (lines ~401-457)
4. Remove the password-related CSS (lines ~20-112)
5. Remove `id="mainContent"` from the main div
6. Remove `.visible` class requirement

Or simply set the password to an empty string and tell everyone the password is blank.

## 🧪 Testing

1. Open the site in a browser
2. You should see the password screen
3. Enter: `corner2024`
4. Content should unlock
5. Refresh the page - you should still be authenticated
6. Close the tab and reopen - you should need to enter password again
