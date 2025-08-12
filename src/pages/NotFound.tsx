import React from 'react';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '../hooks/useRouter';

export const NotFound: React.FC = () => {
  const { t } = useTranslation('common');
  const { navigate, generateLink } = useRouter();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
          <div className="text-8xl font-black text-gray-200 mb-4">404</div>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('errors.pageNotFound') || 'Page non trouvée'}
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {t('errors.pageNotFoundDescription') || 
             'La page que vous recherchez n\'existe pas ou a été déplacée. Vérifiez l\'URL ou utilisez la navigation pour retourner à l\'accueil.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>{t('common.goHome') || 'Retour à l\'accueil'}</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.goBack') || 'Page précédente'}</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            {t('common.helpfulLinks') || 'Liens utiles'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { path: '/', label: t('nav.dashboard') || 'Tableau de bord', icon: '📊' },
              { path: '/appointments', label: t('nav.appointments') || 'Rendez-vous', icon: '📅' },
              { path: '/documents', label: t('nav.documents') || 'Documents', icon: '📄' },
              { path: '/profiles', label: t('nav.profiles') || 'Profils', icon: '👥' }
            ].map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="flex flex-col items-center space-y-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-sm font-medium text-gray-700">{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {t('errors.stillNeedHelp') || 'Vous avez encore besoin d\'aide ?'}
          </p>
          <a
            href="mailto:support@aidassist.fr"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>{t('common.contactSupport') || 'Contacter le support'}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};