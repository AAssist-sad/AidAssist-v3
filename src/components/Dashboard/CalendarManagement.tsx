import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Search,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Appointment } from '../../types';

interface CalendarManagementProps {
  appointments: Appointment[];
  onClose: () => void;
  onCreateAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const CalendarManagement: React.FC<CalendarManagementProps> = ({
  appointments,
  onClose,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(firstDayOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - firstDayOfMonth.getDay());

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startOfCalendar);
    date.setDate(startOfCalendar.getDate() + i);
    calendarDays.push(date);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString() &&
      (filterType === 'all' || apt.type === filterType) &&
      (searchTerm === '' || 
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500';
      case 'hospital': return 'bg-red-500';
      case 'teleconsultation': return 'bg-green-500';
      case 'emergency': return 'bg-red-600';
      case 'analysis': return 'bg-purple-500';
      case 'specialist': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-3 h-3 text-green-600" />;
      case 'cancelled': return <X className="w-3 h-3 text-red-600" />;
      case 'rescheduled': return <AlertCircle className="w-3 h-3 text-orange-600" />;
      default: return <Clock className="w-3 h-3 text-blue-600" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    (filterType === 'all' || apt.type === filterType) &&
    (searchTerm === '' || 
      apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const upcomingAppointments = filteredAppointments
    .filter(apt => apt.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastAppointments = filteredAppointments
    .filter(apt => apt.date < today)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gestion du Calendrier</h2>
                <p className="text-blue-100">Gérez tous vos rendez-vous en un seul endroit</p>
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

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 min-w-[200px] text-center px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Aujourd'hui
              </button>
            </div>

            {/* View Selector */}
            <div className="flex bg-white rounded-xl p-1.5 shadow-lg border border-gray-200">
              {(['month', 'week', 'day', 'list'] as const).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    view === viewType
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {viewType === 'month' ? 'Mois' : 
                   viewType === 'week' ? 'Semaine' : 
                   viewType === 'day' ? 'Jour' : 'Liste'}
                </button>
              ))}
            </div>

            {/* Actions */}
            <button
              onClick={onCreateAppointment}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau RDV</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un rendez-vous..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Filter className="w-5 h-5 text-gray-500" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              >
                <option value="all">Tous les types</option>
                <option value="consultation">Consultation</option>
                <option value="hospital">Hôpital</option>
                <option value="teleconsultation">Téléconsultation</option>
                <option value="emergency">Urgence</option>
                <option value="analysis">Analyse</option>
                <option value="specialist">Spécialiste</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50 to-white">
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-1 bg-gray-100 rounded-2xl overflow-hidden p-2 shadow-inner">
              {/* Day headers */}
              {days.map((day) => (
                <div key={day} className="bg-gradient-to-b from-gray-200 to-gray-100 p-4 text-center rounded-xl">
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">{day}</span>
                </div>
              ))}

              {/* Calendar cells */}
              {calendarDays.map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <div
                    key={index}
                    className={`bg-white p-3 min-h-[130px] rounded-xl shadow-sm border border-gray-100 ${
                      !isCurrentMonth ? 'text-gray-400 bg-gray-50/50' : 'hover:shadow-md hover:border-blue-200'
                    } transition-all duration-200 cursor-pointer`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isToday 
                        ? 'w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg' 
                        : ''
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={`text-xs px-2 py-1.5 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 ${getTypeColor(apt.type)} text-white font-medium shadow-sm`}
                          title={`${apt.title} - ${apt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(apt.status)}
                            <span className="truncate">{apt.title}</span>
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-lg font-medium">
                          +{dayAppointments.length - 3} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'list' && (
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Rendez-vous à venir</span>
                  <span className="ml-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {upcomingAppointments.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                      <div className="w-16 h-16 mx-auto mb-4 text-gray-400 flex items-center justify-center">
                        <Calendar className="w-12 h-12" />
                      </div>
                      <p className="text-lg font-medium text-gray-600">Aucun rendez-vous à venir</p>
                      <p className="text-sm text-gray-500 mt-2">Cliquez sur "Nouveau RDV" pour en créer un</p>
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-4 h-4 rounded-full ${getTypeColor(appointment.type)} shadow-sm`}></div>
                              <h4 className="font-bold text-gray-900 text-lg">{appointment.title}</h4>
                              {getStatusIcon(appointment.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{appointment.date.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{appointment.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-purple-50 p-2 rounded-lg">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate font-medium">{appointment.location}</span>
                              </div>
                            </div>

                            {appointment.description && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg italic">{appointment.description}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditAppointment(appointment)}
                              className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteAppointment(appointment.id)}
                              className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl border border-gray-200">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    <span>Rendez-vous passés</span>
                    <span className="ml-2 bg-gray-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                      {pastAppointments.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {pastAppointments.slice(0, 10).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 opacity-80 hover:opacity-100 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-4 h-4 rounded-full ${getTypeColor(appointment.type)}`}></div>
                              <h4 className="font-semibold text-gray-700">{appointment.title}</h4>
                              {getStatusIcon(appointment.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{appointment.date.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{appointment.location}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Statistics Footer */}
        <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100">
                <div className="text-3xl font-black text-blue-600 mb-1">{upcomingAppointments.length}</div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">À venir</div>
              </div>
            </div>
            <div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-green-100">
                <div className="text-3xl font-black text-green-600 mb-1">
                  {filteredAppointments.filter(apt => apt.status === 'completed').length}
                </div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Terminés</div>
              </div>
            </div>
            <div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-1">
                  {filteredAppointments.filter(apt => apt.status === 'rescheduled').length}
                </div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Reportés</div>
              </div>
            </div>
            <div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-red-100">
                <div className="text-3xl font-black text-red-600 mb-1">
                  {filteredAppointments.filter(apt => apt.status === 'cancelled').length}
                </div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Annulés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Détails du rendez-vous</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{selectedAppointment.title}</h4>
                {selectedAppointment.description && (
                  <p className="text-gray-600 mt-1">{selectedAppointment.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedAppointment.date.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedAppointment.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">{selectedAppointment.duration} minutes</div>
                      <div className="text-sm text-gray-600">Durée estimée</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">{selectedAppointment.location}</div>
                      <div className="text-sm text-gray-600">Lieu du rendez-vous</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedAppointment.doctorName && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedAppointment.doctorName}</div>
                        {selectedAppointment.specialty && (
                          <div className="text-sm text-gray-600">{selectedAppointment.specialty}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAppointment.accompaniedBy && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedAppointment.accompaniedBy}</div>
                        <div className="text-sm text-gray-600">Accompagnant</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(selectedAppointment.status)}
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{selectedAppointment.status}</div>
                      <div className="text-sm text-gray-600">Statut</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    onEditAppointment(selectedAppointment);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => {
                    onDeleteAppointment(selectedAppointment.id);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};