// main.ts - Optimized version
import { createApp } from "vue";
import router from "@/router";
import App from "@/App.vue";
import { createCustomI18n } from "@/plugins/i18n";
import { localeMessages, localeConfig } from "@/locales";

// Development mode check
const isDev = import.meta.env.DEV;

console.log("🚀 Initializing application...");

const app = createApp(App);

// ===== CORE INITIALIZATION (Synchronous) =====
app.use(router);

// ===== ASYNC INITIALIZATION CHAIN =====
Promise.resolve()
  // I18n
  .then(async () => {
    if (isDev) console.log("🌍 Installing i18n...");
    await createCustomI18n({ ...localeConfig, localeMessages }).install(app);
  })
  // GSAP (only load essential plugins)
  .then(async () => {
    if (isDev) console.log("🎨 Loading GSAP");
    const [{ gsap }, { Flip }, { ScrollTrigger }, { ScrollToPlugin }] =
      await Promise.all([
        import("gsap"),
        import("gsap/Flip"),
        import("gsap/ScrollTrigger"),
        import("gsap/ScrollToPlugin"),
      ]);
    gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin);
    app.use(gsap);
  })
  // Mount app
  .then(() => {
    app.mount("#app");
    if (isDev) {
      console.log("✅ App mounted");
      window.addEventListener("load", () => {
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
      });
    }
  })
  // Error handling
  .catch((error) => {
    console.error("❌ Initialization failed:", error);
    document.getElementById("app")!.innerHTML = `
      <div class="error-fallback">
        <h1>⚠️ Application Error</h1>
        <p>Failed to initialize. Please refresh or try again later.</p>
        <button onclick="location.reload()">Refresh</button>
      </div>
    `;
  });
