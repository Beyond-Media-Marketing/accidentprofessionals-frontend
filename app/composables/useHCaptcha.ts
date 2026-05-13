import { ref, onMounted, onUnmounted } from 'vue'

const WEB3FORMS_HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2'

declare global {
  interface Window {
    hcaptcha: {
      render: (el: string | HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onHCaptchaLoad?: () => void
  }
}

// Pending render callbacks — safe for multiple widgets on the same page
const pendingRenders: Array<() => void> = []
let scriptLoading = false

function ensureScript() {
  if (scriptLoading || document.querySelector('script[src*="hcaptcha"]')) return
  scriptLoading = true
  window.onHCaptchaLoad = () => {
    pendingRenders.forEach(fn => fn())
    pendingRenders.length = 0
  }
  const script = document.createElement('script')
  script.src = 'https://js.hcaptcha.com/1/api.js?onload=onHCaptchaLoad&render=explicit'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

export function useHCaptcha(containerId: string) {
  const token = ref('')
  let widgetId = ''

  function renderWidget() {
    const el = document.getElementById(containerId)
    if (!el || !window.hcaptcha) return
    widgetId = window.hcaptcha.render(el, {
      sitekey: WEB3FORMS_HCAPTCHA_SITEKEY,
      callback: (t: string) => { token.value = t },
      'expired-callback': () => { token.value = '' },
      'error-callback': () => { token.value = '' },
      theme: 'light',
    })
  }

  function reset() {
    token.value = ''
    if (widgetId && window.hcaptcha) window.hcaptcha.reset(widgetId)
  }

  onMounted(() => {
    if (window.hcaptcha) {
      renderWidget()
    } else {
      pendingRenders.push(renderWidget)
      ensureScript()
    }
  })

  onUnmounted(() => {
    if (widgetId && window.hcaptcha) window.hcaptcha.remove(widgetId)
  })

  return { token, reset }
}
