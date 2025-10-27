import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { secureRouteParams } from "@/stores/security/security";

// ===== IMPORTS DYNAMIQUES =====
// Groupes de routes pour le code splitting
const views = {
  // Vues publiques
  Home: () => import("@views/HomeView.vue"),
  Auth: () => import("@views/AuthView.vue"),
  Service: () => import("@views/ServiceView.vue"),
  ServiceDetail: () => import("@views/ServiceDetailView.vue"),
  News: () => import("@views/NewsView.vue"),
  Events: () => import("@views/EventView.vue"),

  // Tableaux de bord SASS
  SASSAdminDashboard: () =>
    import("@/components/dashboards/SASS/admin/adminDashboard.vue"),
  SASSAdminHome: () =>
    import("@/components/dashboards/SASS/admin/views/HomeView.vue"),
  SASSAdminClients: () =>
    import("@/components/dashboards/SASS/admin/views/clients/ClientsView.vue"),
  SASSAdminBilling: () =>
    import("@/components/dashboards/SASS/admin/views/billing/BillingsView.vue"),
  SASSAdminConfig: () =>
    import(
      "@/components/dashboards/SASS/admin/views/configuration/ConfiguratorView.vue"
    ),
  SASSAdminAnalytics: () =>
    import(
      "@/components/dashboards/SASS/admin/views/analytics/AnalyticsView.vue"
    ),
  SASSAdminSupport: () =>
    import("@/components/dashboards/SASS/admin/views/support/SupportView.vue"),

  // Tableaux de bord CSE
  CSEMemberDashboard: () =>
    import("@/components/dashboards/CSE/member/CSEMemberDashboard.vue"),
  CSEMemberEvents: () =>
    import("@/components/dashboards/CSE/member/views/events/CalendarView.vue"),
  CSEMemberNews: () =>
    import("@/components/dashboards/CSE/member/views/news/CalendarView.vue"),
  CSEMemberSuppliers: () =>
    import(
      "@/components/dashboards/CSE/member/views/suppliers/SuppliersView.vue"
    ),

  // Autres vues
  TestView: () => import("@/components/common/TestUIView.vue"),
  NotFound: () => import("@/views/404-not-found.vue"),
} as const;

type ViewKey = keyof typeof views;

// ===== DÉFINITION DES ROUTES =====
// Routes publiques (accessibles sans authentification)
const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: views.Home,
    meta: {
      title: "Tableau de bord",
      breadcrumb: "Accueil",
      transition: "route-slide",
      requiresAuth: false,
      preload: ["Events", "News", "Auth", "Service"],
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: views.Auth,
    meta: {
      transition: "route-security-fade",
      requiresAuth: false,
    },
  },
  {
    path: "/services",
    name: "services",
    component: views.Service,
    meta: {
      preload: ["service-detail"],
      transition: "route-depth-slide",
      requiresAuth: false,
    },
  },
  {
    path: "/services/:name",
    name: "service-detail",
    component: views.ServiceDetail,
    meta: {
      transition: "route-depth-slide",
      requiresAuth: false,
    },
  },
  {
    path: "/news",
    name: "News",
    component: views.News,
    meta: {
      transition: "route-fade-elegant",
      requiresAuth: false,
    },
  },
  {
    path: "/events",
    name: "Events",
    component: views.Events,
    meta: {
      transition: "route-bounce-modern",
      requiresAuth: false,
    },
  },
];

// Routes privées (nécessitent une authentification)
const privateRoutes: RouteRecordRaw[] = [
  // Tableau de bord admin SASS
  {
    path: "/dashboard/sass/admin",
    name: "SASSAdminDashboard",
    redirect: "/dashboard/sass/admin/home",
    component: views.SASSAdminDashboard,
    meta: {
      transition: "route-slide",
      requiresAuth: true,
      roles: ["admin"],
      preload: [
        "SASSAdminHome",
        "SASSAdminClients",
        "SASSAdminBilling",
        "SASSAdminConfig",
        "SASSAdminSupport",
        "SASSAdminAnalytics",
      ],
    },
    children: [
      {
        path: "home",
        name: "SASSAdminHome",
        component: views.SASSAdminHome,
        meta: {
          title: "Tableau de bord",
          breadcrumb: "Accueil",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "clients",
        name: "SASSAdminClients",
        component: views.SASSAdminClients,
        meta: {
          breadcrumb: "Clients",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "billing",
        name: "SASSAdminBilling",
        component: views.SASSAdminBilling,
        meta: {
          breadcrumb: "Facturation",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "configuration",
        name: "SASSAdminConfig",
        component: views.SASSAdminConfig,
        meta: {
          breadcrumb: "Configuration",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "analytics",
        name: "SASSAdminAnalytics",
        component: views.SASSAdminAnalytics,
        meta: {
          breadcrumb: "Analytics",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "support",
        name: "SASSAdminSupport",
        component: views.SASSAdminSupport,
        meta: {
          breadcrumb: "Support",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
    ],
  },

  // Tableau de bord membre CSE
  {
    path: "/dashboard/cse/member",
    name: "CSEMemberDashboard",
    redirect: "/dashboard/cse/member/events",
    component: views.CSEMemberDashboard,
    meta: {
      requiresAuth: true,
      roles: ["csemember"],
      breadcrumb: "Tableau de bord",
      preload: ["CSEMemberEvents", "CSEMemberNews", "CSEMemberSuppliers"],
    },
    children: [
      {
        path: "events",
        name: "CSEMemberEvents",
        component: views.CSEMemberEvents,
        meta: {
          requiresAuth: true,
          breadcrumb: "Événements",
        },
      },
      {
        path: "news",
        name: "CSEMemberNews",
        component: views.CSEMemberNews,
        meta: {
          requiresAuth: true,
          breadcrumb: "Actualités",
        },
      },
      {
        path: "suppliers",
        name: "CSEMemberSuppliers",
        component: views.CSEMemberSuppliers,
        meta: {
          requiresAuth: true,
          breadcrumb: "Fournisseurs",
        },
      },
    ],
  },

  // Autres routes privées
  {
    path: "/doc",
    name: "TestView",
    component: views.TestView,
    meta: {
      transition: "route-slide",
      requiresAuth: true,
      breadcrumb: "Documentation",
    },
  },
];

// Route 404 (doit être la dernière)
const notFoundRoute: RouteRecordRaw = {
  path: "/404-not-found",
  name: "NotFound",
  component: views.NotFound,
  meta: {
    title: "Page non trouvée",
  },
};

// Redirection des URLs non trouvées
const redirectNotFoundRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  redirect: "/404-not-found",
};

// Combinaison des routes
const routes = [
  ...publicRoutes,
  ...privateRoutes,
  notFoundRoute,
  redirectNotFoundRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== GESTION DU PRÉCHARGEMENT =====
let preloadTimeout: ReturnType<typeof setTimeout> | null = null;
const preloadedRoutes = new Set<ViewKey>();

/**
 * Préchage intelligent des composants de route
 */
const preloadRoute = (routeName: ViewKey) => {
  // Vérifier si le composant est déjà chargé ou n'existe pas
  if (preloadedRoutes.has(routeName) || !views[routeName]) return;

  // Marquer comme en cours de chargement
  preloadedRoutes.add(routeName);

  // Charger le composant
  views[routeName]().catch((error) => {
    console.warn(`Échec du préchargement de la route ${routeName}:`, error);
    preloadedRoutes.delete(routeName); // Permettre une nouvelle tentative
  });
};

/**
 * Préchage en arrière-plan des routes enfants
 */
const preloadChildRoutes = (routeNames: ViewKey[]) => {
  if (preloadTimeout) clearTimeout(preloadTimeout);

  // Utiliser un délai pour éviter de bloquer la navigation principale
  preloadTimeout = setTimeout(() => {
    routeNames.forEach((routeName) => preloadRoute(routeName));
  }, 100);
};

// ===== GARDIENS DE NAVIGATION =====
// import { useAuthStore } from '@/stores/authStore';

// /**
//  * Gardien de navigation principal
//  */
// router.beforeEach((to, from, next) => {
//   // const authStore = useAuthStore();

//   // Vérification de l'authentification
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({ name: 'Auth' });
//     return;
//   }

//   // Vérification des rôles
//   if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
//     next({ name: 'Home' });
//     return;
//   }

//   // Si tout est OK, continuer la navigation
//   next();
// });

// /**
//  * Après chaque navigation
//  */
// router.afterEach((to) => {
//   // Remonter en haut de page
//   if (typeof window !== "undefined") {
//     window.requestAnimationFrame(() => {
//       window.scrollTo({
//         top: 0,
//         behavior: to.meta?.scrollBehavior || "smooth",
//       });
//     });
//   }

//   // Enregistrement de la navigation pour les analyses
//   if (process.env.NODE_ENV === "production") {
//     // Exemple: Envoyer des données d'analyse
//     console.log(`Navigation vers: ${to.fullPath}`);
//   }
// });

/**
 * Gardien de navigation principal
 */
router.beforeEach(async (to, from, next) => {
  try {
    // Vérification de la sécurité des paramètres de route
    secureRouteParams(to, from, next);

    // Préchargement des routes enfants si spécifié
    if (to.meta?.preload && Array.isArray(to.meta.preload)) {
      preloadChildRoutes(to.meta.preload as ViewKey[]);
    }

    // Trouver la route correspondante pour le fil d'Ariane
    const matched = to.matched.map((record) => ({
      name: record.name as string,
      meta: record.meta,
      path: record.path,
    }));

    // Stocker les informations de navigation pour le fil d'Ariane
    if (to.meta.breadcrumb) {
      to.meta.breadcrumbItems = matched
        .filter((record) => record.meta?.breadcrumb)
        .map((record) => ({
          text: record.meta.breadcrumb,
          to: { name: record.name as string },
        }));
    }

    next();
  } catch (error) {
    console.error("Erreur lors de la navigation:", error);
    next(false);
  }
});

/**
 * Après chaque navigation
 */
router.afterEach((to) => {
  // Remonter en haut de page
  if (typeof window !== "undefined") {
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: to.meta?.scrollBehavior || "smooth",
      });
    });
  }

  // Enregistrement de la navigation pour les analyses
  if (process.env.NODE_ENV === "production") {
    // Exemple: Envoyer des données d'analyse
    console.log(`Navigation vers: ${to.fullPath}`);
  }
});

// Nettoyage avant le déchargement de la page
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (preloadTimeout) {
      clearTimeout(preloadTimeout);
      preloadTimeout = null;
    }
  });
}

// ===== EXPORT =====

export default router;
