/**
 * Render a small, safe subset of inline markdown (**bold**, *italic*) to HTML.
 * HTML is escaped first, so it is safe to use with v-html on CMS-authored copy
 * like hero subheads where a phrase needs emphasis.
 */
export function renderInlineMarkdown(input?: string | null): string {
  if (!input) return ''
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
