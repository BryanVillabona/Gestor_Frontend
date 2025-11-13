/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // AÑADE TODO ESTE BLOQUE "theme" Y "darkMode"
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        "primary": "#FFC107", // El amarillo de los mockups
        "background-light": "#f6f7f8",
        "background-dark": "#101a22",
        "primary-blue": "#1392ec", // El azul de otros mockups
        "success": "#2ecc71",
        "danger": "#e74c3c", 
        "verde-stock": "#28A745", // Verde del botón de stock
        "text-main": "#111518",
        "text-muted": "#617989",
        "border-light": "#dbe1e6",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"] // La fuente de los mockups
      }
    },
  },
  plugins: [],
}