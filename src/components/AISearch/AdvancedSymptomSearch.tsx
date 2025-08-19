import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Stethoscope, 
  AlertTriangle, 
  ExternalLink, 
  Loader2, 
  Calendar,
  MapPin,
  Phone,
  Clock,
  User,
  FileText,
  Heart,
  Brain,
  Eye,
  Thermometer
} from 'lucide-react';
import { APIClient } from '../../lib/api';
import toast from 'react-hot-toast';

interface SymptomCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  symptoms: string[];
}

const symptomCategories: SymptomCategory[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovasculaire',
    icon: Heart,
    color: 'text-red-600 bg-red-50',
    symptoms: ['Douleur thoracique', 'Essoufflement', 'Palpitations', 'Œdème des jambes']
  },
  {
    id: 'neurological',
    name: 'Neurologique',
    icon: Brain,
    color: 'text-purple-600 bg-purple-50',
    symptoms: ['Maux de tête', 'Vertiges', 'Troubles de la mémoire', 'Tremblements']
  },
  {
    id: 'general',
    name: 'Général',
    icon: Thermometer,
    color: 'text-orange-600 bg-orange-50',
    symptoms: ['Fièvre', 'Fatigue', 'Perte de poids', 'Nausées']
  },
  {
    id: 'sensory',
    name: 'Sensoriel',
    icon: Eye,
    color: 'text-blue-600 bg-blue-50',
    symptoms: ['Troubles visuels', 'Troubles auditifs', 'Douleurs', 'Engourdissements']
  }
];

interface AIResponse {
  summary: string;
  possible_causes: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  suggested_specialists: Array<{
    specialty: string;
    reason: string;
    urgency: string;
  }>;
  red_flags: string[];
  follow_up_questions: string[];
}

export function AdvancedSymptomSearch() {
  const [query, setQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; date: Date }>>([]);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query || selectedSymptoms.join(', ');
    if (!finalQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await APIClient.searchSymptoms(finalQuery);
      if (error) {
        toast.error('Erreur lors de la recherche');
      } else {
        setResults(data);
        setSearchHistory(prev => [{ query: finalQuery, date: new Date() }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      // Mock response for demo
      const mockResponse: AIResponse = {
        summary: `Analyse des symptômes : ${finalQuery}. Les symptômes décrits peuvent indiquer plusieurs conditions médicales.`,
        possible_causes: [
          'Stress et anxiété',
          'Troubles cardiovasculaires légers',
          'Effets secondaires médicamenteux',
          'Déshydratation',
          'Troubles du sommeil'
        ],
        recommendations: [
          'Consulter un médecin généraliste dans les 48h',
          'Surveiller la tension artérielle',
          'Maintenir une bonne hydratation',
          'Éviter les efforts intenses',
          'Tenir un journal des symptômes'
        ],
        urgency: selectedSymptoms.some(s => s.includes('Douleur thoracique')) ? 'high' : 'medium',
        suggested_specialists: [
          {
            specialty: 'Cardiologie',
            reason: 'Évaluation cardiovasculaire approfondie',
            urgency: 'Dans les 7 jours'
          },
          {
            specialty: 'Médecine générale',
            reason: 'Bilan de santé complet',
            urgency: 'Dans les 48h'
          }
        ],
        red_flags: [
          'Douleur thoracique intense',
          'Essoufflement au repos',
          'Perte de conscience'
        ],
        follow_up_questions: [
          'Les symptômes s\'aggravent-ils à l\'effort ?',
          'Y a-t-il des antécédents familiaux ?',
          'Quels médicaments sont pris actuellement ?'
        ]
      };
      setResults(mockResponse);
      setSearchHistory(prev => [{ query: finalQuery, date: new Date() }, ...prev.slice(0, 4)]);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = (specialty: string) => {
    // Integration with Doctolib or health directory
    const doctolibUrl = `https://www.doctolib.fr/recherche?ref_visit_motive_ids%5B%5D=6058&force_max_limit=2&q=${encodeURIComponent(specialty)}`;
    window.open(doctolibUrl, '_blank');
    toast.success(`Redirection vers Doctolib pour ${specialty}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Modéré';
      default: return 'Faible';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Stethoscope className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recherche médicale IA avancée</h2>
            <p className="text-gray-600">Analysez des symptômes et obtenez des recommandations personnalisées</p>
          </div>
        </div>

        {/* Quick Symptom Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories de symptômes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {symptomCategories.map(category => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${category.color} inline-block mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Symptom Selection */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Symptômes - {symptomCategories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {symptomCategories
                  .find(c => c.id === selectedCategory)
                  ?.symptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Symptômes sélectionnés</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <span
                  key={symptom}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{symptom}</span>
                  <button
                    onClick={() => handleSymptomToggle(symptom)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Text Search */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description libre des symptômes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Décrivez les symptômes observés en détail : intensité, durée, circonstances d'apparition..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch()}
            disabled={loading || (!query.trim() && selectedSymptoms.length === 0)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Analyser les symptômes</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recherches récentes</h3>
            <div className="space-y-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-900 truncate">{item.query}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.date.toLocaleDateString('fr-FR')} à {item.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important : Disclaimer médical</p>
              <p className="mt-1">
                Cette analyse IA est uniquement à titre informatif et ne remplace pas un avis médical professionnel. 
                En cas de symptômes graves ou persistants, consultez immédiatement un médecin ou appelez le 15.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Urgency Alert */}
          <div className={`rounded-lg border-2 p-4 ${getUrgencyColor(results.urgency)}`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Niveau d'urgence : {getUrgencyLabel(results.urgency)}
              </span>
            </div>
            {results.urgency === 'high' && (
              <p className="mt-2 text-sm">
                Consultez immédiatement un médecin ou rendez-vous aux urgences.
              </p>
            )}
          </div>

          {/* Red Flags */}
          {results.red_flags && results.red_flags.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaux d'alarme
              </h3>
              <ul className="space-y-1">
                {results.red_flags.map((flag, index) => (
                  <li key={index} className="text-sm text-red-800 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analysis Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Résumé de l'analyse
              </h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed">
                {results.summary}
              </p>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Causes possibles</h4>
                <ul className="space-y-2">
                  {results.possible_causes?.map((cause, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-green-600" />
                Recommandations
              </h3>
              <ul className="space-y-3">
                {results.recommendations?.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>

              {/* Follow-up Questions */}
              {results.follow_up_questions && results.follow_up_questions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Questions de suivi</h4>
                  <ul className="space-y-2">
                    {results.follow_up_questions.map((question, index) => (
                      <li key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Specialist Recommendations */}
          {results.suggested_specialists && results.suggested_specialists.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Spécialistes recommandés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.suggested_specialists.map((specialist, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{specialist.specialty}</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {specialist.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{specialist.reason}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => bookAppointment(specialist.specialty)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Calendar className="h-3 w-3" />
                        <span>Prendre RDV</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <MapPin className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Programmer un RDV</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FileText className="h-4 w-4" />
                <span>Ajouter au dossier</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Phone className="h-4 w-4" />
                <span>Contacter médecin</span>
              </button>
              <a
                href="https://www.doctolib.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Doctolib</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}