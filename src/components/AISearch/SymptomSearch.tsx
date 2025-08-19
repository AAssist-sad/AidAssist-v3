import React, { useState } from 'react';
import { Search, Stethoscope, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { APIClient } from '../../lib/api';
import toast from 'react-hot-toast';

export function SymptomSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await APIClient.searchSymptoms(query);
      if (error) {
        toast.error('Erreur lors de la recherche');
      } else {
        setResults(data);
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      // Mock response for demo
      setResults({
        summary: 'Symptômes analysés : fatigue, maux de tête, difficultés de concentration.',
        possible_causes: [
          'Stress et surmenage',
          'Déshydratation',
          'Troubles du sommeil',
          'Carence en vitamines'
        ],
        recommendations: [
          'Consulter un médecin généraliste',
          'Maintenir une bonne hydratation',
          'Améliorer la qualité du sommeil',
          'Faire un bilan sanguin'
        ],
        urgency: 'low'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Stethoscope className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recherche médicale IA</h2>
            <p className="text-gray-600">Analysez des symptômes et obtenez des recommandations</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez les symptômes observés
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Ex: Fatigue persistante depuis 3 jours, maux de tête, difficultés de concentration..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !query.trim()}
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
        </form>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important : Disclaimer médical</p>
              <p className="mt-1">
                Cette analyse IA est uniquement à titre informatif et ne remplace pas un avis médical professionnel. 
                En cas de symptômes graves ou persistants, consultez immédiatement un médecin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <Stethoscope className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Résultats de l'analyse</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Résumé</h4>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{results.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Causes possibles</h4>
              <ul className="space-y-2">
                {results.possible_causes?.map((cause: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommandations</h4>
              <ul className="space-y-2">
                {results.recommendations?.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${
                  results.urgency === 'high' ? 'bg-red-400' :
                  results.urgency === 'medium' ? 'bg-orange-400' :
                  'bg-green-400'
                }`}></div>
                <span className="text-sm text-gray-600">
                  Urgence : {results.urgency === 'high' ? 'Élevée' : results.urgency === 'medium' ? 'Modérée' : 'Faible'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                  <span>Prendre RDV</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Ajouter au dossier
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}