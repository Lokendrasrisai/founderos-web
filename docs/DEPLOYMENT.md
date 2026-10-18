# Deployment

The site has **not** been deployed. These are the steps to do it.

## Requirements
- Node.js ≥ 20.9 (developed and tested on 22.22; `.nvmrc` = 22)
- npm 10+

## Local
```bash
npm ci
npm run dev            # http://localhost:3000 — production content
npm run dev:preview    # drafts + DEMO_ONLY fixtures, badged
npm run check          # lint + typecheck + unit tests + production build
npx playwright install chromium   # once
npm run test:e2e       # builds and tests production, preview, and form modes
```

## Vercel (recommended, free tier is sufficient)
1. Push the repository to GitHub/GitLab.
2. In Vercel: **Add New → Project →** import the repo. Framework preset: Next.js. No build settings to change.
3. Environment variables (Project → Settings → Environment Variables):

| Variable | Environments | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | When a domain exists | Canonical URLs, absolute OG URLs, sitemap |
| `RESEND_API_KEY` | Production (+ Preview if wanted) | For the form | Resend API key (secret) |
| `CONTACT_TO_EMAIL` | same | For the form | Team inbox that receives messages |
| `CONTACT_FROM_EMAIL` | same | For the form | Sender on a domain verified in Resend, e.g. `website@yourdomain.com` |
| `FOUNDEROS_DEMO_CONTENT` | **Preview only** | No | `true` to review drafts on preview deployments |

   Never set `FOUNDEROS_DEMO_CONTENT` for Production — the build fails deliberately if you do.
4. Deploy. Pages are static, so **redeploy after changing env vars or content**.
5. Custom domain: Project → Settings → Domains. Then set `NEXT_PUBLIC_SITE_URL` and redeploy.

Without `NEXT_PUBLIC_SITE_URL`, the site omits canonical tags and the sitemap is empty. On Vercel, Next.js
falls back to the deployment URL for resolving the Open Graph image.

## Contact delivery (Resend)
1. Create a Resend account, add and verify your domain (DNS records).
2. Create an API key with "sending access" only.
3. Set the three variables above, redeploy, and send a test message from the live site.
4. The form reports success only when Resend accepts the message. Failures show a retry message and keep
   the visitor's text.

Alternatives: any provider with an HTTP API can replace the `fetch` in `src/app/contact/actions.ts`.

## Abuse protection — known limits and upgrades
Current: honeypot, minimum fill time, Zod validation with length limits, in-memory rate limit of 5 messages
per IP per 10 minutes. The in-memory limit is **per serverless instance**, so it is not a global guarantee.
If spam appears:
- Shared rate limit: Upstash Redis (Vercel Marketplace) with `@upstash/ratelimit`, replacing `createRateLimiter`.
- Challenge: Cloudflare Turnstile (add its origin to the CSP `script-src`/`frame-src` and update the privacy notice).

## Other hosts
Any Node.js host that runs `npm run build && npm run start` works. `next start` listens on `PORT`
(default 3000). Self-hosted: put it behind a TLS-terminating proxy and add `Strict-Transport-Security`.

## Operating cost
Static pages + one serverless function. Expected cost on Vercel Hobby and Resend free tier: $0 for typical
portfolio traffic (check current plan limits; Vercel Hobby is for non-commercial use — move to Pro once the
company is operating commercially).

## Post-deploy checklist
- [ ] Every route loads; `/robots.txt` allows crawling; `/sitemap.xml` lists published pages only
- [ ] Response headers include CSP and `X-Content-Type-Options` (`curl -I https://yourdomain.com`)
- [ ] No preview banner visible; `<meta name="robots">` is `index, follow`
- [ ] Contact page shows the intended mode; a real test message arrives
- [ ] Share preview renders (e.g. paste the URL into a messaging app)
- [ ] Run Lighthouse / PageSpeed Insights on the live URL and watch Core Web Vitals in Vercel Speed Insights
      or Search Console once there is real traffic
