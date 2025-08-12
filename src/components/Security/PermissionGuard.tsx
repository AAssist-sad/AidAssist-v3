import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { hasPermission, handleSupabaseError } from '../../lib/supabase';

interface PermissionGuardProps {
  children: React.ReactNode;
  aidedPersonId: string;
  requiredRole: 'lecture' | 'contributeur' | 'admin';
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  aidedPersonId,
  requiredRole,
  fallback,
  showError = true
}) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const permission = await hasPermission(aidedPersonId, requiredRole);
        setHasAccess(permission);
      } catch (err) {
        setError(handleSupabaseError(err));
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (aidedPersonId) {
      checkPermission();
    } else {
      setHasAccess(false);
      setLoading(false);
    }
  }, [aidedPersonId, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Vérification des permissions...</span>
      </div>
    );
  }

  if (error && showError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="text-red-700 font-medium">Erreur de permission</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Accès restreint</h3>
          <p className="text-yellow-700">
            Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            <br />
            Rôle requis: <span className="font-semibold">{requiredRole}</span>
          </p>
          <div className="mt-4 text-sm text-yellow-600">
            Contactez un administrateur pour obtenir les droits d'accès appropriés.
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

// Hook for checking permissions in components
export const usePermissionCheck = (aidedPersonId: string, requiredRole: 'lecture' | 'contributeur' | 'admin') => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        const permission = await hasPermission(aidedPersonId, requiredRole);
        setHasAccess(permission);
      } catch (error) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (aidedPersonId) {
      checkPermission();
    } else {
      setHasAccess(false);
      setLoading(false);
    }
  }, [aidedPersonId, requiredRole]);

  return { hasAccess, loading };
};