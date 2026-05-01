# Supabase Auth Setup

This project uses Supabase Auth for email and password login/sign-up.

## Installed package

The project uses:

- `@supabase/supabase-js`
- `@supabase/ssr`

## Supabase environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_or_anon_key
```

You can find these values in Supabase under Project Settings > API or the Connect dialog.

## Supabase setup

In Supabase:

1. Go to Authentication > Providers.
2. Make sure Email is enabled.
3. Decide whether email confirmations should be required.
4. Go to Authentication > URL Configuration.
5. Add this site URL for local development:

```txt
http://localhost:3000
```

For production, set the production domain as the site URL:

```txt
https://your-domain.com
```

## Current auth behavior

- Login uses `supabase.auth.signInWithPassword`.
- Sign-up uses `supabase.auth.signUp`.
- Supabase Auth sessions are stored in cookies for server-side route protection.
- Applicant pages are protected in `src/proxy.ts` and verified again in the applicant layout with `supabase.auth.getClaims()`.
- Sign-up stores `first_name`, `middle_name`, `surname`, and `full_name` in Supabase Auth user metadata.
- If email confirmations are enabled, new users must confirm their email before signing in.
- If email confirmations are disabled, successful sign-up redirects directly to the applicant dashboard.

## Files

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/proxy.ts`
- `src/proxy.ts`
- `src/app/login-form.tsx`
- `src/app/sign-up-form.tsx`
