import { ref, computed, onMounted, onUnmounted } from "vue";

const THEME_KEY = "data-theme";
const prefersDark =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Appliquer la classe dark au root pour Tailwind CSS v4
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  } else if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.remove("dark");
    root.classList.add(prefersDark ? "dark" : "light");
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  // Forcer un repaint pour s'assurer que les styles s'appliquent immédiatement
  root.style.colorScheme = theme;

  // 🎯 NOUVEAU : Forcer le re-calcul des styles
  if (typeof window !== "undefined") {
    window.getComputedStyle(root).getPropertyValue("color-scheme");
  }

  // Debug log
  if (import.meta.env.DEV) {
    console.log(`🌙 Theme applied: ${theme}`);
    console.log("📋 Classes on html:", root.classList.toString());
    console.log("🎨 Color scheme:", root.style.colorScheme);
  }
}

// État réactif pour le thème
const theme = ref<ThemeMode>(
  (typeof localStorage !== "undefined"
    ? (localStorage.getItem(THEME_KEY) as ThemeMode)
    : null) || (prefersDark ? "dark" : "light")
);

// Applique le thème et sauvegarde la préférence
function setTheme(value: ThemeMode) {
  theme.value = value;
  applyTheme(value);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(THEME_KEY, value);
  }
}

// Bascule entre les thèmes clair/sombre
function toggleTheme() {
  const newTheme = theme.value === "dark" ? "light" : "dark";
  setTheme(newTheme);

  // 🎯 NOUVEAU : Debug pour vérifier le changement
  if (import.meta.env.DEV) {
    setTimeout(() => {
      const testElement = document.querySelector(
        ".dark\\:text-gray-200, .dark\\:bg-gray-900"
      );
      if (testElement) {
        const styles = window.getComputedStyle(testElement);
        console.log("🧪 Test element styles after toggle:", {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        });
      }
    }, 100);
  }
}

// Hook principal
export function useTheme() {
  onMounted(() => {
    // 🎯 CRITIQUE : Appliquer le thème immédiatement au montage
    applyTheme(theme.value);

    // Écouter les changements de préférence système
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        // Seulement changer si l'utilisateur n'a pas de préférence sauvegardée
        if (!localStorage.getItem(THEME_KEY)) {
          setTheme(e.matches ? "dark" : "light");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      // Surveiller les changements de préférence système
      // const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      // mediaQuery.addEventListener("change", (e) => {
      //   if (theme.value === "system") {
      //     setTheme("system");
      //   }
      // });
      // Nettoyage
      onUnmounted(() => {
        mediaQuery.removeEventListener("change", handleChange);
      });
    }
  });

  return {
    // État
    theme,
    isDark: computed(() => theme.value === "dark"),

    // Méthodes
    toggleTheme,
    setTheme,

    // Classes utilitaires pour les composants qui en ont encore besoin
    themeClasses: computed(() => ({
      "transition-colors duration-300": true,
      dark: theme.value === "dark",
    })),

    // Styles pour les composants legacy
    glassEffect: computed(() => ({
      background:
        theme.value === "dark"
          ? "rgba(10, 10, 20, 0.8)"
          : "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(12px)",
      border:
        theme.value === "dark"
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(255, 255, 255, 0.22)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    })),
  };
}

export type ThemeMode = "light" | "dark" | "system";
