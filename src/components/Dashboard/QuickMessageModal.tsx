import React, { useState } from 'react';
import { X, MessageSquare, Send, AlertTriangle, Info, Clock, HelpCircle, Users, User, Mail } from 'lucide-react';

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: MessageData) => void;
}

interface MessageData {
  recipients: string[];
  recipientType: 'individual' | 'team';
  type: 'information' | 'urgent' | 'rappel' | 'question';
  priority: 'low' | 'medium' | 'high';
  subject: string;
  message: string;
}

export const QuickMessageModal: React.FC<QuickMessageModalProps> = ({
  isOpen,
  onClose,
  onSend
}) => {
  const [formData, setFormData] = useState({
    recipients: [] as string[],
    recipientType: 'individual' as 'individual' | 'team',
    type: 'information' as 'information' | 'urgent' | 'rappel' | 'question',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - should come from your user management system
  const availableUsers = [
    { id: '1', name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'admin' },
    { id: '2', name: 'Pierre Martin', email: 'pierre.martin@email.com', role: 'contributeur' },
    { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'lecture' },
    { id: '4', name: 'Jean Durand', email: 'jean.durand@email.com', role: 'contributeur' }
  ];

  const teams = [
    { id: 'all', name: 'Toute l\'équipe', members: availableUsers.length },
    { id: 'admins', name: 'Administrateurs', members: availableUsers.filter(u => u.role === 'admin').length },
    { id: 'contributors', name: 'Contributeurs', members: availableUsers.filter(u => u.role === 'contributeur').length }
  ];

  const messageTypes = [
    {
      value: 'information',
      label: 'Information',
      icon: Info,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      priority: 'medium',
      description: 'Information générale à partager'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800 border-red-200',
      priority: 'high',
      description: 'Message nécessitant une attention immédiate'
    },
    {
      value: 'rappel',
      label: 'Rappel',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      priority: 'medium',
      description: 'Rappel d\'une tâche ou d\'un événement'
    },
    {
      value: 'question',
      label: 'Question',
      icon: HelpCircle,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      priority: 'medium',
      description: 'Question nécessitant une réponse'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'bg-green-500', textColor: 'text-green-700' },
    { value: 'medium', label: 'Moyenne', color: 'bg-blue-500', textColor: 'text-blue-700' },
    { value: 'high', label: 'Élevée', color: 'bg-red-500', textColor: 'text-red-700' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation des destinataires
    if (formData.recipients.length === 0) {
      newErrors.recipients = 'Veuillez sélectionner au moins un destinataire';
    }

    // Validation du sujet
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est obligatoire';
    } else if (formData.subject.length > 100) {
      newErrors.subject = 'Le sujet ne peut pas dépasser 100 caractères';
    }

    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Le message ne peut pas dépasser 1000 caractères';
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
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const messageData: MessageData = {
        recipients: formData.recipients,
        recipientType: formData.recipientType,
        type: formData.type,
        priority: formData.priority,
        subject: formData.subject,
        message: formData.message
      };

      onSend(messageData);
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Erreur lors de l\'envoi du message' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Réinitialisation automatique du formulaire
    setFormData({
      recipients: [],
      recipientType: 'individual',
      type: 'information',
      priority: 'medium',
      subject: '',
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

    // Auto-ajustement de la priorité selon le type
    if (field === 'type') {
      const selectedType = messageTypes.find(t => t.value === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          priority: selectedType.priority as 'low' | 'medium' | 'high'
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRecipientToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(userId)
        ? prev.recipients.filter(id => id !== userId)
        : [...prev.recipients, userId]
    }));
  };

  const handleTeamSelect = (teamId: string) => {
    let newRecipients: string[] = [];
    
    switch (teamId) {
      case 'all':
        newRecipients = availableUsers.map(u => u.id);
        break;
      case 'admins':
        newRecipients = availableUsers.filter(u => u.role === 'admin').map(u => u.id);
        break;
      case 'contributors':
        newRecipients = availableUsers.filter(u => u.role === 'contributeur').map(u => u.id);
        break;
    }

    setFormData(prev => ({
      ...prev,
      recipients: newRecipients
    }));
  };

  const selectedType = messageTypes.find(t => t.value === formData.type);
  const selectedPriority = priorities.find(p => p.value === formData.priority);
  const selectedUsers = availableUsers.filter(u => formData.recipients.includes(u.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Message rapide</h2>
                <p className="text-indigo-100">Envoyer un message à votre équipe d'aidants</p>
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
          <form id="message-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection des destinataires */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Destinataires
              </h3>
              
              {/* Type de sélection */}
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recipientType"
                    value="individual"
                    checked={formData.recipientType === 'individual'}
                    onChange={(e) => handleChange('recipientType', e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Individuel</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recipientType"
                    value="team"
                    checked={formData.recipientType === 'team'}
                    onChange={(e) => handleChange('recipientType', e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Équipe</span>
                </label>
              </div>

              {/* Sélection équipe */}
              {formData.recipientType === 'team' && (
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleTeamSelect(team.id)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors duration-200 text-left"
                      >
                        <div className="font-medium text-gray-900">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.members} membre(s)</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection individuelle */}
              {formData.recipientType === 'individual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {availableUsers.map((user) => (
                    <label
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                        formData.recipients.includes(user.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.recipients.includes(user.id)}
                        onChange={() => handleRecipientToggle(user.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'contributeur' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Destinataires sélectionnés */}
              {selectedUsers.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Destinataires sélectionnés ({selectedUsers.length}) :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                      >
                        {user.name}
                        <button
                          type="button"
                          onClick={() => handleRecipientToggle(user.id)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.recipients && (
                <p className="mt-2 text-sm text-red-600">{errors.recipients}</p>
              )}
            </div>

            {/* Type et priorité */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Type et priorité
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type de message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type de message *
                  </label>
                  <div className="space-y-2">
                    {messageTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                            formData.type === type.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="messageType"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-600">{type.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Priorité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priorité *
                  </label>
                  <div className="space-y-2">
                    {priorities.map((priority) => (
                      <label
                        key={priority.value}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          formData.priority === priority.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={(e) => handleChange('priority', e.target.value)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <div className={`w-4 h-4 rounded-full ${priority.color}`}></div>
                        <span className={`font-medium ${priority.textColor}`}>{priority.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu du message */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contenu du message
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Sujet de votre message..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.subject && (
                      <p className="text-sm text-red-600">{errors.subject}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.subject.length}/100 caractères
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={6}
                    maxLength={1000}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tapez votre message ici..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.message.length}/1000 caractères
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aperçu */}
            {formData.subject && formData.message && selectedUsers.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-yellow-600" />
                  Aperçu du message
                </h3>
                
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">À :</span>
                      <span>{selectedUsers.map(u => u.name).join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Type :</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedType?.color}`}>
                        {selectedType && <selectedType.icon className="w-3 h-3 mr-1" />}
                        {selectedType?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Priorité :</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${selectedPriority?.color}`}></div>
                        <span className={selectedPriority?.textColor}>{selectedPriority?.label}</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-medium">Sujet :</span>
                      <span>{formData.subject}</span>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                      <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
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
                form="message-form"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Envoi...' : 'Envoyer'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};