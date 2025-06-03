export interface ApiLoginErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

export interface UserProfile {
  id?: string;
  username?: string;
  isEmailVerified?: boolean;
  fullName: string | null;
  displayName: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  nationality: string | null;
  address: string | null;
  phoneNumber: string | null;
  discordId: string | null;
  twitchId: string | null;
  avatarUrl: string | null;
  bio: string | null;
  preferences: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    darkMode: boolean;
    language: string;
    contentPreferences: string[];
    dashboardView: string;
    timeZone: string;
  };
}

export interface Profile {
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  displayName: string;
  id: string;
  isStreaming: boolean;
  isVerified: boolean;
  joinedAt: Date;
  socials: any[];
  stats: { followers: number; following: number; videos: number };
  accountHealth: { score: number; status: string };
}
