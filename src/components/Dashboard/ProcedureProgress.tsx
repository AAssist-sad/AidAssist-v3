import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Procedure } from '../../types';

interface ProcedureProgressProps {
  procedures: Procedure[];
}

export const ProcedureProgress: React.FC<ProcedureProgressProps> = ({ procedures }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'En retard';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays <= 7) return `Dans ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-4">
      {procedures.map((procedure) => {
        const PriorityIcon = getPriorityIcon(procedure.priority);
        const completedSteps = procedure.steps.filter(step => step.completed).length;
        
        return (
          <div key={procedure.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{procedure.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{procedure.description}</p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(procedure.priority)}`}>
                    <PriorityIcon className="w-3 h-3 mr-1" />
                    {procedure.priority}
                  </span>
                  
                  {procedure.dueDate && (
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDueDate(procedure.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">Progression</span>
                <span className="text-xs text-gray-600">{completedSteps}/{procedure.steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${procedure.progress}%` }}
                />
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              {procedure.steps.filter(step => !step.completed).slice(0, 2).map((step) => (
                <div key={step.id} className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  <span className="text-gray-700 truncate">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};