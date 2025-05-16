export interface EventRating {
  id: string;
  event_id: string;
  user_id: string;
  organization_rating: number;
  content_rating: number;
  venue_rating: number;
  speaker_rating: number;
  overall_rating: number;
  submitted_at: string;
  is_realtime: boolean;
}

export interface EventFeedback {
  id: string;
  event_id: string;
  user_id: string;
  category: string;
  feedback_text: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  submitted_at: string;
  is_realtime: boolean;
}

export interface FeedbackCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface FeedbackResponse {
  id: string;
  event_id: string;
  user_id: string;
  question: string;
  response: string;
  submitted_at: string;
  is_realtime: boolean;
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  category?: string;
  required?: boolean;
}

export interface FeedbackSummary {
  averageRatings: {
    organization: number;
    content: number;
    venue: number;
    speaker: number;
    overall: number;
  };
  totalResponses: number;
  categoryBreakdown: {
    [key: string]: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  commonThemes: {
    positive: string[];
    negative: string[];
  };
  suggestions: string[];
}