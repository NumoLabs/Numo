# Deploying Numo from scratch

The original Vercel, Supabase and Alchemy accounts are not ours. Everything
below rebuilds the deployment from nothing. GitHub is unaffected —
`NumoLabs/Numo` is already under our control.

Order matters: Supabase first, because Vercel needs its keys.

---

## 0. Push the code first

Vercel deploys from git, so the working tree has to be committed and pushed
before the import will show anything current.

```bash
git add -A && git commit -m "chore: security and tooling overhaul" && git push
```

---

## 1. Supabase

Create a project in your **personal** account, then:

1. SQL Editor → paste `supabase/migrations/0001_users.sql` → Run.
2. Storage → New bucket:
   - Name `avatars` (exact — hardcoded in `app/api/profile/upload/route.ts`)
   - Public: **yes**
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
3. Settings → API. Keep the Project URL, the `anon` key and the `service_role`
   key for step 3.

---

## 2. Third-party keys

| Key | Where | Notes |
| --- | --- | --- |
| Alchemy | dashboard.alchemy.com → new app, Starknet Mainnet | The old key `c0P2DVGVr0OOBtgc3tSqm` was public in this repo. **Revoke it** even though it is no longer in the code — it is still in the git history. |
| Pragma | dev.pragma.build | Only needed for price feeds (`/api/pragma`). |

If you put a keyed RPC URL in `NEXT_PUBLIC_STARKNET_RPC_URL`, restrict it by
domain in the provider console — that variable is inlined into the browser
bundle and is readable by anyone.

---

## 3. Vercel

New Project → **Import Git Repository** → `NumoLabs/Numo`.

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js (auto-detected) |
| **Root Directory** | `apps/webapp` ← must be set, this is a monorepo |
| Build / Install / Output | leave as detected (bun is picked up from `bun.lock`) |
| Production Branch | `develop` (the repo default) |

### Environment variables

Generate the auth secret locally and paste the output — do not reuse one from
anywhere else:

```bash
openssl rand -base64 48
```

| Variable | Value | Environments |
| --- | --- | --- |
| `AUTH_SECRET` | output of the command above | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | all |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` key | all |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` key | all |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://numo.vercel.app` | Production |
| `NEXT_PUBLIC_STARKNET_RPC_URL` | public or domain-restricted RPC URL | all |
| `STARKNET_RPC_URL` | keyed RPC URL (server-only) | all |
| `ALCHEMY_API_KEY` | Alchemy key | all |
| `PRAGMA_API_KEY` | Pragma key | all |

Without `AUTH_SECRET` the auth routes return 503 on purpose — there is no
insecure fallback. Everything else degrades gracefully: the app builds and
renders, individual features just stay dark.

---

## 4. Verify

```bash
curl -s https://<your-domain>/api/users/count          # {"count":0} → DB wired
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "x-wallet-address: 0x0000000000000000000000000000000000000000000000000000000000000001" \
  https://<your-domain>/api/profile                    # 401 → auth bypass closed
```

Then connect a wallet in the browser: you should get one signature prompt (no
transaction, no gas), after which the profile page loads.

---

## Notes

- `NEXT_PUBLIC_*` is inlined into the JavaScript bundle. Never a secret.
- The session cookie is httpOnly and `secure` in production, so auth only works
  over HTTPS. Vercel gives you that by default.
- Preview deploys get their own domain. If `NEXT_PUBLIC_SITE_URL` is only set
  for Production, `/api/starknet-rpc` still works on previews — it falls back to
  comparing against the request's own origin.
