import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, Bell, Save, AlertCircle } from 'lucide-react';
import { Appointment } from '../../types';
import { AidedPerson } from '../../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  aidedPersons: AidedPerson[];
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  aidedPersons
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 30,
    location: '',
    type: 'consultation' as Appointment['type'],
    aidedPersonId: aidedPersons && aidedPersons.length > 0 ? aidedPersons[0].id : '',
    accompaniedBy: '',
    doctorName: '',
    specialty: '',
    notes: '',
    reminder: {
      enabled: true,
      timeBeforeInMinutes: 60
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', icon: '🩺' },
    { value: 'hospital', label: 'Hôpital', icon: '🏥' },
    { value: 'teleconsultation', label: 'Téléconsultation', icon: '💻' },
    { value: 'emergency', label: 'Urgence', icon: '🚨' },
    { value: 'analysis', label: 'Analyse', icon: '🔬' },
    { value: 'specialist', label: 'Spécialiste', icon: '👨‍⚕️' }
  ];

  const reminderOptions = [
    { value: 15, label: '15 minutes avant' },
    { value: 30, label: '30 minutes avant' },
    { value: 60, label: '1 heure avant' },
    { value: 120, label: '2 heures avant' },
    { value: 1440, label: '1 jour avant' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }

    if (!formData.time) {
      newErrors.time = 'L\'heure est obligatoire';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est obligatoire';
    }

    if (formData.duration < 5 || formData.duration > 480) {
      newErrors.duration = 'La durée doit être entre 5 et 480 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Combine date and time
    const appointmentDate = new Date(`${formData.date}T${formData.time}`);

    const newAppointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      title: formData.title,
      description: formData.description || undefined,
      date: appointmentDate,
      duration: formData.duration,
      location: formData.location,
      type: formData.type,
      aidedPersonId: formData.aidedPersonId,
      accompaniedBy: formData.accompaniedBy || undefined,
      documents: [],
      status: 'scheduled',
      reminder: formData.reminder,
      notes: formData.notes || undefined,
      doctorName: formData.doctorName || undefined,
      specialty: formData.specialty || undefined
    };

    try {
      onSave(newAppointment);
      console.log('📅 Rendez-vous programmé:', newAppointment);
      handleClose();
    } catch (error) {
      console.error('❌ Erreur lors de la programmation:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde du rendez-vous' });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 30,
      location: '',
      type: 'consultation',
      aidedPersonId: aidedPersons.length > 0 ? aidedPersons[0].id : '',
      accompaniedBy: '',
      doctorName: '',
      specialty: '',
      notes: '',
      reminder: {
        enabled: true,
        timeBeforeInMinutes: 60
      }
    });
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

  const handleReminderChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nouveau rendez-vous</h2>
                <p className="text-blue-100">Programmer un nouveau rendez-vous médical</p>
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
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du rendez-vous *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Consultation cardiologue"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Détails sur le rendez-vous..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de rendez-vous *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {!aidedPersons || aidedPersons.length === 0 ? (
                      <option value="">Aucune personne aidée disponible</option>
                    ) : (
                      aidedPersons.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Date et heure
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.time}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', parseInt(e.target.value) || 30)}
                    min="5"
                    max="480"
                    step="5"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.duration ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location and People */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Lieu et personnes
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu du rendez-vous *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Hôpital Saint-Joseph, 123 rue de la Santé, Paris"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du médecin
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => handleChange('doctorName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Dr. Martin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Cardiologie"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accompagné par
                  </label>
                  <input
                    type="text"
                    value={formData.accompaniedBy}
                    onChange={(e) => handleChange('accompaniedBy', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Nom de la personne qui accompagne"
                  />
                </div>
              </div>
            </div>

            {/* Reminder */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Rappel
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={formData.reminder.enabled}
                    onChange={(e) => handleReminderChange('enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="reminderEnabled" className="text-sm font-medium text-gray-700">
                    Activer le rappel
                  </label>
                </div>

                {formData.reminder.enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rappel
                    </label>
                    <select
                      value={formData.reminder.timeBeforeInMinutes}
                      onChange={(e) => handleReminderChange('timeBeforeInMinutes', parseInt(e.target.value))}
                      className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      {reminderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes additionnelles
              </h3>
              
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Notes, instructions particulières, documents à apporter..."
              />
            </div>

            {/* Error Display */}
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

        {/* Footer avec boutons */}
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
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
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