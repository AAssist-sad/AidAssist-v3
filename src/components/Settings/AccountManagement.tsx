import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Globe, Smartphone, Monitor, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { SessionInfo } from '../../types/auth';

export const AccountManagement: React.FC = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const { t } = useTranslation('common');
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || ''
  });

  // Mock session data
  const [sessions] = useState<SessionInfo[]>(user?.id ? [
    {
      id: '1',
      userId: user.id,
      deviceInfo: 'Chrome sur Windows 11',
      ipAddress: '192.168.1.100',
      lastActivity: new Date(),
      isActive: true
    },
    {
      id: '2',
      userId: user.id,
      deviceInfo: 'Safari sur iPhone 15',
      ipAddress: '192.168.1.101',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isActive: false
    }
  ] : []);

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter de tous les appareils ?')) {
      await logout();
    }
  };

  // Ensure notifications object is always defined with default values
  const userNotifications = (profile?.preferences as any)?.notifications || {
    email: false,
    push: false,
    reminders: false
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informations personnelles
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                profile?.email_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.email_verified ? 'Email vérifié' : 'Email non vérifié'}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Modifier les informations
            </button>
          )}
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Langue et région
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue de l'interface
              </label>
              <div className="flex space-x-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setLanguage(language)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      currentLanguage.code === language.code
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {[
            { key: 'email', label: 'Notifications par email', icon: Mail },
            { key: 'push', label: 'Notifications push', icon: Smartphone },
            { key: 'reminders', label: 'Rappels de rendez-vous', icon: Bell }
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{setting.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={userNotifications[setting.key as keyof typeof userNotifications]}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Sécurité et sessions
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Sessions actives</h3>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.deviceInfo}</p>
                        <p className="text-sm text-gray-600">
                          {session.ipAddress} • {session.isActive ? 'Actif maintenant' : 
                            `Dernière activité: ${session.lastActivity.toLocaleString('fr-FR')}`}
                        </p>
                      </div>
                    </div>
                    {session.isActive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Session actuelle
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Changer le mot de passe
              </button>
              <button
                onClick={handleLogoutAllDevices}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnecter tous les appareils</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};