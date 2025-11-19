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
        primary: '#3A86FF',
        secondary: '#6C63FF',
        accent: '#FFBE0B',
        background: '#F7F8FA',
        surface: '#FFFFFF',
        text: '#0F172A',
        muted: '#6B7280',
        success: '#16A34A',
        error: '#EF4444',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
