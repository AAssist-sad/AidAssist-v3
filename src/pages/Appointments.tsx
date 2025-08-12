import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '../components/Appointments/Calendar';
import { NewAppointmentModal } from '../components/Dashboard/NewAppointmentModal';
import { Appointment } from '../types';

export const Appointments: React.FC = () => {
  const { t } = useTranslation('common');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = React.useState(false);

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Consultation cardiologue',
      description: 'Contrôle annuel',
      date: new Date(2024, 11, 28, 14, 30),
      duration: 30,
      location: 'Hôpital Saint-Joseph',
      type: 'consultation',
      aidedPersonId: '1',
      accompaniedBy: 'Marie Dupont',
      documents: [],
      status: 'scheduled',
      reminder: { enabled: true, timeBeforeInMinutes: 60 }
    },
    {
      id: '2',
      title: 'Téléconsultation',
      description: 'Suivi médication',
      date: new Date(2024, 11, 30, 10, 0),
      duration: 20,
      location: 'En ligne',
      type: 'teleconsultation',
      aidedPersonId: '1',
      documents: [],
      status: 'scheduled',
      reminder: { enabled: true, timeBeforeInMinutes: 30 }
    },
    {
      id: '3',
      title: 'Prise de sang',
      date: new Date(2024, 11, 26, 8, 30),
      duration: 15,
      location: 'Laboratoire Biopath',
      type: 'consultation',
      aidedPersonId: '2',
      documents: [],
      status: 'scheduled',
      reminder: { enabled: true, timeBeforeInMinutes: 120 }
    },
    {
      id: '4',
      title: 'Consultation dentiste',
      date: new Date(2025, 0, 5, 16, 0),
      duration: 45,
      location: 'Cabinet Dr. Rousseau',
      type: 'consultation',
      aidedPersonId: '1',
      documents: [],
      status: 'scheduled',
      reminder: { enabled: true, timeBeforeInMinutes: 60 }
    }
  ];

  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    console.log('Nouveau rendez-vous créé:', appointmentData);
    // Here you would typically save to your backend/state management
    setShowNewAppointmentModal(false);
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <Calendar 
          appointments={appointments} 
          onNewAppointment={handleNewAppointment}
        />
      </div>

      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSave={handleSaveAppointment}
      />
    </>
  );
};