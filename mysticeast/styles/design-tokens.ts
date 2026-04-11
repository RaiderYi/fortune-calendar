// MysticEast Design Tokens
// Fusion Style: Eastern Minimalism + Western Wellness

export const colors = {
  // Primary - Deep Indigo (Spiritual, Trustworthy)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2D1B4E',  // Brand Primary
  },
  
  // Gold - Prosperity, Premium
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#C9A227',  // Brand Gold
  },
  
  // Jade - Growth, Healing
  jade: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#00A86B',  // Brand Jade
  },
  
  // Neutral - Warm, Natural
  neutral: {
    50: '#F5F1E8',   // Cream Background
    100: '#ebe7dd',
    200: '#ddd9cf',
    300: '#c4c0b5',
    400: '#a29e93',
    500: '#858175',
    600: '#6b675d',
    700: '#56524a',
    800: '#49463f',
    900: '#2C2C2C',  // Main Text
    950: '#1a1917',
  },
  
  // Five Elements
  elements: {
    wood: '#228B22',
    fire: '#DC143C',
    earth: '#D2691E',
    metal: '#71717a',
    water: '#1E3A5F',
  }
} as const;

export const typography = {
  fontFamily: {
    serif: ['Cormorant Garamond', 'Georgia', 'serif'],
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    display: ['Cormorant Garamond', 'serif'],
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const effects = {
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    gold: '0 0 20px rgba(201, 162, 39, 0.3)',
    crystal: '0 8px 32px rgba(45, 27, 78, 0.1)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

export const surfaces = {
  pageGradient: 'linear-gradient(135deg, rgba(245,241,232,1) 0%, rgba(245,241,232,1) 55%, rgba(245,243,255,0.48) 100%)',
  cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.62) 100%)',
  darkSectionGradient: 'linear-gradient(145deg, #2D1B4E 0%, #3a2266 55%, #2D1B4E 100%)',
} as const;

export const semantic = {
  focusRing: colors.primary[400],
  focusRingSoft: 'rgba(167, 139, 250, 0.32)',
  borderSoft: 'rgba(221, 214, 254, 0.65)',
  textMuted: 'rgba(44, 44, 44, 0.68)',
} as const;

// Animation presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  crystalShimmer: {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
  }
} as const;
