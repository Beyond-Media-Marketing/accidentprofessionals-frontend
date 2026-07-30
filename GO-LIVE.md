# Go-Live Runbook — accidentprofessionals.com

Cutting over from the old WordPress site (`35.208.209.141`) to the new Nuxt site on Vercel.

**Two hard rules**
- **Never touch the MX / SPF / SRV records** — those are Google Workspace email + Microsoft services. Breaking them takes down email.
- **Do not delete the WordPress site.** It is the rollback plan. Keep it running for at least 30 days.

---

## Phase 0 — Pre-flight (complete *before* touching DNS)

### 0.1 Deploy the CMS to Strapi Cloud
Needs the content types added during the rebuild:
- `cities-section` ("Cities We Serve")
- `privacy-policy`
- attorney fields: `credentials`, `socials`, `tagline`, `locationDetail`, `locationLink`
- blog collections (`blog-post`, `blog-category`) + the CKEditor plugin

### 0.2 Fix content in Strapi admin

**Broken links currently live in the CMS:**
| Where | Current (broken) | Should be |
|---|---|---|
| Navigation | `/areas-we-serve` | `/georgia` |
| Footer | `/blog` | `/blogs` |
| Home → practice areas | `services/workplace-accidents/workers-compensation` | `/services/...` (missing leading slash) |
| Footer | `http://localhost:3001/services/...` | `/services/workplace-accidents/workers-compensation` |

**Cities:**
- Populate **Cities We Serve** (drives the homepage + `/georgia`).
- `services-page.cityAreas` and `service-defaults.cities` have their own lists which **override** the master — add `ctaTitle` ("Don't See Your City?") + `cta` ("See all cities" → `/georgia`) to those two, **or** clear their region lists so they inherit the master and stay consistent.
- `/about` lists **Smyrna** and **Decatur**, which have **no city pages** → live 404s. Either create those pages or remove them from the list.

**SEO:**
- Add a default OG image (`defaultOgImage` in Global Setting, 1200×630) — currently missing, so social shares 404.
- Fill per-page `seo` meta (services, cities, attorneys, blog posts) to avoid duplicate titles/descriptions.

### 0.3 Vercel environment variables (Production scope)
```
STRAPI_URL=https://cms.accidentprofessionals.com
STRAPI_MEDIA_URL=https://dependable-festival-3d32f335d3.media.strapiapp.com
SITE_URL=https://accidentprofessionals.com
WEB3FORMS_KEY_LEADS=…
WEB3FORMS_KEY_ATTORNEYS=…
TURNSTILE_SITE_KEY=…
TURNSTILE_SECRET=…
```
`SITE_URL` drives canonicals, sitemap and OG tags — must be the production domain.

### 0.4 Vercel domains

**Domain is claimed by another Vercel account** → both domains show "Verification Required".
Add these TXT records in Cloudflare (safe — does not affect the live WordPress site), then hit
**Refresh** in Vercel. Delete them once verified.

| Type | Name | Content | Proxy |
|---|---|---|---|
| TXT | `_vercel` | `vc-domain-verify=accidentprofessionals.com,14283fbc0eb8da2e8835` | DNS only |
| TXT | `_vercel` | `vc-domain-verify=www.accidentprofessionals.com,29922e837b652b6ea929` | DNS only |

**Decide www vs non-www.** Vercel currently has apex → 308 → `www` (www canonical).
The old WordPress site was **non-www**, so every indexed URL / backlink is `https://accidentprofessionals.com/…`.
Keeping www canonical adds a permanent extra redirect hop to all of them.
→ **Recommended:** make the **apex** the production domain and `www` the redirect, and keep
`SITE_URL=https://accidentprofessionals.com`.
→ If you keep www canonical instead, you **must** set `SITE_URL=https://www.accidentprofessionals.com`,
or canonicals + sitemap will point at URLs that redirect.

### 0.5 Cloudflare Turnstile
Add `accidentprofessionals.com` (and `www.`) to the widget's hostname list, or the captcha fails on the live domain.

### 0.6 Test on the Vercel URL with production env
Forms submit to the correct inbox · images load · `/about` works · blog renders · attorney pages render.

---

## Phase 1 — Park WordPress somewhere uncrawlable

> ⛔ **ORDER MATTERS — do this AFTER the DNS cutover (Phase 2), not before.**
> While the apex/`www` still point at WordPress, changing WordPress's URLs takes the
> LIVE SITE DOWN — there is no new site catching the traffic yet.
> (This bit us once: `www` began redirecting to `legacy.`, which had no vhost on the
> WordPress host and served "This is the default server vhost".)
>
> Correct sequence: **verify Vercel (0.4) → cut over DNS (Phase 2) → then park WordPress (Phase 1).**

1. Cloudflare DNS → add `legacy` → **A** → `35.208.209.141` → **Proxied**.
2. **Update WordPress's own URLs** — Settings → General → *WordPress Address* + *Site Address* → `https://legacy.accidentprofessionals.com` (or set in `wp-config.php`).
   ⚠️ Skip this and WordPress's canonical redirect bounces `legacy.` back to `accidentprofessionals.com` — which after cutover lands on the **new** site.
3. **Block crawling properly** — `robots.txt` stops crawling, not indexing. Use **Cloudflare Access** or **HTTP Basic Auth** so it isn't publicly reachable at all. Belt and braces: also send `X-Robots-Tag: noindex, nofollow`.

---

## Phase 2 — The DNS cutover

In Cloudflare, change **only these two records**:

Prerequisite: the `_vercel` TXT verification (see 0.4) must be complete first.

| Name | Type | Value | Proxy |
|---|---|---|---|
| `@` (apex) | **CNAME** | `4c3964f6b52b2fb3.vercel-dns-016.com` | **DNS only** (grey) |
| `www` | **CNAME** | `4c3964f6b52b2fb3.vercel-dns-016.com` | **DNS only** (grey) |

These are the **project-specific** hostnames Vercel issued — use them, not the generic
`cname.vercel-dns.com` (which still works but is the legacy path).
Cloudflare's **CNAME flattening** handles the apex automatically — better than a hardcoded
A record, which would break if Vercel changes IPs. Vercel's own dashboard shows
**Proxy: Disabled** for both records.

**Why grey, not proxied:**
- Cert issuance/renewal — Vercel validates its own Let's Encrypt cert; proxying is where that most often stalls
- **Flexible SSL = infinite redirect loop** (the classic Vercel-behind-Cloudflare outage). If you ever proxy, SSL mode **must** be Full (strict)
- Double CDN — Cloudflare caches HTML in front of Vercel, so deploys appear "not live"
- Every other Vercel record here (`sales`, `team`, `operations`…) is already DNS only

You can flip to proxied later as a separate, reversible change — set **Full (strict)** first and bypass cache for HTML.

---

## Phase 3 — Verify immediately after cutover

- `https://accidentprofessionals.com` serves the new site over valid HTTPS
- `www.` resolves to the canonical domain
- **Redirects** — each should be a *single* 301 to a working page:
  - `/about/` · `/car-accident/` · `/brian-moore/`
  - `/georgia/atlanta-personal-injury-lawyer/`
  - `/blogs/car-acccidents/car-accidents/`
  - `/es/about/` (Spanish → English)
- **Send a real test lead** → confirm it reaches the correct inbox
- **Send + receive an email** → proves MX records survived

---

## Phase 4 — Post-launch

- Google Search Console: submit `https://accidentprofessionals.com/sitemap.xml`
- Watch **Pages → Not indexed** for ~2 weeks; the 301s hand rankings over
- Keep WordPress parked ≥ 30 days before decommissioning

---

## Rollback

Revert the apex + `www` records to **A → `35.208.209.141`**, and set WordPress's Site/WordPress Address back to `https://accidentprofessionals.com`.
