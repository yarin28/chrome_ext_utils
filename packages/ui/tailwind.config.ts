import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  darkMode: ['class'],
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}', '../../pages/content-ui/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {
      colors: {
        'color-1': 'hsl(var(--color-1))',
        'color-2': 'hsl(var(--color-2))',
        'color-3': 'hsl(var(--color-3))',
        'color-4': 'hsl(var(--color-4))',
        'color-5': 'hsl(var(--color-5))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      keyframes: {
        'aurora-border': {
          '0%, 100%': {
            borderRadius: '37% 29% 27% 27% / 28% 25% 41% 37%',
          },
          '25%': {
            borderRadius: '47% 29% 39% 49% / 61% 19% 66% 26%',
          },
          '50%': {
            borderRadius: '57% 23% 47% 72% / 63% 17% 66% 33%',
          },
          '75%': {
            borderRadius: '28% 49% 29% 100% / 93% 20% 64% 25%',
          },
        },
        'aurora-1': {
          '0%, 100%': {
            top: '0',
            right: '0',
          },
          '50%': {
            top: '50%',
            right: '25%',
          },
          '75%': {
            top: '25%',
            right: '50%',
          },
        },
        'aurora-2': {
          '0%, 100%': {
            top: '0',
            left: '0',
          },
          '60%': {
            top: '75%',
            left: '25%',
          },
          '85%': {
            top: '50%',
            left: '50%',
          },
        },
        'aurora-3': {
          '0%, 100%': {
            bottom: '0',
            left: '0',
          },
          '40%': {
            bottom: '50%',
            left: '25%',
          },
          '65%': {
            bottom: '25%',
            left: '50%',
          },
        },
        'aurora-4': {
          '0%, 100%': {
            bottom: '0',
            right: '0',
          },
          '50%': {
            bottom: '25%',
            right: '40%',
          },
          '90%': {
            bottom: '50%',
            right: '25%',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
});
