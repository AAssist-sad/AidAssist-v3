import React from 'react';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Checklist } from '../../types';

interface ProcedureCardProps {
  checklist: Checklist;
  onUpdateProgress: (id: string, stepId: string, completed: boolean) => void;
}

export const ProcedureCard: React.FC<ProcedureCardProps> = ({ checklist, onUpdateProgress }) => {
  const completedSteps = checklist.steps.filter(step => step.completed).length;
  const totalSteps = checklist.steps.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'caf': return '👨‍👩‍👧‍👦';
      case 'ameli': return '🏥';
      case 'cnav': return '🏛️';
      case 'prefecture': return '🏢';
      default: return '📋';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'caf': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'ameli': return 'bg-green-50 border-green-200 text-green-700';
      case 'cnav': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'prefecture': return 'bg-orange-50 border-orange-200 text-orange-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl ${getCategoryColor(checklist.category)}`}>
              {getCategoryIcon(checklist.category)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{checklist.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{checklist.description}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            progressPercent === 100 
              ? 'bg-green-100 text-green-800'
              : progressPercent > 0 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {progressPercent === 100 ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Terminé
              </>
            ) : progressPercent > 0 ? (
              <>
                <Clock className="w-3 h-3 mr-1" />
                En cours
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                À commencer
              </>
            )}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">{completedSteps}/{totalSteps} étapes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {checklist.steps.slice(0, 3).map((step) => (
            <div key={step.id} className="flex items-start space-x-3">
              <button
                onClick={() => onUpdateProgress(checklist.id, step.id, !step.completed)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  step.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {step.completed && (
                  <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                )}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${step.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {step.title}
                </p>
                {step.externalLink && (
                  <a
                    href={step.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Lien officiel
                  </a>
                )}
              </div>
            </div>
          ))}
          
          {checklist.steps.length > 3 && (
            <p className="text-sm text-gray-500 ml-8">
              +{checklist.steps.length - 3} autres étapes...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};