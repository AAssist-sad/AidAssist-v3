import React, { useState } from 'react';
import { User, Users, Shield, Bell, HelpCircle } from 'lucide-react';
import { AccountManagement } from '../components/Settings/AccountManagement';
import { AidantsManagement } from '../components/Settings/AidantsManagement';
import { ErrorBoundary } from '../utils/common/ErrorBoundary';

type SettingsTab = 'account' | 'aidants' | 'security' | 'notifications' | 'help';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const tabs = [
    { id: 'account', label: 'Mon compte', icon: User },
    { id: 'aidants', label: 'Aidants', icon: Users },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Aide', icon: HelpCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
        <ErrorBoundary>
          <AccountManagement />
        </ErrorBoundary>
       );
      case 'aidants':
        return (
        <ErrorBoundary>
          <AidantsManagement />
        </ErrorBoundary>
      );
      case 'security':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres de sécurité</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres de notifications</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      case 'help':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Centre d'aide</h2>
            <p className="text-gray-600">Cette section sera développée prochainement.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Paramètres</h1>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};