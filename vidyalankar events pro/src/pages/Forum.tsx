import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, Filter, Plus, Pin, Lock, Eye, ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forumService } from '../services/forumService';
import { ForumTopic, ForumCategory } from '../types/forum';

export function Forum() {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [fetchedTopics, fetchedCategories] = await Promise.all([
        forumService.getTopics(selectedCategory === 'all' ? undefined : selectedCategory),
        forumService.getCategories()
      ]);
      
      setTopics(fetchedTopics);
      setCategories(fetchedCategories);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedCategory]);

  const filteredTopics = topics.filter(topic => {
    return (
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-[#f14621] py-12 sm:py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
            alt="Forum discussion"
          />
          <div className="absolute inset-0 bg-[#f14621] mix-blend-multiply opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white sm:text-4xl">
              Community Forum
            </h1>
            <p className="mt-4 text-base sm:text-xl text-white max-w-3xl mx-auto">
              Join discussions, ask questions, and connect with the Vidyalankar community
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto pb-2 md:pb-0">
              <div className="flex space-x-2 min-w-max">
                <button
                  key="all"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${selectedCategory === 'all'
                      ? 'bg-[#f14621] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  All Topics
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                      ${selectedCategory === category.name
                        ? 'bg-[#f14621] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Topic Button */}
            {isAuthenticated && (
              <Link
                to="/forum/create"
                className="bg-[#f14621] text-white px-4 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No topics found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No topics match your search for "${searchQuery}"`
                : selectedCategory !== 'all'
                  ? `No topics in the ${selectedCategory} category`
                  : 'Be the first to start a discussion!'}
            </p>
            {isAuthenticated && (
              <Link
                to="/forum/create"
                className="mt-6 inline-block bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
              >
                Create a Topic
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Topic
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Author
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Stats
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 sm:px-6 py-4 whitespace-normal">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3 hidden sm:block">
                            <div className="h-10 w-10 rounded-full bg-[#f14621]/10 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-[#f14621]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              {topic.is_pinned && (
                                <Pin className="h-4 w-4 text-[#f14621] mr-1" />
                              )}
                              {topic.is_locked && (
                                <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                              )}
                              <Link 
                                to={`/forum/topic/${topic.id}`}
                                className="text-gray-900 dark:text-white font-medium hover:text-[#f14621] dark:hover:text-[#ff6b4a] line-clamp-2"
                              >
                                {topic.title}
                              </Link>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 hidden sm:flex">
                              {topic.tags.slice(0, 2).map((tag, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                              {topic.tags.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                  +{topic.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className="px-2 py-1 text-xs rounded-full bg-[#f14621]/10 text-[#f14621] dark:bg-[#f14621]/20">
                          {topic.category}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900 dark:text-white">{topic.author_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(topic.created_at)}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-xs">{topic.views}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">{topic.likes}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">{topic.replies_count}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        {topic.last_reply_at ? (
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">{topic.last_reply_by}</div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(topic.last_reply_at)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No replies yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}