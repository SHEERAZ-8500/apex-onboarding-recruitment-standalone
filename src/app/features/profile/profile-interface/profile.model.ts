/**
 * Profile Completion & Avatars — models
 * Matches the backend contract for /api/auth/profile
 */

export interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  address?: string | null;
  cnic?: string | null;
  emailVerified: boolean;
  roleCode: string;
  avatarUrl: string | null;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: ProfileData;
}

/** Payload for PATCH /api/auth/profile */
export interface UpdateProfilePayload {
  phoneNumber?: string;
  address?: string;
  cnic?: string;
}

/** CNIC must match: 5 digits - 7 digits - 1 digit, e.g. 42101-1234567-1 */
export const CNIC_PATTERN = /^\d{5}-\d{7}-\d$/;

/** Pakistani mobile number, e.g. 03001234567 */
export const PHONE_PATTERN = /^03\d{9}$/;

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
