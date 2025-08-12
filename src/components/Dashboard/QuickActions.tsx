import React, { useState } from 'react';
import { Calendar, FileText, ClipboardList, UserPlus, MessageSquare, Search } from 'lucide-react';
import { NewAppointmentModal } from './NewAppointmentModal';
import { NewDocumentModal } from './NewDocumentModal';
import { NewProcedureModal } from './NewProcedureModal';
import { InviteHelperModal } from './InviteHelperModal';
import { QuickMessageModal } from './QuickMessageModal';
import { GlobalSearchModal } from '../Search/GlobalSearchModal';
import { Appointment } from '../../types';
import { AidedPerson } from '../../types';

interface QuickActionsProps {
  appointments: Appointment[];
  onNavigate: (page: string) => void;
  onCreateAppointment?: (appointmentData: any) => Promise<any>;
  aidedPersons: AidedPerson[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ appointments, onNavigate, onCreateAppointment, aidedPersons }) => {
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showNewProcedureModal, setShowNewProcedureModal] = useState(false);
  const [showInviteHelperModal, setShowInviteHelperModal] = useState(false);
  const [showQuickMessageModal, setShowQuickMessageModal] = useState(false);
  const [showGlobalSearchModal, setShowGlobalSearchModal] = useState(false);

  const actions = [
    {
      id: 'search',
      title: 'Recherche info',
      description: 'Recherche globale',
      icon: Search,
      color: 'bg-amber-500 hover:bg-amber-600',
      onClick: () => setShowGlobalSearchModal(true)
    },
    {
      id: 'appointment',
      title: 'Nouveau RDV',
      description: 'Programmer un rendez-vous',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setShowNewAppointmentModal(true)
    },
    {
      id: 'document',
      title: 'Ajouter document',
      description: 'Téléverser un fichier',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => setShowNewDocumentModal(true)
    },
    {
      id: 'procedure',
      title: 'Nouvelle démarche',
      description: 'Créer une procédure',
      icon: ClipboardList,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => setShowNewProcedureModal(true)
    },
    {
      id: 'invite',
      title: 'Inviter aidant',
      description: 'Ajouter un collaborateur',
      icon: UserPlus,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => setShowInviteHelperModal(true)
    },
    {
      id: 'message',
      title: 'Message rapide',
      description: 'Envoyer un message',
      icon: MessageSquare,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => setShowQuickMessageModal(true)
    }
  ];

  const handleSaveAppointment = async (appointmentData: any) => {
    // Convertir les données pour Supabase
    const supabaseData = {
      title: appointmentData.title,
      description: appointmentData.description,
      appointment_date: appointmentData.date.toISOString(),
      duration: appointmentData.duration,
      location: appointmentData.location,
      type: appointmentData.type,
      aided_person_id: appointmentData.aidedPersonId,
      accompanied_by: appointmentData.accompaniedBy,
      doctor_name: appointmentData.doctorName,
      specialty: appointmentData.specialty,
      reminder_enabled: appointmentData.reminder.enabled,
      reminder_minutes: appointmentData.reminder.timeBeforeInMinutes,
      notes: appointmentData.notes
    };
    
    try {
      if (onCreateAppointment) {
        await onCreateAppointment(supabaseData);
        console.log('✅ Rendez-vous créé avec succès !');
      } else {
        console.log('⚠️ Fonction de création non disponible');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      throw error;
    }
  };

  const handleSaveDocument = (documentData: any) => {
    // Here you would typically save to your backend/state management
    console.log('Nouveau document téléversé:', documentData);
    // You could also navigate to documents page to show the new document
    // onNavigate('documents');
  };

  const handleSaveProcedure = (procedureData: any) => {
    // Here you would typically save to your backend/state management
    console.log('Nouvelle démarche créée:', procedureData);
    // You could also navigate to procedures page to show the new procedure
    // onNavigate('procedures');
  };

  const handleInviteHelper = (inviteData: any) => {
    // Here you would typically save to your backend/state management
    console.log('Invitation envoyée:', inviteData);
    // You could also navigate to settings page to show the new invitation
    // onNavigate('settings');
  };

  const handleSendMessage = async (messageData: any) => {
    // Here you would typically send the message via your API
    console.log('Message envoyé:', messageData);
    
    // Simulate API call
    try {
      // Replace with actual API call
      // await sendMessageAPI(messageData);
      
      // Show success notification (you could add a toast notification here)
      console.log('Message envoyé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  return (
    <>
      <div className="card p-8 animate-fade-in bg-gradient-to-r from-white to-blue-50 border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 animate-pulse"></div>
          Actions rapides
          <div className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {actions.length} actions
          </div>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`${action.color} text-white p-6 rounded-2xl transition-all duration-300 text-center focus-ring group hover:shadow-xl hover:scale-105 transform`}
                aria-label={action.description}
              >
                <Icon className="w-7 h-7 mx-auto mb-3 group-hover:scale-125 transition-transform duration-300" />
                <div className="text-sm font-bold mb-1">{action.title}</div>
                <div className="text-xs opacity-90 font-medium leading-tight">{action.description}</div>
              </button>
            );
          })}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-lg font-black text-blue-600">6</div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Actions/jour</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-lg font-black text-green-600">98%</div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Efficacité</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-lg font-black text-purple-600">2.3s</div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Temps moyen</div>
          </div>
        </div>
      </div>

      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSave={handleSaveAppointment}
        aidedPersons={aidedPersons}
      />

      <NewDocumentModal
        isOpen={showNewDocumentModal}
        onClose={() => setShowNewDocumentModal(false)}
        onSave={handleSaveDocument}
        aidedPersons={aidedPersons}
      />

      <NewProcedureModal
        isOpen={showNewProcedureModal}
        onClose={() => setShowNewProcedureModal(false)}
        onSave={handleSaveProcedure}
        aidedPersons={aidedPersons}
      />

      <InviteHelperModal
        isOpen={showInviteHelperModal}
        onClose={() => setShowInviteHelperModal(false)}
        onSend={handleInviteHelper}
        aidedPersons={aidedPersons}
      />

      <QuickMessageModal
        isOpen={showQuickMessageModal}
        onClose={() => setShowQuickMessageModal(false)}
        onSend={handleSendMessage}
      />

      <GlobalSearchModal
        isOpen={showGlobalSearchModal}
        onClose={() => setShowGlobalSearchModal(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};