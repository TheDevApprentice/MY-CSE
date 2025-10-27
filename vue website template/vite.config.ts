import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ command, mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";
  const isDevelopment = mode === "development";

  return {
    // Configuration des plugins
    plugins: [
      vue({
        // Optimisations Vue spécifiques
        script: {
          defineModel: true,
          propsDestructure: true,
        },
        template: {
          compilerOptions: {
            // Optimiser le rendu en production
            hoistStatic: isProduction,
            cacheHandlers: isProduction,
          },
        },
      }),

      tailwindcss(),

      // Compression uniquement en production
      ...(isProduction
        ? [
            viteCompression({
              algorithm: "gzip",
              threshold: 10240,
              deleteOriginFile: false,
              verbose: false,
            }),
            // Compression Brotli supplémentaire pour encore meilleures performances
            // viteCompression({
            //   algorithm: "brotliCompress",
            //   ext: ".br",
            //   threshold: 10240,
            //   deleteOriginFile: false,
            //   verbose: false,
            // }),
          ]
        : []),

      // Bundle analyzer uniquement quand nécessaire
      ...(env.ANALYZE === "true"
        ? [
            visualizer({
              open: true,
              filename: "dist/stats.html",
              gzipSize: true,
              brotliSize: true,
              template: "treemap", // ou "sunburst", "network"
            }),
          ]
        : []),
    ],

    // Alias de chemin
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@public": fileURLToPath(new URL("./public", import.meta.url)),
        "@icons": fileURLToPath(new URL("./src/components/common/icons", import.meta.url)),
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        "@common": fileURLToPath(
          new URL("./src/components/common", import.meta.url)
        ),
        "@utils": fileURLToPath(
          new URL("./src/utils", import.meta.url)
        ),
        "@dashboards": fileURLToPath(
          new URL("./src/components/common/layouts/dashboard", import.meta.url)
        ),
        "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
        "@composables": fileURLToPath(
          new URL("./src/composables", import.meta.url)
        ),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@plugins": fileURLToPath(new URL("./src/plugins", import.meta.url)),
        "@keys": fileURLToPath(new URL("./src/keys", import.meta.url)),
        "@types": fileURLToPath(new URL("./src/types", import.meta.url)),
        "@modules": fileURLToPath(new URL("./src/modules", import.meta.url)),
        "@locales": fileURLToPath(new URL("./src/locales", import.meta.url)),
        "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      },
      // Extensions par défaut pour améliorer la résolution
      extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json"],
    },

    // Configuration CSS
    css: {
      devSourcemap: isDevelopment,
    },

    // Configuration du serveur de développement
    server: {
      open: true,
      cors: true,
      // Préchargement des modules pour améliorer les performances
      warmup: {
        clientFiles: [
          "./src/main.ts",
          "./src/App.vue",
          "./src/router/index.ts",
        ],
      },
    },

    // Prévisualisation
    preview: {
      port: 4173,
      open: true,
    },

    // Configuration de build optimisée
    build: {
      target: ["es2020", "edge88", "firefox78", "chrome87", "safari13"],
      minify: "terser",
      sourcemap: isDevelopment ? "inline" : false,

      // Options Terser pour une minification agressive
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction
            ? ["console.log", "console.info", "console.debug"]
            : [],
          passes: 2, // Nombre de passes pour une meilleure compression
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
          safari10: true,
        },
      },

      // Configuration CSS
      cssCodeSplit: true,
      cssMinify: isProduction,

      // Configuration des assets
      assetsDir: "assets",
      assetsInlineLimit: 4096, // 4kb

      // Configuration Rollup avancée
      rollupOptions: {
        // Optimisations d'entrée
        input: {
          main: fileURLToPath(new URL("./index.html", import.meta.url)),
        },

        output: {
          // Nommage des chunks pour le cache
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId
                  .split("/")
                  .pop()
                  .replace(/\.\w+$/, "")
              : "chunk";
            return `assets/js/[name]-[hash].js`;
          },
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },

          // Stratégie de chunking optimisée
          manualChunks: (id) => {
            // Chunk vendor principal (core framework)
            if (
              id.includes("node_modules/vue/") ||
              id.includes("node_modules/@vue/")
            ) {
              return "vendor-vue";
            }

            // Router séparé pour lazy loading
            if (id.includes("node_modules/vue-router")) {
              return "vendor-router";
            }

            // State management
            if (
              id.includes("node_modules/pinia") ||
              id.includes("node_modules/vuex")
            ) {
              return "vendor-store";
            }

            // Utilitaires (souvent utilisés partout)
            if (
              id.includes("node_modules/lodash") ||
              id.includes("node_modules/date-fns") ||
              id.includes("node_modules/axios")
            ) {
              return "vendor-utils";
            }

            // Animations (chargé à la demande)
            if (
              id.includes("node_modules/gsap") ||
              id.includes("node_modules/lenis") ||
              id.includes("node_modules/framer-motion")
            ) {
              return "vendor-animations";
            }

            // Internationalisation
            if (id.includes("node_modules/vue-i18n")) {
              return "vendor-i18n";
            }

            // Composants UI lourds
            if (
              id.includes("node_modules/lucide-vue") ||
              id.includes("node_modules/vue-country-flag-next") ||
              id.includes("node_modules/@headlessui")
            ) {
              return "vendor-ui";
            }

            // Charts et visualisations
            if (
              id.includes("node_modules/chart.js") ||
              id.includes("node_modules/d3") ||
              id.includes("node_modules/three")
            ) {
              return "vendor-charts";
            }

            // Éditeurs et outils avancés
            if (
              id.includes("node_modules/monaco-editor") ||
              id.includes("node_modules/codemirror") ||
              id.includes("node_modules/quill")
            ) {
              return "vendor-editors";
            }

            // Autres dépendances node_modules
            if (id.includes("node_modules/")) {
              return "vendor-misc";
            }

            // Chunking par fonctionnalité de l'application
            if (id.includes("/src/views/404-not-found/")) {
              return "pages-404";
            }
          },
        },

        // Optimisations des modules externes
        external: [],

        // Plugins Rollup supplémentaires pour l'optimisation
        plugins: [],
      },

      // Limite d'avertissement pour la taille des chunks
      chunkSizeWarningLimit: 1000,

      // Optimisation des modules de bibliothèque
      lib: undefined,

      // Configuration avancée
      ssr: false,
      watch: null,

      // Reporting de build
      reportCompressedSize: isProduction,
      write: true,
    },

    // Optimisations des dépendances
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "@vueuse/core"],
      exclude: [
        // Exclure les modules qui causent des problèmes
      ],
      // Force la re-optimisation en cas de changement
      force: false,
    },

    // Configuration pour les Web Workers
    worker: {
      format: "es",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/workers/[name]-[hash].js",
        },
      },
    },

    // Gestion des variables d'environnement
    define: {
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },

    // Configuration EsBuild pour le développement
    esbuild: {
      target: "es2020",
      // Supprimer les console.log en production
      drop: isProduction ? ["console", "debugger"] : [],
      // Optimisations spécifiques
      treeShaking: true,
      minifyIdentifiers: isProduction,
      minifySyntax: isProduction,
      minifyWhitespace: isProduction,
    },

    // Configuration expérimentale
    experimental: {
      // Activer les features expérimentales si nécessaire
      renderBuiltUrl: (filename, { hostType }) => {
        if (hostType === "js") {
          return { js: `window.__assetsPath(${JSON.stringify(filename)})` };
        } else {
          return { relative: true };
        }
      },
    },
  };
});
