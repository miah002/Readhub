import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF6EA',
        cardBorder: '#F0E4D0',
        cardAlt: '#FDF7EC',
        ink: '#33303E',
        inkSub: '#6E6A7A',
        inkMuted: '#A79883',
        coral: '#F04E37',
        teal: '#29B6A4',
        amber: '#F5A623',
        purple: '#7A6CF0',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
