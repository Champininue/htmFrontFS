# Email Proxy (Cloudflare Worker)

A tiny serverless proxy that accepts contact form submissions and forwards them to Brevo securely without exposing your API key in the browser. Deploy to Cloudflare Workers, set secrets, and point your site to the Worker URL via `PROXY_URL`.

## What it does
- Accepts POST JSON: `{ name, email, subject, message, updates }`
- Validates required fields and basic length limits
- Builds a nicely formatted HTML + text email
- Sends through Brevo (Sendinblue) using server-side secret `BREVO_API_KEY`
- Returns 201 with `{ ok: true }` on success
- CORS enabled for your site origin

## Files
- `worker.js`: Cloudflare Worker entry with CORS and Brevo forwarding

## Deploy (Dashboard)
1. Create a new Worker in Cloudflare Dashboard
2. Copy `proxy/worker.js` contents into the Worker editor
3. Set the following Worker variables (Settings → Variables):
   - Secrets:
     - `BREVO_API_KEY` (secret)
   - Plain text (environment variables):
     - `TO_EMAIL`
     - `FROM_EMAIL`
     - `ALLOWED_ORIGIN` (optional, e.g., `https://<username>.github.io`)
4. Deploy and copy the Worker URL (e.g., `https://your-worker.your-subdomain.workers.dev`)
5. In GitHub → Repository Settings → Environments → your Pages env, set variable `PROXY_URL` to the Worker URL
6. Push a commit to trigger the GH Actions build; the injector will replace `INJECT_PROXY_URL`

## Deploy (Wrangler CLI)
Optionally via CLI:

```sh
# Install wrangler if needed
npm i -g wrangler

# Initialize (optional)
# wrangler init

# Create secrets and vars
wrangler secret put BREVO_API_KEY
wrangler kv:namespace create CONTACT_RATELIMIT # optional, not used by default

# Publish
wrangler deploy proxy/worker.js --name contact-proxy
```

Then set environment variables in the dashboard or via `wrangler.toml` if you prefer.

## Configure the site
- Ensure `PROXY_URL` is set in your environment (repo or environment variable) so the GitHub Actions injector replaces it in `public/index.html`
- The client detects `PROXY_URL` and uses it automatically; otherwise it falls back to `mailto:`

## CORS
- The Worker replies with `Access-Control-Allow-Origin` using `ALLOWED_ORIGIN` if set; otherwise it mirrors the incoming `Origin` or `*` as a last resort.
- For best security, set `ALLOWED_ORIGIN` to your GitHub Pages domain.

## Notes
- Do not try to call Brevo directly from the browser; keys will be exposed and blocked by authorized IP policy.
- This Worker doesn’t include persistent rate-limiting; add KV or D1 if you need advanced protection.
- Keep `FROM_EMAIL` aligned with a verified sender in Brevo.
