import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToReset }) => {
  const { signIn, loading, error: authError } = useAuth();
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await signIn(formData.email, formData.password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError('');
  };

  const displayError = localError || authError;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p className="text-gray-600">Accédez à votre espace AidAssist</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-red-700 text-sm font-medium">{displayError}</p>
              {displayError.includes('Email ou mot de passe incorrect') && (
                <p className="text-red-600 text-xs mt-1">
                  Pas encore de compte ? {' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="underline hover:no-underline"
                  >
                    Créez-en un ici
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">{displayError}</p>
              {displayError.includes('Email non confirmé') && (
                <div className="mt-2 text-sm text-red-600">
                  <p className="mb-2">Si vous n'avez pas reçu l'email de confirmation :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vérifiez votre dossier spam</li>
                    <li>Contactez le support technique</li>
                  </ul>
                </div>
              )}
              {displayError.includes('Email ou mot de passe incorrect') && (
                <p className="mt-2 text-sm text-red-600">
                  Pas encore de compte ? {' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="underline hover:no-underline"
                  >
                    Créez-en un ici
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
          </label>
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Créer un compte
          </button>
        </p>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">🇫🇷 FranceConnect</h3>
        <p className="text-sm text-blue-800 mb-3">
          Pour vos démarches officielles, vous serez redirigé vers FranceConnect sur les sites gouvernementaux.
        </p>
        <p className="text-xs text-blue-700">
          AidAssist vous guide mais ne stocke pas vos identifiants FranceConnect.
        </p>
      </div>
    </div>
  );
};