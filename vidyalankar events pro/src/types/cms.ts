export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  category: string;
  tags: string[];
  views: number;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CmsTag {
  id: string;
  name: string;
  slug: string;
}