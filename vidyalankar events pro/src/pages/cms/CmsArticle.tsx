import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Edit, Share, Bookmark, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cmsService } from '../../services/cmsService';
import { CmsArticle as CmsArticleType } from '../../types/cms';

export function CmsArticle() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [article, setArticle] = useState<CmsArticleType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedArticles, setRelatedArticles] = useState<CmsArticleType[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      setIsLoading(true);
      const fetchedArticle = await cmsService.getArticleByIdOrSlug(articleId);
      setArticle(fetchedArticle);
      
      if (fetchedArticle) {
        // Fetch related articles from the same category
        const articles = await cmsService.getArticles(fetchedArticle.category);
        setRelatedArticles(articles.filter(a => a.id !== fetchedArticle.id).slice(0, 3));
      }
      
      setIsLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to render markdown content
  const renderContent = (content: string) => {
    // This is a simple implementation - in a real app, you'd use a markdown parser
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-4 mt-6">{paragraph.substring(2)}</h1>;
      } else if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mb-3 mt-5">{paragraph.substring(3)}</h2>;
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{paragraph.substring(4)}</h3>;
      } else if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').map(item => item.substring(2));
        return (
          <ul key={index} className="list-disc pl-5 mb-4 space-y-1">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      } else {
        return <p key={index} className="mb-4">{paragraph}</p>;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Article Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/"
            className="mt-6 inline-block bg-[#f14621] text-white px-6 py-2 rounded-lg hover:bg-[#d13d1b] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Featured Image */}
      <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-800">
        {article.featured_image ? (
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#f14621]/80 to-[#f14621]/40"></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#f14621] text-white text-sm rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{article.title}</h1>
            <div className="flex items-center text-white/80">
              <User className="w-4 h-4 mr-2" />
              <span className="mr-4">{article.author_name}</span>
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#f14621] dark:hover:text-[#ff6b4a]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Article Stats */}
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center mr-4">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="text-sm">{article.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="text-sm">0 comments</span>
                  </div>
                </div>
                
                {/* Article Content */}
                <div className="prose dark:prose-invert max-w-none">
                  {renderContent(article.content)}
                </div>
                
                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]">
                      <Share className="w-5 h-5 mr-1" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a]">
                      <Bookmark className="w-5 h-5 mr-1" />
                      <span>Save</span>
                    </button>
                  </div>
                  
                  {/* Edit button for admins and faculty */}
                  {profile && (profile.role === 'admin' || profile.role === 'faculty') && (
                    <Link 
                      to={`/cms/editor/${article.id}`}
                      className="flex items-center text-[#f14621] hover:text-[#d13d1b]"
                    >
                      <Edit className="w-5 h-5 mr-1" />
                      <span>Edit Article</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Author</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#f14621] flex items-center justify-center text-white">
                      {article.author_name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">{article.author_name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Content creator at Vidyalankar Events. Passionate about education and technology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Articles</h3>
                
                {relatedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link 
                        key={relatedArticle.id}
                        to={`/cms/article/${relatedArticle.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            {relatedArticle.featured_image ? (
                              <img 
                                src={relatedArticle.featured_image} 
                                alt={relatedArticle.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-[#f14621]/80 to-[#f14621]/40"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#f14621] dark:group-hover:text-[#ff6b4a] transition-colors">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(relatedArticle.published_at)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No related articles found.</p>
                )}
              </div>
            </div>
            
            {/* Categories */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/cms/admin?category=Announcements"
                      className="text-gray-600 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a] transition-colors"
                    >
                      Announcements
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/cms/admin?category=Events"
                      className="text-gray-600 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a] transition-colors"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/cms/admin?category=News"
                      className="text-gray-600 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a] transition-colors"
                    >
                      News
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/cms/admin?category=Tutorials"
                      className="text-gray-600 dark:text-gray-400 hover:text-[#f14621] dark:hover:text-[#ff6b4a] transition-colors"
                    >
                      Tutorials
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}