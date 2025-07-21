/**
 * Validation utility functions for forms and data
 */

/**
 * Email validation regex pattern
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Phone number validation regex pattern for Vietnam
 */
const PHONE_PATTERN = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

/**
 * URL validation regex pattern
 */
const URL_PATTERN = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

/**
 * Vietnamese text validation regex pattern (allows Vietnamese characters)
 */
const VIETNAMESE_TEXT_PATTERN = /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ,.!?@#$%^&*()_+-=\\[\]{}|;':",./<>?]+$/;

/**
 * Password validation (at least 8 characters, contains at least one uppercase, one lowercase, one number)
 */
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

/**
 * Validation functions for common use cases
 */
export const validationUtils = {
  /**
   * Check if value is not empty
   */
  isNotEmpty: (value: string | undefined | null): boolean => {
    return !!value && value.trim().length > 0;
  },
  
  /**
   * Check if value is a valid email
   */
  isValidEmail: (email: string): boolean => {
    return EMAIL_PATTERN.test(email);
  },
  
  /**
   * Check if value is a valid Vietnamese phone number
   */
  isValidPhone: (phone: string): boolean => {
    return PHONE_PATTERN.test(phone);
  },
  
  /**
   * Check if value is a valid URL
   */
  isValidUrl: (url: string): boolean => {
    return URL_PATTERN.test(url);
  },
  
  /**
   * Check if value is a strong password
   */
  isStrongPassword: (password: string): boolean => {
    return STRONG_PASSWORD_PATTERN.test(password);
  },
  
  /**
   * Check if value is a valid Vietnamese text
   */
  isValidVietnameseText: (text: string): boolean => {
    return VIETNAMESE_TEXT_PATTERN.test(text);
  }
};

/**
 * Form validation rules for Ant Design Form
 */
export const formValidationRules = {
  /**
   * Required field rule
   */
  required: (message = 'Trường này là bắt buộc') => ({
    required: true,
    message
  }),
  
  /**
   * Email validation rule
   */
  email: (message = 'Vui lòng nhập email hợp lệ') => ({
    pattern: EMAIL_PATTERN,
    message
  }),
  
  /**
   * Phone validation rule
   */
  phone: (message = 'Vui lòng nhập số điện thoại hợp lệ') => ({
    pattern: PHONE_PATTERN,
    message
  }),
  
  /**
   * URL validation rule
   */
  url: (message = 'Vui lòng nhập URL hợp lệ') => ({
    pattern: URL_PATTERN,
    message
  }),
  
  /**
   * Strong password validation rule
   */
  strongPassword: (message = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số') => ({
    pattern: STRONG_PASSWORD_PATTERN,
    message
  }),
  
  /**
   * Min length validation rule
   */
  minLength: (min: number, message?: string) => ({
    min,
    message: message || `Vui lòng nhập ít nhất ${min} ký tự`
  }),
  
  /**
   * Max length validation rule
   */
  maxLength: (max: number, message?: string) => ({
    max,
    message: message || `Vui lòng nhập không quá ${max} ký tự`
  }),
  
  /**
   * Numeric value validation rule
   */
  number: (message = 'Vui lòng nhập giá trị số') => ({
    type: 'number' as const,
    message
  }),
  
  /**
   * Minimum value validation rule
   */
  min: (min: number, message?: string) => ({
    type: 'number' as const,
    min,
    message: message || `Giá trị tối thiểu là ${min}`
  }),
  
  /**
   * Maximum value validation rule
   */
  max: (max: number, message?: string) => ({
    type: 'number' as const,
    max,
    message: message || `Giá trị tối đa là ${max}`
  })
};
