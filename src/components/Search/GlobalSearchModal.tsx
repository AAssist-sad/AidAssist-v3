import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  ClipboardList, 
  Users, 
  Clock, 
  MapPin, 
  Tag,
  ExternalLink,
  Star,
  ChevronDown,
  Zap
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'appointment' | 'document' | 'procedure' | 'contact';
  title: string;
  description: string;
  relevanceScore: number;
  date?: Date;
  category?: string;
  tags?: string[];
  location?: string;
  status?: string;
  preview?: string;
  directLink?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, itemId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with real data from your state/API
  const mockData: SearchResult[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Consultation cardiologue',
      description: 'Contrôle annuel avec Dr. Martin',
      relevanceScore: 95,
      date: new Date(2024, 11, 28, 14, 30),
      category: 'consultation',
      location: 'Hôpital Saint-Joseph',
      status: 'scheduled',
      preview: 'Rendez-vous programmé pour le suivi cardiaque annuel',
      directLink: 'appointments'
    },
    {
      id: '2',
      type: 'document',
      title: 'Ordonnance Dr. Martin.pdf',
      description: 'Prescription pour traitement cardiaque',
      relevanceScore: 88,
      date: new Date(2024, 11, 25),
      category: 'medical',
      tags: ['cardiologie', 'prescription', 'dr-martin'],
      preview: 'Document médical - Prescription médicamenteuse',
      directLink: 'documents'
    },
    {
      id: '3',
      type: 'procedure',
      title: 'Demande CAF',
      description: 'Démarches pour les allocations familiales',
      relevanceScore: 82,
      date: new Date(2024, 11, 20),
      category: 'caf',
      status: 'in_progress',
      preview: 'Procédure administrative en cours - 60% complétée',
      directLink: 'procedures'
    },
    {
      id: '4',
      type: 'contact',
      title: 'Dr. Martin - Cardiologue',
      description: 'Spécialiste en cardiologie',
      relevanceScore: 90,
      category: 'medical',
      location: 'Hôpital Saint-Joseph',
      preview: 'Contact médical - Cardiologie',
      directLink: 'contacts'
    },
    {
      id: '5',
      type: 'document',
      title: 'Résultats analyses.pdf',
      description: 'Résultats prise de sang - Laboratoire Biopath',
      relevanceScore: 75,
      date: new Date(2024, 11, 23),
      category: 'medical',
      tags: ['analyses', 'laboratoire', 'prise-de-sang'],
      preview: 'Résultats d\'analyses médicales',
      directLink: 'documents'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tout', icon: Search, color: 'bg-gray-100 text-gray-800' },
    { value: 'appointment', label: 'Rendez-vous', icon: Calendar, color: 'bg-blue-100 text-blue-800' },
    { value: 'document', label: 'Documents', icon: FileText, color: 'bg-green-100 text-green-800' },
    { value: 'procedure', label: 'Démarches', icon: ClipboardList, color: 'bg-purple-100 text-purple-800' },
    { value: 'contact', label: 'Contacts', icon: Users, color: 'bg-orange-100 text-orange-800' }
  ];

  const periods = [
    { value: 'all', label: 'Toute période' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' }
  ];

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm, selectedCategories, selectedPeriod]);

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredResults = mockData.filter(item => {
      // Text search
      const searchLower = searchTerm.toLowerCase();
      const matchesText = 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.preview?.toLowerCase().includes(searchLower);
      
      // Category filter
      const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(item.type);
      
      // Period filter
      let matchesPeriod = true;
      if (selectedPeriod !== 'all' && item.date) {
        const now = new Date();
        const itemDate = item.date;
        
        switch (selectedPeriod) {
          case 'today':
            matchesPeriod = itemDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesPeriod = itemDate >= weekAgo;
            break;
          case 'month':
            matchesPeriod = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            break;
          case 'year':
            matchesPeriod = itemDate.getFullYear() === now.getFullYear();
            break;
        }
      }
      
      return matchesText && matchesCategory && matchesPeriod;
    });

    // Sort by relevance score
    filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    setResults(filteredResults);
    setIsLoading(false);
  };

  const handleCategoryToggle = (categoryValue: string) => {
    if (categoryValue === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.filter(c => c !== 'all');
        if (newCategories.includes(categoryValue)) {
          const filtered = newCategories.filter(c => c !== categoryValue);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newCategories, categoryValue];
        }
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'document': return FileText;
      case 'procedure': return ClipboardList;
      case 'contact': return Users;
      default: return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document': return 'bg-green-100 text-green-800 border-green-200';
      case 'procedure': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contact': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.directLink) {
      onNavigate(result.directLink, result.id);
      onClose();
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    setSelectedCategories(['all']);
    setSelectedPeriod('all');
    setShowFilters(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Recherche globale</h2>
                <p className="text-amber-100">Trouvez rapidement toutes vos informations</p>
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

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans tous vos contenus..."
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 text-lg"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
                showFilters ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategories.includes(category.value);
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryToggle(category.value)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Recherche en cours...</span>
            </div>
          ) : searchTerm.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recherche intelligente</h3>
              <p className="text-gray-600 mb-4">
                Tapez votre recherche pour explorer tous vos contenus
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {categories.slice(1).map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.value} className="text-center p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">{category.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">
                Essayez avec d'autres mots-clés ou ajustez vos filtres
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Zap className="w-4 h-4" />
                  <span>Triés par pertinence</span>
                </div>
              </div>

              {results.map((result) => {
                const Icon = getTypeIcon(result.type);
                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(result.type)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition-colors duration-200">
                              {result.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <Star className={`w-4 h-4 ${getRelevanceColor(result.relevanceScore)}`} />
                              <span className={`text-xs font-medium ${getRelevanceColor(result.relevanceScore)}`}>
                                {result.relevanceScore}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{result.description}</p>
                          
                          {result.preview && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg mb-3 italic">
                              {result.preview}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {result.date && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{result.date.toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}
                            
                            {result.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{result.location}</span>
                              </div>
                            )}
                            
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="w-4 h-4" />
                                <div className="flex space-x-1">
                                  {result.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {result.tags.length > 3 && (
                                    <span className="text-xs">+{result.tags.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>💡 Astuce : Utilisez les filtres pour affiner votre recherche</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Échap</kbd>
              <span>pour fermer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};