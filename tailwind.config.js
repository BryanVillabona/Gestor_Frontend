/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // ¡AQUÍ ESTÁ LA OTRA PARTE CLAVE!
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        // Color principal (amarillo)
        "primary": "#FFC107", 
        
        // Color de fondo
        "background-light": "#f6f7f8",
        "background-dark": "#101a22",
        
        // Colores de los otros mockups (Ventas, Clientes)
        "primary-blue": "#1392ec", // El azul
        "success": "#2ecc71",
        "danger": "#e74c3c", // Para eliminar
        "verde-stock": "#28A745", // El verde de "Añadir Stock"

        // Colores de texto
        "text-main": "#111518",
        "text-muted": "#617989",
        "border-light": "#dbe1e6",
      },
      fontFamily: {
        // La fuente "Inter"
        "display": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}