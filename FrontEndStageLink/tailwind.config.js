/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935', // Rouge vif
          light: '#FF6F60',
          dark: '#AB000D',
        },
        success: {
          DEFAULT: '#16a34a', // Vert Tailwind 600
          dark: '#166534',
        },
        accent: {
          DEFAULT: '#2563eb', // Bleu moderne (Tailwind blue-600)
          dark: '#1d4ed8',
        },
        // Les gris natifs Tailwind sont conservés
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
