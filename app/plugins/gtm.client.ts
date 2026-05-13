export default defineNuxtPlugin(() => {
  window.addEventListener('load', () => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TQBVGHZX'
    document.head.appendChild(script)
  })
})
