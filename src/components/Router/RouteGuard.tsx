import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../hooks/useRouter';
import { RouteConfig } from '../../config/routes';

interface RouteGuardProps {
  children: React.ReactNode;
  route: RouteConfig;
  fallback?: React.ReactNode;
}

/**
 * Composant de protection des routes
 * Vérifie l'authentification et les permissions avant d'afficher le contenu
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  route, 
  fallback 
}) => {
  const { isAuthenticated, user, profile } = useAuth();
  const { navigate } = useRouter();

  // Vérification de l'authentification
  if (route.requiresAuth && !isAuthenticated) {
    React.useEffect(() => {
      navigate('/auth/login', { replace: true });
    }, [navigate]);

    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  // Vérification des rôles (si spécifiés)
  if (route.roles && route.roles.length > 0 && profile) {
    const userRole = profile.account_type;
    const hasRequiredRole = route.roles.includes(userRole);

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚫</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h1>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
  }

  // Redirection si utilisateur connecté essaie d'accéder aux pages d'auth
  if (!route.requiresAuth && isAuthenticated && route.path.startsWith('/auth')) {
    React.useEffect(() => {
      navigate('/', { replace: true });
    }, [navigate]);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * HOC pour protéger les composants
 */
export const withRouteGuard = <P extends object>(
  Component: React.ComponentType<P>,
  route: RouteConfig
) => {
  return (props: P) => (
    <RouteGuard route={route}>
      <Component {...props} />
    </RouteGuard>
  );
};

/**
 * Hook pour vérifier les permissions de route
 */
export const useRoutePermissions = (routePath: string) => {
  const { isAuthenticated, profile } = useAuth();
  const route = RouteUtils.findRoute(routePath);

  const canAccess = React.useMemo(() => {
    if (!route) return false;
    
    // Vérification authentification
    if (route.requiresAuth && !isAuthenticated) return false;
    
    // Vérification rôles
    if (route.roles && route.roles.length > 0 && profile) {
      return route.roles.includes(profile.account_type);
    }
    
    return true;
  }, [route, isAuthenticated, profile]);

  return {
    canAccess,
    route,
    requiresAuth: route?.requiresAuth || false,
    requiredRoles: route?.roles || []
  };
};