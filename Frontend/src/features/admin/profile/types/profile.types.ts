export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  city?: string;
  address?: string;
  password?: string;
}

export interface SecurityFormData {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
