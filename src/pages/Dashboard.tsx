import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  ClipboardList, 
  Users, 
  TrendingUp, 
  Clock,
  Settings,
  ChevronRight,
  Plus,
  Bell,
  Star,
  Heart,
  Activity,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Zap,
  Target,
  Award,
  Bookmark,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Filter,
  Search,
  Download,
  Share2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  Flag,
  Palette
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAidedPersons } from '../hooks/useAidedPersons';
import { useAppointments } from '../hooks/useAppointments';
import { useDocuments } from '../hooks/useDocuments';
import { useProcedures } from '../hooks/useProcedures';
import { useNotifications } from '../hooks/useNotifications';
import { StatCard } from '../components/Dashboard/StatCard';
import { AppointmentCard } from '../components/Dashboard/AppointmentCard';
import { RecentDocuments } from '../components/Dashboard/RecentDocuments';
import { ProcedureProgress } from '../components/Dashboard/ProcedureProgress';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { WeatherWidget } from '../components/Dashboard/WeatherWidget';
import { CalendarManagement } from '../components/Dashboard/CalendarManagement';
import { NotificationCenter } from '../components/Dashboard/NotificationCenter';
import { PersonalizeDashboardModal } from '../components/Dashboard/PersonalizeDashboardModal';
import { Appointment, Document, Procedure, DashboardStats } from '../types';

interface DashboardSettings {
  visibleSections: {
    stats: boolean;
    appointments: boolean;
    documents: boolean;
    procedures: boolean;
    quickActions: boolean;
    weekCalendar: boolean;
    tips: boolean;
    shortcuts: boolean;
  };
  layout: 'standard' | 'compact' | 'detailed';
  theme: 'light' | 'blue' | 'violet' | 'green';
  sectionOrder: string[];
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t } = useTranslation('common');
  
  // Supabase hooks
  const { aidedPersons, loading: aidedPersonsLoading } = useAidedPersons();
  const { appointments, getUpcomingAppointments, createAppointment, loading: appointmentsLoading } = useAppointments();
  const { documents, loading: documentsLoading } = useDocuments();
  const { procedures, getActiveProcedures, loading: proceduresLoading } = useProcedures();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [activeProcedures, setActiveProcedures] = useState<any[]>([]);
  
  // Load dashboard settings from localStorage
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem('aidassist-dashboard-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing dashboard settings:', error);
      }
    }
    return {
      visibleSections: {
        stats: true,
        appointments: true,
        documents: true,
        procedures: true,
        quickActions: true,
        weekCalendar: true,
        tips: true,
        shortcuts: true
      },
      layout: 'standard',
      theme: 'light',
      sectionOrder: ['stats', 'appointments', 'documents', 'procedures', 'quickActions', 'weekCalendar', 'tips', 'shortcuts']
    };
  });

  // Load real data from Supabase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [upcomingAppts, activeProcs] = await Promise.all([
          getUpcomingAppointments(5),
          getActiveProcedures()
        ]);
        
        setUpcomingAppointments(upcomingAppts);
        setActiveProcedures(activeProcs);
        setRecentDocuments(documents.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [appointments, documents, procedures]);

  // Calculate real stats from data
  const stats: DashboardStats = {
    totalAppointments: appointments.length,
    upcomingAppointments: upcomingAppointments.length,
    totalDocuments: documents.length,
    activeProcedures: procedures.filter(p => p.status === 'in_progress').length,
    completedProcedures: procedures.filter(p => p.status === 'completed').length,
    aidedPersonsCount: aidedPersons.length
  };

  // Show loading state while data is being fetched
  if (aidedPersonsLoading || appointmentsLoading || documentsLoading || proceduresLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const activities = [
    {
      id: '1',
      type: 'appointment_created',
      title: 'Nouveau rendez-vous',
      description: 'RDV cardiologue programmé pour le 28 décembre',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'Marie Dupont'
    },
    {
      id: '2',
      type: 'document_uploaded',
      title: 'Document ajouté',
      description: 'Ordonnance Dr. Martin téléversée',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: 'Pierre Martin'
    },
    {
      id: '3',
      type: 'procedure_completed',
      title: 'Étape terminée',
      description: 'Formulaire CAF complété',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: 'Marie Dupont'
    }
  ];

  const handleCreateAppointment = () => {
    // Ouvrir le modal de création de rendez-vous
    // Cette fonction sera appelée par QuickActions
  };

  const handleEditAppointment = (appointment: Appointment) => {
    console.log('Edit appointment:', appointment);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    console.log('Delete appointment:', appointmentId);
  };

  const handleSaveDashboardSettings = (settings: DashboardSettings) => {
    setDashboardSettings(settings);
    localStorage.setItem('aidassist-dashboard-settings', JSON.stringify(settings));
  };

  // Get theme classes based on current theme
  const getThemeClasses = () => {
    switch (dashboardSettings.theme) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-50 via-white to-blue-100';
      case 'violet':
        return 'bg-gradient-to-br from-violet-50 via-white to-violet-100';
      case 'green':
        return 'bg-gradient-to-br from-green-50 via-white to-green-100';
      default:
        return 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
    }
  };

  // Get layout-specific item counts
  const getLayoutCounts = () => {
    switch (dashboardSettings.layout) {
      case 'compact':
        return { appointments: 2, documents: 2, procedures: 2 };
      case 'detailed':
        return { appointments: 6, documents: 5, procedures: 4 };
      default:
        return { appointments: 4, documents: 3, procedures: 3 };
    }
  };

  const layoutCounts = getLayoutCounts();
  return (
    <div className={`min-h-screen ${getThemeClasses()} animate-fade-in`}>
      <div className="p-6">
        {/* Header */}
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 text-white animate-fade-in-up relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 right-10 lg:top-10 lg:right-20 w-16 h-16 lg:w-32 lg:h-32 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-5 left-10 lg:bottom-10 lg:left-20 w-12 h-12 lg:w-24 lg:h-24 bg-white rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 lg:w-40 lg:h-40 bg-white rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            {/* Top Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-xl lg:rounded-2xl flex items-center justify-center micro-bounce">
                  <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 tracking-tight">
                    Bonjour Marie ! 👋
                  </h1>
                  <div className="flex items-center space-x-2 lg:space-x-4 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-medium">Connectée • Tout va bien</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end space-x-3 lg:space-x-4">
                {/* Weather Widget */}
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center min-w-[100px] lg:min-w-[120px] micro-lift">
                  <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1">
                    <div className="text-lg lg:text-2xl">☁️</div>
                    <span className="text-lg lg:text-2xl font-bold">18°C</span>
                  </div>
                  <div className="text-xs text-blue-100 font-medium hidden sm:block">Paris, France</div>
                  <div className="text-xs text-blue-200 mt-1 hidden lg:block">Humidité 65% • 12 km/h</div>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 relative micro-bounce hover:bg-opacity-25 transition-all duration-200"
                  >
                    <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-xs font-bold text-white text-[10px] lg:text-xs">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 apple-card animate-scale-in z-50" style={{boxShadow: 'var(--shadow-heavy)'}}>
                      <NotificationCenter 
                        notifications={notifications} 
                        onClose={() => setShowNotifications(false)}
                        onMarkAsRead={markAsRead}
                        onMarkAllAsRead={markAllAsRead}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-4 font-medium leading-relaxed">
                  Vous accompagnez actuellement <span className="font-bold text-white">{stats.aidedPersonsCount} personne{stats.aidedPersonsCount > 1 ? 's' : ''}</span> avec{' '}
                  <span className="font-bold text-white">{stats.upcomingAppointments} rendez-vous</span> programmé{stats.upcomingAppointments > 1 ? 's' : ''} cette semaine.
                </p>

                {/* Status Indicators */}
                <div className="flex flex-wrap items-center gap-2 lg:gap-6">
                  <div className="flex items-center space-x-2 bg-white bg-opacity-15 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-300" />
                    <span className="text-xs lg:text-sm font-medium text-blue-100">Données sécurisées</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-15 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2">
                    <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-300" />
                    <span className="text-xs lg:text-sm font-medium text-blue-100 hidden sm:inline">Synchronisation active</span>
                    <span className="text-xs lg:text-sm font-medium text-blue-100 sm:hidden">Sync active</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-15 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-300" />
                    <span className="text-xs lg:text-sm font-medium text-blue-100">MAJ: 23:16</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center justify-center lg:justify-end space-x-4 lg:space-x-6 lg:ml-8">
                <div className="text-center bg-white bg-opacity-15 rounded-xl lg:rounded-2xl p-4 lg:p-6 min-w-[80px] lg:min-w-[100px] micro-lift">
                  <div className="text-2xl lg:text-4xl font-black text-white mb-1">{stats.upcomingAppointments}</div>
                  <div className="text-xs lg:text-sm font-semibold text-blue-100 uppercase tracking-wide">RDV À VENIR</div>
                </div>
                <div className="text-center bg-white bg-opacity-15 rounded-xl lg:rounded-2xl p-4 lg:p-6 min-w-[80px] lg:min-w-[100px] micro-lift">
                  <div className="text-2xl lg:text-4xl font-black text-white mb-1">{stats.activeProcedures}</div>
                  <div className="text-xs lg:text-sm font-semibold text-blue-100 uppercase tracking-wide">DÉMARCHES</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalize Button - Positioned below header */}
        <div className="flex justify-center lg:justify-end mb-4 lg:mb-6 animate-fade-in px-4 lg:px-0">
          <button
            onClick={() => setShowPersonalizeModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 flex items-center space-x-2 font-semibold micro-lift shadow-md hover:shadow-lg text-sm lg:text-base w-full lg:w-auto justify-center lg:justify-start"
          >
            <Palette className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            <span className="hidden sm:inline">Personnaliser le tableau de bord</span>
            <span className="sm:hidden">Personnaliser</span>
          </button>
        </div>

        {/* Stats */}
        {dashboardSettings.visibleSections.stats && (
          <div className={`grid gap-4 lg:gap-6 mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0 ${
            dashboardSettings.layout === 'compact' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : dashboardSettings.layout === 'detailed'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            <StatCard
              title={t('dashboard.nextAppointments') || 'Prochains rendez-vous'}
              value={stats.upcomingAppointments}
              icon={Calendar}
              color="blue"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title={t('dashboard.recentDocuments') || 'Documents récents'}
              value={stats.totalDocuments}
              icon={FileText}
              color="green"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title={t('dashboard.activeProcedures') || 'Démarches en cours'}
              value={stats.activeProcedures}
              icon={ClipboardList}
              color="purple"
            />
            <StatCard
              title={t('dashboard.aidesManaged') || 'Personnes suivies'}
              value={stats.aidedPersonsCount}
              icon={Users}
              color="orange"
            />
          </div>
        )}

        {/* Quick Actions */}
        {dashboardSettings.visibleSections.quickActions && (
          <div className="mb-6 lg:mb-8 animate-slide-in-right px-4 lg:px-0">
            <QuickActions 
              appointments={upcomingAppointments} 
              onNavigate={onNavigate}
              onCreateAppointment={createAppointment}
              aidedPersons={aidedPersons}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8 px-4 lg:px-0">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2">
            {dashboardSettings.visibleSections.appointments && (
              <div className="animate-fade-in-up">
                <div className="apple-card micro-lift p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center tracking-tight">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-blue-600" />
                      {t('dashboard.nextAppointments') || 'Prochains rendez-vous'}
                    </h2>
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <button
                        onClick={() => setShowCalendarModal(true)}
                        className="apple-button-secondary micro-bounce focus-visible flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm"
                      >
                        <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">Calendrier</span>
                      </button>
                      <button
                        onClick={() => onNavigate('appointments')}
                        className="apple-button-secondary micro-bounce focus-visible flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm"
                      >
                        <span className="hidden sm:inline">{t('dashboard.viewAll')}</span>
                        <span className="hidden sm:inline">{t('dashboard.viewAll') || 'Voir tout'}</span>
                        <span className="hidden sm:inline">{t('dashboard.viewAll') || 'Voir tout'}</span>
                        <span className="hidden sm:inline">{t('dashboard.viewAll') || 'Voir tout'}</span>
                        <span className="sm:hidden">Tout</span>
                        <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">Aucun rendez-vous programmé</p>
                    </div>
                  ) : (
                    <div className={`grid gap-4 ${
                      dashboardSettings.layout === 'compact' 
                        ? 'grid-cols-1' 
                        : dashboardSettings.layout === 'detailed'
                        ? 'grid-cols-1 xl:grid-cols-2'
                        : 'grid-cols-1'
                    }`}>
                      {upcomingAppointments.slice(0, layoutCounts.appointments).map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Alerts */}
          <div className="lg:col-span-1">
            <div className="animate-fade-in-up">
              <div className="apple-card micro-lift p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center tracking-tight">
                    <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-orange-600" />
                    Alertes
                  </h2>
                  <button className="apple-button-secondary micro-bounce focus-visible flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm">
                    <span className="hidden sm:inline">Tout voir</span>
                    <span className="sm:hidden">Tout</span>
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Document expiring soon */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-orange-900 mb-1">Document expirant</h4>
                        <p className="text-sm text-orange-700 mb-2">Carte Vitale expire dans 15 jours</p>
                        <div className="flex items-center text-xs text-orange-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Expire le 15 janvier 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment reminder */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">Rappel RDV</h4>
                        <p className="text-sm text-blue-700 mb-2">Consultation cardiologue demain</p>
                        <div className="flex items-center text-xs text-blue-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>Hôpital Saint-Joseph</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Procedure deadline */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 mb-1">Échéance proche</h4>
                        <p className="text-sm text-red-700 mb-2">Dossier CAF à finaliser</p>
                        <div className="flex items-center text-xs text-red-600">
                          <Target className="w-3 h-3 mr-1" />
                          <span>Échéance dans 3 jours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New collaboration */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900 mb-1">Nouvel aidant</h4>
                        <p className="text-sm text-green-700 mb-2">Sophie a rejoint l'équipe</p>
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span>Invitation acceptée</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System update */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900 mb-1">Nouvelle fonctionnalité</h4>
                        <p className="text-sm text-purple-700 mb-2">Recherche globale disponible</p>
                        <div className="flex items-center text-xs text-purple-600">
                          <Zap className="w-3 h-3 mr-1" />
                          <span>Découvrir maintenant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        {dashboardSettings.visibleSections.documents && (
          <div className="mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0">
            <div className="apple-card micro-lift p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center tracking-tight">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-green-600" />
                  {t('dashboard.recentDocuments')}
                </h2>
                <button
                  onClick={() => onNavigate('documents')}
                  className="apple-button-secondary micro-bounce focus-visible flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm"
                >
                  <span className="hidden sm:inline">{t('dashboard.viewAll')}</span>
                  <span className="sm:hidden">Tout</span>
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
              
              <RecentDocuments documents={recentDocuments.slice(0, layoutCounts.documents)} />
            </div>
          </div>
        )}

        {/* Procedures */}
        {dashboardSettings.visibleSections.procedures && (
          <div className="mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0">
            <div className="apple-card micro-lift p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center tracking-tight">
                  <ClipboardList className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-purple-600" />
                  {t('dashboard.activeProcedures')}
                </h2>
                <button
                  onClick={() => onNavigate('procedures')}
                  className="apple-button-secondary micro-bounce focus-visible flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm"
                >
                  <span className="hidden sm:inline">{t('dashboard.viewAll')}</span>
                  <span className="sm:hidden">Tout</span>
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
              
              <ProcedureProgress procedures={activeProcedures.slice(0, layoutCounts.procedures)} />
            </div>
          </div>
        )}

        {/* Week Calendar */}
        {dashboardSettings.visibleSections.weekCalendar && (
          <div className="mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white micro-glow relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-8 w-24 h-24 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-8 w-16 h-16 bg-white rounded-full blur-lg"></div>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center micro-bounce">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
                        {t('dashboard.activeProcedures') || 'Démarches en cours'}
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        {upcomingAppointments.filter(apt => {
                          const weekStart = new Date();
                          weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
                          const weekEnd = new Date(weekStart);
                          weekEnd.setDate(weekEnd.getDate() + 6);
                          return apt.date >= weekStart && apt.date <= weekEnd;
                        }).length} rendez-vous cette semaine
                      </p>
                    </div>
                  </div>

                  {/* Weather and Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-4 text-center min-w-[140px] micro-lift">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="text-2xl">☁️</div>
                        <span className="text-2xl font-bold">18°C</span>
                      </div>
                      <div className="text-xs text-indigo-100 font-medium">Paris, France</div>
                      <div className="flex items-center justify-center space-x-3 text-xs text-indigo-200 mt-2">
                        <div className="flex items-center space-x-1">
                          <span>💧</span>
                          <span>65%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💨</span>
                          <span>12 km/h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setShowCalendarModal(true)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium micro-bounce"
                      >
                        Vue complète
                      </button>
                      <button
                        onClick={handleCreateAppointment}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium micro-bounce flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nouveau</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 lg:gap-3">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + 1 + index);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayAppointments = upcomingAppointments.filter(apt => 
                      apt.date.toDateString() === date.toDateString()
                    );
                    const hasAppointment = dayAppointments.length > 0;
                    
                    return (
                      <div 
                        key={day} 
                        className={`bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center transition-all duration-300 cursor-pointer hover:bg-opacity-25 hover:scale-105 ${
                          isToday ? 'ring-2 ring-white ring-opacity-50 bg-opacity-25' : ''
                        }`}
                        onClick={() => {
                          if (hasAppointment) {
                            setShowCalendarModal(true);
                          }
                        }}
                      >
                        <div className="text-xs lg:text-sm opacity-80 font-medium mb-1">{day}</div>
                        <div className={`text-lg lg:text-2xl font-bold mb-2 ${
                          isToday ? 'text-yellow-300' : ''
                        }`}>
                          {date.getDate()}
                        </div>
                        
                        {/* Appointment indicators */}
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map((apt, aptIndex) => (
                            <div
                              key={aptIndex}
                              className="w-full h-1.5 bg-yellow-400 rounded-full opacity-90"
                              title={`${apt.title} - ${apt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                            />
                          ))}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-yellow-300 font-bold">
                              +{dayAppointments.length - 2}
                            </div>
                          )}
                          {!hasAppointment && (
                            <div className="h-3"></div>
                          )}
                        </div>

                        {/* Today indicator */}
                        {isToday && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Week Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold mb-1">
                      {upcomingAppointments.filter(apt => {
                        const weekStart = new Date();
                        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 6);
                        return apt.date >= weekStart && apt.date <= weekEnd;
                      }).length}
                    </div>
                    <div className="text-xs text-indigo-100 font-medium uppercase tracking-wide">RDV cette semaine</div>
                  </div>
                  
                  <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold mb-1">
                      {upcomingAppointments.filter(apt => 
                        apt.date.toDateString() === new Date().toDateString()
                      ).length}
                    </div>
                    <div className="text-xs text-indigo-100 font-medium uppercase tracking-wide">Aujourd'hui</div>
                  </div>
                  
                  <div className="bg-white bg-opacity-15 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold mb-1">
                      {upcomingAppointments.filter(apt => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return apt.date.toDateString() === tomorrow.toDateString();
                      }).length}
                    </div>
                    <div className="text-xs text-indigo-100 font-medium uppercase tracking-wide">Demain</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {dashboardSettings.visibleSections.tips && (
          <div className="mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg p-4 lg:p-6 text-white micro-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3 lg:mr-4 micro-bounce">
                  <Star className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold">Conseil du jour</h3>
                  <p className="text-amber-100 text-xs lg:text-sm">Optimisez votre organisation</p>
                </div>
              </div>
              <p className="text-amber-50 leading-relaxed font-medium text-sm lg:text-base">
                💡 Pensez à préparer vos questions avant chaque rendez-vous médical. 
                Cela vous permettra de maximiser le temps avec le professionnel de santé 
                et de ne rien oublier d'important.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 text-amber-100 text-xs lg:text-sm">
                  <Award className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Astuce validée par 95% des aidants</span>
                  <span className="sm:hidden">Validée par 95% des aidants</span>
                </div>
                <button className="text-white hover:text-amber-100 transition-colors duration-200 micro-bounce self-end sm:self-auto">
                  <Bookmark className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shortcuts */}
        {dashboardSettings.visibleSections.shortcuts && (
          <div className="mb-6 lg:mb-8 animate-fade-in-up px-4 lg:px-0">
            <div className="apple-card micro-lift p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-yellow-600" />
                Accès rapides
              </h3>
              <div className={`grid gap-4 ${
                dashboardSettings.layout === 'compact' 
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
                  : dashboardSettings.layout === 'detailed'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              }`}>
                {[
                  { icon: Phone, label: 'Urgences', color: 'bg-red-500', action: () => window.open('tel:15') },
                  { icon: Mail, label: 'Support', color: 'bg-blue-500', action: () => window.open('mailto:support@aidassist.fr') },
                  { icon: MapPin, label: 'Pharmacie', color: 'bg-green-500', action: () => window.open('https://maps.google.com/search/pharmacie') },
                  { icon: ExternalLink, label: 'Ameli.fr', color: 'bg-purple-500', action: () => window.open('https://ameli.fr') }
                ].map((shortcut, index) => {
                  const Icon = shortcut.icon;
                  return (
                    <button
                      key={index}
                      onClick={shortcut.action}
                      className={`${shortcut.color} text-white p-3 lg:p-4 rounded-lg hover:opacity-90 transition-all duration-200 text-center micro-lift focus-visible`}
                    >
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 mx-auto mb-2" />
                      <span className="text-xs lg:text-sm font-medium">{shortcut.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="mt-6 lg:mt-8 animate-fade-in-up px-4 lg:px-0">
          <div className="apple-card micro-lift p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center tracking-tight">
                <Activity className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-indigo-600" />
                Activité récente
              </h2>
              <button className="apple-button-secondary micro-bounce focus-visible px-2 lg:px-3 py-1 lg:py-1.5 text-xs lg:text-sm">
                <span className="hidden sm:inline">Voir tout</span>
                <span className="sm:hidden">Tout</span>
              </button>
            </div>
            
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <CalendarManagement
          appointments={upcomingAppointments}
          onClose={() => setShowCalendarModal(false)}
          onCreateAppointment={handleCreateAppointment}
          onEditAppointment={handleEditAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          aidedPersons={aidedPersons}
        />
      )}

      {/* Personalize Modal */}
      <PersonalizeDashboardModal
        isOpen={showPersonalizeModal}
        onClose={() => setShowPersonalizeModal(false)}
        onSave={handleSaveDashboardSettings}
        currentSettings={dashboardSettings}
      />
    </div>
  );
};