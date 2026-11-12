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

/**
 * Split a full name into first / last for the two ClickUp text fields.
 * First token is the first name, everything after it is the surname — compound
 * surnames ("De Jongh", "Hernandez-Hernandez") therefore stay intact. A
 * single-word name yields an empty surname rather than duplicating the value.
 */
function splitName(full: string): { first: string; last: string } {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: '', last: '' }
  if (parts.length === 1) return { first: parts[0]!, last: '' }
  return { first: parts[0]!, last: parts.slice(1).join(' ') }
}

/** ClickUp `date` fields take epoch MILLISECONDS; a bad string must not be sent. */
function toEpochMs(value: string): number | null {
  if (!value) return null
  const ms = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value)
  return Number.isFinite(ms) ? ms : null
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

interface LeadBody {
  token?: string
  rep?: string
  locale?: 'en' | 'es'
  name?: string
  email?: string
  phone?: string
  dialCode?: string
  details?: string
  state?: string
  accidentDate?: string
  bestTime?: string
  bestTimeLabel?: string
  bestTimeLabelLocal?: string
  specificTime?: string
  consent?: boolean
  pageTitle?: string
  utm?: Record<string, string>
  // Out-of-state fields — only honoured when `state` is not Georgia.
  hospital?: string
  injuries?: string
  policeReport?: string
  address?: string
  language?: string
  additionalInfo?: string
  attachmentCount?: number
}

const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  spanish: 'Spanish',
  portuguese: 'Portuguese',
  russian: 'Russian',
  other: 'Other',
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

  // Out-of-state leads carry the extra intake fields. For Georgia (or no state) they
  // are ignored outright, so values typed before switching back to Georgia can never
  // reach ClickUp even if a client sends them.
  const state = String(body.state || '').trim()
  const outOfState = !!state && state !== 'Georgia'
  const oos = {
    hospital: outOfState ? String(body.hospital || '').trim() : '',
    injuries: outOfState ? String(body.injuries || '').trim() : '',
    policeReport: outOfState ? String(body.policeReport || '').trim() : '',
    address: outOfState ? String(body.address || '').trim() : '',
    language: outOfState && LANGUAGE_LABELS[String(body.language || '')] ? String(body.language) : '',
    additionalInfo: outOfState ? String(body.additionalInfo || '').trim() : '',
  }
  if (
    outOfState &&
    (!oos.hospital || !oos.injuries || !oos.policeReport || !oos.address || !oos.language)
  ) {
    setResponseStatus(event, 422)
    return { ok: false, error: 'missing-required-fields' }
  }
  const attachmentCount = outOfState ? Math.max(0, Math.floor(Number(body.attachmentCount) || 0)) : 0

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
    `**Phone:** ${body.dialCode || '+1'} ${phone}`,
    `**Email:** ${email || '—'}`,
    '',
    `**What happened:**`,
    details,
    '',
    `**State:** ${state || '—'}`,
    `**Date of accident:** ${body.accidentDate || '—'}`,
    `**Best time to call:** ${body.bestTimeLabel || body.bestTime || '—'}${
      body.bestTimeLabelLocal && body.bestTimeLabelLocal !== body.bestTimeLabel
        ? ` (chose: ${body.bestTimeLabelLocal})`
        : ''
    }`,
    ...(body.specificTime ? [`**Requested time:** ${body.specificTime}`] : []),
    ...(outOfState
      ? [
          '',
          '**Out-of-state details**',
          `**Hospital:** ${oos.hospital}`,
          `**Injuries:** ${oos.injuries}`,
          `**Police report:** ${oos.policeReport}`,
          `**Address:** ${oos.address}`,
          `**Primary language:** ${LANGUAGE_LABELS[oos.language]}`,
          `**Attachments:** ${attachmentCount ? `${attachmentCount} file(s), see task attachments` : 'none'}`,
          ...(oos.additionalInfo ? ['**Additional info:**', oos.additionalInfo] : []),
        ]
      : []),
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

  // ── ClickUp custom fields ────────────────────────────────────────────────
  // Each value must match its field's type exactly (see server/utils/clickupFields.ts):
  // wrongly-shaped values are rejected or silently dropped by ClickUp.
  const { first, last } = splitName(name)
  const customFields: { id: string; value: any }[] = []
  const put = (id: string, value: any) => {
    if (value !== null && value !== undefined && value !== '') customFields.push({ id, value })
  }

  // ClickUp's `phone` type expects a full international number (E.164).
  const phoneE164 = `${body.dialCode || '+1'}${phone}`.replace(/[^\d+]/g, '')

  put(CF.firstName, first)
  put(CF.lastName, last)
  put(CF.description, details)
  // ClickUp rejects the WHOLE task over a malformed email value, so only send
  // well-formed addresses; the raw text is in the description either way.
  put(CF.email, isEmail(email) ? email : '')
  put(CF.phone, phoneE164)
  put(CF.bestTimeToCall, body.bestTimeLabel || body.bestTime || '')
  put(CF.bestDateTime, body.specificTime || '')

  // Consent: a checkbox plus the timestamp it was given — both are compliance evidence.
  customFields.push({ id: CF.consentCheckbox, value: true })
  customFields.push({ id: CF.consentGivenOn, value: Date.now() })

  const accidentMs = toEpochMs(String(body.accidentDate || ''))
  if (accidentMs !== null) customFields.push({ id: CF.dateOfAccident, value: accidentMs })

  // drop_down → the option's uuid, never its label.
  const stateId = STATE_OPTION_IDS[state]
  if (stateId) put(CF.accidentState, stateId)

  // labels → an ARRAY of option uuids. Reps without a confirmed option are left
  // unset here on purpose; the rep tag still carries the attribution.
  const originatorId = rep ? ORIGINATOR_OPTION_IDS[rep] : undefined
  if (originatorId) customFields.push({ id: CF.originator, value: [originatorId] })

  // Out-of-state intake fields — the same ones the ClickUp "Out of State Lead Form"
  // fills. Every one of them is also written into the task description above.
  if (outOfState) {
    put(CF.hospital, oos.hospital.replace(/\s*\n+\s*/g, ', ')) // short_text: single line
    put(CF.injuries, oos.injuries)
    put(CF.policeReport, oos.policeReport)
    put(CF.address, oos.address)
    put(CF.primaryLanguage, LANGUAGE_OPTION_IDS[oos.language])
    put(CF.additionalInfo, oos.additionalInfo)
  }

  const createTask = (fields: typeof customFields) =>
    $fetch<{ id?: string; url?: string }>(`${CLICKUP_API}/list/${clickupListId}/task`, {
      method: 'POST',
      headers: { Authorization: clickupToken, 'Content-Type': 'application/json' },
      body: {
        // Task title is just the lead's name — phone, rep and everything else
        // are in the description and the tags.
        name,
        // The description is written in markdown. Sent as plain `description`, ClickUp
        // showed the ** literally; `markdown_content` renders it (and takes precedence).
        description,
        markdown_content: description,
        tags,
        custom_fields: fields,
      },
    }).catch((err: any) => {
      console.error('[callback-lead] ClickUp task creation failed:', err?.data ?? err?.message ?? err)
      return null
    })

  // ClickUp validates phone/email values and rejects the WHOLE task over one it
  // doesn't like (e.g. a mistyped number). Never lose the lead to that: retry once
  // without those fields — the raw values are still in the description.
  const STRICT = new Set<string>([CF.phone, CF.email])
  let task = await createTask(customFields)
  if (!task?.id && customFields.some((f) => STRICT.has(f.id))) {
    task = await createTask(customFields.filter((f) => !STRICT.has(f.id)))
  }

  if (!task?.id) {
    setResponseStatus(event, 502)
    return { ok: false, error: 'clickup-failed' }
  }

  return {
    ok: true,
    taskId: task.id,
    url: task.url,
    tags,
    // Lets the browser upload the out-of-state attachments to THIS task only.
    ...(outOfState ? { attachmentToken: issueAttachmentToken(clickupToken, task.id) } : {}),
  }
})
