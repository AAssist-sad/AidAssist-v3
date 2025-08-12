import React from 'react';
import { Heart } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">AidAssist</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Simplifiez vos démarches administratives
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Une plateforme complète pour gérer les rendez-vous, documents et démarches 
              de vos proches en toute sécurité.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '📅', title: 'Rendez-vous', desc: 'Gestion complète' },
              { icon: '📄', title: 'Documents', desc: 'Stockage sécurisé' },
              { icon: '🤝', title: 'Collaboration', desc: 'Équipe d\'aidants' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-blue-200">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-blue-500 pt-6">
            <p className="text-sm text-blue-200">
              Conforme RGPD • Données chiffrées • Support 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center p-6">
          <div className="lg:hidden flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AidAssist</span>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>
            © 2024 AidAssist. Tous droits réservés. •{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Conditions d'utilisation
            </a>{' '}
            •{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};