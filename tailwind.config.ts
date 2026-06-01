import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  // Preflight is OFF on purpose: the legacy SCSS pages (auto-accidents,
  // workplace-accidents, premises-liability) rely on app/assets/scss/_reset.scss
  // as the single global reset. Tailwind's Preflight would fight with it and
  // silently restyle those pages. New (Tailwind) pages layer utilities on top
  // of the shared SCSS reset instead.
  corePlugins: {
    preflight: false,
  },
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      // Large-display breakpoints so the whole site fills 27"+ screens
      // instead of stranding content at a narrow max-width.
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      // Single source of truth: these map to the CSS custom properties defined
      // in app/assets/scss/_tokens.scss, so SCSS and Tailwind never drift.
      colors: {
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-glow': 'var(--color-accent-glow)',
        dark: 'var(--color-dark)',
        cream: 'var(--color-cream)',
        muted: 'var(--color-muted)',
        'border-subtle': 'var(--color-border)',
        'on-dark': 'var(--color-text-on-dark)',
      },
      fontFamily: {
        primary: ['Fira Sans', 'sans-serif'],
        secondary: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        button: 'var(--shadow-button)',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
}
