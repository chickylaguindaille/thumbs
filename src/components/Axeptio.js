import { useEffect } from "react";

const Axeptio = () => {
  useEffect(() => {
    // Configuration Axeptio
    window.axeptioSettings = {
      clientId: "671557d179a83d857bb20bbb",
      cookiesVersion: "thumbs-fr-EU",
    };

    // Création et ajout dynamique du script Axeptio
    const script = document.createElement("script");
    script.src = "https://static.axept.io/sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Nettoyage lorsque le composant est démonté
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default Axeptio;
