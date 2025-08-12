export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'aidant' | 'proche_aide';
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  preferences: {
    language: 'fr' | 'en';
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
  };
}

export interface AidantRole {
  id: string;
  aidantId: string;
  aidedPersonId: string;
  role: 'lecture' | 'contributeur' | 'admin';
  invitedBy: string;
  invitedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Invitation {
  id: string;
  email: string;
  aidedPersonId: string;
  role: 'lecture' | 'contributeur' | 'admin';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'invite_sent' | 'role_changed' | 'profile_updated' | 'password_reset';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  lastActivity: Date;
  isActive: boolean;
}