import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0D0509', // background utama (hitam undertone maroon)
          900: '#18090F', // surface / card
          800: '#261019', // surface elevated / border subtle
        },
        rose: {
          600: '#C2185B', // aksen utama (CTA)
          400: '#E91E8C', // aksen terang (highlight / glow / active)
        },
        gold: {
          400: '#D4A24E', // KHUSUS Arab, dalil, elemen sakral
        },
        parchment: {
          100: '#F5EDE4', // teks utama di atas background gelap
        },
        mute: {
          500: '#9C8089', // teks sekunder, dusty rose-grey
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arab: ['Amiri', '"Noto Naskh Arabic"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(233,30,140,0.25), 0 0 32px -8px rgba(233,30,140,0.45)',
        'glow-soft': '0 0 40px -12px rgba(233,30,140,0.35)',
      },
      maxWidth: {
        app: '460px',
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
