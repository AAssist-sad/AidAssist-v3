import React from 'react';
import { Menu, Bell, Search, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalSearchModal } from '../Search/GlobalSearchModal';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { t } = useTranslation('common');
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Mapping manuel des titres selon les routes
  const routeTitleMap: Record<string, string> = {
    '/': 'AidAssist',
    '/dashboard': 'Tableau de bord',
    '/appointments': 'Rendez-vous',
    '/documents': 'documents',
    '/procedures': 'Démarches administratives',
    '/settings': 'Paramètres',
    // Ajoute ici toutes tes routes et titres
  };

  const title = routeTitleMap[location.pathname] || 'AidAssist';

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
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-4 animate-fade-in sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden btn btn-ghost btn-sm focus-ring"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 lg:text-2xl tracking-tight truncate">
              {title}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search - Hidden on mobile */}
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="hidden md:flex items-center bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl px-4 py-3 min-w-64 transition-all duration-200 focus-ring"
              aria-label="Recherche globale"
            >
              <Search className="w-4 h-4 text-gray-600 mr-3" />
              <span className="text-sm text-gray-600 flex-1 text-left font-medium">
                {t('common.search') || 'Rechercher'} dans tous vos contenus...
              </span>
              <kbd className="hidden xl:inline-block px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-300 font-mono">
                Ctrl+K
              </kbd>
            </button>

            {/* Notifications */}
            <button
              className="relative btn btn-ghost btn-sm focus-ring"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                <span className="text-xs font-bold text-white">3</span>
              </div>
            </button>

            {/* Mobile Search */}
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="md:hidden btn btn-ghost btn-sm focus-ring"
              aria-label="Recherche"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 focus-ring"
                aria-label="Menu utilisateur"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {profile?.first_name?.[0] || 'U'}{profile?.last_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {profile?.account_type === 'aidant' ? 'Aidant principal' : 'Proche aidé'}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute top-full right-0 mt-3 w-72 card py-2 z-20 animate-scale-in">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <p className="text-base font-bold text-gray-900">
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Utilisateur'
                        }
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {profile?.account_type === 'aidant' ? 'Aidant principal' : 'Proche aidé'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span>Mon profil</span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showGlobalSearch && (
        <GlobalSearchModal
          isOpen={showGlobalSearch}
          onClose={() => setShowGlobalSearch(false)}
          onNavigate={(page, itemId) => {
            const path = itemId ? `/${page}/${itemId}` : `/${page}`;
            navigate(path);
          }}
        />
      )}
    </>
  );
};
