/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1E3A8A',
          dark: '#0F172A',
          light: '#1E40AF',
        },
        blue: {
          bright: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        orange: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        },
        offwhite: '#F8FAFC',
        gray: {
          dark: '#1E293B',
          mid: '#64748B',
          light: '#E2E8F0',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        green: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          50: '#F0FDF4',
        },
        red: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          50: '#FEF2F2',
        },
        purple: {
          DEFAULT: '#7C3AED',
          light: '#F3E8FF',
        },
        yellow: {
          DEFAULT: '#EAB308',
          light: '#FEF9C3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'md': ['15px', { lineHeight: '1.6' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['18px', { lineHeight: '1.4' }],
        '2xl': ['20px', { lineHeight: '1.3' }],
        '3xl': ['24px', { lineHeight: '1.3' }],
        '4xl': ['28px', { lineHeight: '1.2' }],
        '5xl': ['32px', { lineHeight: '1.1' }],
        '6xl': ['36px', { lineHeight: '1.1' }],
        '7xl': ['40px', { lineHeight: '1.1' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.14)',
        'nav': '0 1px 4px rgba(0,0,0,0.08)',
        'nav-scroll': '0 2px 12px rgba(0,0,0,0.15)',
        'modal': '0 16px 48px rgba(0,0,0,0.2)',
      },
      maxWidth: {
        'container': '1280px',
      },
      animation: {
        'pulse-skeleton': 'pulse-skeleton 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease',
        'fade-in': 'fade-in 0.2s ease',
        'scale-in': 'scale-in 0.2s ease',
        'count-up': 'count-up 2s ease-out',
      },
      keyframes: {
        'pulse-skeleton': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
