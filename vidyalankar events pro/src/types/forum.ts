export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  is_pinned: boolean;
  is_locked: boolean;
  replies_count: number;
  last_reply_at: string | null;
  last_reply_by: string | null;
}

export interface ForumReply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  likes: number;
  is_solution: boolean;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topics_count: number;
  icon: string;
}