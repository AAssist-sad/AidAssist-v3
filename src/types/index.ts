export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'contributor' | 'reader';
  language: 'fr' | 'en';
  avatar?: string;
  createdAt: Date;
}

export interface AidedPerson {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: string;
  medicalInfo?: string;
  emergencyContact?: string;
  address?: string;
  socialSecurityNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  location: string;
  type: 'consultation' | 'hospital' | 'teleconsultation' | 'emergency' | 'analysis' | 'specialist';
  aidedPersonId: string;
  accompaniedBy?: string;
  documents: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reminder: {
    enabled: boolean;
    timeBeforeInMinutes: number;
  };
  notes?: string;
  doctorName?: string;
  specialty?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'medical' | 'administrative' | 'insurance' | 'identity' | 'other';
  aidedPersonId: string;
  appointmentId?: string;
  procedureId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
  description?: string;
  expirationDate?: Date;
  tags: string[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  category: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other';
  steps: ProcedureStep[];
  language: 'fr' | 'en';
  aidedPersonId: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  documents?: string[];
  externalLink?: string;
  notes?: string;
  completedAt?: Date;
  completedBy?: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'document' | 'deadline' | 'collaboration' | 'reminder';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: Date;
}

export interface Language {
  code: 'fr' | 'en';
  name: string;
  flag: string;
}

export interface Translation {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalDocuments: number;
  activeProcedures: number;
  completedProcedures: number;
  aidedPersonsCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'deadline' | 'reminder';
  color: string;
  data: any;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  category: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other';
  language: 'fr' | 'en';
  aidedPersonId: string;
  progress: number;
  steps: ChecklistStep[];
}

export interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  documents?: string[];
  externalLink?: string;
  notes?: string;
  completedAt?: Date;
  completedBy?: string;
}