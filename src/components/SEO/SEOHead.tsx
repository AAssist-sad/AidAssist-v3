import React, { useEffect } from 'react';
import { useRouter } from '../../hooks/useRouter';
import { useLanguage } from '../../contexts/LanguageContext';
import { RouteUtils } from '../../config/routes';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

/**
 * Composant pour la gestion des métadonnées SEO
 * Met à jour dynamiquement les balises meta selon la page et la langue
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  image,
  noIndex = false
}) => {
  const { getCurrentRoute } = useRouter();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const routeInfo = getCurrentRoute();
    const finalTitle = title || routeInfo.title || 'AidAssist';
    const finalDescription = description || routeInfo.description || 'Plateforme d\'aide aux démarches administratives';

    // Titre de la page
    document.title = `${finalTitle} - AidAssist`;

    // Meta description
    updateMetaTag('description', finalDescription);

    // Meta keywords
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Meta robots
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:url', window.location.href);
    updateMetaProperty('og:locale', currentLanguage.code === 'fr' ? 'fr_FR' : 'en_US');
    
    if (image) {
      updateMetaProperty('og:image', image);
    }

    // Twitter Card
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    
    if (image) {
      updateMetaName('twitter:image', image);
    }

    // Canonical et hreflang
    updateCanonicalAndHreflang(routeInfo);

    // Langue de la page
    document.documentElement.lang = currentLanguage.code;

  }, [title, description, keywords, image, noIndex, currentLanguage, getCurrentRoute]);

  return null; // Ce composant ne rend rien visuellement
};

/**
 * Utilitaires pour la mise à jour des balises meta
 */
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateCanonicalAndHreflang = (routeInfo: ReturnType<typeof useRouter>['getCurrentRoute']) => {
  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.href;

  // Supprimer les anciens hreflang
  const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflang.forEach(link => link.remove());

  // Ajouter les nouveaux hreflang
  if (routeInfo.route) {
    ['fr', 'en'].forEach(lang => {
      const hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = lang;
      hreflang.href = window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, lang);
      document.head.appendChild(hreflang);
    });

    // x-default pour la langue par défaut
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, 'fr');
    document.head.appendChild(xDefault);
  }
};

/**
 * Hook pour la gestion SEO
 */
export const useSEO = () => {
  const { getCurrentRoute } = useRouter();
  const { currentLanguage } = useLanguage();

  const updateSEO = (seoData: Partial<SEOHeadProps>) => {
    const routeInfo = getCurrentRoute();
    
    return {
      title: seoData.title || routeInfo.title,
      description: seoData.description || routeInfo.description,
      canonical: window.location.href,
      hreflang: {
        fr: window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, 'fr'),
        en: window.location.origin + RouteUtils.generateLocalizedPath(routeInfo.path, 'en')
      }
    };
  };

  return {
    updateSEO,
    currentLanguage: currentLanguage.code,
    currentRoute: getCurrentRoute()
  };
};