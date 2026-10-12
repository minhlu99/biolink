/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06080d',
          900: '#0b0f19',
          800: '#111827',
          700: '#1f293d',
        },
        brand: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#8a2be2',
        },
      },
      animation: {
        'aurora-1': 'auroraOne 14s ease-in-out infinite alternate',
        'aurora-2': 'auroraTwo 18s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        auroraOne: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, 40px) scale(1.15)' },
        },
        auroraTwo: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(-40px, -30px) scale(1.2)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
