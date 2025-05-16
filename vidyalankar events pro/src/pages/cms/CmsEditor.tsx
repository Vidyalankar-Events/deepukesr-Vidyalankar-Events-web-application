import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image, Tag, X, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cmsService } from '../../services/cmsService';
import { CmsArticle } from '../../types/cms';

export function CmsEditor() {
  const { articleId } = useParams<{ articleId?: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CmsArticle>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'Announcements',
    tags: [],
    featured_image: '',
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      setIsLoading(true);
      const article = await cmsService.getArticleByIdOrSlug(articleId);
      
      if (article) {
        setFormData({
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          featured_image: article.featured_image || '',
          status: article.status
        });
      } else {
        setError('Article not found');
      }
      
      setIsLoading(false);
    };

    fetchArticle();
  }, [articleId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toLowerCase())) {
      if (formData.tags && formData.tags.length >= 10) {
        setError('You can only add up to 10 tags');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
      setError(null);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    
    if (!profile) {
      setError('You must be signed in to create or edit an article');
      return;
    }
    
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content?.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!formData.excerpt?.trim()) {
      setError('Excerpt is required');
      return;
    }
    
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const articleData = {
        ...formData,
        status: saveAsDraft ? 'draft' : 'published',
        published_at: saveAsDraft ? null : new Date().toISOString(),
        author_id: profile.id,
        author_name: profile.name
      };
      
      let result;
      
      if (articleId) {
        // Update existing article
        result = await cmsService.updateArticle(articleId, articleData);
      } else {
        // Create new article
        result = await cmsService.createArticle(articleData as any);
      }
      
      if (result.error) {
        setError(result.error.message || 'Failed to save article');
        setIsSaving(false);
        return;
      }
      
      if (result.data) {
        navigate('/cms/admin');
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setError('An unexpected error occurred');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f14621]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/cms/admin')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#f14621] dark:hover:text-[#ff6b4a]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to CMS
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {articleId ? 'Edit Article' : 'Create New Article'}
            </h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter article title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt *
                </label>
                <input
                  type="text"
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Brief summary of the article"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="Announcements">Announcements</option>
                  <option value="Events">Events</option>
                  <option value="News">News</option>
                  <option value="Tutorials">Tutorials</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      id="featured_image"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                {formData.featured_image && (
                  <div className="mt-2">
                    <img 
                      src={formData.featured_image} 
                      alt="Featured preview" 
                      className="h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content * (Markdown supported)
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                  placeholder="Write your article content here..."
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use Markdown for formatting: # Heading, ## Subheading, **bold**, *italic*, - list item
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (up to 10)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#f14621] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Add a tag"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Press Enter to add a tag
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={isSaving}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f14621] text-white rounded-lg hover:bg-[#d13d1b] transition-colors flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}