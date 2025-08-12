// Validation utilities for forms and data

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  strength: number;
  errors: string[];
} => {
  const errors: string[] = [];
  let strength = 0;

  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  } else {
    strength++;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule');
  } else {
    strength++;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule');
  } else {
    strength++;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Au moins un chiffre');
  } else {
    strength++;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Au moins un caractère spécial');
  } else {
    strength++;
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  return file.size <= maxSizeInMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

// Form validation schemas
export const appointmentValidation = {
  title: (value: string) => validateRequired(value) && validateLength(value, 1, 100),
  date: (value: string) => validateRequired(value) && validateDate(value),
  location: (value: string) => validateRequired(value) && validateLength(value, 1, 200),
  duration: (value: number) => value >= 5 && value <= 480
};

export const documentValidation = {
  name: (value: string) => validateRequired(value) && validateLength(value, 1, 100),
  file: (file: File) => validateFileSize(file, 10) && validateFileType(file, [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ])
};

export const procedureValidation = {
  title: (value: string) => validateRequired(value) && validateLength(value, 1, 100),
  description: (value: string) => validateRequired(value) && validateLength(value, 1, 500),
  steps: (steps: any[]) => steps.length > 0 && steps.every(step => validateRequired(step.title))
};

export const profileValidation = {
  firstName: (value: string) => validateRequired(value) && validateLength(value, 1, 50),
  lastName: (value: string) => validateRequired(value) && validateLength(value, 1, 50),
  email: (value: string) => validateRequired(value) && validateEmail(value)
};