import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProcedureCard } from '../components/Procedures/ProcedureCard';
import { Checklist } from '../types';

export const Procedures: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Mock checklists data
  const [checklists, setChecklists] = React.useState<Checklist[]>([
    {
      id: '1',
      title: 'Déclaration CAF',
      description: 'Démarches pour les allocations familiales',
      category: 'caf',
      language: 'fr',
      aidedPersonId: '1',
      progress: 60,
      steps: [
        {
          id: '1',
          title: 'Créer un compte en ligne',
          description: 'Inscription sur caf.fr',
          completed: true,
          externalLink: 'https://www.caf.fr'
        },
        {
          id: '2',
          title: 'Remplir le formulaire de déclaration',
          description: 'Compléter les informations personnelles',
          completed: true
        },
        {
          id: '3',
          title: 'Joindre les pièces justificatives',
          description: 'Scanner et téléverser les documents',
          completed: false,
          documents: ['carte_identite.pdf', 'avis_imposition.pdf']
        },
        {
          id: '4',
          title: 'Valider et envoyer la déclaration',
          description: 'Vérifier et soumettre le dossier',
          completed: false
        },
        {
          id: '5',
          title: 'Suivre le traitement du dossier',
          description: 'Attendre la réponse de la CAF',
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'Remboursement AMELI',
      description: 'Demande de remboursement frais médicaux',
      category: 'ameli',
      language: 'fr',
      aidedPersonId: '1',
      progress: 100,
      steps: [
        {
          id: '1',
          title: 'Se connecter à son compte AMELI',
          description: 'Accès via ameli.fr',
          completed: true,
          externalLink: 'https://www.ameli.fr'
        },
        {
          id: '2',
          title: 'Télécharger les factures',
          description: 'Scanner les feuilles de soins',
          completed: true
        },
        {
          id: '3',
          title: 'Envoyer la demande',
          description: 'Validation du remboursement',
          completed: true
        }
      ]
    },
    {
      id: '3',
      title: 'Demande de carte grise',
      description: 'Nouvelle carte grise suite à déménagement',
      category: 'prefecture',
      language: 'fr',
      aidedPersonId: '2',
      progress: 25,
      steps: [
        {
          id: '1',
          title: 'Préparer les documents nécessaires',
          description: 'Rassembler pièces d\'identité et justificatifs',
          completed: true
        },
        {
          id: '2',
          title: 'Faire la demande en ligne',
          description: 'Sur le site ANTS',
          completed: false,
          externalLink: 'https://ants.gouv.fr'
        },
        {
          id: '3',
          title: 'Payer les taxes',
          description: 'Règlement en ligne',
          completed: false
        },
        {
          id: '4',
          title: 'Recevoir la nouvelle carte grise',
          description: 'Par courrier recommandé',
          completed: false
        }
      ]
    }
  ]);

  const categories = [
    { value: 'all', label: 'Toutes', icon: '📋' },
    { value: 'caf', label: 'CAF', icon: '👨‍👩‍👧‍👦' },
    { value: 'ameli', label: 'AMELI', icon: '🏥' },
    { value: 'cnav', label: 'CNAV', icon: '🏛️' },
    { value: 'prefecture', label: 'Préfecture', icon: '🏢' }
  ];

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || checklist.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpdateProgress = (checklistId: string, stepId: string, completed: boolean) => {
    setChecklists(prevChecklists =>
      prevChecklists.map(checklist => {
        if (checklist.id === checklistId) {
          const updatedSteps = checklist.steps.map(step =>
            step.id === stepId ? { ...step, completed } : step
          );
          const completedSteps = updatedSteps.filter(step => step.completed).length;
          const progress = (completedSteps / updatedSteps.length) * 100;
          
          return {
            ...checklist,
            steps: updatedSteps,
            progress
          };
        }
        return checklist;
      })
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('procedures.title') || 'Démarches'}</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos démarches administratives avec des guides étape par étape
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Nouvelle démarche</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
             placeholder={t('common.search') || 'Rechercher'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex bg-gray-100 rounded-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-1 ${
                    selectedCategory === category.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Procedures Grid */}
      {filteredChecklists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune démarche trouvée
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter une nouvelle démarche'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChecklists.map((checklist) => (
            <ProcedureCard
              key={checklist.id}
              checklist={checklist}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}

      {/* Popular Procedures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Démarches populaires
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Demande MDPH', icon: '♿', category: 'Handicap' },
            { title: 'Pension retraite', icon: '👴', category: 'CNAV' },
            { title: 'Carte d\'identité', icon: '🆔', category: 'Préfecture' },
            { title: 'Passeport', icon: '📘', category: 'Préfecture' }
          ].map((procedure, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-left"
            >
              <div className="text-2xl mb-2">{procedure.icon}</div>
              <div className="font-medium text-gray-900 mb-1">{procedure.title}</div>
              <div className="text-xs text-gray-500">{procedure.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};