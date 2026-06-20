import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ea2804',
        'primary-deep': '#c01f00',
        'on-primary': '#ffffff',
        ink: '#202020',
        body: '#3a3a3a',
        charcoal: '#575757',
        mute: '#646464',
        ash: '#8d8d8d',
        stone: '#bbbbbb',
        'on-dark': '#fcfcfc',
        'on-dark-mute': 'rgba(252,252,252,0.72)',
        canvas: '#f9f7f3',
        'surface-bone': '#f3f0e8',
        'surface-card': '#ffffff',
        'surface-dark': '#202020',
        'surface-deep': '#000000',
        hairline: 'rgba(32,32,32,0.12)',
        'hairline-strong': '#202020',
        'divider-dark': 'rgba(255,255,255,0.2)',
        'hero-warm': '#ea2804',
        'hero-glow': '#ff6a3d',
        'hero-pink': '#f4a8a0',
        'badge-success': '#2b9a66',
        gold: '#d4a24e',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arab: ['Amiri', '"Noto Naskh Arabic"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        'drop-soft': '0 8px 24px rgba(32,32,32,0.08)',
        'drop-card': '0 2px 8px rgba(32,32,32,0.06)',
      },
      maxWidth: {
        app: '460px',
        content: '1280px',
      },
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        xxxl: '48px',
        section: '96px',
        band: '160px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
