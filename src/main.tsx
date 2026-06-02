import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  registerSW({
    onOfflineReady() {
      console.info("[Future Skills] App prête pour une utilisation hors ligne.");
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
