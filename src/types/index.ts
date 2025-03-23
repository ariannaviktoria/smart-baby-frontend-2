// Authentikációs típusok
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
}

// Felhasználói profil típusok
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Baba adatok
export interface Baby {
  id: number;
  name: string;
  dateOfBirth: Date;
  gender: number;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Napi rutin típusok
export interface DailyRoutine {
  id: number;
  babyId: number;
  date: Date;
  wakeUpTime?: string;
  bedTime?: string;
  napCount?: number;
  feedingCount?: number;
  notes?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Növekedés adatok
export interface Growth {
  id: number;
  babyId: number;
  date: Date;
  weight?: number;
  height?: number;
  headCircumference?: number;
  notes?: string;
}

// Alvási adatok
export interface SleepPeriod {
  id: number;
  babyId: number;
  startTime: Date;
  endTime?: Date;
  quality?: 'good' | 'fair' | 'poor';
  location?: string;
  notes?: string;
}

// Etetési adatok
export interface Feeding {
  id: number;
  babyId: number;
  startTime: Date;
  endTime?: Date;
  type: 'breast' | 'bottle' | 'solid';
  amount?: number;
  notes?: string;
}

// Sírási adatok
export interface CryingPeriod {
  id: number;
  babyId: number;
  startTime: Date;
  endTime?: Date;
  reason?: string;
  intensity?: 'low' | 'medium' | 'high';
  solution?: string;
  notes?: string;
}

// Jegyzetek
export interface Note {
  id: number;
  babyId: number;
  content: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API válasz típusok
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Általános lekérdezési paraméterek
export interface DateRangeParams {
  startDate: Date;
  endDate: Date;
} 