import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { RouteUtils, routesConfig } from '../../config/routes';
import { useRouter } from '../../hooks/useRouter';
import { useAuth } from '../../contexts/AuthContext';

// Import des composants de pages
import { Dashboard } from '../../pages/Dashboard';
import { Appointments } from '../../pages/Appointments';
import { Documents } from '../../pages/Documents';
import { Procedures } from '../../pages/Procedures';
import { Profiles } from '../../pages/Profiles';
import { Settings } from '../../pages/Settings';
import { Auth } from '../../pages/Auth';
import { NotFound } from '../../pages/NotFound';

/**
 * Mapping des composants par nom
 * Permet de résoudre dynamiquement les composants selon la configuration des routes
 */
const componentMap: Record<string, React.ComponentType<any>> = {
  Dashboard,
  Appointments,
  Documents,
  Procedures,
  Profiles,
  Settings,
  Login: Auth,
  Register: Auth,
  ResetPassword: Auth,
  NotFound
};

/**
 * Composant de routing localisé
 * Gère la navigation avec support i18n et authentification
 */
export const LocalizedRouter: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { getCurrentRoute, navigate } = useRouter();
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const routeInfo = getCurrentRoute();
    
    // Redirection automatique si pas de langue dans l'URL
    if (!routeInfo.locale || !['fr', 'en'].includes(routeInfo.locale)) {
      const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
      navigate(routeInfo.path, { replace: true, locale: browserLang });
      return;
    }

    // Synchroniser la langue du contexte avec l'URL
    if (routeInfo.locale !== currentLanguage.code) {
      const targetLanguage = routeInfo.locale === 'fr' 
        ? { code: 'fr' as const, name: 'Français', flag: '🇫🇷' }
        : { code: 'en' as const, name: 'English', flag: '🇺🇸' };
      setLanguage(targetLanguage);
    }

    // Résolution du composant
    if (routeInfo.route) {
      // Vérification de l'authentification
      if (routeInfo.route.requiresAuth && !isAuthenticated) {
        navigate('/auth/login', { replace: true });
        return;
      }

      // Redirection si utilisateur connecté essaie d'accéder aux pages d'auth
      if (!routeInfo.route.requiresAuth && isAuthenticated && routeInfo.path.startsWith('/auth')) {
        navigate('/', { replace: true });
        return;
      }

      const Component = componentMap[routeInfo.route.component];
      if (Component) {
        setCurrentComponent(() => Component);
      } else {
        setCurrentComponent(() => NotFound);
      }
    } else {
      setCurrentComponent(() => NotFound);
    }

    // Mise à jour du titre de la page
    if (routeInfo.title) {
      document.title = `${routeInfo.title} - AidAssist`;
    }

    // Mise à jour des métadonnées SEO
    updateSEOMetadata(routeInfo);
  }, [getCurrentRoute, currentLanguage, isAuthenticated, navigate, setLanguage]);

  /**
   * Met à jour les métadonnées SEO
   */
  const updateSEOMetadata = (routeInfo: ReturnType<typeof getCurrentRoute>) => {
    if (!routeInfo.route) return;

    // Description meta tag
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && routeInfo.description) {
      descriptionMeta.setAttribute('content', routeInfo.description);
    }

    // Canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, routeInfo.locale);
    }

    // Hreflang links
    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach(link => link.remove());

    ['fr', 'en'].forEach(lang => {
      const hreflangLink = document.createElement('link');
      hreflangLink.rel = 'alternate';
      hreflangLink.hreflang = lang;
      hreflangLink.href = window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, lang);
      document.head.appendChild(hreflangLink);
    });
  };

  // Fonction de navigation à passer aux composants
  const handleNavigate = (page: string, itemId?: string) => {
    const path = itemId ? `${page}/${itemId}` : page;
    navigate(path);
  };

  if (!currentComponent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const Component = currentComponent;
  
  return <Component onNavigate={handleNavigate} />;
};