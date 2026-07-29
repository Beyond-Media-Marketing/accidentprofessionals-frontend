import { ref, onMounted, onUnmounted } from 'vue'

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

// Pending render callbacks — safe for multiple widgets on the same page.
const pendingRenders: Array<() => void> = []
let scriptLoading = false

function ensureScript() {
  if (scriptLoading || document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return
  scriptLoading = true
  window.onTurnstileLoad = () => {
    pendingRenders.forEach((fn) => fn())
    pendingRenders.length = 0
  }
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

/**
 * Cloudflare Turnstile (Managed mode). Returns a reactive token that must be
 * present before a form can submit. If no site key is configured yet, the token
 * is pre-filled with a sentinel so forms still work (server skips verification).
 */
export function useTurnstile(containerId: string) {
  const { turnstileSiteKey } = useRuntimeConfig().public
  const token = ref(turnstileSiteKey ? '' : 'disabled')
  let widgetId = ''

  function renderWidget() {
    const el = document.getElementById(containerId)
    if (!el || !window.turnstile || el.dataset.rendered) return
    el.dataset.rendered = '1'
    widgetId = window.turnstile.render(el, {
      sitekey: turnstileSiteKey,
      callback: (t: string) => {
        token.value = t
      },
      'expired-callback': () => {
        token.value = ''
      },
      'error-callback': () => {
        token.value = ''
      },
      theme: 'light',
    })
  }

  function reset() {
    if (!turnstileSiteKey) return
    token.value = ''
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
  }

  /**
   * Verify the current token on our own server before the form is submitted.
   * Turnstile is kept OUT of the Web3Forms payload — their free plan rejects any
   * submission carrying a `cf-turnstile-response` field as a Pro feature.
   * Resolves true when verification passes (or when Turnstile isn't configured).
   */
  async function verify(): Promise<boolean> {
    if (!turnstileSiteKey) return true
    try {
      const res = await $fetch<{ ok?: boolean }>('/api/verify-captcha', {
        method: 'POST',
        body: { token: token.value },
      })
      return res?.ok === true
    } catch {
      return false
    }
  }

  onMounted(() => {
    if (!turnstileSiteKey) return
    if (window.turnstile) renderWidget()
    else {
      pendingRenders.push(renderWidget)
      ensureScript()
    }
  })

  onUnmounted(() => {
    if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
  })

  return { token, reset, verify }
}
