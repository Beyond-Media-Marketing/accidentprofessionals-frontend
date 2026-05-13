import { ref, onMounted, onUnmounted } from 'vue'

declare global {
  interface Window {
    turnstile: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export function useTurnstile(containerId: string) {
  const token = ref('')
  const config = useRuntimeConfig()
  let widgetId = ''

  function renderWidget() {
    const el = document.getElementById(containerId)
    if (!el || !window.turnstile || !config.public.turnstileSiteKey) return
    widgetId = window.turnstile.render(el, {
      sitekey: config.public.turnstileSiteKey,
      callback: (t: string) => { token.value = t },
      'expired-callback': () => { token.value = '' },
      'error-callback': () => { token.value = '' },
      theme: 'auto',
    })
  }

  function reset() {
    token.value = ''
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
  }

  onMounted(() => {
    if (!config.public.turnstileSiteKey) return
    if (window.turnstile) {
      renderWidget()
    } else {
      window.onTurnstileLoad = renderWidget
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })

  onUnmounted(() => {
    if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
  })

  return { token, reset }
}
