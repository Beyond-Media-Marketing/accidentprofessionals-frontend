export function useScrollReveal() {
  const { $el } = getCurrentInstance() ?? {}

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const targets = document.querySelectorAll('.reveal')
    targets.forEach((el) => observer.observe(el))

    onUnmounted(() => observer.disconnect())
  })
}

export function useRevealSection(sectionRef: Ref<HTMLElement | null>) {
  onMounted(() => {
    if (!sectionRef.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('is-visible')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(sectionRef.value)
    onUnmounted(() => observer.disconnect())
  })
}
