import { useEffect, useState } from "react";

/**
 * Hook to handle PWA install prompt across all platforms.
 *
 * - Android/Windows/Linux/macOS (Chrome/Edge): Uses `beforeinstallprompt` event.
 * - iOS Safari: Detects via user agent (no prompt API, show manual guide).
 * - Already installed: detects via `display-mode: standalone`.
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS (no install prompt API)
    const ios =
      /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
      !window.MSStream;
    setIsIOS(ios);

    // Detect if already installed as PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(standalone);

    // Listen for browser install prompt (Android, Windows, Linux, macOS, etc.)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    return outcome === "accepted";
  };

  return { isInstallable, isInstalled, isIOS, triggerInstall };
}
