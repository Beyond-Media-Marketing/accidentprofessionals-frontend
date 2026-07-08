/** Flatten a blocks node's text content into a plain string. */
export function blockText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  return (node.children || []).map(blockText).join('')
}

/** Stable id/anchor for a heading, derived from its text. */
export function headingSlug(text: string): string {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Extract H2 headings (with their ids) from an HTML string. */
export function tocFromHtml(html?: string | null): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = []
  const re = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/gis
  let m: RegExpExecArray | null
  while ((m = re.exec(html || ''))) {
    const text = m[2].replace(/<[^>]+>/g, '').trim()
    if (text) out.push({ id: m[1], text })
  }
  return out
}

/** Extract H2 headings (for a table of contents) from blocks content. */
export function extractToc(...blockLists: (any[] | null | undefined)[]): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = []
  for (const blocks of blockLists) {
    for (const b of blocks ?? []) {
      if (b?.type === 'heading' && b.level === 2) {
        const text = blockText(b)
        if (text) out.push({ id: headingSlug(text), text })
      }
    }
  }
  return out
}
