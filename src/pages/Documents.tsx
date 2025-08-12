import React, { useState } from 'react';
import { Search, Filter, Upload, Plus, Grid, List, Calendar, Tag, Download, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Document } from '../types';

export const Documents: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  // Mock documents data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Ordonnance Dr. Martin.pdf',
      type: 'application/pdf',
      size: 245000,
      category: 'medical',
      aidedPersonId: '1',
      uploadedBy: 'user1',
      uploadedAt: new Date(2024, 11, 25),
      url: '',
      description: 'Prescription pour traitement cardiaque',
      tags: ['cardiologie', 'prescription', 'dr-martin'],
      expirationDate: new Date(2025, 5, 25)
    },
    {
      id: '2',
      name: 'Carte Vitale scan.jpg',
      type: 'image/jpeg',
      size: 1200000,
      category: 'identity',
      aidedPersonId: '1',
      uploadedBy: 'user1',
      uploadedAt: new Date(2024, 11, 24),
      url: '',
      description: 'Scan recto-verso de la carte vitale',
      tags: ['identité', 'sécurité-sociale', 'carte-vitale']
    },
    {
      id: '3',
      name: 'Résultats analyses.pdf',
      type: 'application/pdf',
      size: 180000,
      category: 'medical',
      aidedPersonId: '2',
      uploadedBy: 'user1',
      uploadedAt: new Date(2024, 11, 23),
      url: '',
      description: 'Résultats prise de sang - Laboratoire Biopath',
      tags: ['analyses', 'laboratoire', 'prise-de-sang']
    },
    {
      id: '4',
      name: 'Attestation CAF.pdf',
      type: 'application/pdf',
      size: 95000,
      category: 'administrative',
      aidedPersonId: '1',
      uploadedBy: 'user1',
      uploadedAt: new Date(2024, 11, 20),
      url: '',
      description: 'Attestation de droits CAF',
      tags: ['caf', 'attestation', 'droits']
    },
    {
      id: '5',
      name: 'Contrat mutuelle.pdf',
      type: 'application/pdf',
      size: 520000,
      category: 'insurance',
      aidedPersonId: '1',
      uploadedBy: 'user1',
      uploadedAt: new Date(2024, 11, 18),
      url: '',
      description: 'Contrat mutuelle santé 2024',
      tags: ['mutuelle', 'assurance', 'santé']
    }
  ]);

  const categories = [
    { value: 'all', label: 'Tous', icon: '📁', count: documents.length },
    { value: 'medical', label: 'Médical', icon: '🏥', count: documents.filter(d => d.category === 'medical').length },
    { value: 'administrative', label: 'Administratif', icon: '📋', count: documents.filter(d => d.category === 'administrative').length },
    { value: 'insurance', label: 'Assurance', icon: '🛡️', count: documents.filter(d => d.category === 'insurance').length },
    { value: 'identity', label: 'Identité', icon: '🆔', count: documents.filter(d => d.category === 'identity').length },
    { value: 'other', label: 'Autre', icon: '📄', count: documents.filter(d => d.category === 'other').length }
  ];

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      }
    });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'administrative': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'insurance': return 'bg-green-100 text-green-800 border-green-200';
      case 'identity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    if (bytes === 0) return '0 o';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('documents.title') || 'Documents'}</h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos documents importants en un seul endroit
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          <Upload className="w-4 h-4" />
          <span>{t('documents.upload')}</span>
          <span>{t('documents.upload') || 'Téléverser'}</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap ${
                    selectedCategory === category.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode and Sort */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Plus récent</option>
              <option value="name">Nom A-Z</option>
              <option value="size">Taille</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun document trouvé
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par téléverser vos premiers documents'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 ${
                viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center space-x-4'
              }`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {getFileIcon(document.type)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2 truncate" title={document.name}>
                    {document.name}
                  </h3>

                  {document.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {document.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(document.category)}`}>
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{document.uploadedAt.toLocaleDateString('fr-FR')}</span>
                    </div>

                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{document.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {document.expirationDate && (
                      <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        Expire le {document.expirationDate.toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // List View
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {getFileIcon(document.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                    {document.description && (
                      <p className="text-sm text-gray-600 truncate">{document.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(document.category)}`}>
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                      <span className="text-xs text-gray-500">
                        {document.uploadedAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Glissez-déposez vos fichiers ici
        </h3>
        <p className="text-gray-600 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Sélectionner des fichiers
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Formats supportés: PDF, JPG, PNG, DOC, DOCX (max 10 Mo)
        </p>
      </div>
    </div>
  );
};