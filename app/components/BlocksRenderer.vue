<script lang="ts">
import { h, defineComponent, resolveComponent, type VNode } from 'vue'

/**
 * Renders Strapi 5 "blocks" rich-text content (headings, paragraphs, lists,
 * links, images, quotes, inline marks) into styled prose that matches the site.
 */
export default defineComponent({
  name: 'BlocksRenderer',
  props: {
    content: { type: Array as () => any[], default: () => [] },
  },
  setup(props) {
    const { strapiUrl } = useRuntimeConfig().public
    const NuxtLink = resolveComponent('NuxtLink')

    const mediaUrl = (url?: string) =>
      !url ? '' : /^https?:\/\//i.test(url) ? url : `${strapiUrl}${url}`

    const renderText = (node: any): VNode | string => {
      let node2: any = node.text
      if (node.code) node2 = h('code', node2)
      if (node.bold) node2 = h('strong', node2)
      if (node.italic) node2 = h('em', node2)
      if (node.underline) node2 = h('u', node2)
      if (node.strikethrough) node2 = h('s', node2)
      return node2
    }

    const renderChildren = (children: any[] = []): any[] => children.map((c) => renderNode(c))

    const renderNode = (node: any): any => {
      switch (node?.type) {
        case 'text':
          return renderText(node)
        case 'link': {
          const url: string = node.url || '#'
          const internal = url.startsWith('/')
          return internal
            ? h(NuxtLink, { to: url, class: 'blocks-link' }, () => renderChildren(node.children))
            : h('a', { href: url, target: '_blank', rel: 'noopener', class: 'blocks-link' }, renderChildren(node.children))
        }
        case 'paragraph':
          return h('p', renderChildren(node.children))
        case 'heading': {
          const level = node.level || 2
          const id = level === 2 ? headingSlug(blockText(node)) : undefined
          return h(`h${level}`, { id }, renderChildren(node.children))
        }
        case 'list':
          return h(node.format === 'ordered' ? 'ol' : 'ul', renderChildren(node.children))
        case 'list-item':
          return h('li', renderChildren(node.children))
        case 'quote':
          return h('blockquote', renderChildren(node.children))
        case 'code':
          return h('pre', h('code', renderChildren(node.children)))
        case 'image': {
          const src = mediaUrl(node.image?.url)
          return src
            ? h('img', { src, alt: node.image?.alternativeText || '', loading: 'lazy', class: 'blocks-img' })
            : null
        }
        default:
          return node?.children ? renderChildren(node.children) : null
      }
    }

    return () => h('div', { class: 'prose-blocks' }, (props.content || []).map((n) => renderNode(n)))
  },
})
</script>

<style scoped>
.prose-blocks {
  font-family: var(--font-primary);
  color: var(--color-dark);
  font-size: 17px;
  line-height: 1.8;
}
.prose-blocks :deep(h2) {
  font-family: var(--font-secondary);
  font-weight: 700;
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  line-height: 1.25;
  color: var(--color-dark);
  margin: 2.2em 0 0.7em;
  scroll-margin-top: 100px;
}
.prose-blocks :deep(h3) {
  font-family: var(--font-secondary);
  font-weight: 700;
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  color: var(--color-dark);
  margin: 1.8em 0 0.6em;
  scroll-margin-top: 100px;
}
.prose-blocks :deep(h2:first-child),
.prose-blocks :deep(h3:first-child) { margin-top: 0; }
.prose-blocks :deep(p) { margin: 0 0 1.25em; }
.prose-blocks :deep(a.blocks-link),
.prose-blocks :deep(.blocks-link) {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.prose-blocks :deep(ul),
.prose-blocks :deep(ol) { margin: 0 0 1.4em; padding-left: 1.3em; display: flex; flex-direction: column; gap: 0.5em; }
.prose-blocks :deep(ul) { list-style: none; padding-left: 0; }
.prose-blocks :deep(ul > li) { position: relative; padding-left: 1.9em; }
.prose-blocks :deep(ul > li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}
.prose-blocks :deep(ol) { list-style: decimal; }
.prose-blocks :deep(li) { line-height: 1.7; }
.prose-blocks :deep(strong) { font-weight: 700; color: var(--color-dark); }
.prose-blocks :deep(blockquote) {
  margin: 1.6em 0;
  padding: 0.4em 0 0.4em 1.4em;
  border-left: 3px solid var(--color-accent);
  font-size: 1.15em;
  font-style: italic;
  color: var(--color-dark);
}
.prose-blocks :deep(.blocks-img) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin: 1.8em 0;
}
.prose-blocks :deep(pre) {
  background: #f3f2ef;
  border-radius: 12px;
  padding: 1em 1.2em;
  overflow-x: auto;
  margin: 1.6em 0;
  font-size: 0.9em;
}
.prose-blocks :deep(code) { font-family: monospace; }
</style>
