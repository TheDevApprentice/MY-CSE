// tailwind.config.js pour Tailwind CSS v4
export default {
    content: [
      './src/**/*.{vue,js,ts,jsx,tsx}',
      './index.html'
    ],
    
    // Dans Tailwind CSS v4, darkMode n'est plus nécessaire ici
    // Le mode sombre est géré via @variant dans le CSS
    
    theme: {
      extend: {
        // Extensions personnalisées si nécessaire
        colors: {
          // Couleurs personnalisées
        },
        fontFamily: {
          sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        },
        animation: {
          // Animations personnalisées
          'fade-in': 'fadeIn 0.2s ease-in-out',
          'slide-up': 'slideUp 0.3s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(-8px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
      },
    },
    
    plugins: [
      // Plugins personnalisés si nécessaire
    ],
  }