# Supabase Integration Setup Guide

## Complete Step-by-Step Instructions

### Step 1: Database Setup
1. **Go to your Supabase Dashboard** (https://app.supabase.com)
2. **Select your project** (or create a new one if needed)
3. **Navigate to SQL Editor**
4. **Copy and paste the entire content** from `database_setup.sql` file in your project root
5. **Run the SQL script** - this will create all necessary tables, indexes, RLS policies, and triggers

### Step 2: Environment Variables
Your `.env` file is already configured with your Supabase credentials:
```
VITE_SUPABASE_URL=https://edzojevlzrwbiqyxklss.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Authentication Settings (Important!)
1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Email Settings:**
   - **Disable email confirmation** (for testing):
     - Set "Enable email confirmations" to **OFF**
     - This allows immediate login after signup
   - **Check "Allowed email domains"**:
     - Make sure it's not restricted to specific domains
     - If restricted, add your domain or remove restrictions
3. **URL Configuration:**
   - Verify "Site URL" is set correctly (e.g., http://localhost:5174)
   - Check "Redirect URLs" include your local development URL
4. **Email Validation:**
   - Some email formats might be rejected
   - Try using common domains like gmail.com, example.com, or your actual email

### Step 4: Switch to Supabase Implementation
I've created parallel hooks for Supabase. You need to update these components to use Supabase:

1. **Update AddAnime component:**
```typescript
// In src/components/AddAnime.tsx, change the import:
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

// Change the hook usage:
const { user } = useSupabaseAuth();
```

2. **Update other components** that use authentication or anime data to import from Supabase hooks.

### Step 5: Testing the Integration

1. **Start your development server:**
```bash
npm run dev
```

2. **Test the authentication flow:**
   - Try signing up with a new email
   - Try signing in with existing credentials
   - Check if you're redirected to the main app after authentication

3. **Test anime management:**
   - Add a new anime entry
   - View your anime list
   - Edit and delete anime entries

### Step 6: Verify Database
1. **Go to Supabase Dashboard → Table Editor**
2. **Check the following tables exist:**
   - `profiles` - User profiles
   - `anime` - Anime entries
   - `episodes` - Episode data
   - `episode_links` - Streaming links
   - `subtitles` - Subtitle files

### Step 7: Migration from Local Storage (Optional)
If you have existing data in localStorage, you can:
1. Export it from the browser's developer tools
2. Transform it to match the new database schema
3. Import it via the Supabase dashboard or API calls

## Key Features Enabled

### ✅ User Authentication
- Email/password signup and signin
- Automatic profile creation
- Session management
- Password reset functionality

### ✅ Data Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure API access with Supabase

### ✅ Real-time Capabilities (Future)
- Supabase supports real-time subscriptions
- Can be added later for live updates

### ✅ Scalability
- Cloud database with automatic backups
- No more localStorage limitations
- Support for multiple users

## Troubleshooting

### Common Issues:

1. **"Email address is invalid" error:**
   - Try using a different email format (e.g., admin@gmail.com instead of admin@mail.com)
   - Check Supabase Auth Settings → "Allowed email domains"
   - Some TLD restrictions might apply (.com, .org work better than .mail)
   - Use your actual email address for testing

2. **Email confirmation required:**
   - Disable in Supabase Auth settings for testing
   - Or check your email for confirmation link

3. **RLS Policy errors:**
   - Ensure user is authenticated
   - Check browser console for specific errors

4. **Database connection issues:**
   - Verify environment variables are correct
   - Check Supabase project is not paused

5. **Type errors:**
   - Run `npm run build` to check for TypeScript issues
   - The types are defined in `src/lib/supabase.ts`

6. **"process is not defined" error:**
   - Fixed by using `import.meta.env` instead of `process.env`
   - Restart development server after the fix

## Next Steps

1. **Run the database setup SQL**
2. **Test authentication**
3. **Add your first anime entry**
4. **Verify everything works in the database**

## Files Modified/Created:
- ✅ `src/lib/supabase.ts` - Supabase client and types
- ✅ `src/hooks/useSupabaseAuth.ts` - Authentication hook
- ✅ `src/hooks/useSupabaseAnime.ts` - Anime data management
- ✅ `database_setup.sql` - Database schema and policies
- ✅ Updated `src/App.tsx` and `src/components/AuthForm.tsx`

Let me know if you encounter any issues during the setup!
