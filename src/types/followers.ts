export interface Followers {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  followers: Follower[];
}

export interface Follower {
  avatarUrl: string;
  bio: string | null;
  displayName: string;
  followedAt: string;
  id: string;
  isVerified: boolean;
}
