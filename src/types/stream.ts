export interface Stream {
  id: string;
  isLive: boolean;
  startedAt: string;
  viewers: number;
  thumbnail: string | null;
  title: string;
  user: {
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  _count: {
    streams: number;
  };
}
