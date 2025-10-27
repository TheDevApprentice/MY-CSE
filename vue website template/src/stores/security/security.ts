// security.ts
// /**
//  * 🔐 Système de sécurité centralisé pour protéger l'application contre :
//  * - Les injections SQL
//  * - Les attaques XSS
//  * - Les manipulations d'URL ou d'encodage
//  *
//  * 🧠 Philosophie :
//  * Ce système repose sur une logique d'analyse comportementale et contextuelle :
//  * - Aucun blocage immédiat ne se déclenche sur la simple frappe d’un mot-clé isolé (ex: "select", "drop").
//  * - Ce n’est que lorsque plusieurs éléments suspects sont saisis en séquence (ex : "select * from", "<script>", "drop table")
//  *   que l’entrée est considérée comme potentiellement malveillante.
//  * - Le terme "pattern" utilisé ici ne désigne pas une expression régulière simple, mais une **structure cohérente d’attaque**.
//  *
//  * 🎯 Objectif :
//  * - Réduire les faux positifs au maximum afin de ne pas bloquer des utilisateurs légitimes.
//  * - Détecter les comportements suspects précocement, avant la soumission de formulaire.
//  * - Réagir automatiquement en arrière-plan : si un pattern complet d’injection est détecté,
//  *   une requête spéciale est envoyée vers l’API pour bloquer l’IP de manière permanente (ajout en blacklist).
//  *
//  * 🔁 Défense en profondeur :
//  * - Ce fichier protège principalement la partie front-end (Vue.js).
//  * - Une logique similaire sera également déployée côté API, pour renforcer la robustesse globale.
//  *
//  * 🛡️ Ce module est actuellement utilisé dans le routeur Vue pour filtrer les paramètres d’URL et les query strings.
//  * À terme, il sera appliqué sur tous les champs de saisie utilisateurs via une validation dynamique (à la frappe).
//  */

import {
  SQL_INJECTION_PATTERNS,
  XSS_PATTERNS,
  URL_INJECTION_PATTERNS,
} from "./patterns";

/**
 * Vérifie si une chaîne contient des motifs d'injection SQL
 * @param {string} input - La chaîne à vérifier
 * @returns {boolean} - True si une injection est détectée, sinon false
 */
function hasSqlInjection(input: string): boolean {
  if (!input) return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Vérifie si une chaîne contient des motifs XSS
 * @param {string} input - La chaîne à vérifier
 * @returns {boolean} - True si une attaque XSS est détectée, sinon false
 */
function hasXssInjection(input: string): boolean {
  if (!input) return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Vérifie si une URL contient des tentatives d'injection
 * @param {string} url - L'URL à vérifier
 * @returns {boolean} - True si une tentative d'injection est détectée, sinon false
 */
function hasUrlInjection(url: string): boolean {
  if (!url) return false;
  return URL_INJECTION_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Nettoie une chaîne de caractères en échappant les caractères spéciaux
 * @param {string} input - La chaîne à nettoyer
 * @returns {string} - La chaîne nettoyée
 */
function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    console.error(
      "Type d'entrée invalide. Une chaîne de caractères est attendue."
    );
    return "";
  }

  // Vérification des injections
  if (hasSqlInjection(input) || hasXssInjection(input)) {
    console.error(
      "Tentative d'injection détectée dans l'entrée utilisateur:",
      input
    );
    return "";
  }

  // Échappement des caractères spéciaux
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Valide et nettoie un objet entier (récursif)
 * @param {any} data - Les données à valider
 * @returns {any} - Les données nettoyées
 */
function sanitizeObject(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Si c'est un tableau, on nettoie chaque élément
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item));
  }

  // Si c'est un objet, on nettoie chaque propriété
  if (typeof data === "object") {
    const sanitized: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizeObject(data[key]);
      }
    }
    return sanitized;
  }

  // Si c'est une chaîne, on la nettoie
  if (typeof data === "string") {
    return sanitizeInput(data);
  }

  // Pour les autres types (nombre, booléen, etc.), on les retourne tels quels
  return data;
}

/**
 * Middleware pour sécuriser les paramètres de l'URL
 * @param {any} to - L'objet de destination de la navigation
 * @param {any} from - L'objet de provenance de la navigation
 * @param {Function} next - La fonction pour continuer la navigation
 */
function secureRouteParams(to: any, from: any, next: Function): void {
  // Vérification des paramètres de l'URL
  if (to.params) {
    for (const key in to.params) {
      const param = to.params[key];
      if (
        param &&
        (hasSqlInjection(param) ||
          hasXssInjection(param) ||
          hasUrlInjection(param))
      ) {
        console.error(
          `Tentative d'injection détectée dans le paramètre URL: ${key}=${param}`
        );
        next({ name: "error", params: { code: "403" } });
        return;
      }
    }
  }

  // Vérification de la query string
  if (to.query) {
    for (const key in to.query) {
      const value = to.query[key];
      if (
        value &&
        (hasSqlInjection(value) ||
          hasXssInjection(value) ||
          hasUrlInjection(value))
      ) {
        console.error(
          `Tentative d'injection détectée dans la query string: ${key}=${value}`
        );
        next({ name: "error", params: { code: "403" } });
        return;
      }
    }
  }

  // Si tout est bon, on continue la navigation
  // next();
}

/**
 * Vérifie si une URL est sûre avant de procéder à une redirection
 * @param {string} url - L'URL à vérifier
 * @returns {boolean} - True si l'URL est sûre, sinon false
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Vérifier que l'URL est bien du même domaine
    if (parsedUrl.origin !== window.location.origin) {
      console.error("Tentative de redirection vers un domaine externe:", url);
      return false;
    }
    return !hasUrlInjection(
      parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
    );
  } catch (e) {
    console.error("URL invalide:", url, e);
    return false;
  }
}

export {
  hasSqlInjection,
  hasXssInjection,
  hasUrlInjection,
  sanitizeInput,
  sanitizeObject,
  secureRouteParams,
  isSafeUrl,
};
