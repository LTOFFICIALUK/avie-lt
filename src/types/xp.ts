// User XP Data Structure
export interface UserXP {
  totalXP: number;
  currentWeekXP: number;
  weeklyRank: number | null;
  breakdown: XPBreakdown;
}

// XP Breakdown by Source
export interface XPBreakdown {
  // Viewer XP sources
  chatXP: number;
  watchTimeXP: number;
  likedStreamsXP: number;
  donationsXP: number;
  
  // Streamer XP sources
  uniqueViewersXP: number;
  newFollowersXP: number;
  streamChatXP: number;
  streamTimeXP: number;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  rank: number;
  xp: number;
  isCurrentUser?: boolean;
}

// Weekly XP History
export interface WeeklyXPHistory {
  weekStartDate: string;
  weekEndDate: string;
  totalXP: number;
  rank: number | null;
  breakdown: XPBreakdown;
}

// XP Event
export interface XPEvent {
  id: string;
  createdAt: string;
  userId: string;
  amount: number;
  source: XPSource;
  details: any;
  weekOf: string;
}

// XP Source Enum
export enum XPSource {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  WATCH_TIME = 'WATCH_TIME',
  STREAM_LIKE = 'STREAM_LIKE',
  DONATION = 'DONATION',
  UNIQUE_VIEWER = 'UNIQUE_VIEWER',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  STREAM_CHAT = 'STREAM_CHAT',
  STREAM_TIME = 'STREAM_TIME'
} 