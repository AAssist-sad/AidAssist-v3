import { RouteConfig } from '../config/routes';

/**
 * Utilitaires SEO pour l'optimisation des moteurs de recherche
 */
export class SEOUtils {
  /**
   * Génère les métadonnées structurées JSON-LD
   */
  static generateStructuredData(route: RouteConfig, locale: string) {
    const baseUrl = window.location.origin;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": route.title[locale as keyof typeof route.title],
      "description": route.description?.[locale as keyof typeof route.description],
      "url": `${baseUrl}/${locale}${route.path}`,
      "inLanguage": locale,
      "isPartOf": {
        "@type": "WebSite",
        "name": "AidAssist",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/${locale}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    };

    return structuredData;
  }

  /**
   * Injecte les données structurées dans le DOM
   */
  static injectStructuredData(data: any) {
    // Supprimer les anciennes données structurées
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Ajouter les nouvelles données
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Génère les balises hreflang pour toutes les langues
   */
  static generateHreflangTags(path: string, supportedLocales: string[] = ['fr', 'en']) {
    const baseUrl = window.location.origin;
    const hreflangData: Array<{ locale: string; url: string }> = [];

    supportedLocales.forEach(locale => {
      hreflangData.push({
        locale,
        url: `${baseUrl}/${locale}${path}`
      });
    });

    // Ajouter x-default (langue par défaut)
    hreflangData.push({
      locale: 'x-default',
      url: `${baseUrl}/fr${path}` // Français comme langue par défaut
    });

    return hreflangData;
  }

  /**
   * Met à jour les balises hreflang dans le DOM
   */
  static updateHreflangTags(path: string) {
    // Supprimer les anciennes balises hreflang
    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach(link => link.remove());

    // Ajouter les nouvelles balises
    const hreflangData = this.generateHreflangTags(path);
    hreflangData.forEach(({ locale, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Génère le sitemap XML pour toutes les langues
   */
  static generateSitemap(routes: RouteConfig[], supportedLocales: string[] = ['fr', 'en']) {
    const baseUrl = window.location.origin;
    const urls: string[] = [];

    routes.forEach(route => {
      if (!route.path.includes(':')) { // Exclure les routes avec paramètres
        supportedLocales.forEach(locale => {
          urls.push(`${baseUrl}/${locale}${route.path}`);
        });
      }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${supportedLocales.map(locale => 
      `<xhtml:link rel="alternate" hreflang="${locale}" href="${url.replace(/\/(fr|en)\//, `/${locale}/`)}" />`
    ).join('\n    ')}
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  /**
   * Optimise les métadonnées pour les réseaux sociaux
   */
  static optimizeSocialMetadata(title: string, description: string, image?: string) {
    const metadata = {
      // Open Graph
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': window.location.href,
      'og:site_name': 'AidAssist',
      
      // Twitter Card
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:site': '@aidassist',
      
      // LinkedIn
      'linkedin:title': title,
      'linkedin:description': description
    };

    if (image) {
      metadata['og:image'] = image;
      metadata['twitter:image'] = image;
      metadata['linkedin:image'] = image;
    }

    return metadata;
  }
}

/**
 * Hook pour la gestion SEO avancée
 */
export const useSEO = () => {
  const { getCurrentRoute } = useRouter();
  const { currentLanguage } = useLanguage();

  const updatePageSEO = useCallback((customData?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  }) => {
    const routeInfo = getCurrentRoute();
    
    if (routeInfo.route) {
      const title = customData?.title || routeInfo.title || 'AidAssist';
      const description = customData?.description || routeInfo.description || 'Plateforme d\'aide aux démarches';
      
      // Données structurées
      const structuredData = SEOUtils.generateStructuredData(routeInfo.route, routeInfo.locale);
      SEOUtils.injectStructuredData(structuredData);
      
      // Hreflang
      SEOUtils.updateHreflangTags(routeInfo.path);
      
      // Métadonnées sociales
      const socialMetadata = SEOUtils.optimizeSocialMetadata(title, description, customData?.image);
      
      Object.entries(socialMetadata).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          if (property.startsWith('og:') || property.startsWith('linkedin:')) {
            meta.setAttribute('property', property);
          } else {
            meta.setAttribute('name', property);
          }
          document.head.appendChild(meta);
        }
        meta.content = content;
      });
    }
  }, [getCurrentRoute]);

  return {
    updatePageSEO,
    currentRoute: getCurrentRoute(),
    currentLanguage: currentLanguage.code
  };
};