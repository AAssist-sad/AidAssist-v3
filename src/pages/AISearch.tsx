import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedSymptomSearch } from '../components/AISearch/AdvancedSymptomSearch';

export function AISearch() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recherche médicale IA</h1>
        <p className="text-gray-600">
          Analysez des symptômes et obtenez des recommandations médicales personnalisées
        </p>
      </div>

      <AdvancedSymptomSearch />
    </motion.div>
  );
}