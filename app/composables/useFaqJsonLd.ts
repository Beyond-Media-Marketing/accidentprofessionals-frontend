interface FaqItem {
  question?: string | null
  answer?: string | null
}

/**
 * Emit FAQPage JSON-LD from a list of Q&As — targets Google's "People Also Ask".
 * Pass a getter so it stays reactive after the page data resolves.
 */
export function useFaqJsonLd(itemsGetter: () => FaqItem[] | null | undefined) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => {
          const items = (itemsGetter() ?? []).filter((i) => i.question && i.answer)
          if (!items.length) return ''
          return JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((i) => ({
              '@type': 'Question',
              name: i.question,
              acceptedAnswer: { '@type': 'Answer', text: i.answer },
            })),
          })
        }),
      },
    ],
  })
}
