// composables/useInvoiceDownload.ts
import { ref, nextTick } from "vue";

export const useInvoiceDownload = () => {
  const isGenerating = ref(false);
  const downloadProgress = ref(0);

  // Fonction pour capturer les styles computed de tous les éléments
  const captureComputedStyles = (element: HTMLElement): string => {
    let styles = "";

    // Fonction récursive pour parcourir tous les éléments
    const processElement = (el: HTMLElement, index: number) => {
      const computedStyle = window.getComputedStyle(el);
      const className = `captured-style-${index}`;

      // Ajouter une classe unique à l'élément
      el.classList.add(className);

      // Capturer les styles importants
      const importantProperties = [
        "display",
        "position",
        "top",
        "left",
        "right",
        "bottom",
        "width",
        "height",
        "min-width",
        "min-height",
        "max-width",
        "max-height",
        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "border",
        "border-width",
        "border-style",
        "border-color",
        "border-radius",
        "background",
        "background-color",
        "background-image",
        "background-size",
        "color",
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "text-align",
        "text-decoration",
        "text-transform",
        "opacity",
        "visibility",
        "overflow",
        "z-index",
        "flex",
        "flex-direction",
        "justify-content",
        "align-items",
        "grid",
        "grid-template-columns",
        "grid-gap",
        "box-shadow",
        "transform",
      ];

      let elementStyles = `.${className} {\n`;
      importantProperties.forEach((prop) => {
        const value = computedStyle.getPropertyValue(prop);
        if (
          value &&
          value !== "none" &&
          value !== "auto" &&
          value !== "normal"
        ) {
          elementStyles += `  ${prop}: ${value} !important;\n`;
        }
      });
      elementStyles += "}\n\n";

      styles += elementStyles;

      // Traiter les enfants
      Array.from(el.children).forEach((child, childIndex) => {
        if (child instanceof HTMLElement) {
          processElement(child, index * 1000 + childIndex);
        }
      });
    };

    processElement(element, 1);
    return styles;
  };

  // Solution HTML avec styles computed
  const downloadInvoiceAsHTML = async (hiddenInvoiceRef: any) => {
    try {
      isGenerating.value = true;
      downloadProgress.value = 10;

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 500));
      downloadProgress.value = 30;

      if (hiddenInvoiceRef.value) {
        // Rendre l'élément temporairement visible pour capturer les styles
        const originalStyle = hiddenInvoiceRef.value.style.cssText;
        hiddenInvoiceRef.value.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 800px !important;
          background: white !important;
          z-index: 9999 !important;
          visibility: visible !important;
        `;

        downloadProgress.value = 50;

        // Capturer les styles computed
        const capturedStyles = captureComputedStyles(hiddenInvoiceRef.value);

        // Capturer le HTML
        const htmlContent = hiddenInvoiceRef.value.innerHTML;

        // Restaurer le style original
        hiddenInvoiceRef.value.style.cssText = originalStyle;

        downloadProgress.value = 70;

        // Créer le fichier HTML final avec les styles
        const finalHtmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              /* Styles computed capturés */
              ${capturedStyles}
            </style>
          </head>
          <body>
              ${htmlContent}
          </body>
          </html>
        `;

        downloadProgress.value = 90;

        // Télécharger le fichier
        // const blob = new Blob([finalHtmlContent], { type: "text/html" });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = `facture_${invoice.number}.html`;
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);

        // Attendre un peu que le téléchargement se lance
        // await new Promise((resolve) => setTimeout(resolve, 500));

        // // Ouvrir le fichier HTML pour l'impression en utilisant l'URL
        // let w = window.open(url, "_blank"); // Utiliser url au lieu de blob
        // if (!w) {
        //   throw new Error("Impossible d'ouvrir la fenêtre d'impression");
        // }

        // // Attendre que la fenêtre soit chargée avant d'imprimer
        // w.onload = function () {
        //   setTimeout(() => {
        //     w.print();
        //     setTimeout(() => {
        //       w.close();
        //       URL.revokeObjectURL(url); // Nettoyer après fermeture
        //     }, 1000);
        //   }, 500);
        // };

        // Imprimer via iframe invisible (pas de popup)
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.left = "-9999px";
        iframe.style.top = "-9999px";

        document.body.appendChild(iframe);

        // Écrire le contenu dans l'iframe
        iframe.contentDocument?.open();
        iframe.contentDocument?.write(finalHtmlContent);
        iframe.contentDocument?.close();

        // Attendre que le contenu soit chargé puis imprimer
        iframe.onload = function () {
          setTimeout(() => {
            iframe.contentWindow?.print();
            // Supprimer l'iframe après impression
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 1000);
          }, 500);
        };

        downloadProgress.value = 100;

        console.log("Facture téléchargée avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement HTML:", error);
      throw error;
    } finally {
      isGenerating.value = false;
      downloadProgress.value = 0;
    }
  };

  return {
    isGenerating,
    downloadProgress,
    downloadInvoiceAsHTML,
  };
};
