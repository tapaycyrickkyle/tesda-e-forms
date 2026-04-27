# Supabase Google Auth Setup

This project will use Supabase Auth with Google OAuth for Gmail sign-in.

## What the developer must install

Run this in the project root:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Supabase environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_or_anon_key
```

You can find these values in Supabase under Project Settings > API or the Connect dialog.

## Google Cloud setup

Create a Google OAuth client:

- Application type: Web application
- Authorized JavaScript origins:

```txt
http://localhost:3000
```

- Authorized redirect URI:

Use the callback URL shown by Supabase in Authentication > Providers > Google. It usually looks like:

```txt
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

## Supabase setup

In Supabase:

1. Go to Authentication > Providers > Google.
2. Enable Google.
3. Paste the Google Client ID and Client Secret.
4. Go to Authentication > URL Configuration.
5. Add this redirect URL:

```txt
http://localhost:3000/auth/callback
```

For production, also add:

```txt
https://your-domain.com/auth/callback
```

## Next code to add after packages are installed

Once the packages are installed, add:

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/app/auth/callback/route.ts`
- A Google login button using `supabase.auth.signInWithOAuth({ provider: "google" })`

