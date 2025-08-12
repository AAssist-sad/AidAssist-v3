import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { RouteUtils } from '../../config/routes';

/**
 * Composant de détection et redirection automatique de langue
 * Analyse l'URL et redirige vers la langue appropriée si nécessaire
 */
export const LanguageDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage, setLanguage } = useLanguage();

  useEffect(() => {
    const detectAndRedirect = () => {
      const currentPath = window.location.pathname;
      const { locale, path } = RouteUtils.extractLocaleFromPath(currentPath);
      
      // Si aucune langue dans l'URL, rediriger vers la langue du navigateur ou par défaut
      if (!locale || !['fr', 'en'].includes(locale)) {
        const browserLang = getBrowserLanguage();
        const newPath = RouteUtils.generateLocalizedPath(path, browserLang);
        
        // Redirection sans rechargement de page
        window.history.replaceState(null, '', newPath);
        
        // Mise à jour du contexte de langue
        const targetLanguage = browserLang === 'fr' 
          ? { code: 'fr' as const, name: 'Français', flag: '🇫🇷' }
          : { code: 'en' as const, name: 'English', flag: '🇺🇸' };
        setLanguage(targetLanguage);
        
        return;
      }

      // Synchroniser le contexte avec l'URL si différent
      if (locale !== currentLanguage.code) {
        const targetLanguage = locale === 'fr' 
          ? { code: 'fr' as const, name: 'Français', flag: '🇫🇷' }
          : { code: 'en' as const, name: 'English', flag: '🇺🇸' };
        setLanguage(targetLanguage);
      }
    };

    detectAndRedirect();
  }, [currentLanguage, setLanguage]);

  return <>{children}</>;
};

/**
 * Détecte la langue préférée du navigateur
 */
const getBrowserLanguage = (): string => {
  // Vérifier localStorage en premier
  const savedLang = localStorage.getItem('aidassist-language');
  if (savedLang && ['fr', 'en'].includes(savedLang)) {
    return savedLang;
  }

  // Détecter depuis le navigateur
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('en')) return 'en';
  
  // Langue par défaut
  return 'fr';
};

/**
 * Hook pour la détection de langue
 */
export const useLanguageDetection = () => {
  const [detectedLanguage, setDetectedLanguage] = React.useState<string>('fr');
  const [isDetecting, setIsDetecting] = React.useState(true);

  useEffect(() => {
    const detect = async () => {
      setIsDetecting(true);
      
      // Simulation d'une détection asynchrone (ex: API de géolocalisation)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const lang = getBrowserLanguage();
      setDetectedLanguage(lang);
      setIsDetecting(false);
    };

    detect();
  }, []);

  return {
    detectedLanguage,
    isDetecting,
    getBrowserLanguage
  };
};