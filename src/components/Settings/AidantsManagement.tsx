import React, { useState } from 'react';
import { Users, Mail, Shield, Plus, MoreVertical, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AidantRole, Invitation } from '../../types/auth';

export const AidantsManagement: React.FC = () => {
  const { user, roles } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'contributeur' as 'lecture' | 'contributeur' | 'admin',
    aidedPersonId: '1' // Mock - should be selected from user's aided persons
  });

  // Mock data for aidants and invitations
  const [aidants] = useState<(AidantRole & { user: { firstName: string; lastName: string; email: string; avatar?: string } })[]>([
    {
      id: '1',
      aidantId: user?.id || '',
      aidedPersonId: '1',
      role: 'admin',
      invitedBy: user?.id || '',
      invitedAt: new Date(),
      acceptedAt: new Date(),
      status: 'accepted',
      user: {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com'
      }
    },
    {
      id: '2',
      aidantId: '2',
      aidedPersonId: '1',
      role: 'contributeur',
      invitedBy: user?.id || '',
      invitedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      acceptedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      status: 'accepted',
      user: {
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@email.com'
      }
    }
  ]);

  const [invitations] = useState<Invitation[]>([
    {
      id: '1',
      email: 'sophie.bernard@email.com',
      aidedPersonId: '1',
      role: 'lecture',
      invitedBy: user?.id || '',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      token: 'mock-token',
      status: 'pending'
    }
  ]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'lecture': return 'Lecture seule';
      case 'contributeur': return 'Contributeur';
      case 'admin': return 'Administrateur';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'lecture': return 'bg-gray-100 text-gray-800';
      case 'contributeur': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock invitation logic
    console.log('Inviting:', inviteForm);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'contributeur', aidedPersonId: '1' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des aidants</h1>
          <p className="text-gray-600 mt-1">
            Gérez les personnes qui peuvent accéder aux informations de vos proches
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Inviter un aidant</span>
        </button>
      </div>

      {/* Active Aidants */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Aidants actifs ({aidants.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {aidants.map((aidant) => (
            <div key={aidant.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {aidant.user.firstName[0]}{aidant.user.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {aidant.user.firstName} {aidant.user.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{aidant.user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(aidant.role)}`}>
                      {getRoleLabel(aidant.role)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Rejoint le {aidant.acceptedAt?.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {aidant.aidantId === user?.id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Vous
                  </span>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Invitations en attente ({invitations.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{invitation.email}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(invitation.role)}`}>
                        {getRoleLabel(invitation.role)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Invité le {invitation.invitedAt.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    En attente
                  </span>
                  <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Guide */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Guide des permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              role: 'Lecture seule',
              color: 'text-gray-700',
              permissions: ['Consulter les rendez-vous', 'Voir les documents', 'Accéder aux démarches']
            },
            {
              role: 'Contributeur',
              color: 'text-blue-700',
              permissions: ['Toutes les permissions de lecture', 'Ajouter des rendez-vous', 'Téléverser des documents']
            },
            {
              role: 'Administrateur',
              color: 'text-purple-700',
              permissions: ['Toutes les permissions', 'Inviter des aidants', 'Gérer les droits']
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className={`font-medium mb-2 ${item.color}`}>{item.role}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.permissions.map((permission, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Inviter un aidant</h3>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="lecture">Lecture seule</option>
                  <option value="contributeur">Contributeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Envoyer l'invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};