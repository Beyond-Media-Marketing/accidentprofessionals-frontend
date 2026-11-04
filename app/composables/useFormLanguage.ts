/**
 * Language helpers shared by the lead/contact forms on the localized site.
 *
 * Submissions always go to the (English-speaking) sales inbox, so the email
 * subject stays English but is tagged `[ES]` and carries a `language` field —
 * the team can see at a glance that the lead should be answered in Spanish.
 */
export function useFormLanguage() {
  const { locale } = useNuxtApp().$i18n
  const isSpanish = computed(() => locale.value === 'es')
  return {
    /** Value for the submission's `language` field. */
    language: computed(() => (isSpanish.value ? 'Spanish' : 'English')),
    /** Email subject, tagged for Spanish leads. */
    subject: (s: string) => (isSpanish.value ? `[ES] ${s}` : s),
  }
}
