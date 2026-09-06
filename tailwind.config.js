/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0F1420',
        surface: '#161D2E',
        surface2: '#1D2740',
        lapis: '#2C5F9E',
        lapisdeep: '#173B66',
        gold: '#C9A24B',
        goldbright: '#E0BE6E',
        clay: '#A85C32',
        bone: '#EDE6D6',
        muted: '#8B93A7',
        line: '#2A3350',
      },
      fontFamily: {
        display: ['"Cinzel"', '"Aref Ruqaa"', 'serif'],
        body: ['"Cairo"', 'sans-serif'],
      },
      backgroundImage: {
        'lapis-glow': 'radial-gradient(circle at 30% 20%, rgba(44,95,158,0.35), transparent 60%)',
      },
    },
  },
  plugins: [],
}
