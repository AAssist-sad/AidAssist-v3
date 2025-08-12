import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield, Send, AlertCircle, Info, Users } from 'lucide-react';

interface InviteAidantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSend: (inviteData: any) => void;
}

export const InviteAidantModal: React.FC<InviteAidantModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSend
}) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'contributeur' as 'lecture' | 'contributeur' | 'admin',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      value: 'lecture',
      label: 'Lecture seule',
      icon: '👁️',
      description: 'Peut consulter les informations mais ne peut pas les modifier'
    },
    {
      value: 'contributeur',
      label: 'Contributeur',
      icon: '✏️',
      description: 'Peut consulter et ajouter du contenu'
    },
    {
      value: 'admin',
      label: 'Administrateur',
      icon: '👑',
      description: 'Accès complet et gestion des droits'
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (formData.message && formData.message.length > 500) {
      newErrors.message = 'Le message ne peut pas dépasser 500 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const inviteData = {
        email: formData.email,
        role: formData.role,
        message: formData.message || undefined
      };

      onSend(inviteData);
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Erreur lors de l\'envoi de l\'invitation' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      role: 'contributeur',
      message: ''
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <UserPlus className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Inviter un aidant</h2>
                <p className="text-orange-100">Pour {profile?.firstName} {profile?.lastName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Information */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Comment ça marche ?
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• Un email d'invitation sera envoyé à la personne</p>
                <p>• Elle devra créer un compte et accepter l'invitation</p>
                <p>• Elle pourra alors accéder aux informations selon son rôle</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Invitation
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="exemple@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle attribué *
                  </label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          formData.role === role.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={(e) => handleChange('role', e.target.value)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <div className="text-2xl">{role.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{role.label}</div>
                          <div className="text-sm text-gray-600">{role.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message personnalisé (optionnel)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                      errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={`Bonjour,

Je vous invite à rejoindre mon équipe d'aidants pour m'aider dans l'accompagnement de ${profile?.firstName}.

Cordialement`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.message.length}/500 caractères
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              * Champs obligatoires
            </p>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Envoi...' : 'Envoyer l\'invitation'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};