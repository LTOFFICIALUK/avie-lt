export interface CharacterFormData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    system?: string;
    bio?: string[];
    lore?: string[];
    media?: MediaItem[];
    style?: { all: string[]; chat: string[]; post: string[] };
    knowledge?: KnowledgeItem[];
    topics?: string[];
    adjectives?: string[];
    secrets?: Record<string, unknown>;
    postExamples?: string[];
    messageExamples?: MessageExample[];
    voice?: { model: string };
    twitter?: { postWithImages: boolean, username: string, mentions: TwitterMention[] };
    chat_active?: boolean;
  };
  avatarUrl?: string;
}

export interface MediaItem {
  url: string;
  type: string;
}

export interface MessageExample {
  user: string;
  content: { text: string };
}

export interface TwitterMention {
  username: string;
  id?: string;
}

export interface KnowledgeItem {
  id: string;
  path: string;
  content: string;
}
