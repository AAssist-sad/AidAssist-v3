import React from 'react';
import { Calendar, Clock, MapPin, User, Phone, FileText, Video, Stethoscope, ExternalLink } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const handleLocationClick = (location: string) => {
    // Ouvrir Google Maps avec l'adresse recherchée
    const encodedLocation = encodeURIComponent(location.trim());
    const googleMapsUrl = `https://www.google.com/maps/search/${encodedLocation}`;
    
    // Ouvrir dans un nouvel onglet
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'consultation': 
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: Stethoscope,
          label: 'Consultation'
        };
      case 'hospital': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200', 
          icon: Calendar,
          label: 'Hôpital'
        };
      case 'teleconsultation': 
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          icon: Video,
          label: 'Téléconsultation'
        };
      case 'emergency': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200', 
          icon: Calendar,
          label: 'Urgence'
        };
      case 'analysis': 
        return { 
          color: 'bg-violet-50 text-violet-700 border-violet-200', 
          icon: FileText,
          label: 'Analyse'
        };
      case 'specialist': 
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: User,
          label: 'Spécialiste'
        };
      default: 
        return { 
          color: 'bg-gray-50 text-gray-700 border-gray-200', 
          icon: Calendar,
          label: 'Rendez-vous'
        };
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    let dateStr = '';
    if (isToday) dateStr = 'Aujourd\'hui';
    else if (isTomorrow) dateStr = 'Demain';
    else dateStr = date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: '2-digit', 
      month: 'short' 
    });
    
    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-emerald-500';
      case 'cancelled': return 'bg-red-500';
      case 'rescheduled': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const typeConfig = getTypeConfig(appointment.type);
  const TypeIcon = typeConfig.icon;
  const { dateStr, timeStr } = formatDate(appointment.date);

  return (
    <div className="card card-interactive p-6 group relative overflow-hidden animate-fade-in">
      {/* Indicateur de statut */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(appointment.status)} rounded-r-full`}></div>
      
      {/* En-tête */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <h3 className="font-bold text-gray-900 text-xl leading-tight tracking-tight flex-1">{appointment.title}</h3>
            <span className={`status ${typeConfig.color} flex-shrink-0`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeConfig.label}
            </span>
          </div>
          
          {appointment.description && (
            <p className="text-base text-gray-700 mb-4 leading-relaxed">{appointment.description}</p>
          )}
          
          {appointment.doctorName && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{appointment.doctorName}</p>
                {appointment.specialty && (
                  <p className="text-sm text-gray-600 font-medium">{appointment.specialty}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions rapides */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 flex-shrink-0">
          <button className="btn btn-ghost btn-sm focus-ring" aria-label="Modifier le rendez-vous">
            <Calendar className="w-4 h-4 text-blue-600" />
          </button>
          <button 
            onClick={() => handleLocationClick(appointment.location)}
            className="btn btn-ghost btn-sm focus-ring"
            title="Voir l'itinéraire"
            aria-label="Voir l'itinéraire"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-base">{dateStr}</div>
            <div className="text-sm text-gray-600 font-medium">à {timeStr}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-base">{appointment.duration} minutes</div>
            <div className="text-sm text-gray-600 font-medium">Durée estimée</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-base truncate">{appointment.location}</div>
            <div className="text-sm text-gray-600 font-medium">Lieu du rendez-vous</div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => handleLocationClick(appointment.location)}
              className="btn btn-ghost btn-sm focus-ring"
              title="Ouvrir dans Google Maps"
              aria-label="Ouvrir dans Google Maps"
            >
              <ExternalLink className="w-4 h-4 text-violet-600" />
            </button>
          </div>
        </div>
        
        {appointment.accompaniedBy && (
          <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-base">Accompagné par</div>
              <div className="text-sm text-gray-600 font-medium">{appointment.accompaniedBy}</div>
            </div>
          </div>
        )}
      </div>

      {/* Rappel */}
      {appointment.reminder.enabled && (
        <div className="mt-6 pt-4 border-t border-gray-100 animate-fade-in">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-3 h-3 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-700 font-bold">
              Rappel {appointment.reminder.timeBeforeInMinutes} min avant
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-6 pt-4 border-t border-gray-100 animate-fade-in">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-600" />
              Notes
            </h5>
            <p className="text-sm text-gray-700 leading-relaxed">
            {appointment.notes}
          </p>
          </div>
        </div>
      )}
    </div>
  );
};