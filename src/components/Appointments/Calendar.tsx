import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Appointment } from '../../types';
import { AppointmentCard } from '../Dashboard/AppointmentCard';

interface CalendarProps {
  appointments: Appointment[];
  onNewAppointment: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({ appointments = [], onNewAppointment }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'month' | 'week' | 'list'>('month');

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(firstDayOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - firstDayOfMonth.getDay());

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const calendarDays = [];

  // Generate calendar days
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
      apt.date.toDateString() === date.toDateString()
    );
  };

  const upcomingAppointments = appointments
    .filter(apt => apt.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'list'] as const).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    view === viewType
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType === 'month' ? 'Mois' : viewType === 'week' ? 'Semaine' : 'Liste'}
                </button>
              ))}
            </div>

            <button
              onClick={onNewAppointment}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 micro-bounce"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau RDV</span>
              <span className="sm:hidden">RDV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {days.map((day) => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <span className="text-xs font-semibold text-gray-700">{day}</span>
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
                  className={`bg-white p-2 min-h-[80px] ${
                    !isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center' 
                      : ''
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                        title={apt.title}
                      >
                        {apt.title}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains rendez-vous</h3>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun rendez-vous programmé</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};