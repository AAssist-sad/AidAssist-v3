import React from 'react';
import { FileText, Download, Eye, Calendar, Tag } from 'lucide-react';
import { Document } from '../../types';

interface RecentDocumentsProps {
  documents: Document[];
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'administrative': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'insurance': return 'bg-green-100 text-green-800 border-green-200';
      case 'identity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'medical': return 'Médical';
      case 'administrative': return 'Administratif';
      case 'insurance': return 'Assurance';
      case 'identity': return 'Identité';
      default: return 'Autre';
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
    <div className="space-y-3">
      {documents.map((document) => (
        <div key={document.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200">
                {getFileIcon(document.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate mb-1">{document.name}</h4>
                
                {document.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{document.description}</p>
                )}
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(document.category)}`}>
                    {getCategoryLabel(document.category)}
                  </span>
                  <span className="text-xs text-gray-500">{formatFileSize(document.size)}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    {document.uploadedAt.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {document.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{document.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}

                {document.expirationDate && (
                  <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    Expire le {document.expirationDate.toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};