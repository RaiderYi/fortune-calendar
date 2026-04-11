import type { Config } from 'tailwindcss';
import { colors, effects, typography } from './styles/design-tokens';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        gold: colors.gold,
        jade: colors.jade,
        cream: colors.neutral[50],
        charcoal: colors.neutral[900],
        element: {
          wood: colors.elements.wood,
          fire: colors.elements.fire,
          earth: colors.elements.earth,
          metal: colors.elements.metal,
          water: colors.elements.water,
        },
      },
      fontFamily: {
        serif: [...typography.fontFamily.serif],
        sans: [...typography.fontFamily.sans],
        display: [...typography.fontFamily.display],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'gold': effects.shadow.gold,
        'crystal': effects.shadow.crystal,
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #C9A227 0%, #d4af37 50%, #C9A227 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
