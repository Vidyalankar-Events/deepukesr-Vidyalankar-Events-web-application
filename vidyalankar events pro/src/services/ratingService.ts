import { supabase } from '../lib/supabase';
import { 
  EventRating, 
  EventFeedback, 
  FeedbackCategory,
  FeedbackResponse,
  FeedbackSummary 
} from '../types/ratings';

// Default feedback questions
const defaultQuestions = [
  {
    id: 'enjoy',
    text: 'What did you enjoy most about the event?',
    category: 'General',
    required: true
  },
  {
    id: 'improve',
    text: 'How can we improve future events?',
    category: 'Improvement',
    required: true
  },
  {
    id: 'engaging',
    text: 'Was the event content engaging? Please explain.',
    category: 'Content',
    required: true
  },
  {
    id: 'suggestions',
    text: 'Please provide any additional suggestions or comments.',
    category: 'Other',
    required: false
  }
];

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Mock data for development
const mockRatings: EventRating[] = [];
const mockFeedback: EventFeedback[] = [];
const mockResponses: FeedbackResponse[] = [];

export const ratingService = {
  // Get user's rating for an event
  getUserEventRating: async (eventId: string, userId: string): Promise<EventRating | null> => {
    if (useMockData()) {
      return mockRatings.find(r => r.event_id === eventId && r.user_id === userId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('event_ratings')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user rating:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
  },

  // Submit event rating
  submitRating: async (rating: Omit<EventRating, 'id' | 'submitted_at'>): Promise<{ data: EventRating | null; error: any }> => {
    // Check for existing rating
    const existingRating = await ratingService.getUserEventRating(rating.event_id, rating.user_id);
    if (existingRating) {
      return { data: null, error: { message: 'You have already submitted feedback for this event' } };
    }

    if (useMockData()) {
      const newRating: EventRating = {
        id: crypto.randomUUID(),
        submitted_at: new Date().toISOString(),
        ...rating
      };
      mockRatings.push(newRating);
      return { data: newRating, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('event_ratings')
        .insert({
          event_id: rating.event_id,
          user_id: rating.user_id,
          organization_rating: rating.organization_rating,
          content_rating: rating.content_rating,
          venue_rating: rating.venue_rating,
          speaker_rating: rating.speaker_rating,
          overall_rating: rating.overall_rating,
          is_realtime: rating.is_realtime
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error submitting rating:', error);
      return { data: null, error };
    }
  },

  // Submit event feedback
  submitFeedback: async (feedback: Omit<EventFeedback, 'id' | 'submitted_at' | 'sentiment'>): Promise<{ data: EventFeedback | null; error: any }> => {
    if (useMockData()) {
      const newFeedback: EventFeedback = {
        id: crypto.randomUUID(),
        submitted_at: new Date().toISOString(),
        sentiment: 'neutral',
        ...feedback
      };
      mockFeedback.push(newFeedback);
      return { data: newFeedback, error: null };
    }

    try {
      // Call sentiment analysis function (to be implemented)
      const sentiment = await analyzeSentiment(feedback.feedback_text);

      const { data, error } = await supabase
        .from('event_feedback')
        .insert({
          ...feedback,
          sentiment
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { data: null, error };
    }
  },

  // Submit feedback responses
  submitFeedbackResponses: async (
    eventId: string,
    userId: string,
    responses: { question: string; response: string }[],
    isRealtime?: boolean
  ): Promise<boolean> => {
    if (useMockData()) {
      responses.forEach(response => {
        mockResponses.push({
          id: crypto.randomUUID(),
          event_id: eventId,
          user_id: userId,
          question: response.question,
          response: response.response,
          submitted_at: new Date().toISOString(),
          is_realtime: isRealtime || false
        });
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('event_feedback_responses')
        .insert(
          responses.map(response => ({
            event_id: eventId,
            user_id: userId,
            question: response.question,
            response: response.response,
            is_realtime: isRealtime || false
          }))
        );

      return !error;
    } catch (error) {
      console.error('Error submitting feedback responses:', error);
      return false;
    }
  },

  // Get feedback categories
  getFeedbackCategories: async (): Promise<FeedbackCategory[]> => {
    if (useMockData()) {
      return [
        {
          id: '1',
          name: 'Venue',
          description: 'Feedback about the event venue and facilities',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Content',
          description: 'Feedback about the event content and materials',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Organization',
          description: 'Feedback about event organization and management',
          created_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('event_feedback_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching feedback categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching feedback categories:', error);
      return [];
    }
  },

  // Get default feedback questions
  getDefaultQuestions: () => defaultQuestions,

  // Get event feedback summary
  getEventFeedbackSummary: async (eventId: string): Promise<FeedbackSummary | null> => {
    if (useMockData()) {
      return {
        averageRatings: {
          organization: 4.5,
          content: 4.2,
          venue: 4.0,
          speaker: 4.8,
          overall: 4.4
        },
        totalResponses: mockRatings.filter(r => r.event_id === eventId).length,
        categoryBreakdown: {
          Venue: { positive: 15, negative: 3, neutral: 2 },
          Content: { positive: 18, negative: 1, neutral: 1 },
          Organization: { positive: 16, negative: 2, neutral: 2 }
        },
        commonThemes: {
          positive: ['Great speakers', 'Well organized', 'Engaging content'],
          negative: ['Room temperature', 'Limited seating']
        },
        suggestions: [
          'More networking opportunities',
          'Longer Q&A sessions',
          'Better refreshments'
        ]
      };
    }

    try {
      // Get ratings
      const { data: ratings } = await supabase
        .from('event_ratings')
        .select('*')
        .eq('event_id', eventId);

      // Get feedback
      const { data: feedback } = await supabase
        .from('event_feedback')
        .select('*')
        .eq('event_id', eventId);

      // Get responses
      const { data: responses } = await supabase
        .from('event_feedback_responses')
        .select('*')
        .eq('event_id', eventId);

      if (!ratings || !feedback || !responses) {
        return null;
      }

      // Calculate average ratings
      const averageRatings = {
        organization: calculateAverage(ratings.map(r => r.organization_rating)),
        content: calculateAverage(ratings.map(r => r.content_rating)),
        venue: calculateAverage(ratings.map(r => r.venue_rating)),
        speaker: calculateAverage(ratings.map(r => r.speaker_rating)),
        overall: calculateAverage(ratings.map(r => r.overall_rating))
      };

      // Calculate category breakdown
      const categoryBreakdown: { [key: string]: { positive: number; negative: number; neutral: number } } = {};
      feedback.forEach(f => {
        if (!categoryBreakdown[f.category]) {
          categoryBreakdown[f.category] = { positive: 0, negative: 0, neutral: 0 };
        }
        categoryBreakdown[f.category][f.sentiment || 'neutral']++;
      });

      // Extract common themes and suggestions
      const commonThemes = extractCommonThemes(feedback);
      const suggestions = responses
        .filter(r => r.question.toLowerCase().includes('suggest') || r.question.toLowerCase().includes('improve'))
        .map(r => r.response);

      return {
        averageRatings,
        totalResponses: ratings.length,
        categoryBreakdown,
        commonThemes,
        suggestions: suggestions.slice(0, 10) // Limit to top 10 suggestions
      };
    } catch (error) {
      console.error('Error generating feedback summary:', error);
      return null;
    }
  }
};

// Helper function to calculate average
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
};

// Helper function to extract common themes
const extractCommonThemes = (feedback: EventFeedback[]): { positive: string[]; negative: string[] } => {
  const positive = feedback
    .filter(f => f.sentiment === 'positive')
    .map(f => f.feedback_text)
    .slice(0, 5);

  const negative = feedback
    .filter(f => f.sentiment === 'negative')
    .map(f => f.feedback_text)
    .slice(0, 5);

  return { positive, negative };
};

// Placeholder for sentiment analysis function
const analyzeSentiment = async (text: string): Promise<'positive' | 'negative' | 'neutral'> => {
  // This would be replaced with actual sentiment analysis
  // For now, return a random sentiment
  const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral'];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};