// composables/useView.ts
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import type {
  ViewType,
  UseEventViewReturn,
} from "@/components/events/types/event";

/**
 * Composable pour la gestion des vues et animations avec support du thème
 */
export function useView(): UseEventViewReturn {
  // État réactif
  const currentView = ref<ViewType>("calendar");
  const loading = ref(false);
  const showFiltersModal = ref(false);
  const isAnimating = ref(false);
  const selectedEvent = ref<Event | null>(null);

  // Refs pour les éléments DOM
  const calendarSection = ref<HTMLElement | null>(null);
  const listSection = ref<HTMLElement | null>(null);
  const gridSection = ref<HTMLElement | null>(null);
  const eventSidebar = ref<HTMLElement | null>(null);

  // Configuration des animations
  const animationConfig = {
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.05,
  };

  // Méthodes principales
  const switchView = async (view: ViewType): Promise<void> => {
    if (currentView.value === view || isAnimating.value) {
      return;
    }

    isAnimating.value = true;

    // Animation de sortie de l'ancienne vue
    await animateViewExit(currentView.value);

    currentView.value = view;
    await nextTick();

    // Animation d'entrée de la nouvelle vue
    await animateViewTransition(view);

    isAnimating.value = false;
  };

  const animateViewExit = async (view: ViewType): Promise<void> => {
    const section = getSectionElement(view);

    if (section) {
      return new Promise<void>((resolve) => {
        gsap.to(section, {
          y: -20,
          opacity: 0,
          scale: 0.98,
          duration: 0.3,
          ease: "power2.in",
          onComplete: resolve,
        });
      });
    }
    return Promise.resolve();
  };

  const animateViewTransition = async (view: ViewType): Promise<void> => {
    const section = getSectionElement(view);

    if (section) {
      return new Promise<void>((resolve) => {
        gsap.fromTo(
          section,
          {
            y: 20,
            opacity: 0,
            scale: 0.98,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: animationConfig.duration,
            ease: animationConfig.ease,
            onComplete: resolve,
          }
        );
      });
    }
    return Promise.resolve();
  };

  const getSectionElement = (view: ViewType): HTMLElement | null => {
    switch (view) {
      case "calendar":
        return calendarSection.value;
      case "list":
        return listSection.value;
      case "grid":
        return gridSection.value;
      default:
        return null;
    }
  };

  // Animations pour les événements
  const animateEventSelection = (eventElement: HTMLElement): Promise<void> => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      tl.to(eventElement, {
        scale: 1.05,
        duration: 0.15,
        ease: "power2.out",
      }).to(eventElement, {
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    });
  };

  // Animation d'ouverture de la sidebar avec réduction du calendrier
  const animateEventSidebar = async (
    isOpening: boolean = true
  ): Promise<void> => {
    const calendar = calendarSection.value;
    const sidebar = eventSidebar.value;

    if (!calendar) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      if (isOpening) {
        // Animation d'ouverture
        tl.to(
          calendar,
          {
            width: "calc(100% - 420px)",
            duration: 0.5,
            ease: "power3.out",
          },
          0
        );

        if (sidebar) {
          tl.fromTo(
            sidebar,
            {
              x: 420,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            0.1
          );
        }
      } else {
        // Animation de fermeture
        if (sidebar) {
          tl.to(
            sidebar,
            {
              x: 420,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
            },
            0
          );
        }

        tl.to(
          calendar,
          {
            width: "100%",
            duration: 0.4,
            ease: "power3.out",
          },
          0.1
        );
      }
    });
  };

  // Gestion des événements sélectionnés
  const selectEvent = async (event: any): Promise<void> => {
    if (selectedEvent.value === event) return;

    selectedEvent.value = event;
    await nextTick();
    await animateEventSidebar(true);
  };

  const closeSidebar = async (): Promise<void> => {
    await animateEventSidebar(false);
    selectedEvent.value = null;
  };

  // Animations d'entrée de page
  const animatePageEntry = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const timeline = gsap.timeline({
        onComplete: resolve,
      });

      // Animation du header avec effet de glissement
      timeline.fromTo(
        ".events-header",
        {
          y: -50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Animation des contrôles avec décalage
      timeline.fromTo(
        ".unified-controls",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Animation du contenu principal
      const currentSection = getSectionElement(currentView.value);
      if (currentSection) {
        timeline.fromTo(
          currentSection,
          {
            y: 30,
            opacity: 0,
            scale: 0.98,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }
    });
  };

  // Animations pour les listes d'événements
  const animateEventCards = (selector: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      gsap.fromTo(
        selector,
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
          rotationX: 5,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.6,
          stagger: animationConfig.stagger,
          ease: "power3.out",
          onComplete: resolve,
        }
      );
    });
  };

  // Animations pour le calendrier
  const animateCalendarDays = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      gsap.fromTo(
        ".calendar-day",
        {
          scale: 0.8,
          opacity: 0,
          y: 10,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.02,
          ease: "power3.out",
          onComplete: resolve,
        }
      );
    });
  };

  // Animation de transition entre mois
  const animateMonthTransition = async (
    direction: "next" | "previous"
  ): Promise<void> => {
    const calendar = document.querySelector(".calendar-days");
    if (!calendar) return;

    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      // Animation de sortie
      tl.to(".calendar-day", {
        x: direction === "next" ? -50 : 50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.01,
        ease: "power2.in",
      });

      // Animation d'entrée
      tl.fromTo(
        ".calendar-day",
        {
          x: direction === "next" ? 50 : -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.02,
          ease: "power3.out",
        }
      );
    });
  };

  // Gestion des modales avec animations améliorées
  const openFiltersModal = (): void => {
    showFiltersModal.value = true;

    nextTick(() => {
      const modal = document.querySelector(".modal-content");
      const backdrop = document.querySelector(".modal-backdrop");

      const tl = gsap.timeline();

      if (backdrop) {
        tl.fromTo(
          backdrop,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.3,
          },
          0
        );
      }

      if (modal) {
        tl.fromTo(
          modal,
          {
            scale: 0.9,
            opacity: 0,
            y: 30,
            rotationX: -10,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          0.1
        );
      }
    });
  };

  const closeFiltersModal = (): void => {
    const modal = document.querySelector(".modal-content");
    const backdrop = document.querySelector(".modal-backdrop");

    const tl = gsap.timeline({
      onComplete: () => {
        showFiltersModal.value = false;
      },
    });

    if (modal) {
      tl.to(
        modal,
        {
          scale: 0.9,
          opacity: 0,
          y: 30,
          rotationX: -10,
          duration: 0.2,
          ease: "power2.in",
        },
        0
      );
    }

    if (backdrop) {
      tl.to(
        backdrop,
        {
          opacity: 0,
          duration: 0.3,
        },
        0
      );
    }
  };

  // Utilitaires
  const isCurrentView = (view: ViewType): boolean => {
    return currentView.value === view;
  };

  const getViewLabel = (view: ViewType): string => {
    const labels = {
      calendar: "Calendrier",
      list: "Liste",
      grid: "Grille",
    };
    return labels[view];
  };

  const setLoading = (state: boolean): void => {
    loading.value = state;
  };

  // Gestion responsive
  const isMobile = ref(false);
  const isTablet = ref(false);

  const updateResponsiveState = (): void => {
    const width = window.innerWidth;
    isMobile.value = width < 768;
    isTablet.value = width >= 768 && width < 1024;

    // Adapter les animations selon la taille d'écran
    if (isMobile.value) {
      animationConfig.duration = 0.3;
      animationConfig.stagger = 0.03;
    } else {
      animationConfig.duration = 0.5;
      animationConfig.stagger = 0.05;
    }
  };

  // Gestion des événements clavier
  const handleKeyboard = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && selectedEvent.value) {
      closeSidebar();
    }

    if (event.key === "Tab" && selectedEvent.value) {
      // Gérer la navigation au clavier dans la sidebar
      const sidebar = eventSidebar.value;
      if (sidebar) {
        const focusableElements = sidebar.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[
            focusableElements.length - 1
          ] as HTMLElement;

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    }
  };

  // Initialisation
  const initView = async (): Promise<void> => {
    updateResponsiveState();

    // Écouter les changements de taille d'écran
    window.addEventListener("resize", updateResponsiveState);
    window.addEventListener("keydown", handleKeyboard);

    // Animation d'entrée
    await nextTick();
    await animatePageEntry();
  };

  // Nettoyage
  const cleanupView = (): void => {
    window.removeEventListener("resize", updateResponsiveState);
    window.removeEventListener("keydown", handleKeyboard);

    // Nettoyer les animations GSAP
    gsap.killTweensOf("*");
  };

  // Préférences utilisateur
  const saveViewPreference = (view: ViewType): void => {
    try {
      localStorage.setItem("preferred-view", view);
    } catch (error) {
      console.warn("Impossible de sauvegarder la préférence de vue:", error);
    }
  };

  const loadViewPreference = (): ViewType => {
    try {
      const saved = localStorage.getItem("preferred-view") as ViewType;
      return saved && ["calendar", "list", "grid"].includes(saved)
        ? saved
        : "calendar";
    } catch (error) {
      console.warn("Impossible de charger la préférence de vue:", error);
      return "calendar";
    }
  };

  // Watch pour sauvegarder automatiquement
  watch(currentView, (newView) => {
    saveViewPreference(newView);
  });

  // Lifecycle hooks
  onMounted(initView);
  onUnmounted(cleanupView);

  return {
    // État
    currentView,
    loading,
    showFiltersModal,
    isAnimating,
    isMobile,
    isTablet,
    selectedEvent,

    // Refs DOM
    calendarSection,
    listSection,
    gridSection,
    eventSidebar,

    // Méthodes principales
    switchView,
    setLoading,
    selectEvent,
    closeSidebar,

    // Animations
    animateEventSelection,
    animateEventSidebar,
    animatePageEntry,
    animateEventCards,
    animateCalendarDays,
    animateMonthTransition,

    // Modales
    openFiltersModal,
    closeFiltersModal,

    // Utilitaires
    isCurrentView,
    getViewLabel,
    updateResponsiveState,

    // Lifecycle
    initView,
    cleanupView,

    // Préférences
    saveViewPreference,
    loadViewPreference,
  };
}
