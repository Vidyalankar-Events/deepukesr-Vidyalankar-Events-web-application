import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, ThumbsUp, ArrowLeft, Flag, Share, Bookmark, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forumService } from '../services/forumService';
import { ForumTopic as ForumTopicType, ForumReply } from '../types/forum';

export function ForumTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, profile } = useAuth();
  const [topic, setTopic] = useState<ForumTopicType | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;
      
      setIsLoading(true);
      const [fetchedTopic, fetchedReplies] = await Promise.all([
        forumService.getTopicById(topicId),
        forumService.getReplies(topicId)
      ]);
      
      setTopic(fetchedTopic);
      setReplies(fetchedReplies);
      setIsLoading(false);
    };

    fetchData();
  }, [topicId]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !topic || !user || !profile || !replyContent.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await forumService.createReply({
        topic_id: topic.id,
        content: replyContent,
        author_id: user.id,
        author_name: profile.name
      });
      
      if (error) {
        console.error('Error creating reply:', error);
        return;
      }
      
      if (data) {
        setReplies([...replies, data]);
        setReplyContent('');
        
        // Update topic in state to reflect new reply count
        setTopic({
          ...topic,
          replies_count: topic.replies_count + 1,
          last_reply_at: data.created_at,
          last_reply_by: data.author_name
        });
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeTopic = async () => {
    if (!isAuthenticated || !topic || !user) return;
    
    const success = await forumService.likeTopic(topic.id, user.id);
    if (success) {
      // Optimistically update the UI
      setTopic({
        ...topic,
        likes: topic.likes + 1
      });
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!isAuthenticated || !user) return;
    
    const success = await forumService.likeReply(replyId, user.id);
    if (success) {
      // Optimistically update the UI
      setReplies(replies.map(reply => {
        if (reply.id === replyId) {
          return {
            ...reply,
            likes: reply.likes + 1
          };
        }
        return reply;
      }));
    }
  };

  const handleMarkAsSolution = async (replyId: string) => {
    if (!isAuthenticated || !topic || !user) return;
    
    // Only the topic author or an admin can mark a solution
    if (user.id !== topic.author_id && profile?.role !== 'admin') return;
    
    const success = await forumService.markAsSolution(replyId, topic.id);
    if (success) {
      // Update the UI
      setReplies(replies.map(reply => ({
        ...reply,
        is_solution: reply.id === replyId
      })));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Topic Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">The topic you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/forum"
            className="mt-6 inline-block bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
          >
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#f14621] dark:hover:text-[#ff6b4a]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </button>
        </div>

        {/* Topic */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{topic.title}</h1>
              <span className="px-3 py-1 bg-[#f14621]/10 text-[#f14621] rounded-full text-sm mb-4 sm:mb-0 w-fit">
                {topic.category}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-[#f14621] flex items-center justify-center text-white">
                {topic.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{topic.author_name}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(topic.created_at)}
                </div>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{topic.content}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {topic.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLikeTopic}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]"
                  disabled={!isAuthenticated}
                >
                  <ThumbsUp className="w-5 h-5 mr-1" />
                  <span>{topic.likes}</span>
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]">
                  <Share className="w-5 h-5 mr-1" />
                  <span>Share</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]">
                  <Bookmark className="w-5 h-5 mr-1" />
                  <span>Save</span>
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]">
                  <Flag className="w-5 h-5 mr-1" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Replies ({topic.replies_count})
          </h2>
          
          {replies.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
                    reply.is_solution ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#f14621] flex items-center justify-center text-white">
                        {reply.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{reply.author_name}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(reply.created_at)}
                        </div>
                      </div>
                      
                      {reply.is_solution && (
                        <div className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Solution
                        </div>
                      )}
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none mb-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{reply.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLikeReply(reply.id)}
                          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]"
                          disabled={!isAuthenticated}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                      
                      {(user?.id === topic.author_id || profile?.role === 'admin') && !reply.is_solution && (
                        <button 
                          onClick={() => handleMarkAsSolution(reply.id)}
                          className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Solution
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {isAuthenticated ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <form onSubmit={handleSubmitReply} className="p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Post a Reply</h3>
              
              <div className="mb-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Write your reply here..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#f14621] text-white px-4 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">You need to be signed in to reply to this topic.</p>
            <Link
              to="/login"
              className="bg-[#f14621] text-white px-4 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}