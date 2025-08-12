import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocalizedRouter } from './components/Router/LocalizedRouter';
import { LanguageDetector } from './components/Router/LanguageDetector';
import { SEOHead } from './components/SEO/SEOHead';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Auth } from './pages/Auth';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation de l'application...</p>
          <p className="text-sm text-gray-500 mt-2">Vérification de l'authentification</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LanguageDetector>
      <SEOHead />
      <div className="min-h-screen bg-gray-50 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header onMenuToggle={toggleSidebar} />
          
          <main className="flex-1 overflow-auto bg-gray-50">
            <LocalizedRouter />
          </main>
          
          <Footer />
        </div>
      </div>
    </LanguageDetector>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;