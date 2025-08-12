import React, { useState } from 'react';
import { X, Palette, Layout, Move, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';

interface DashboardSettings {
  visibleSections: {
    stats: boolean;
    appointments: boolean;
    documents: boolean;
    procedures: boolean;
    quickActions: boolean;
    weekCalendar: boolean;
    tips: boolean;
    shortcuts: boolean;
  };
  layout: 'standard' | 'compact' | 'detailed';
  theme: 'light' | 'blue' | 'violet' | 'green';
  sectionOrder: string[];
}

interface PersonalizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: DashboardSettings) => void;
  currentSettings: DashboardSettings;
}

export const PersonalizeDashboardModal: React.FC<PersonalizeDashboardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'layout' | 'theme'>('sections');
  const [settings, setSettings] = useState<DashboardSettings>(currentSettings);

  if (!isOpen) return null;

  const sections = [
    { 
      key: 'stats', 
      label: 'Statistiques', 
      icon: '📊', 
      description: 'Aperçu des chiffres clés et métriques importantes' 
    },
    { 
      key: 'appointments', 
      label: 'Rendez-vous à venir', 
      icon: '📅', 
      description: 'Prochains rendez-vous programmés et calendrier' 
    },
    { 
      key: 'documents', 
      label: 'Documents récents', 
      icon: '📄', 
      description: 'Derniers documents ajoutés et fichiers importants' 
    },
    { 
      key: 'procedures', 
      label: 'Démarches en cours', 
      icon: '📋', 
      description: 'Procédures administratives actives et leur progression' 
    },
    { 
      key: 'quickActions', 
      label: 'Actions rapides', 
      icon: '⚡', 
      description: 'Raccourcis vers les fonctions principales' 
    },
    { 
      key: 'weekCalendar', 
      label: 'Calendrier de la semaine', 
      icon: '🗓️', 
      description: 'Vue hebdomadaire des événements et météo' 
    },
    { 
      key: 'tips', 
      label: 'Conseils du jour', 
      icon: '💡', 
      description: 'Conseils pratiques et astuces pour les aidants' 
    },
    { 
      key: 'shortcuts', 
      label: 'Accès rapides', 
      icon: '🔗', 
      description: 'Liens vers les services externes et contacts utiles' 
    }
  ];

  const layouts = [
    { 
      key: 'standard', 
      label: 'Standard', 
      description: 'Disposition équilibrée avec toutes les informations',
      preview: 'bg-blue-100 border-blue-300'
    },
    { 
      key: 'compact', 
      label: 'Compact', 
      description: 'Vue condensée pour économiser l\'espace',
      preview: 'bg-green-100 border-green-300'
    },
    { 
      key: 'detailed', 
      label: 'Détaillé', 
      description: 'Vue étendue avec plus d\'informations visibles',
      preview: 'bg-purple-100 border-purple-300'
    }
  ];

  const themes = [
    { 
      key: 'light', 
      label: 'Clair', 
      description: 'Thème clair classique avec tons neutres',
      colors: ['bg-gray-100', 'bg-gray-200', 'bg-gray-300'],
      primary: 'bg-gray-500'
    },
    { 
      key: 'blue', 
      label: 'Bleu', 
      description: 'Thème bleu professionnel et apaisant',
      colors: ['bg-blue-100', 'bg-blue-200', 'bg-blue-300'],
      primary: 'bg-blue-500'
    },
    { 
      key: 'violet', 
      label: 'Violet', 
      description: 'Thème violet moderne et créatif',
      colors: ['bg-violet-100', 'bg-violet-200', 'bg-violet-300'],
      primary: 'bg-violet-500'
    },
    { 
      key: 'green', 
      label: 'Vert', 
      description: 'Thème vert naturel et reposant',
      colors: ['bg-green-100', 'bg-green-200', 'bg-green-300'],
      primary: 'bg-green-500'
    }
  ];

  const handleSectionToggle = (sectionKey: string) => {
    setSettings(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [sectionKey]: !prev.visibleSections[sectionKey as keyof typeof prev.visibleSections]
      }
    }));
  };

  const handleLayoutChange = (layoutKey: string) => {
    setSettings(prev => ({
      ...prev,
      layout: layoutKey as 'standard' | 'compact' | 'detailed'
    }));
  };

  const handleThemeChange = (themeKey: string) => {
    setSettings(prev => ({
      ...prev,
      theme: themeKey as 'light' | 'blue' | 'violet' | 'green'
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: DashboardSettings = {
      visibleSections: {
        stats: true,
        appointments: true,
        documents: true,
        procedures: true,
        quickActions: true,
        weekCalendar: true,
        tips: true,
        shortcuts: true
      },
      layout: 'standard',
      theme: 'light',
      sectionOrder: ['stats', 'appointments', 'documents', 'procedures', 'quickActions', 'weekCalendar', 'tips', 'shortcuts']
    };
    setSettings(defaultSettings);
  };

  const visibleSectionsCount = Object.values(settings.visibleSections).filter(Boolean).length;
  const selectedTheme = themes.find(t => t.key === settings.theme);
  const selectedLayout = layouts.find(l => l.key === settings.layout);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Palette className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Personnaliser le tableau de bord</h2>
                <p className="text-indigo-100">Adaptez votre espace de travail à vos besoins</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex">
            {[
              { key: 'sections', label: 'Sections visibles', icon: Eye, count: visibleSectionsCount },
              { key: 'layout', label: 'Disposition', icon: Layout },
              { key: 'theme', label: 'Thème', icon: Palette }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 relative ${
                    activeTab === tab.key
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      activeTab === tab.key 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}/8
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sections visibles</h3>
                <p className="text-gray-600">Choisissez les sections à afficher sur votre tableau de bord</p>
                <div className="mt-4 inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">
                    {visibleSectionsCount} section{visibleSectionsCount > 1 ? 's' : ''} visible{visibleSectionsCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section) => {
                  const isVisible = settings.visibleSections[section.key as keyof typeof settings.visibleSections];
                  return (
                    <div
                      key={section.key}
                      className={`border-2 rounded-xl p-5 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        isVisible
                          ? 'border-indigo-300 bg-indigo-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      onClick={() => handleSectionToggle(section.key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-3xl">{section.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{section.label}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                          </div>
                        </div>
                        <button
                          className={`p-3 rounded-xl transition-all duration-200 ${
                            isVisible
                              ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200'
                              : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {isVisible ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Disposition</h3>
                <p className="text-gray-600">Choisissez comment organiser les informations sur votre tableau de bord</p>
                {selectedLayout && (
                  <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Layout className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Layout actuel : {selectedLayout.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {layouts.map((layout) => {
                  const isSelected = settings.layout === layout.key;
                  return (
                    <button
                      key={layout.key}
                      onClick={() => handleLayoutChange(layout.key)}
                      className={`p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg ${
                        isSelected
                          ? 'border-blue-400 bg-blue-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="mb-4">
                        <div className={`w-full h-24 rounded-lg border-2 ${layout.preview} relative overflow-hidden`}>
                          {/* Visual representation */}
                          <div className="p-3 space-y-2">
                            {layout.key === 'compact' && (
                              <>
                                <div className="h-2 bg-green-400 rounded w-3/4"></div>
                                <div className="h-2 bg-green-400 rounded w-1/2"></div>
                              </>
                            )}
                            {layout.key === 'standard' && (
                              <>
                                <div className="h-2 bg-blue-400 rounded w-full"></div>
                                <div className="h-2 bg-blue-400 rounded w-2/3"></div>
                                <div className="h-2 bg-blue-400 rounded w-1/2"></div>
                              </>
                            )}
                            {layout.key === 'detailed' && (
                              <>
                                <div className="h-1.5 bg-purple-400 rounded w-full"></div>
                                <div className="h-1.5 bg-purple-400 rounded w-full"></div>
                                <div className="h-1.5 bg-purple-400 rounded w-3/4"></div>
                                <div className="h-1.5 bg-purple-400 rounded w-2/3"></div>
                                <div className="h-1.5 bg-purple-400 rounded w-1/2"></div>
                              </>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Eye className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{layout.label}</h4>
                      <p className="text-sm text-gray-600">{layout.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thème de couleur</h3>
                <p className="text-gray-600">Personnalisez l'apparence de votre tableau de bord</p>
                {selectedTheme && (
                  <div className="mt-4 inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Thème actuel : {selectedTheme.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map((theme) => {
                  const isSelected = settings.theme === theme.key;
                  return (
                    <button
                      key={theme.key}
                      onClick={() => handleThemeChange(theme.key)}
                      className={`p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg ${
                        isSelected
                          ? 'border-purple-400 bg-purple-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${theme.primary} shadow-lg`}></div>
                        <div>
                          <h4 className="font-bold text-gray-900">{theme.label}</h4>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                        </div>
                        {isSelected && (
                          <div className="ml-auto w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Eye className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Color palette preview */}
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          {theme.colors.map((color, index) => (
                            <div key={index} className={`flex-1 h-4 rounded ${color}`}></div>
                          ))}
                        </div>
                        <div className={`w-full h-20 rounded-lg ${theme.colors[0]} border-2 ${theme.colors[2]} p-3`}>
                          <div className="space-y-2">
                            <div className={`h-2 ${theme.primary} bg-opacity-60 rounded w-3/4`}></div>
                            <div className={`h-2 ${theme.primary} bg-opacity-40 rounded w-1/2`}></div>
                            <div className={`h-2 ${theme.primary} bg-opacity-30 rounded w-2/3`}></div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
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