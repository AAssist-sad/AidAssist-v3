import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  Shield,
  AlertCircle,
  User,
  FileText,
  Clock,
  Settings,
  MoreVertical,
  UserPlus,
  Star,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAidedPersons } from '../hooks/useAidedPersons';
import { NewProfileModal } from '../components/Profiles/NewProfileModal';
import { ProfileDetailModal } from '../components/Profiles/ProfileDetailModal';
import { EditProfileModal } from '../components/Profiles/EditProfileModal';
import { InviteAidantModal } from '../components/Profiles/InviteAidantModal';

interface ProfilesProps {
  onNavigate?: (page: string) => void;
}

export const Profiles: React.FC<ProfilesProps> = ({ onNavigate }) => {
  const { t } = useTranslation('common');
  const { aidedPersons, loading, createAidedPerson, updateAidedPerson, deleteAidedPerson, inviteAidant } = useAidedPersons();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Transform Supabase data to match component expectations
  const profiles = aidedPersons.map(person => ({
    id: person.id,
    firstName: person.first_name,
    lastName: person.last_name,
    dateOfBirth: person.date_of_birth ? new Date(person.date_of_birth) : new Date(),
    relationship: person.relationship || 'Non spécifié',
    medicalInfo: person.medical_info,
    emergencyContact: person.emergency_contact,
    address: person.address,
    socialSecurityNumber: person.social_security_number,
    createdAt: new Date(person.created_at),
    updatedAt: new Date(person.updated_at),
    stats: {
      appointments: 0, // Will be calculated from real data
      documents: 0,    // Will be calculated from real data
      procedures: 0,   // Will be calculated from real data
      lastActivity: new Date(person.updated_at)
    },
    aidants: [
      { id: '1', name: 'Vous', role: 'admin', status: 'active' }
    ]
  }));

  const filters = [
    { value: 'all', label: 'Tous les profils', count: profiles.length },
    { value: 'recent', label: 'Activité récente', count: profiles.filter(p => p.stats?.lastActivity && p.stats.lastActivity > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
    { value: 'medical', label: 'Suivi médical', count: profiles.filter(p => p.medicalInfo).length },
    { value: 'procedures', label: 'Démarches actives', count: profiles.filter(p => p.stats?.procedures && p.stats.procedures > 0).length }
  ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.relationship?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'recent' && profile.stats?.lastActivity && profile.stats.lastActivity > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (selectedFilter === 'medical' && profile.medicalInfo) ||
      (selectedFilter === 'procedures' && profile.stats?.procedures && profile.stats.procedures > 0);

    return matchesSearch && matchesFilter;
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getActivityStatus = (lastActivity?: Date) => {
    if (!lastActivity) return { label: 'Aucune activité', color: 'bg-gray-100 text-gray-600' };
    
    const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) return { label: 'Aujourd\'hui', color: 'bg-green-100 text-green-700' };
    if (daysSince <= 3) return { label: `Il y a ${daysSince} jour${daysSince > 1 ? 's' : ''}`, color: 'bg-blue-100 text-blue-700' };
    if (daysSince <= 7) return { label: 'Cette semaine', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Ancienne', color: 'bg-gray-100 text-gray-600' };
  };

  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);
    setShowDetailModal(true);
  };

  const handleEditProfile = (profile: any) => {
    setSelectedProfile(profile);
    setShowEditModal(true);
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.')) {
      try {
        await deleteAidedPerson(profileId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleInviteAidant = (profile: any) => {
    setSelectedProfile(profile);
    setShowInviteModal(true);
  };

  const handleCreateProfile = async (aidedPersonData: any) => {
    try {
      await createAidedPerson(aidedPersonData);
      setShowNewProfileModal(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleUpdateProfile = async (aidedPersonData: any) => {
    try {
      await updateAidedPerson(selectedProfile.id, aidedPersonData);
      setShowEditModal(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleSendInvite = async (inviteData: any) => {
    try {
      await inviteAidant(inviteData.email, selectedProfile.id, inviteData.role);
      setShowInviteModal(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-7 h-7 mr-3 text-blue-600" />
              {t('profiles.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('profiles.manage')}
            </p>
          </div>
          <button 
            onClick={() => setShowNewProfileModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>{t('profiles.new')}</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.totalProfiles')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.appointmentsThisMonth')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + (p.stats?.appointments || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.documents')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + (p.stats?.documents || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('dashboard.stats.procedures')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {profiles.reduce((sum, p) => sum + (p.stats?.procedures || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search') + ' un profil...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${
                      selectedFilter === filter.value
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profiles Grid/List */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun profil trouvé' : t('profiles.noProfiles')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? t('common.search') + ' avec d\'autres termes' 
                : 'Commencez par créer le profil d\'une personne que vous accompagnez'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowNewProfileModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                {t('profiles.createFirst')}
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredProfiles.map((profile) => {
              const age = calculateAge(profile.dateOfBirth);
              const activityStatus = getActivityStatus(profile.stats?.lastActivity);
              
              return (
                <div
                  key={profile.id}
                  className={`bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:border-blue-300 ${
                    viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center space-x-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {profile.firstName[0]}{profile.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {profile.firstName} {profile.lastName}
                            </h3>
                            <p className="text-gray-600 text-sm">{profile.relationship} • {age} ans</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${activityStatus.color}`}>
                              {activityStatus.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{profile.stats?.appointments || 0}</div>
                          <div className="text-xs text-gray-600 font-medium">RDV</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{profile.stats?.documents || 0}</div>
                          <div className="text-xs text-gray-600 font-medium">Docs</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">{profile.stats?.procedures || 0}</div>
                          <div className="text-xs text-gray-600 font-medium">Démarches</div>
                        </div>
                      </div>

                      {/* Medical Info */}
                      {profile.medical_info && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Informations médicales</span>
                          </div>
                          <p className="text-sm text-red-700 line-clamp-2">{profile.medical_info}</p>
                        </div>
                      )}

                      {/* Aidants */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Équipe d'aidants</span>
                          <button
                            onClick={() => handleInviteAidant(profile)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + Inviter
                          </button>
                        </div>
                        <div className="flex -space-x-2">
                          {profile.aidants?.slice(0, 4).map((aidant: any, index: number) => (
                            <div
                              key={aidant.id}
                              className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                              title={`${aidant.name} (${aidant.role})`}
                            >
                              <span className="text-white font-bold text-xs">
                                {aidant.name[0]}
                              </span>
                            </div>
                          ))}
                          {profile.aidants && profile.aidants.length > 4 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                              <span className="text-gray-600 font-bold text-xs">
                                +{profile.aidants.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProfile(profile)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir</span>
                        </button>
                        <button
                          onClick={() => handleEditProfile(profile)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {profile.firstName[0]}{profile.lastName[0]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${activityStatus.color}`}>
                            {activityStatus.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{profile.relationship} • {age} ans</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{profile.stats?.appointments || 0} RDV</span>
                          <span>{profile.stats?.documents || 0} docs</span>
                          <span>{profile.stats?.procedures || 0} démarches</span>
                          <span>{profile.aidants?.length || 0} aidant{(profile.aidants?.length || 0) > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProfile(profile)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProfile(profile)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowNewProfileModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all duration-200 text-center"
            >
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Nouveau profil</div>
            </button>
            <button
              onClick={() => onNavigate?.('appointments')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all duration-200 text-center"
            >
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Voir les RDV</div>
            </button>
            <button
              onClick={() => onNavigate?.('documents')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all duration-200 text-center"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Gérer les docs</div>
            </button>
            <button
              onClick={() => onNavigate?.('procedures')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all duration-200 text-center"
            >
              <Activity className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Démarches</div>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewProfileModal
        isOpen={showNewProfileModal}
        onClose={() => setShowNewProfileModal(false)}
        onSave={handleCreateProfile}
      />

      {selectedProfile && (
        <>
          <ProfileDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedProfile(null);
            }}
            profile={selectedProfile}
            onEdit={() => {
              setShowDetailModal(false);
              setShowEditModal(true);
            }}
            onDelete={() => {
              setShowDetailModal(false);
              handleDeleteProfile(selectedProfile.id);
              setSelectedProfile(null);
            }}
            onInviteAidant={() => {
              setShowDetailModal(false);
              setShowInviteModal(true);
            }}
            onNavigate={onNavigate}
          />

          <EditProfileModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProfile(null);
            }}
            profile={selectedProfile}
            onSave={handleUpdateProfile}
          />

          <InviteAidantModal
            isOpen={showInviteModal}
            onClose={() => {
              setShowInviteModal(false);
              setSelectedProfile(null);
            }}
            profile={selectedProfile}
            onSend={handleSendInvite}
          />
        </>
      )}
    </>
  );
};