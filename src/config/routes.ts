/**
 * Configuration centralisée des routes de l'application
 * Permet une gestion facile des routes multilingues et de leur maintenance
 */

export interface RouteConfig {
  path: string;
  component: string;
  title: {
    fr: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
  requiresAuth?: boolean;
  roles?: string[];
  children?: RouteConfig[];
}

/**
 * Configuration complète des routes de l'application
 * Structure hiérarchique pour faciliter la navigation et la génération de menus
 */
export const routesConfig: RouteConfig[] = [
  {
    path: '/',
    component: 'Dashboard',
    title: {
      fr: 'Tableau de bord',
      en: 'Dashboard'
    },
    description: {
      fr: 'Vue d\'ensemble de vos activités et statistiques',
      en: 'Overview of your activities and statistics'
    },
    requiresAuth: true
  },
  {
    path: '/dashboard',
    component: 'Dashboard',
    title: {
      fr: 'Tableau de bord',
      en: 'Dashboard'
    },
    requiresAuth: true
  },
  {
    path: '/appointments',
    component: 'Appointments',
    title: {
      fr: 'Rendez-vous',
      en: 'Appointments'
    },
    description: {
      fr: 'Gérez vos rendez-vous médicaux et administratifs',
      en: 'Manage your medical and administrative appointments'
    },
    requiresAuth: true,
    children: [
      {
        path: '/appointments/new',
        component: 'NewAppointment',
        title: {
          fr: 'Nouveau rendez-vous',
          en: 'New appointment'
        },
        requiresAuth: true
      },
      {
        path: '/appointments/:id',
        component: 'AppointmentDetail',
        title: {
          fr: 'Détails du rendez-vous',
          en: 'Appointment details'
        },
        requiresAuth: true
      }
    ]
  },
  {
    path: '/documents',
    component: 'Documents',
    title: {
      fr: 'Documents',
      en: 'Documents'
    },
    description: {
      fr: 'Stockage sécurisé de vos documents importants',
      en: 'Secure storage of your important documents'
    },
    requiresAuth: true,
    children: [
      {
        path: '/documents/upload',
        component: 'DocumentUpload',
        title: {
          fr: 'Téléverser un document',
          en: 'Upload document'
        },
        requiresAuth: true
      },
      {
        path: '/documents/:id',
        component: 'DocumentDetail',
        title: {
          fr: 'Détails du document',
          en: 'Document details'
        },
        requiresAuth: true
      }
    ]
  },
  {
    path: '/procedures',
    component: 'Procedures',
    title: {
      fr: 'Démarches',
      en: 'Procedures'
    },
    description: {
      fr: 'Suivez vos démarches administratives étape par étape',
      en: 'Track your administrative procedures step by step'
    },
    requiresAuth: true,
    children: [
      {
        path: '/procedures/new',
        component: 'NewProcedure',
        title: {
          fr: 'Nouvelle démarche',
          en: 'New procedure'
        },
        requiresAuth: true
      },
      {
        path: '/procedures/:id',
        component: 'ProcedureDetail',
        title: {
          fr: 'Détails de la démarche',
          en: 'Procedure details'
        },
        requiresAuth: true
      }
    ]
  },
  {
    path: '/profiles',
    component: 'Profiles',
    title: {
      fr: 'Profils',
      en: 'Profiles'
    },
    description: {
      fr: 'Gérez les profils des personnes que vous accompagnez',
      en: 'Manage profiles of people you assist'
    },
    requiresAuth: true,
    children: [
      {
        path: '/profiles/new',
        component: 'NewProfile',
        title: {
          fr: 'Nouveau profil',
          en: 'New profile'
        },
        requiresAuth: true
      },
      {
        path: '/profiles/:id',
        component: 'ProfileDetail',
        title: {
          fr: 'Détails du profil',
          en: 'Profile details'
        },
        requiresAuth: true
      }
    ]
  },
  {
    path: '/settings',
    component: 'Settings',
    title: {
      fr: 'Paramètres',
      en: 'Settings'
    },
    description: {
      fr: 'Configurez votre compte et vos préférences',
      en: 'Configure your account and preferences'
    },
    requiresAuth: true,
    children: [
      {
        path: '/settings/account',
        component: 'AccountSettings',
        title: {
          fr: 'Mon compte',
          en: 'My account'
        },
        requiresAuth: true
      },
      {
        path: '/settings/security',
        component: 'SecuritySettings',
        title: {
          fr: 'Sécurité',
          en: 'Security'
        },
        requiresAuth: true
      },
      {
        path: '/settings/notifications',
        component: 'NotificationSettings',
        title: {
          fr: 'Notifications',
          en: 'Notifications'
        },
        requiresAuth: true
      }
    ]
  },
  {
    path: '/auth/login',
    component: 'Login',
    title: {
      fr: 'Connexion',
      en: 'Login'
    },
    description: {
      fr: 'Connectez-vous à votre compte AidAssist',
      en: 'Sign in to your AidAssist account'
    },
    requiresAuth: false
  },
  {
    path: '/auth/register',
    component: 'Register',
    title: {
      fr: 'Inscription',
      en: 'Register'
    },
    description: {
      fr: 'Créez votre compte AidAssist',
      en: 'Create your AidAssist account'
    },
    requiresAuth: false
  },
  {
    path: '/auth/reset-password',
    component: 'ResetPassword',
    title: {
      fr: 'Réinitialiser le mot de passe',
      en: 'Reset password'
    },
    requiresAuth: false
  }
];

/**
 * Utilitaires pour la gestion des routes
 */
export class RouteUtils {
  /**
   * Trouve une route par son chemin
   */
  static findRoute(path: string): RouteConfig | null {
    const findInRoutes = (routes: RouteConfig[], targetPath: string): RouteConfig | null => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if (route.children) {
          const found = findInRoutes(route.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findInRoutes(routesConfig, path);
  }

  /**
   * Génère toutes les routes plates (sans hiérarchie)
   */
  static getFlatRoutes(): RouteConfig[] {
    const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
      const flat: RouteConfig[] = [];
      for (const route of routes) {
        flat.push(route);
        if (route.children) {
          flat.push(...flattenRoutes(route.children));
        }
      }
      return flat;
    };

    return flattenRoutes(routesConfig);
  }

  /**
   * Génère les routes pour le menu de navigation
   */
  static getNavigationRoutes(): RouteConfig[] {
    return routesConfig.filter(route => 
      route.requiresAuth && 
      !route.path.startsWith('/auth') && 
      !route.children
    );
  }

  /**
   * Génère l'URL avec la langue
   */
  static generateLocalizedPath(path: string, locale: string): string {
    // Nettoie le chemin
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${cleanPath}`;
  }

  /**
   * Extrait la langue de l'URL
   */
  static extractLocaleFromPath(pathname: string): { locale: string; path: string } {
    const segments = pathname.split('/').filter(Boolean);
    const supportedLocales = ['fr', 'en'];
    
    if (segments.length > 0 && supportedLocales.includes(segments[0])) {
      return {
        locale: segments[0],
        path: '/' + segments.slice(1).join('/')
      };
    }

    return {
      locale: 'fr', // Langue par défaut
      path: pathname
    };
  }

  /**
   * Génère les métadonnées SEO pour une route
   */
  static generateSEOMetadata(route: RouteConfig, locale: string) {
    return {
      title: route.title[locale as keyof typeof route.title],
      description: route.description?.[locale as keyof typeof route.description],
      canonical: RouteUtils.generateLocalizedPath(route.path, locale),
      hreflang: {
        fr: RouteUtils.generateLocalizedPath(route.path, 'fr'),
        en: RouteUtils.generateLocalizedPath(route.path, 'en')
      }
    };
  }
}

/**
 * Types pour le système de routing
 */
export interface NavigationItem {
  path: string;
  title: string;
  icon?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
}

/**
 * Hook pour la gestion des routes
 */
export const useRoutes = () => {
  const currentPath = window.location.pathname;
  const { locale, path } = RouteUtils.extractLocaleFromPath(currentPath);
  const currentRoute = RouteUtils.findRoute(path);

  return {
    currentRoute,
    currentPath: path,
    currentLocale: locale,
    allRoutes: routesConfig,
    flatRoutes: RouteUtils.getFlatRoutes(),
    navigationRoutes: RouteUtils.getNavigationRoutes()
  };
};