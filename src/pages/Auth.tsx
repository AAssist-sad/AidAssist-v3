import React, { useState } from 'react';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';

type AuthMode = 'login' | 'register' | 'reset';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onSwitchToReset={() => setMode('reset')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onSwitchToLogin={() => setMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderForm()}
    </AuthLayout>
  );
};