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
      // Literal hex (NOT the CSS vars) so Tailwind opacity modifiers work —
      // e.g. text-accent/20, bg-dark/85. With var(--x) holding a hex, Tailwind
      // emits invalid `rgb(#hex / .2)` and the rule is dropped. These mirror the
      // exact values in app/assets/scss/_tokens.scss (legacy SCSS keeps the vars).
      colors: {
        accent: '#f3af00',
        'accent-light': '#f8edd4',
        'accent-glow': 'rgba(243, 175, 0, 0.2)',
        dark: '#1e1e1e',
        cream: '#f8f6f4',
        muted: '#a8a197',
        'border-subtle': 'rgba(30, 30, 30, 0.05)',
        'on-dark': '#f8f6f4',
      },
      fontFamily: {
        primary: ['Fira Sans', 'sans-serif'],
        secondary: ['DM Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
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
