const NAVBAR_HEIGHT = 90

export function useScrollToContact() {
  function scrollToContact() {
    const el = document.getElementById('contact-section')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }
  return { scrollToContact }
}
