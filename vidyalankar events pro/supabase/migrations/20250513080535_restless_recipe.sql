/*
  # Event Rating System

  1. New Tables
    - `event_ratings` - Store quantitative ratings for different aspects
    - `event_feedback` - Store qualitative feedback and comments
    - `event_feedback_categories` - Predefined feedback categories
    - `event_feedback_responses` - Store responses to specific feedback questions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create event ratings table
CREATE TABLE IF NOT EXISTS event_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  organization_rating integer CHECK (organization_rating BETWEEN 1 AND 5),
  content_rating integer CHECK (content_rating BETWEEN 1 AND 5),
  venue_rating integer CHECK (venue_rating BETWEEN 1 AND 5),
  speaker_rating integer CHECK (speaker_rating BETWEEN 1 AND 5),
  overall_rating integer CHECK (overall_rating BETWEEN 1 AND 5),
  submitted_at timestamptz DEFAULT now(),
  is_realtime boolean DEFAULT false,
  UNIQUE(event_id, user_id)
);

-- Create event feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  feedback_text text NOT NULL,
  sentiment text CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  submitted_at timestamptz DEFAULT now(),
  is_realtime boolean DEFAULT false
);

-- Create feedback categories table
CREATE TABLE IF NOT EXISTS event_feedback_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create feedback responses table
CREATE TABLE IF NOT EXISTS event_feedback_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  question text NOT NULL,
  response text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  is_realtime boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback_responses ENABLE ROW LEVEL SECURITY;

-- Event ratings policies
CREATE POLICY "Users can view event ratings"
  ON event_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can submit ratings for events they attended"
  ON event_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM event_registrations
    WHERE event_registrations.event_id = event_ratings.event_id
    AND event_registrations.user_id = auth.uid()
  ));

-- Event feedback policies
CREATE POLICY "Users can view event feedback"
  ON event_feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can submit feedback for events they attended"
  ON event_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM event_registrations
    WHERE event_registrations.event_id = event_feedback.event_id
    AND event_registrations.user_id = auth.uid()
  ));

-- Insert default feedback categories
INSERT INTO event_feedback_categories (name, description) VALUES
  ('Venue', 'Feedback about the event venue and facilities'),
  ('Content', 'Feedback about the event content and materials'),
  ('Organization', 'Feedback about event organization and management'),
  ('Speakers', 'Feedback about event speakers and presenters'),
  ('Engagement', 'Feedback about audience engagement and interaction'),
  ('Technical', 'Feedback about technical aspects and equipment'),
  ('Other', 'Other general feedback')
ON CONFLICT (name) DO NOTHING;