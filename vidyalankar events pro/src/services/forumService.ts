import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { ForumTopic, ForumReply, ForumCategory } from '../types/forum';

// Mock data for development when Supabase is not connected
const mockTopics: ForumTopic[] = [
  {
    id: '1',
    title: 'Welcome to the Vidyalankar Events Forum!',
    content: 'This is the official forum for discussing all events and activities at Vidyalankar. Feel free to ask questions, share experiences, and connect with fellow students and faculty members.',
    author_id: 'mock-admin-id',
    author_name: 'Admin User',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Announcements',
    tags: ['welcome', 'introduction', 'guidelines'],
    views: 245,
    likes: 42,
    is_pinned: true,
    is_locked: false,
    replies_count: 5,
    last_reply_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_reply_by: 'John Student'
  },
  {
    id: '2',
    title: 'Tech Symposium 2025 - Discussion Thread',
    content: 'Let\'s discuss the upcoming Tech Symposium 2025! Share your ideas, questions, and suggestions for making this event a success.',
    author_id: 'mock-faculty-id',
    author_name: 'Jane Faculty',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Events',
    tags: ['tech', 'symposium', '2025'],
    views: 187,
    likes: 28,
    is_pinned: false,
    is_locked: false,
    replies_count: 12,
    last_reply_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    last_reply_by: 'Sarah Johnson'
  },
  {
    id: '3',
    title: 'Looking for team members for the Hackathon',
    content: 'Hi everyone! I\'m looking for team members to participate in the upcoming Hackathon. I\'m proficient in React and Node.js, and I\'m looking for people with skills in UI/UX design and backend development.',
    author_id: 'mock-student-id',
    author_name: 'John Student',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Collaborations',
    tags: ['hackathon', 'team', 'coding'],
    views: 132,
    likes: 15,
    is_pinned: false,
    is_locked: false,
    replies_count: 8,
    last_reply_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    last_reply_by: 'Michael Chen'
  }
];

const mockReplies: ForumReply[] = [
  {
    id: '1',
    topic_id: '1',
    content: 'Welcome everyone! Looking forward to engaging discussions here.',
    author_id: 'mock-faculty-id',
    author_name: 'Jane Faculty',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    is_solution: false
  },
  {
    id: '2',
    topic_id: '1',
    content: 'Thanks for creating this forum! It will be very helpful for coordinating events.',
    author_id: 'mock-student-id',
    author_name: 'John Student',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    is_solution: false
  },
  {
    id: '3',
    topic_id: '2',
    content: 'I\'m excited about the Tech Symposium! Will there be workshops on AI and machine learning?',
    author_id: 'mock-student-id',
    author_name: 'John Student',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    is_solution: false
  },
  {
    id: '4',
    topic_id: '2',
    content: 'Yes, we\'re planning to have workshops on AI/ML, blockchain, and cloud computing. More details will be announced soon!',
    author_id: 'mock-faculty-id',
    author_name: 'Jane Faculty',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 10,
    is_solution: true
  }
];

const mockCategories: ForumCategory[] = [
  {
    id: '1',
    name: 'Announcements',
    description: 'Official announcements from the administration',
    topics_count: 5,
    icon: 'megaphone'
  },
  {
    id: '2',
    name: 'Events',
    description: 'Discussions about upcoming and past events',
    topics_count: 12,
    icon: 'calendar'
  },
  {
    id: '3',
    name: 'Collaborations',
    description: 'Find team members and collaborators for projects',
    topics_count: 8,
    icon: 'users'
  },
  {
    id: '4',
    name: 'Academic',
    description: 'Discussions related to courses, exams, and academics',
    topics_count: 15,
    icon: 'book-open'
  },
  {
    id: '5',
    name: 'Technical',
    description: 'Technical discussions and troubleshooting',
    topics_count: 10,
    icon: 'code'
  },
  {
    id: '6',
    name: 'General',
    description: 'General discussions about campus life',
    topics_count: 20,
    icon: 'message-square'
  }
];

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Forum service
export const forumService = {
  // Get all forum topics
  getTopics: async (category?: string): Promise<ForumTopic[]> => {
    if (useMockData()) {
      if (category && category !== 'all') {
        return mockTopics.filter(topic => topic.category === category);
      }
      return mockTopics;
    }
    
    try {
      let query = supabase
        .from('forum_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching forum topics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching forum topics:', error);
      return mockTopics; // Fallback to mock data on error
    }
  },

  // Get a single topic by ID
  getTopicById: async (id: string): Promise<ForumTopic | null> => {
    if (useMockData()) {
      const topic = mockTopics.find(topic => topic.id === id);
      
      // Increment views for mock data
      if (topic) {
        topic.views += 1;
      }
      
      return topic || null;
    }
    
    try {
      // First, get the topic
      const { data, error } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching forum topic:', error);
        return null;
      }

      if (data) {
        // Increment views
        await supabase
          .from('forum_topics')
          .update({ views: data.views + 1 })
          .eq('id', id);
          
        // Return the topic with updated views
        return { ...data, views: data.views + 1 };
      }

      return null;
    } catch (error) {
      console.error('Error fetching forum topic:', error);
      return mockTopics.find(topic => topic.id === id) || null;
    }
  },

  // Create a new topic
  createTopic: async (
    topic: Omit<ForumTopic, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'replies_count' | 'last_reply_at' | 'last_reply_by'>
  ): Promise<{ data: ForumTopic | null; error: any }> => {
    if (useMockData()) {
      const newTopic: ForumTopic = {
        id: uuidv4(),
        ...topic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        replies_count: 0,
        last_reply_at: null,
        last_reply_by: null
      };
      
      mockTopics.unshift(newTopic);
      
      return { data: newTopic, error: null };
    }
    
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          ...topic,
          views: 0,
          likes: 0,
          replies_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating forum topic:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating forum topic:', error);
      return { data: null, error };
    }
  },

  // Get replies for a topic
  getReplies: async (topicId: string): Promise<ForumReply[]> => {
    if (useMockData()) {
      return mockReplies.filter(reply => reply.topic_id === topicId);
    }
    
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching forum replies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching forum replies:', error);
      return mockReplies.filter(reply => reply.topic_id === topicId);
    }
  },

  // Create a reply
  createReply: async (
    reply: Omit<ForumReply, 'id' | 'created_at' | 'updated_at' | 'likes' | 'is_solution'>
  ): Promise<{ data: ForumReply | null; error: any }> => {
    if (useMockData()) {
      const newReply: ForumReply = {
        id: uuidv4(),
        ...reply,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes: 0,
        is_solution: false
      };
      
      mockReplies.push(newReply);
      
      // Update the topic's last reply info and count
      const topic = mockTopics.find(t => t.id === reply.topic_id);
      if (topic) {
        topic.replies_count += 1;
        topic.last_reply_at = newReply.created_at;
        topic.last_reply_by = newReply.author_name;
      }
      
      return { data: newReply, error: null };
    }
    
    try {
      // Start a transaction
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          ...reply,
          likes: 0,
          is_solution: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating forum reply:', error);
        return { data: null, error };
      }

      // Update the topic's reply count and last reply info
      if (data) {
        await supabase
          .from('forum_topics')
          .update({
            replies_count: supabase.rpc('increment', { x: 1 }),
            last_reply_at: data.created_at,
            last_reply_by: data.author_name
          })
          .eq('id', reply.topic_id);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating forum reply:', error);
      return { data: null, error };
    }
  },

  // Get all categories
  getCategories: async (): Promise<ForumCategory[]> => {
    if (useMockData()) {
      return mockCategories;
    }
    
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching forum categories:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching forum categories:', error);
      return mockCategories;
    }
  },

  // Like a topic
  likeTopic: async (topicId: string, userId: string): Promise<boolean> => {
    if (useMockData()) {
      const topic = mockTopics.find(t => t.id === topicId);
      if (topic) {
        topic.likes += 1;
        return true;
      }
      return false;
    }
    
    try {
      // Check if user already liked this topic
      const { data: existingLike } = await supabase
        .from('forum_likes')
        .select('*')
        .eq('topic_id', topicId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        // User already liked, remove the like
        await supabase
          .from('forum_likes')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', userId);
          
        await supabase
          .from('forum_topics')
          .update({ likes: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', topicId);
          
        return true;
      } else {
        // Add new like
        await supabase
          .from('forum_likes')
          .insert({
            topic_id: topicId,
            user_id: userId
          });
          
        await supabase
          .from('forum_topics')
          .update({ likes: supabase.rpc('increment', { x: 1 }) })
          .eq('id', topicId);
          
        return true;
      }
    } catch (error) {
      console.error('Error liking forum topic:', error);
      return false;
    }
  },

  // Like a reply
  likeReply: async (replyId: string, userId: string): Promise<boolean> => {
    if (useMockData()) {
      const reply = mockReplies.find(r => r.id === replyId);
      if (reply) {
        reply.likes += 1;
        return true;
      }
      return false;
    }
    
    try {
      // Check if user already liked this reply
      const { data: existingLike } = await supabase
        .from('forum_reply_likes')
        .select('*')
        .eq('reply_id', replyId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        // User already liked, remove the like
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('reply_id', replyId)
          .eq('user_id', userId);
          
        await supabase
          .from('forum_replies')
          .update({ likes: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', replyId);
          
        return true;
      } else {
        // Add new like
        await supabase
          .from('forum_reply_likes')
          .insert({
            reply_id: replyId,
            user_id: userId
          });
          
        await supabase
          .from('forum_replies')
          .update({ likes: supabase.rpc('increment', { x: 1 }) })
          .eq('id', replyId);
          
        return true;
      }
    } catch (error) {
      console.error('Error liking forum reply:', error);
      return false;
    }
  },

  // Mark a reply as solution
  markAsSolution: async (replyId: string, topicId: string): Promise<boolean> => {
    if (useMockData()) {
      // Reset any existing solution
      mockReplies.forEach(r => {
        if (r.topic_id === topicId) {
          r.is_solution = false;
        }
      });
      
      // Mark the new solution
      const reply = mockReplies.find(r => r.id === replyId);
      if (reply) {
        reply.is_solution = true;
        return true;
      }
      return false;
    }
    
    try {
      // Reset any existing solution
      await supabase
        .from('forum_replies')
        .update({ is_solution: false })
        .eq('topic_id', topicId);
        
      // Mark the new solution
      await supabase
        .from('forum_replies')
        .update({ is_solution: true })
        .eq('id', replyId);
        
      return true;
    } catch (error) {
      console.error('Error marking reply as solution:', error);
      return false;
    }
  }
};