# Supabase setup

The original Numo project lived in an account we no longer control, so this
directory reconstructs what the app needs from scratch.

## 1. Create a project

Create a new Supabase project, then copy into `apps/webapp/.env.local`:

| Supabase dashboard | Env var |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / publishable key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` |

`service_role` bypasses row level security. It is server-only — it must never
appear in a `NEXT_PUBLIC_*` var, and never in the browser bundle.

## 2. Run the migration

Paste `migrations/0001_users.sql` into the SQL editor, or:

```bash
supabase db push
```

## 3. Create the avatars bucket

Storage → New bucket:

- **Name:** `avatars` (exact — `app/api/profile/upload/route.ts` hardcodes it)
- **Public:** yes (avatar URLs are served directly to the browser)
- **File size limit:** 5 MB
- **Allowed MIME types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`

The app no longer creates this bucket on demand: doing that added two API round
trips to every upload and required elevated permissions.

## Verifying

With the app running:

```bash
curl -s localhost:3000/api/users/count
```

`{"count":0}` means the connection and the table are good. `{"error":"Supabase
not configured"}` means the env vars are not being read.
