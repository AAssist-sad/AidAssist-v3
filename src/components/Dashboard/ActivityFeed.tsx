import React from 'react';
import { Calendar, FileText, CheckCircle, User, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: Date;
  user: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment_created': return Calendar;
      case 'document_uploaded': return FileText;
      case 'procedure_completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment_created': return 'text-blue-600 bg-blue-100';
      case 'document_uploaded': return 'text-green-600 bg-green-100';
      case 'procedure_completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (time: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return time.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const colorClass = getActivityColor(activity.type);
        
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass} flex-shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                <span className="text-xs text-gray-500">{formatTime(activity.time)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center space-x-1 mt-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.user}</span>
              </div>
            </div>
            
            {index < activities.length - 1 && (
              <div className="absolute left-4 mt-8 w-px h-4 bg-gray-200"></div>
            )}
          </div>
        );
      })}
      
      <div className="text-center pt-4">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir toute l'activité →
        </button>
      </div>
    </div>
  );
};