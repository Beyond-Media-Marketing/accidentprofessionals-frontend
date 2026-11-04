/** `localizeHref` bound to the current locale — use for every internal link. */
export function useLocaleHref() {
  const { locale } = useNuxtApp().$i18n
  return <T extends string | null | undefined>(href: T): T => localizeHref(href, locale.value)
}
