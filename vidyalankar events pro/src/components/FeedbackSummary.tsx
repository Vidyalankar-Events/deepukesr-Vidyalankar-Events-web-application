import React from 'react';
import { Star, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FeedbackSummary as FeedbackSummaryType } from '../types/ratings';

interface Props {
  summary: FeedbackSummaryType;
}

export function FeedbackSummary({ summary }: Props) {
  if (!summary || !summary.averageRatings) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Event Feedback Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ratings Overview */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Average Ratings
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organization</p>
                {renderStars(summary.averageRatings.organization)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Content</p>
                {renderStars(summary.averageRatings.content)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Venue</p>
                {renderStars(summary.averageRatings.venue)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Speakers</p>
                {renderStars(summary.averageRatings.speaker)}
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Overall</p>
                {renderStars(summary.averageRatings.overall)}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Feedback by Category
            </h4>
            <div className="space-y-4">
              {Object.entries(summary.categoryBreakdown).map(([category, counts]) => (
                <div key={category}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-green-500">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">{counts.positive}</span>
                    </div>
                    <div className="flex items-center text-red-500">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      <span className="text-sm">{counts.negative}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span className="text-sm">{counts.neutral}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Themes */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Common Themes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-green-500 mb-2 flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Positive Feedback
              </h5>
              <ul className="space-y-2">
                {summary.commonThemes.positive.map((theme, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    • {theme}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-red-500 mb-2 flex items-center">
                <ThumbsDown className="w-4 h-4 mr-1" />
                Areas for Improvement
              </h5>
              <ul className="space-y-2">
                {summary.commonThemes.negative.map((theme, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    • {theme}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#f14621]" />
            Top Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {summary.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on {summary.totalResponses} responses
          </p>
        </div>
      </div>
    </div>
  );
}