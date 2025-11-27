import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C61',
          dark: '#E85A2A',
          50: '#FFF4F0',
          100: '#FFE8DD',
          600: '#FF6B35',
          700: '#E85A2A',
        },
        secondary: {
          DEFAULT: '#4CAF50',
          light: '#66BB6A',
          dark: '#388E3C',
        },
        accent: {
          DEFAULT: '#FF5252',
          light: '#FF6E6E',
          dark: '#E63946',
        },
        background: '#FFF8F5',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#2C3E50',
          light: '#5D6D7E',
          muted: '#95A5A6',
        },
        border: {
          DEFAULT: '#F0E6DC',
          light: '#F8F1EA',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#66BB6A',
          dark: '#388E3C',
        },
        error: {
          DEFAULT: '#FF5252',
          light: '#FF6E6E',
          dark: '#E63946',
        },
        warning: {
          DEFAULT: '#FFA726',
          light: '#FFB74D',
          dark: '#F57C00',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
