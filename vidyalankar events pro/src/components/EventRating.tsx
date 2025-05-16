import React, { useState, useEffect } from 'react';
import { Star, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ratingService } from '../services/ratingService';
import { EventRatingType, EventFeedback, FeedbackResponse } from '../types/ratings';

interface Props {
  eventId: string;
  isRealtime?: boolean;
  onSubmit?: () => void;
}

export function EventRating({ eventId, isRealtime = false, onSubmit }: Props) {
  const { user } = useAuth();
  const [ratings, setRatings] = useState({
    organization: 0,
    content: 0,
    venue: 0,
    speaker: 0,
    overall: 0
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const questions = ratingService.getDefaultQuestions();

  useEffect(() => {
    const checkExistingRating = async () => {
      if (!user) return;
      
      const existingRating = await ratingService.getUserEventRating(eventId, user.id);
      if (existingRating) {
        setHasSubmitted(true);
        setRatings({
          organization: existingRating.organization_rating,
          content: existingRating.content_rating,
          venue: existingRating.venue_rating,
          speaker: existingRating.speaker_rating,
          overall: existingRating.overall_rating
        });
      }
    };

    checkExistingRating();
  }, [eventId, user]);

  const handleRatingChange = (aspect: string, value: number) => {
    if (hasSubmitted) return;
    
    setRatings(prev => ({
      ...prev,
      [aspect]: value
    }));
  };

  const handleFeedbackChange = (questionId: string, value: string) => {
    if (hasSubmitted) return;
    
    setFeedback(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user || hasSubmitted) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit ratings
      const ratingData: Omit<EventRatingType, 'id' | 'submitted_at'> = {
        event_id: eventId,
        user_id: user.id,
        organization_rating: ratings.organization,
        content_rating: ratings.content,
        venue_rating: ratings.venue,
        speaker_rating: ratings.speaker,
        overall_rating: ratings.overall,
        is_realtime: isRealtime
      };

      const { error: ratingError } = await ratingService.submitRating(ratingData);
      if (ratingError) throw ratingError;

      // Submit feedback for each category
      const categories = ['Venue', 'Content', 'Organization', 'Speakers'];
      for (const category of categories) {
        if (feedback[category.toLowerCase()]) {
          const feedbackData: Omit<EventFeedback, 'id' | 'submitted_at' | 'sentiment'> = {
            event_id: eventId,
            user_id: user.id,
            category,
            feedback_text: feedback[category.toLowerCase()],
            is_realtime: isRealtime
          };

          const { error: feedbackError } = await ratingService.submitFeedback(feedbackData);
          if (feedbackError) throw feedbackError;
        }
      }

      // Submit responses to default questions
      const responses = questions.map(q => ({
        question: q.text,
        response: feedback[q.id] || ''
      }));

      const success = await ratingService.submitFeedbackResponses(
        eventId,
        user.id,
        responses,
        isRealtime
      );

      if (!success) throw new Error('Failed to submit feedback responses');

      // Call onSubmit callback if provided
      if (onSubmit) onSubmit();

      setHasSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (aspect: string, value: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(aspect, star)}
            className={`focus:outline-none ${
              star <= value
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            disabled={hasSubmitted}
          >
            <Star
              className={`w-8 h-8 ${
                star <= value ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (hasSubmitted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Thank you for your feedback!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You have already submitted feedback for this event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Rate Your Experience
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization
              </label>
              {renderStars('organization', ratings.organization)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              {renderStars('content', ratings.content)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue
              </label>
              {renderStars('venue', ratings.venue)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speakers
              </label>
              {renderStars('speaker', ratings.speaker)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overall Experience
              </label>
              {renderStars('overall', ratings.overall)}
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            disabled={!Object.values(ratings).every(r => r > 0)}
            className="w-full bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Share Your Feedback
          </h3>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {q.text}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                  value={feedback[q.id] || ''}
                  onChange={(e) => handleFeedbackChange(q.id, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required={q.required}
                ></textarea>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !Object.values(feedback).some(f => f.trim())}
              className="flex-1 bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}