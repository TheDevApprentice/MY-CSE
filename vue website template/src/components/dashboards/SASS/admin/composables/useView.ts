// components/dashboards/SASS/admin/composables/useView.ts
import { ref, nextTick, watch, onMounted, computed } from "vue";
import gsap from "gsap";
import { useRoute } from "vue-router";
import { AdminNavigationItem, AdminView, UseAdminViewReturn } from "../types";
import { useAdminDashboard } from './index';

/**
 * Composable pour la gestion des vues du dashboard admin
 */
export function useView(views: AdminView[]): UseAdminViewReturn {
  const route = useRoute();
  const { loading } = useAdminDashboard();
  // State
  const currentView = ref<AdminView>(views[0]);
  const isAnimating = ref(false);

  // Navigation items
  const navigationItems = ref<AdminNavigationItem[]>([
    {
      name: "home",
      label: "Accueil",
      path: "/dashboard/sass/admin/home",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v3m0 0h2m0 0h2m0-2h2m0 0l2-2m0 0l2 2m7-2a2 2 0 012 2h4a2 2 0 012-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 01-2 2h-1a2 2 0 01-2-2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"/>',
    },
    {
      name: "clients",
      label: "Clients",
      path: "/dashboard/sass/admin/clients",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>',
    },
    {
      name: "billing",
      label: "Factures",
      path: "/dashboard/sass/admin/billing",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
    },
    {
      name: "support",
      label: "Support",
      path: "/dashboard/sass/admin/support",
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 0v4m0 12v-4m10-6h-4M6 12H2"/>',
    },
    // {
    //   name: "configuration",
    //   label: "Configuration",
    //   path: "/dashboard/sass/admin/configuration",
    //   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    // },
  ]);

  // Configuration des animations
  const animationConfig = {
    viewTransition: {
      duration: 0.3,
      ease: "power2.inOut",
      stagger: 0.05,
    },
    modalTransition: {
      duration: 0.2,
      ease: "back.out(1.7)",
    },
  };

  // Animations
  const animateViewEnter = (el: HTMLElement): void => {
    isAnimating.value = true;

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: animationConfig.viewTransition.duration,
        ease: animationConfig.viewTransition.ease,
        onComplete: () => {
          isAnimating.value = false;
        },
      }
    );
  };

  const animateViewExit = (el: HTMLElement, onComplete?: () => void): void => {
    isAnimating.value = true;

    gsap.to(el, {
      opacity: 0,
      y: -20,
      duration: animationConfig.viewTransition.duration,
      ease: animationConfig.viewTransition.ease,
      onComplete: () => {
        isAnimating.value = false;
        onComplete?.();
      },
    });
  };

  const animateModalEnter = (el: HTMLElement): void => {
    gsap.fromTo(
      el,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: animationConfig.modalTransition.duration,
        ease: animationConfig.modalTransition.ease,
      }
    );
  };

  const animateModalExit = (el: HTMLElement): void => {
    gsap.to(el, {
      scale: 0.95,
      opacity: 0,
      duration: animationConfig.modalTransition.duration,
      ease: animationConfig.modalTransition.ease,
    });
  };

  // Computed
  const activeView = computed<AdminView | undefined>(() => {
    return views.find((view) => view === currentView.value);
  });

  // Methods
  const setView = async (viewName: AdminView): Promise<void> => {
    if (currentView.value === viewName || isAnimating.value) return;

    loading.value = true;
    await nextTick();

    currentView.value = viewName;
    loading.value = false;
  };

  const isActiveView = (viewName: AdminView): boolean => {
    return currentView.value === viewName;
  };

  // Lifecycle
  onMounted(() => {});

  // Watch route changes
  watch(
    () => route.name,
    (newRouteName) => {
      if (typeof newRouteName === 'string' && views.some((view) => view === newRouteName)) {
        currentView.value = newRouteName as AdminView;
      }
    },
    { immediate: true }
  );

  return {
    currentView,
    activeView,
    loading,
    isAnimating,
    navigationItems,
    setView,
    isActiveView,
    animateViewEnter,
    animateViewExit,
    animateModalEnter,
    animateModalExit,
  };
}

export type UseViewReturn = ReturnType<typeof useView>;
