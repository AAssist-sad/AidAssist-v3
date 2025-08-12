import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des fichiers JSON de traduction
import commonFR from './locales/fr/common.json';
import commonEN from './locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',
    debug: false,

    resources: {
        fr: {
            common: commonFR
          },
          en: {
            common: commonEN
          }
        },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'aidassist-language',
      checkWhitelist: true
    },

    defaultNS: 'common',
    ns: ['common'],

    supportedLngs: ['fr', 'en'],
    nonExplicitSupportedLngs: true,

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    },

    // Configuration avancée
    load: 'languageOnly',
    preload: ['fr', 'en'],
    
    // Gestion des clés manquantes
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

/**
 * Utilitaires pour i18n
 */
export const i18nUtils = {
  /**
   * Change la langue et met à jour l'URL
   */
  changeLanguage: async (lng: string) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('aidassist-language', lng);
  },

  /**
   * Obtient toutes les langues supportées
   */
  getSupportedLanguages: () => ['fr', 'en'],

  /**
   * Vérifie si une langue est supportée
   */
  isLanguageSupported: (lng: string) => ['fr', 'en'].includes(lng),

  /**
   * Obtient la langue par défaut
   */
  getDefaultLanguage: () => 'fr',

  /**
   * Formate une date selon la locale
   */
  formatDate: (date: Date, locale: string = i18n.language) => {
    return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(date);
  },

  /**
   * Formate un nombre selon la locale
   */
  formatNumber: (number: number, locale: string = i18n.language) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(number);
  },

  /**
   * Formate une devise selon la locale
   */
  formatCurrency: (amount: number, currency: string = 'EUR', locale: string = i18n.language) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }
};