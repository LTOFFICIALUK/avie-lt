import { UserProfile } from "./api";

export interface User {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  isEmailVerified?: boolean;
  avatarUrl?: string;
}

export interface Session {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
