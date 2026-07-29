/**
 * Verifies a Cloudflare Turnstile token server-side, using our own secret.
 *
 * Turnstile is deliberately decoupled from Web3Forms: their free plan rejects any
 * submission containing a `cf-turnstile-response` field ("Pro feature"), so the
 * browser verifies here FIRST and only then posts the form to Web3Forms without it.
 *
 * Returns { ok: true } when the token is valid — or when no secret is configured,
 * so forms keep working in environments without Turnstile set up.
 */
export default defineEventHandler(async (event) => {
  const { token } = await readBody<{ token?: string }>(event) || {}
  const { turnstileSecret } = useRuntimeConfig()

  // No secret configured (local/dev without keys) → don't block submissions.
  if (!turnstileSecret) return { ok: true, skipped: true }

  if (!token) {
    setResponseStatus(event, 400)
    return { ok: false, error: 'missing-token' }
  }

  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || ''

  const result = await $fetch<{ success: boolean; 'error-codes'?: string[] }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    },
  ).catch(() => null)

  if (!result?.success) {
    setResponseStatus(event, 400)
    return { ok: false, error: result?.['error-codes']?.join(',') || 'verification-failed' }
  }

  return { ok: true }
})
