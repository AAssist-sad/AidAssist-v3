import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSwitchToLogin }) => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (isEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé !</h1>
        
        <p className="text-gray-600 mb-6">
          Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
          Vérifiez votre boîte de réception et suivez les instructions.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Retour à la connexion
          </button>
          
          <button
            onClick={() => setIsEmailSent(false)}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
          >
            Renvoyer l'email
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Conseil :</strong> Vérifiez aussi vos spams. L'email peut prendre quelques minutes à arriver.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={onSwitchToLogin}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la connexion
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
        <p className="text-gray-600">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Envoyer le lien de réinitialisation'
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Besoin d'aide ?</h3>
        <p className="text-sm text-blue-800">
          Si vous ne recevez pas l'email, contactez notre support à{' '}
          <a href="mailto:support@aidassist.fr" className="underline">
            support@aidassist.fr
          </a>
        </p>
      </div>
    </div>
  );
};