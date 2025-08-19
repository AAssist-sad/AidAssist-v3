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
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(appointment.status)}`}></div>

      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight tracking-tight">{appointment.title}</h3>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${typeConfig.color}`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeConfig.label}
            </span>
          </div>

          {appointment.description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed font-medium">{appointment.description}</p>
          )}

          {appointment.doctorName && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center micro-bounce">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{appointment.doctorName}</p>
                {appointment.specialty && (
                  <p className="text-xs text-gray-500">{appointment.specialty}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
          <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleLocationClick(appointment.location)}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-200 shadow-sm"
            title="Voir l'itinéraire"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center micro-bounce">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-semibold text-gray-900">{dateStr}</span>
            <span className="text-gray-600 ml-2">à {timeStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center micro-bounce">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-gray-700 font-semibold">{appointment.duration} minutes</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center micro-bounce">
            <MapPin className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex items-center justify-between flex-1">
            <span className="text-gray-700 font-semibold truncate">{appointment.location}</span>
            <button
              onClick={() => handleLocationClick(appointment.location)}
              className="ml-2 p-1 text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded transition-colors duration-200 micro-bounce"
              title="Ouvrir dans Google Maps"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {appointment.accompaniedBy && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center micro-bounce">
              <User className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-gray-700 font-semibold">Accompagné par {appointment.accompaniedBy}</span>
          </div>
        )}
      </div>

      {/* Rappel */}
      {appointment.reminder && appointment.reminder.enabled && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 bg-yellow-50 rounded-lg flex items-center justify-center micro-bounce">
              <Clock className="w-3 h-3 text-yellow-600" />
            </div>
            <span className="text-gray-600 font-semibold">
              Rappel {appointment.reminder.timeBeforeInMinutes} min avant
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
          <p className="text-xs text-gray-600 italic leading-relaxed bg-gray-50 p-3 rounded-xl font-medium">
            {appointment.notes}
          </p>
        </div>
      )}
    </div>
  );
};
