import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RouteUtils } from '../config/routes';

/**
 * Hook personnalisé pour la gestion du routing avec i18n
 * Fournit une API simple pour la navigation dans l'application
 */
export const useRouter = () => {
  const { currentLanguage } = useLanguage();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Écouter les changements d'URL
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Observer les changements d'URL pour les SPA
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  /**
   * Navigation vers une nouvelle page avec gestion de la langue
   */
  const navigate = useCallback((path: string, options?: { replace?: boolean; locale?: string }) => {
    const locale = options?.locale || currentLanguage.code;
    const localizedPath = RouteUtils.generateLocalizedPath(path, locale);
    
    if (options?.replace) {
      window.history.replaceState(null, '', localizedPath);
    } else {
      window.history.pushState(null, '', localizedPath);
    }
    
    setCurrentPath(localizedPath);
  }, [currentLanguage.code]);

  /**
   * Navigation avec changement de langue
   */
  const changeLanguage = useCallback((newLocale: string) => {
    const { path } = RouteUtils.extractLocaleFromPath(currentPath);
    const newPath = RouteUtils.generateLocalizedPath(path, newLocale);
    
    window.history.pushState(null, '', newPath);
    setCurrentPath(newPath);
  }, [currentPath]);

  /**
   * Génère un lien localisé
   */
  const generateLink = useCallback((path: string, locale?: string) => {
    const targetLocale = locale || currentLanguage.code;
    return RouteUtils.generateLocalizedPath(path, targetLocale);
  }, [currentLanguage.code]);

  /**
   * Vérifie si une route est active
   */
  const isActive = useCallback((path: string) => {
    const { path: currentRoutePath } = RouteUtils.extractLocaleFromPath(currentPath);
    return currentRoutePath === path || currentRoutePath.startsWith(path + '/');
  }, [currentPath]);

  /**
   * Retourne les informations de la route actuelle
   */
  const getCurrentRoute = useCallback(() => {
    const { locale, path } = RouteUtils.extractLocaleFromPath(currentPath);
    const route = RouteUtils.findRoute(path);
    
    return {
      locale,
      path,
      route,
      title: route?.title[locale as keyof typeof route.title],
      description: route?.description?.[locale as keyof typeof route.description]
    };
  }, [currentPath]);

  /**
   * Navigation avec paramètres
   */
  const navigateWithParams = useCallback((path: string, params: Record<string, string>, options?: { replace?: boolean }) => {
    const searchParams = new URLSearchParams(params);
    const fullPath = `${path}?${searchParams.toString()}`;
    navigate(fullPath, options);
  }, [navigate]);

  /**
   * Redirection conditionnelle
   */
  const redirectIf = useCallback((condition: boolean, targetPath: string) => {
    if (condition) {
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  return {
    // État
    currentPath,
    
    // Navigation
    navigate,
    changeLanguage,
    navigateWithParams,
    redirectIf,
    
    // Utilitaires
    generateLink,
    isActive,
    getCurrentRoute,
    
    // Actions navigateur
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    reload: () => window.location.reload(),
    
    // Informations
    canGoBack: window.history.length > 1,
    canGoForward: window.history.length > 1
  };
};