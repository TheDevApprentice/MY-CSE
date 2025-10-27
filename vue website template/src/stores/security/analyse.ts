// analyse.ts
/**
 * 🔐 Analyse comportementale sécurisée (Singleton)
 *
 * Ce module est conçu pour détecter des patterns de saisie potentiellement malveillants.
 * Il est autonome, encapsulé, et ne peut être altéré depuis l'extérieur (console ou injection).
 *
 * 🧠 Fonctionnement :
 * - Garde en mémoire une trace interne des fragments de saisie analysés.
 * - Compare ces traces à une liste de séquences suspectes (pas de regex brut).
 * - En cas de détection d’un pattern d’injection cohérent, déclenche un blocage d’IP.
 *
 * 🚫 Protection :
 * - Aucune méthode d’altération ou lecture de la mémoire n’est exposée.
 * - Utilisable dans n'importe quel autre module (ex: security.ts).
 */

import {
  SQL_INJECTION_PATTERNS,
  XSS_PATTERNS,
  URL_INJECTION_PATTERNS,
} from "./patterns";

const IntrusionMonitor = (() => {
  const trace: string[] = [];
  const maxLength = 10;

  const suspiciousSequences = [
    ["select", "*", "from"],
    ["drop", "table"],
    ["union", "select"],
    ["insert", "into"],
    ["<script>"],
    ["or", "1=1"],
    ["--", "drop"],
    [";"],
    ["exec"],
    ["sleep", "("],
  ];

  let alreadyTriggered = false;

  async function blockIp(ip: string) {
    if (alreadyTriggered) return;
    alreadyTriggered = true;

    try {
      await fetch("/api/security/block-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
      console.warn(`🔐 IP ${ip} bloquée.`);
    } catch (err) {
      console.error("Erreur lors du blocage IP :", err);
    }
  }

  function matchesAnyPattern(input: string): boolean {
    const patterns = [
      ...SQL_INJECTION_PATTERNS,
      ...XSS_PATTERNS,
      ...URL_INJECTION_PATTERNS,
    ];
    return patterns.some((regex) => regex.test(input));
  }

  function analyze(input: string, ip: string): void {
    if (!input || typeof input !== "string") return;

    const lower = input.toLowerCase().trim();

    // 🔍 Détection immédiate via regex
    if (matchesAnyPattern(lower)) {
      console.warn(`🛑 Pattern REGEX détecté dans l'entrée :`, input);
      void blockIp(ip);
      trace.length = 0;
      return;
    }

    // 🧠 Analyse comportementale
    trace.push(lower);
    if (trace.length > maxLength) trace.shift();
    const joined = trace.join(" ");

    for (const pattern of suspiciousSequences) {
      const expected = pattern.join(" ");
      if (joined.includes(expected)) {
        console.warn(`🛑 Séquence suspecte détectée : "${expected}"`);
        void blockIp(ip);
        trace.length = 0;
        break;
      }
    }
  }

  return {
    analyze,
  };
})();

export default IntrusionMonitor;
