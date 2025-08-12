import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  ClipboardList, 
  Users, 
  Settings,
  Heart,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation();
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard') || 'Tableau de bord' },
    { id: 'appointments', icon: Calendar, label: t('nav.appointments') || 'Rendez-vous' },
    { id: 'documents', icon: FileText, label: t('nav.documents') || 'Documents' },
    { id: 'procedures', icon: ClipboardList, label: t('nav.procedures') || 'Démarches' },
    { id: 'profiles', icon: Users, label: t('nav.profiles') || 'Profils' },
    { id: 'settings', icon: Settings, label: t('nav.settings') || 'Paramètres' },
  ];

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto w-72 flex flex-col shadow-xl lg:shadow-none`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 animate-fade-in bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight">AidAssist</span>
              <div className="text-xs text-gray-600 font-medium">Plateforme d'aide</div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden btn btn-ghost btn-sm focus-ring"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 animate-fade-in-up overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === `/${item.id}`;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 focus-ring group ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 shadow-sm font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  active ? 'text-blue-600' : 'text-gray-500 group-hover:scale-110'
                }`} />
                <span className="text-base">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="p-4 border-t border-gray-100 animate-fade-in">
          <LanguageSwitcher />
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 animate-fade-in bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {profile?.first_name?.[0] || 'M'}{profile?.last_name?.[0] || 'J'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Marie Dupont'
                }
              </p>
              <p className="text-xs text-gray-600 truncate font-medium">
                {profile?.account_type === 'aidant' ? 'Aidante principale' : 'Proche aidé'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">En ligne</span>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 focus-ring text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};