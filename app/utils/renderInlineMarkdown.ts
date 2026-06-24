/**
 * Render a small, safe subset of inline markdown to HTML:
 *   **bold**, *italic*, [text](href) links, and line breaks.
 * HTML is escaped first, so it is safe to use with v-html on CMS-authored
 * rich-text fields (e.g. the hero description, where editors add internal links).
 */
export function renderInlineMarkdown(input?: string | null): string {
  if (!input) return ''
  let s = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Links: [label](href) — open external (http) links in a new tab.
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const safeHref = String(href).replace(/"/g, '%22')
    const external = /^https?:\/\//i.test(href)
    const attrs = external ? ' target="_blank" rel="noopener"' : ''
    return `<a href="${safeHref}"${attrs}>${label}</a>`
  })

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(/\n/g, '<br>')
  return s
}
