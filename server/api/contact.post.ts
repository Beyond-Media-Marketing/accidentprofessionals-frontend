/**
 * Lead-form proxy. The browser posts form data + a Cloudflare Turnstile token
 * here; we verify the token server-side (Web3Forms free plan can't), then forward
 * the submission to Web3Forms using the right access key for the form type.
 *
 * Expected body: { form_id, 'cf-turnstile-response', subject, page, ...fields }
 */
const ATTORNEY_FORMS = ['attorney_application']

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, any>>(event)
  const { 'cf-turnstile-response': token, form_id, ...fields } = body || {}
  const config = useRuntimeConfig()

  // 1. Verify Turnstile — skipped only if no secret is configured yet (dev/pre-setup).
  if (config.turnstileSecret) {
    const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || ''
    const verify = await $fetch<{ success: boolean }>(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({ secret: config.turnstileSecret, response: token || '', remoteip: ip }),
      },
    ).catch(() => ({ success: false }))

    if (!verify?.success) {
      setResponseStatus(event, 400)
      return { success: false, message: 'Verification failed. Please try again.' }
    }
  }

  // 2. Route to the correct Web3Forms inbox by form type (falls back to the single key).
  const accessKey =
    (ATTORNEY_FORMS.includes(form_id) ? config.web3FormsKeyAttorneys : config.web3FormsKeyLeads) ||
    config.public.web3FormsKey

  if (!accessKey) {
    setResponseStatus(event, 500)
    return { success: false, message: 'Form is not configured.' }
  }

  // 3. Forward to Web3Forms.
  const result = await $fetch<{ success: boolean; message?: string }>('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: { access_key: accessKey, form_id, ...fields },
  }).catch(() => ({ success: false, message: 'Could not send. Please try again.' }))

  if (!result?.success) setResponseStatus(event, 502)
  return result
})
