/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#5f6FFF",
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      animation: {
        marquee: 'marquee 10s linear infinite', // Tăng thời gian để hiệu ứng chạy mượt hơn
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
