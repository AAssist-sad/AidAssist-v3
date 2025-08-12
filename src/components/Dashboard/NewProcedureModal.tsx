import React, { useState } from 'react';
import { X, ClipboardList, Plus, Trash2, ExternalLink, Calendar, AlertTriangle, Save, CheckCircle, Clock, User } from 'lucide-react';
import { Procedure, ProcedureStep } from '../../types';
import { AidedPerson } from '../../types';

interface NewProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  aidedPersons: AidedPerson[];
}

export const NewProcedureModal: React.FC<NewProcedureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  aidedPersons
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'caf' as Procedure['category'],
    aidedPersonId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Mock - should be selected from user's aided persons
    priority: 'medium' as Procedure['priority'],
    dueDate: '',
    language: 'fr' as 'fr' | 'en'
  });

  const [steps, setSteps] = useState<Omit<ProcedureStep, 'id'>[]>([
    {
      title: '',
      description: '',
      completed: false,
      externalLink: '',
      notes: ''
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'caf', label: 'CAF', icon: '👨‍👩‍👧‍👦', description: 'Caisse d\'Allocations Familiales' },
    { value: 'ameli', label: 'AMELI', icon: '🏥', description: 'Assurance Maladie' },
    { value: 'cnav', label: 'CNAV', icon: '🏛️', description: 'Caisse Nationale d\'Assurance Vieillesse' },
    { value: 'prefecture', label: 'Préfecture', icon: '🏢', description: 'Services préfectoraux' },
    { value: 'mdph', label: 'MDPH', icon: '♿', description: 'Maison Départementale des Personnes Handicapées' },
    { value: 'other', label: 'Autre', icon: '📋', description: 'Autre organisme' }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-800', icon: '🟢' },
    { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    { value: 'high', label: 'Élevée', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: '🔴' }
  ];

  const procedureTemplates = [
    {
      category: 'caf',
      title: 'Demande d\'allocations familiales',
      description: 'Procédure pour obtenir les allocations familiales',
      steps: [
        { title: 'Créer un compte CAF en ligne', description: 'Inscription sur caf.fr avec vos identifiants', externalLink: 'https://www.caf.fr' },
        { title: 'Remplir le formulaire de demande', description: 'Compléter toutes les informations personnelles et familiales' },
        { title: 'Joindre les pièces justificatives', description: 'Scanner et téléverser tous les documents requis' },
        { title: 'Envoyer la demande', description: 'Valider et soumettre le dossier complet' },
        { title: 'Suivre le traitement', description: 'Vérifier l\'avancement sur votre espace personnel' }
      ]
    },
    {
      category: 'ameli',
      title: 'Demande de remboursement',
      description: 'Procédure pour obtenir un remboursement de frais médicaux',
      steps: [
        { title: 'Se connecter à son compte AMELI', description: 'Accès via ameli.fr avec vos identifiants', externalLink: 'https://www.ameli.fr' },
        { title: 'Télécharger les factures', description: 'Scanner les feuilles de soins et factures' },
        { title: 'Remplir la demande en ligne', description: 'Compléter le formulaire de remboursement' },
        { title: 'Envoyer la demande', description: 'Valider et soumettre avec les pièces jointes' }
      ]
    },
    {
      category: 'prefecture',
      title: 'Demande de carte d\'identité',
      description: 'Procédure pour obtenir ou renouveler une carte d\'identité',
      steps: [
        { title: 'Prendre rendez-vous en ligne', description: 'Réserver un créneau sur le site de la préfecture' },
        { title: 'Préparer les documents', description: 'Rassembler pièces d\'identité et justificatifs' },
        { title: 'Se rendre au rendez-vous', description: 'Présenter les documents et faire les photos' },
        { title: 'Récupérer la carte', description: 'Retirer la nouvelle carte d\'identité' }
      ]
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (steps.length === 0 || steps.every(step => !step.title.trim())) {
      newErrors.steps = 'Au moins une étape est obligatoire';
    }

    steps.forEach((step, index) => {
      if (!step.title.trim()) {
        newErrors[`step_${index}_title`] = 'Le titre de l\'étape est obligatoire';
      }
    });

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      if (dueDate <= today) {
        newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const procedureSteps: ProcedureStep[] = steps
      .filter(step => step.title.trim())
      .map((step, index) => ({
        id: `step_${index + 1}`,
        title: step.title,
        description: step.description,
        completed: false,
        externalLink: step.externalLink || undefined,
        notes: step.notes || undefined
      }));

    const newProcedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      steps: procedureSteps,
      language: formData.language,
      aidedPersonId: formData.aidedPersonId,
      progress: 0,
      status: 'not_started',
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    };

    onSave(newProcedure);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'caf',
      aidedPersonId: aidedPersons.length > 0 ? aidedPersons[0].id : '',
      priority: 'medium',
      dueDate: '',
      language: 'fr'
    });
    setSteps([{
      title: '',
      description: '',
      completed: false,
      externalLink: '',
      notes: ''
    }]);
    setErrors({});
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

  const handleStepChange = (index: number, field: string, value: string) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    ));

    // Clear step error
    const errorKey = `step_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addStep = () => {
    setSteps(prev => [...prev, {
      title: '',
      description: '',
      completed: false,
      externalLink: '',
      notes: ''
    }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(prev => prev.filter((_, i) => i !== index));
    }
  };

  const loadTemplate = (template: typeof procedureTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      category: template.category as Procedure['category']
    }));

    setSteps(template.steps.map(step => ({
      title: step.title,
      description: step.description,
      completed: false,
      externalLink: step.externalLink || '',
      notes: ''
    })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nouvelle démarche</h2>
                <p className="text-purple-100">Créer une procédure administrative guidée</p>
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
          <form id="procedure-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Templates */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Modèles prédéfinis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {procedureTemplates.map((template, index) => {
                  const category = categories.find(c => c.value === template.category);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => loadTemplate(template)}
                      className="p-4 border-2 border-indigo-200 rounded-xl text-left hover:border-indigo-400 hover:bg-indigo-100 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{category?.icon}</span>
                        <span className="font-medium text-gray-900">{category?.label}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{template.title}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <p className="text-xs text-indigo-600 mt-2">{template.steps.length} étapes</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la démarche *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Demande d'allocations familiales"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez l'objectif de cette démarche..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisme *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label} - {category.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personne concernée
                  </label>
                  <select
                    value={formData.aidedPersonId}
                    onChange={(e) => handleChange('aidedPersonId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    <option value="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11">Marie Dupont</option>
                    <option value="b1fccb00-0d1c-5fe9-cc7e-7cc0ce491b22">Pierre Martin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.icon} {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                      errors.dueDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Étapes de la démarche
                </h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une étape</span>
                </button>
              </div>

              {errors.steps && (
                <p className="mb-4 text-sm text-red-600">{errors.steps}</p>
              )}

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Étape {index + 1}</h4>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre de l'étape *
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                            errors[`step_${index}_title`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Ex: Créer un compte en ligne"
                        />
                        {errors[`step_${index}_title`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_title`]}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Détails sur cette étape..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lien externe
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={step.externalLink}
                            onChange={(e) => handleStepChange(index, 'externalLink', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="https://..."
                          />
                          {step.externalLink && (
                            <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={step.notes}
                          onChange={(e) => handleStepChange(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Notes particulières..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="procedure-form"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};