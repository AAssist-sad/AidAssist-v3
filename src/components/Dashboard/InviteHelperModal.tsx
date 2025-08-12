import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield, Send, AlertCircle, CheckCircle, Users, Info } from 'lucide-react';
import { AidedPerson } from '../../types';

interface InviteHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (inviteData: InviteData) => void;
  aidedPersons: AidedPerson[];
}

interface InviteData {
  email: string;
  role: 'lecture' | 'contributeur' | 'admin';
  aidedPersonId: string;
  message?: string;
}

export const InviteHelperModal: React.FC<InviteHelperModalProps> = ({
  isOpen,
  onClose,
  onSend,
  aidedPersons
}) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'contributeur' as 'lecture' | 'contributeur' | 'admin',
    aidedPersonId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Mock - should be selected from user's aided persons
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      value: 'lecture',
      label: 'Lecture seule',
      icon: '👁️',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Peut consulter les informations mais ne peut pas les modifier',
      permissions: [
        'Consulter les rendez-vous',
        'Voir les documents',
        'Accéder aux démarches',
        'Recevoir les notifications'
      ]
    },
    {
      value: 'contributeur',
      label: 'Contributeur',
      icon: '✏️',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Peut consulter et ajouter du contenu',
      permissions: [
        'Toutes les permissions de lecture',
        'Ajouter des rendez-vous',
        'Téléverser des documents',
        'Créer des démarches',
        'Modifier les informations'
      ]
    },
    {
      value: 'admin',
      label: 'Administrateur',
      icon: '👑',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Accès complet et gestion des droits',
      permissions: [
        'Toutes les permissions',
        'Inviter des aidants',
        'Gérer les droits d\'accès',
        'Supprimer du contenu',
        'Configurer les paramètres'
      ]
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    // Validation message personnalisé (optionnel mais limité)
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
      // Simuler l'envoi de l'invitation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const inviteData: InviteData = {
        email: formData.email,
        role: formData.role,
        aidedPersonId: formData.aidedPersonId,
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
      aidedPersonId: '1',
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const selectedRole = roles.find(role => role.value === formData.role);
  const selectedPerson = aidedPersons.find(person => person.id === formData.aidedPersonId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <UserPlus className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Inviter un aidant</h2>
                <p className="text-orange-100">Ajouter un collaborateur à votre équipe d'aidants</p>
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
          <form id="invite-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Information générale */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Comment ça marche ?
              </h3>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">1. Invitation</h4>
                    <p className="text-gray-600">Un email d'invitation sera envoyé à la personne</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">2. Acceptation</h4>
                    <p className="text-gray-600">Elle devra créer un compte et accepter l'invitation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">3. Collaboration</h4>
                    <p className="text-gray-600">Elle pourra accéder aux informations selon son rôle</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de l'invitation */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Informations de l'invitation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email de la personne à inviter *
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
                    Personne concernée *
                  </label>
                  <select
                    value={formData.aidedPersonId}
                    onChange={(e) => handleChange('aidedPersonId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    {aidedPersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle attribué *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Détails du rôle sélectionné */}
            {selectedRole && (
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Permissions du rôle "{selectedRole.label}"
                </h3>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{selectedRole.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedRole.label}</h4>
                      <p className="text-sm text-gray-600">{selectedRole.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRole.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message personnalisé */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Message personnalisé (optionnel)
              </h3>
              
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                  errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={`Bonjour,

Je vous invite à rejoindre mon équipe d'aidants pour m'aider dans l'accompagnement de ${selectedPerson?.name}.

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

            {/* Aperçu de l'invitation */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-yellow-600" />
                Aperçu de l'invitation
              </h3>
              
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="text-sm space-y-2">
                  <p><strong>À :</strong> {formData.email || 'exemple@email.com'}</p>
                  <p><strong>Objet :</strong> Invitation à rejoindre l'équipe d'aidants - {selectedPerson?.name}</p>
                  <p><strong>Rôle :</strong> {selectedRole?.label}</p>
                  <p><strong>Personne concernée :</strong> {selectedPerson?.name} ({selectedPerson?.relationship})</p>
                  {formData.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-orange-500">
                      <p className="text-xs text-gray-600 mb-1">Message personnalisé :</p>
                      <p className="text-sm italic">{formData.message}</p>
                    </div>
                  )}
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
                form="invite-form"
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