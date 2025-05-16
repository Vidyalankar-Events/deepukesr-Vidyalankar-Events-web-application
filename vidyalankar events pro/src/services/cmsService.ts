import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { CmsArticle, CmsCategory, CmsTag } from '../types/cms';

// Mock data for development when Supabase is not connected
const mockArticles: CmsArticle[] = [
  {
    id: '1',
    title: 'Welcome to Vidyalankar Events',
    slug: 'welcome-to-vidyalankar-events',
    content: `
# Welcome to Vidyalankar Events

We're excited to launch our new events platform for the Vidyalankar community. This platform will serve as a central hub for all events happening on campus, making it easier for students, faculty, and staff to stay informed and engaged.

## Key Features

- **Event Discovery**: Browse and search for events by category, date, or keyword
- **Registration**: Register for events with just a few clicks
- **Notifications**: Get reminders and updates about events you're interested in
- **Interactive Forum**: Engage in discussions about events and connect with organizers
- **Content Management**: Faculty and administrators can create and manage event content

We hope this platform enhances your campus experience and helps you make the most of the vibrant community at Vidyalankar.

Stay tuned for upcoming events!
    `,
    excerpt: 'Introducing our new events platform for the Vidyalankar community.',
    author_id: 'mock-admin-id',
    author_name: 'Admin User',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    category: 'Announcements',
    tags: ['welcome', 'platform', 'features'],
    views: 542
  },
  {
    id: '2',
    title: 'Tech Symposium 2025 - Call for Papers',
    slug: 'tech-symposium-2025-call-for-papers',
    content: `
# Tech Symposium 2025 - Call for Papers

We are pleased to announce the Call for Papers for the Tech Symposium 2025, to be held at Vidyalankar Institute of Technology on March 15-16, 2025.

## About the Symposium

The Tech Symposium is an annual event that brings together students, faculty, researchers, and industry professionals to share knowledge, showcase innovations, and discuss emerging trends in technology.

## Topics of Interest

We invite submissions on the following topics (but not limited to):

- Artificial Intelligence and Machine Learning
- Blockchain and Cryptocurrency
- Cloud Computing and Edge Computing
- Cybersecurity and Privacy
- Internet of Things (IoT)
- Augmented Reality and Virtual Reality
- Quantum Computing
- Sustainable Technology
- Human-Computer Interaction

## Important Dates

- **Submission Deadline**: January 15, 2025
- **Notification of Acceptance**: February 1, 2025
- **Camera-Ready Submission**: February 15, 2025
- **Symposium Dates**: March 15-16, 2025

## Submission Guidelines

Papers should be submitted in IEEE format and should not exceed 6 pages. All submissions will undergo a double-blind peer review process.

For more information, please contact the symposium committee at techsymposium@vidyalankar.edu.

We look forward to your contributions!
    `,
    excerpt: 'Submit your papers for the upcoming Tech Symposium 2025 at Vidyalankar Institute of Technology.',
    author_id: 'mock-faculty-id',
    author_name: 'Jane Faculty',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    category: 'Events',
    tags: ['tech', 'symposium', 'call-for-papers', 'research'],
    views: 328
  },
  {
    id: '3',
    title: 'Student Council Elections 2025',
    slug: 'student-council-elections-2025',
    content: `
# Student Council Elections 2025

The Student Council Elections for the academic year 2025-26 will be held on February 10, 2025. This is your opportunity to elect representatives who will voice your concerns and work towards enhancing the student experience at Vidyalankar.

## Positions Open for Election

- President
- Vice President
- General Secretary
- Treasurer
- Cultural Secretary
- Sports Secretary
- Technical Secretary
- Class Representatives (for each department and year)

## Election Timeline

- **Nomination Filing**: January 20-25, 2025
- **Campaigning Period**: January 26 - February 8, 2025
- **Election Day**: February 10, 2025
- **Results Announcement**: February 12, 2025

## Eligibility Criteria

- Candidates must be full-time students at Vidyalankar
- Must have a minimum CGPA of 7.0
- No active disciplinary actions
- For President and Vice President positions, candidates must be in their pre-final or final year

## How to File Nomination

Interested candidates can pick up nomination forms from the Student Affairs Office starting January 20, 2025. Completed forms must be submitted by 5:00 PM on January 25, 2025.

## Voting Process

Voting will be conducted online through the Vidyalankar Events platform. All registered students will receive a unique voting link on their registered email address on the election day.

For any queries, please contact the Election Committee at elections@vidyalankar.edu.

Your vote matters - be sure to participate!
    `,
    excerpt: 'Information about the upcoming Student Council Elections for the academic year 2025-26.',
    author_id: 'mock-admin-id',
    author_name: 'Admin User',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    category: 'Announcements',
    tags: ['elections', 'student-council', 'voting'],
    views: 215
  }
];

const mockCategories: CmsCategory[] = [
  {
    id: '1',
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official announcements from the administration'
  },
  {
    id: '2',
    name: 'Events',
    slug: 'events',
    description: 'Information about upcoming and past events'
  },
  {
    id: '3',
    name: 'News',
    slug: 'news',
    description: 'Latest news and updates from the campus'
  },
  {
    id: '4',
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'How-to guides and tutorials'
  }
];

const mockTags: CmsTag[] = [
  { id: '1', name: 'welcome', slug: 'welcome' },
  { id: '2', name: 'platform', slug: 'platform' },
  { id: '3', name: 'features', slug: 'features' },
  { id: '4', name: 'tech', slug: 'tech' },
  { id: '5', name: 'symposium', slug: 'symposium' },
  { id: '6', name: 'call-for-papers', slug: 'call-for-papers' },
  { id: '7', name: 'research', slug: 'research' },
  { id: '8', name: 'elections', slug: 'elections' },
  { id: '9', name: 'student-council', slug: 'student-council' },
  { id: '10', name: 'voting', slug: 'voting' }
];

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// CMS service
export const cmsService = {
  // Get all articles
  getArticles: async (category?: string, status?: string): Promise<CmsArticle[]> => {
    if (useMockData()) {
      let filteredArticles = [...mockArticles];
      
      if (category && category !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.category === category);
      }
      
      if (status && status !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.status === status);
      } else if (!status) {
        // Default to published articles only
        filteredArticles = filteredArticles.filter(article => article.status === 'published');
      }
      
      return filteredArticles;
    }
    
    try {
      let query = supabase
        .from('cms_articles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      } else if (!status) {
        // Default to published articles only
        query = query.eq('status', 'published');
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching CMS articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching CMS articles:', error);
      return mockArticles; // Fallback to mock data on error
    }
  },

  // Get a single article by ID or slug
  getArticleByIdOrSlug: async (idOrSlug: string): Promise<CmsArticle | null> => {
    if (useMockData()) {
      const article = mockArticles.find(
        article => article.id === idOrSlug || article.slug === idOrSlug
      );
      
      // Increment views for mock data
      if (article) {
        article.views += 1;
      }
      
      return article || null;
    }
    
    try {
      // Try to find by ID first
      let { data, error } = await supabase
        .from('cms_articles')
        .select('*')
        .eq('id', idOrSlug)
        .maybeSingle();

      if (!data && !error) {
        // If not found by ID, try by slug
        const result = await supabase
          .from('cms_articles')
          .select('*')
          .eq('slug', idOrSlug)
          .maybeSingle();
          
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error fetching CMS article:', error);
        return null;
      }

      if (data) {
        // Increment views
        await supabase
          .from('cms_articles')
          .update({ views: data.views + 1 })
          .eq('id', data.id);
          
        // Return the article with updated views
        return { ...data, views: data.views + 1 };
      }

      return null;
    } catch (error) {
      console.error('Error fetching CMS article:', error);
      return mockArticles.find(
        article => article.id === idOrSlug || article.slug === idOrSlug
      ) || null;
    }
  },

  // Create a new article
  createArticle: async (
    article: Omit<CmsArticle, 'id' | 'slug' | 'created_at' | 'updated_at' | 'views'>
  ): Promise<{ data: CmsArticle | null; error: any }> => {
    const slug = generateSlug(article.title);
    
    if (useMockData()) {
      const newArticle: CmsArticle = {
        id: uuidv4(),
        slug,
        ...article,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0
      };
      
      mockArticles.unshift(newArticle);
      
      return { data: newArticle, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_articles')
        .insert({
          ...article,
          slug,
          views: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating CMS article:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating CMS article:', error);
      return { data: null, error };
    }
  },

  // Update an article
  updateArticle: async (
    id: string,
    article: Partial<Omit<CmsArticle, 'id' | 'slug' | 'created_at' | 'updated_at' | 'views'>>
  ): Promise<{ data: CmsArticle | null; error: any }> => {
    // Generate slug if title is being updated
    const updates: any = { ...article };
    if (article.title) {
      updates.slug = generateSlug(article.title);
    }
    
    if (useMockData()) {
      const index = mockArticles.findIndex(a => a.id === id);
      if (index === -1) {
        return { data: null, error: { message: 'Article not found' } };
      }
      
      const updatedArticle = {
        ...mockArticles[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      mockArticles[index] = updatedArticle;
      
      return { data: updatedArticle, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating CMS article:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating CMS article:', error);
      return { data: null, error };
    }
  },

  // Delete an article
  deleteArticle: async (id: string): Promise<boolean> => {
    if (useMockData()) {
      const index = mockArticles.findIndex(a => a.id === id);
      if (index === -1) {
        return false;
      }
      
      mockArticles.splice(index, 1);
      return true;
    }
    
    try {
      const { error } = await supabase
        .from('cms_articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting CMS article:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting CMS article:', error);
      return false;
    }
  },

  // Get all categories
  getCategories: async (): Promise<CmsCategory[]> => {
    if (useMockData()) {
      return mockCategories;
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching CMS categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching CMS categories:', error);
      return mockCategories;
    }
  },

  // Get all tags
  getTags: async (): Promise<CmsTag[]> => {
    if (useMockData()) {
      return mockTags;
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching CMS tags:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching CMS tags:', error);
      return mockTags;
    }
  },

  // Create a category
  createCategory: async (
    category: Omit<CmsCategory, 'id' | 'slug'>
  ): Promise<{ data: CmsCategory | null; error: any }> => {
    const slug = generateSlug(category.name);
    
    if (useMockData()) {
      const newCategory: CmsCategory = {
        id: uuidv4(),
        ...category,
        slug
      };
      
      mockCategories.push(newCategory);
      
      return { data: newCategory, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_categories')
        .insert({
          ...category,
          slug
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating CMS category:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating CMS category:', error);
      return { data: null, error };
    }
  },

  // Create a tag
  createTag: async (
    tag: Omit<CmsTag, 'id' | 'slug'>
  ): Promise<{ data: CmsTag | null; error: any }> => {
    const slug = generateSlug(tag.name);
    
    if (useMockData()) {
      const newTag: CmsTag = {
        id: uuidv4(),
        ...tag,
        slug
      };
      
      mockTags.push(newTag);
      
      return { data: newTag, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_tags')
        .insert({
          ...tag,
          slug
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating CMS tag:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating CMS tag:', error);
      return { data: null, error };
    }
  }
};