export interface Videos {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  videos: Video[];
}

export interface Video {
  duration: number;
  endedAt: string;
  likes: number;
  maxViewers: number;
  playbackUrl: number;
  startedAt: string;
  thumbnail: string;
  title: string;
  viewers: number;
  vodUrl: string;
  user: { avatarUrl: string; displayName: string; id: string };
}
