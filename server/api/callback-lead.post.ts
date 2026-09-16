/**
 * Rep call-back lead → ClickUp task.
 *
 * Flow (see app/components/CallbackForm.vue): the browser verifies Turnstile HERE,
 * then posts the lead to Web3Forms separately for the email copy. Email and ClickUp
 * are deliberately independent so a ClickUp/API outage still produces an email —
 * that redundancy is the whole point of the email leg.
 *
 * Turnstile is verified inside this handler (not via /api/verify-captcha) so the
 * endpoint can't be hit directly to spam the ClickUp list.
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2'

/** Tags can't contain spaces; reps are already slugs, but be defensive. */
const toTag = (s: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

interface LeadBody {
  token?: string
  rep?: string
  locale?: 'en' | 'es'
  name?: string
  email?: string
  phone?: string
  details?: string
  bestTime?: string
  bestTimeLabel?: string
  specificTime?: string
  consent?: boolean
  pageTitle?: string
  utm?: Record<string, string>
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const result = await $fetch<{ success: boolean }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    },
  ).catch(() => null)
  return result?.success === true
}

export default defineEventHandler(async (event) => {
  const body = (await readBody<LeadBody>(event)) || {}
  const { turnstileSecret, clickupToken, clickupListId } = useRuntimeConfig()

  // ── Spam gate ──────────────────────────────────────────────────────────────
  if (turnstileSecret) {
    const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || ''
    if (!body.token || !(await verifyTurnstile(turnstileSecret, body.token, ip))) {
      setResponseStatus(event, 400)
      return { ok: false, error: 'verification-failed' }
    }
  }

  // ── Validation (mirrors the required fields on the form) ───────────────────
  const name = String(body.name || '').trim()
  const phone = String(body.phone || '').trim()
  const details = String(body.details || '').trim()
  if (!name || !phone || !details || !body.consent) {
    setResponseStatus(event, 422)
    return { ok: false, error: 'missing-required-fields' }
  }

  if (!clickupToken || !clickupListId) {
    // Not configured — the email leg still delivers the lead, so this is not fatal.
    setResponseStatus(event, 503)
    return { ok: false, error: 'clickup-not-configured' }
  }

  // ── Build the task ─────────────────────────────────────────────────────────
  const locale = body.locale === 'es' ? 'es' : 'en'
  const rep = toTag(body.rep || '')
  const email = String(body.email || '').trim()
  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {}

  // Roster lookup is enrichment only — `rep` (the tag) is already set from the URL.
  // A null map means Strapi was unreachable, so we simply don't judge the slug.
  const roster = rep ? await getReps(event) : null
  const known = roster ? roster.get(rep) : undefined
  const slugIsUnknown = !!rep && !!roster && !known
  const repIsInactive = !!known && known.active === false

  const utmLines = Object.entries(utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `- **${k}:** ${v}`)

  const description = [
    `**Name:** ${name}`,
    `**Phone:** ${phone}`,
    `**Email:** ${email || '—'}`,
    '',
    `**What happened:**`,
    details,
    '',
    `**Best time to call:** ${body.bestTimeLabel || body.bestTime || '—'}`,
    ...(body.specificTime ? [`**Requested time:** ${body.specificTime}`] : []),
    '',
    `**Referred by:** ${
      rep
        ? `${known?.name ?? rep}${slugIsUnknown ? '  ⚠️ NOT ON ROSTER — check the link' : ''}${repIsInactive ? '  ⚠️ marked INACTIVE in the CMS' : ''}`
        : 'direct (no rep link)'
    }`,
    `**Language:** ${locale === 'es' ? 'Spanish' : 'English'}`,
    `**Page:** ${body.pageTitle || '—'}`,
    ...(utmLines.length ? ['', '**Campaign:**', ...utmLines] : []),
    '',
    `**Consent given:** yes — ${new Date().toISOString()}`,
  ].join('\n')

  // Language tag so EN/ES stay separable now that both land in one list.
  const tags = [locale === 'es' ? 'spanish' : 'english']
  if (rep) {
    tags.push(rep)
    // The route accepts any well-formed slug so new reps need no deploy — but a
    // slug that isn't on the roster is usually a typo'd link. Flag it rather than
    // letting it quietly create a one-off tag nobody reconciles.
    if (slugIsUnknown) tags.push('unknown-rep')
    if (repIsInactive) tags.push('inactive-rep')
  }

  const task = await $fetch<{ id?: string; url?: string }>(
    `${CLICKUP_API}/list/${clickupListId}/task`,
    {
      method: 'POST',
      headers: { Authorization: clickupToken, 'Content-Type': 'application/json' },
      body: {
        // Task title is just the lead's name — phone, rep and everything else
        // are in the description and the tags.
        name,
        description,
        tags,
      },
    },
  ).catch((err: any) => {
    console.error('[callback-lead] ClickUp task creation failed:', err?.data ?? err?.message ?? err)
    return null
  })

  if (!task?.id) {
    setResponseStatus(event, 502)
    return { ok: false, error: 'clickup-failed' }
  }

  return { ok: true, taskId: task.id, url: task.url, tags }
})
