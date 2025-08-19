import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Stethoscope, Loader2, Heart, Brain, Eye, Thermometer } from 'lucide-react';
import { APIClient } from '../../lib/api';
import toast from 'react-hot-toast';

interface SymptomCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  symptoms: string[];
}

interface AIResponse {
  summary: string;
  possible_causes: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  suggested_specialists: Array<{ specialty: string; reason: string; urgency: string }>;
  red_flags: string[];
  follow_up_questions: string[];
}

interface GlobalAiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const symptomCategories: SymptomCategory[] = [
  { id: 'cardiovascular', name: 'Cardiovasculaire', icon: Heart, color: 'text-red-600 bg-red-50', symptoms: ['Douleur thoracique', 'Essoufflement', 'Palpitations', 'Œdème des jambes'] },
  { id: 'neurological', name: 'Neurologique', icon: Brain, color: 'text-purple-600 bg-purple-50', symptoms: ['Maux de tête', 'Vertiges', 'Troubles de la mémoire', 'Tremblements'] },
  { id: 'general', name: 'Général', icon: Thermometer, color: 'text-orange-600 bg-orange-50', symptoms: ['Fièvre', 'Fatigue', 'Perte de poids', 'Nausées'] },
  { id: 'sensory', name: 'Sensoriel', icon: Eye, color: 'text-blue-600 bg-blue-50', symptoms: ['Troubles visuels', 'Troubles auditifs', 'Douleurs', 'Engourdissements'] }
];

export const GlobalAiSearchModal: React.FC<GlobalAiSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResponse | null>(null);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const handleSearch = async () => {
    const finalQuery = [query, ...selectedSymptoms].filter(Boolean).join(', ');
    if (!finalQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await APIClient.searchSymptoms(finalQuery);
      if (error) {
        toast.error('Erreur lors de la recherche');
      } else {
        setResults(data);
      }
    } catch {
      const mockResponse: AIResponse = {
        summary: `Analyse des symptômes : ${finalQuery}`,
        possible_causes: ['Stress', 'Fatigue', 'Problèmes cardiovasculaires légers'],
        recommendations: ['Consulter un médecin', 'Surveiller les symptômes'],
        urgency: selectedSymptoms.includes('Douleur thoracique') ? 'high' : 'medium',
        suggested_specialists: [{ specialty: 'Cardiologie', reason: 'Évaluation cardiovasculaire', urgency: 'Dans les 7 jours' }],
        red_flags: ['Douleur thoracique intense'],
        follow_up_questions: ['Symptômes aggravés par l’effort ?']
      };
      setResults(mockResponse);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

return (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2"><Stethoscope /> Recherche médicale IA</h2>

          {/* 1. Catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {symptomCategories.map(cat => {
              const Icon = cat.icon;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} className={`p-4 rounded-lg border-2 ${selectedCategory === cat.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`p-2 rounded-lg inline-block mb-2 ${cat.color}`}><Icon className="h-5 w-5" /></div>
                  <h4 className="text-sm font-medium text-gray-900">{cat.name}</h4>
                </button>
              );
            })}
          </div>

          {/* 2. Symptômes de la catégorie */}
          {selectedCategory && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Symptômes - {symptomCategories.find(c => c.id === selectedCategory)?.name}</h3>
              <div className="flex flex-wrap gap-2">
                {symptomCategories.find(c => c.id === selectedCategory)?.symptoms.map(symptom => (
                  <button key={symptom} onClick={() => handleSymptomToggle(symptom)} className={`px-3 py-2 rounded-full text-sm ${selectedSymptoms.includes(symptom) ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'}`}>
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Symptômes sélectionnés */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedSymptoms.map(symptom => (
                <span key={symptom} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                  <span>{symptom}</span>
                  <button onClick={() => handleSymptomToggle(symptom)} className="text-purple-500 font-bold">&times;</button>
                </span>
              ))}
            </div>
          )}

          {/* 4. Description libre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description libre</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea value={query} onChange={e => setQuery(e.target.value)} rows={3} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" placeholder="Décrivez vos symptômes..." />
            </div>
          </div>

          {/* 5. Bouton Analyse */}
          <button onClick={handleSearch} disabled={loading || (!query && selectedSymptoms.length === 0)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Analyse...</span></> : <><Search className="h-4 w-4" /><span>Analyser</span></>}
          </button>

          {/* 6. Résultats */}
          {results && (
            <div className="mt-4 space-y-3">
              <div className={`p-3 rounded-lg border-2 ${getUrgencyColor(results.urgency)}`}>
                <span className="font-medium">Urgence : {results.urgency}</span>
                <p className="text-sm mt-1">{results.summary}</p>

                {results.possible_causes.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Causes possibles :</span>
                    <ul className="list-disc list-inside text-sm">
                      {results.possible_causes.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}

                {results.recommendations.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Recommandations :</span>
                    <ul className="list-disc list-inside text-sm">
                      {results.recommendations.map(r => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {results.suggested_specialists.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Spécialistes suggérés :</span>
                    <ul className="list-disc list-inside text-sm">
                      {results.suggested_specialists.map(s => <li key={s.specialty}>{s.specialty} - {s.reason} ({s.urgency})</li>)}
                    </ul>
                  </div>
                )}

                {results.red_flags.length > 0 && (
                  <div className="mt-2 text-red-700 text-sm">
                    <span className="font-medium">Signes d’alerte :</span>
                    <ul className="list-disc list-inside">
                      {results.red_flags.map(rf => <li key={rf}>{rf}</li>)}
                    </ul>
                  </div>
                )}

                {results.follow_up_questions.length > 0 && (
                  <div className="mt-2 text-gray-700 text-sm">
                    <span className="font-medium">Questions supplémentaires :</span>
                    <ul className="list-disc list-inside">
                      {results.follow_up_questions.map(q => <li key={q}>{q}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">
                ⚠️ Les informations fournies sont à titre informatif uniquement et ne remplacent pas une consultation médicale. Consultez un professionnel de santé en cas de doute.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
