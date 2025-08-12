import React from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Heart, 
  Phone, 
  MapPin, 
  Shield, 
  Edit, 
  Trash2, 
  UserPlus,
  FileText,
  Activity,
  Clock,
  Mail,
  Eye,
  Download,
  Plus,
  Settings,
  Star,
  AlertTriangle
} from 'lucide-react';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onEdit: () => void;
  onDelete: () => void;
  onInviteAidant: () => void;
  onNavigate?: (page: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  onEdit,
  onDelete,
  onInviteAidant,
  onNavigate
}) => {
  if (!isOpen || !profile) return null;

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile.dateOfBirth);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contributeur': return 'bg-blue-100 text-blue-800';
      case 'lecture': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-indigo-100">{profile.relationship} • {age} ans</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Date de naissance</div>
                      <div className="font-medium text-gray-900">
                        {profile.dateOfBirth.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Heart className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-sm text-gray-600">Relation</div>
                      <div className="font-medium text-gray-900">{profile.relationship}</div>
                    </div>
                  </div>

                  {profile.socialSecurityNumber && (
                    <div className="md:col-span-2 flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm text-gray-600">Numéro de sécurité sociale</div>
                        <div className="font-medium text-gray-900 font-mono">{profile.socialSecurityNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Information */}
              {profile.medicalInfo && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Informations médicales
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-gray-700 leading-relaxed">{profile.medicalInfo}</p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contacts et adresse
                </h3>
                
                <div className="space-y-3">
                  {profile.emergencyContact && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm text-gray-600">Contact d'urgence</div>
                        <div className="font-medium text-gray-900">{profile.emergencyContact}</div>
                      </div>
                    </div>
                  )}

                  {profile.address && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-600">Adresse</div>
                        <div className="font-medium text-gray-900">{profile.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Activité récente
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Dernier rendez-vous</div>
                      <div className="font-medium text-gray-900">Consultation cardiologue - 20 déc 2024</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Dernier document</div>
                      <div className="font-medium text-gray-900">Ordonnance Dr. Martin - 25 déc 2024</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Dernière démarche</div>
                      <div className="font-medium text-gray-900">Demande CAF - En cours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Actions */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Statistiques
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Rendez-vous</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{profile.stats?.appointments || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Documents</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{profile.stats?.documents || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Démarches</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{profile.stats?.procedures || 0}</span>
                  </div>
                </div>
              </div>

              {/* Team Management */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-orange-600" />
                    Équipe d'aidants
                  </h3>
                  <button
                    onClick={onInviteAidant}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Inviter
                  </button>
                </div>
                
                <div className="space-y-3">
                  {profile.aidants?.map((aidant: any) => (
                    <div key={aidant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{aidant.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{aidant.name}</div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(aidant.role)}`}>
                              {aidant.role}
                            </span>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(aidant.status)}`}>
                              {aidant.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Actions rapides
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate?.('appointments')}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">Voir les rendez-vous</span>
                  </button>

                  <button
                    onClick={() => onNavigate?.('documents')}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  >
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">Gérer les documents</span>
                  </button>

                  <button
                    onClick={() => onNavigate?.('procedures')}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                  >
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-700">Suivre les démarches</span>
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {profile.medicalInfo && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Alertes médicales
                  </h3>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Informations médicales importantes renseignées
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Profil créé le {profile.createdAt.toLocaleDateString('fr-FR')} • 
              Dernière modification le {profile.updatedAt.toLocaleDateString('fr-FR')}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
              <button
                onClick={onDelete}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};