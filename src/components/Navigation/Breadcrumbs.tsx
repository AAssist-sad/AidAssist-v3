import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from '../../hooks/useRouter';
import { useTranslation } from 'react-i18next';
import { LocalizedLink } from '../Router/LocalizedLink';
import { RouteUtils } from '../../config/routes';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

/**
 * Composant de fil d'Ariane (breadcrumbs) localisé
 * Génère automatiquement le chemin de navigation basé sur l'URL actuelle
 */
export const Breadcrumbs: React.FC = () => {
  const { getCurrentRoute } = useRouter();
  const { t } = useTranslation('common');
  const routeInfo = getCurrentRoute();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Toujours commencer par l'accueil
    breadcrumbs.push({
      label: t('nav.dashboard') || 'Accueil',
      path: '/',
      isActive: routeInfo.path === '/'
    });

    if (routeInfo.path !== '/') {
      const pathSegments = routeInfo.path.split('/').filter(Boolean);
      let currentPath = '';

      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        // Ignorer les paramètres (segments qui commencent par :)
        if (segment.startsWith(':')) return;
        
        const route = RouteUtils.findRoute(currentPath);
        if (route) {
          breadcrumbs.push({
            label: route.title[routeInfo.locale as keyof typeof route.title] || segment,
            path: currentPath,
            isActive: index === pathSegments.length - 1
          });
        }
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Ne pas afficher si seulement l'accueil
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Fil d'Ariane">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          
          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900" aria-current="page">
              {breadcrumb.label}
            </span>
          ) : (
            <LocalizedLink
              href={breadcrumb.path}
              className="hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
              {breadcrumb.label}
            </LocalizedLink>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Hook pour générer des breadcrumbs personnalisés
 */
export const useBreadcrumbs = (customBreadcrumbs?: BreadcrumbItem[]) => {
  const { getCurrentRoute } = useRouter();
  const { t } = useTranslation('common');

  const generateAutoBreadcrumbs = (): BreadcrumbItem[] => {
    const routeInfo = getCurrentRoute();
    const breadcrumbs: BreadcrumbItem[] = [];
    
    breadcrumbs.push({
      label: t('nav.dashboard') || 'Accueil',
      path: '/',
      isActive: routeInfo.path === '/'
    });

    if (routeInfo.path !== '/') {
      const pathSegments = routeInfo.path.split('/').filter(Boolean);
      let currentPath = '';

      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        
        if (!segment.startsWith(':')) {
          const route = RouteUtils.findRoute(currentPath);
          if (route) {
            breadcrumbs.push({
              label: route.title[routeInfo.locale as keyof typeof route.title] || segment,
              path: currentPath,
              isActive: index === pathSegments.length - 1
            });
          }
        }
      });
    }

    return breadcrumbs;
  };

  return {
    breadcrumbs: customBreadcrumbs || generateAutoBreadcrumbs(),
    currentRoute: getCurrentRoute()
  };
};