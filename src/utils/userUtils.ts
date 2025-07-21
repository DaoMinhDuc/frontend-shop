/**
 * Utility functions for user profile
 */
import type { User } from '../types/user';
import type { FormInstance } from 'antd/es/form';

/**
 * Types for password change form values
 */
export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const setUserFormValues = (form: FormInstance, user: User | undefined | null): void => {
  if (!user) return;
  
  form.setFieldsValue({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
};

/**
 * Check if user phone number is valid
 * @param phone Phone number to validate
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone);
};
