/*
  # Initial Schema Setup for VidyalankarEvents

  1. New Tables
    - `profiles` - User profiles with role information
    - `events` - Event details
    - `event_registrations` - Track event registrations
    - `event_approvals` - Track event approval status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  contact text,
  department text,
  year text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  capacity integer NOT NULL,
  price text DEFAULT 'Free',
  image_url text,
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  organizer_name text NOT NULL,
  organizer_contact text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  roll_number text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  special_requirements text,
  ticket_id text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event approvals table
CREATE TABLE IF NOT EXISTS event_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_approvals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view approved events"
  ON events
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Faculty can view their own events regardless of status"
  ON events
  FOR SELECT
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Faculty can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'faculty'
  ));

CREATE POLICY "Faculty can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Event registrations policies
CREATE POLICY "Users can view their own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Faculty can view registrations for their events"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_registrations.event_id
    AND events.organizer_id = auth.uid()
  ));

CREATE POLICY "Users can register for events"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_registrations.event_id
    AND events.status = 'approved'
  ));

-- Event approvals policies
CREATE POLICY "Admins can view all approval requests"
  ON event_approvals
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can create approval decisions"
  ON event_approvals
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create function to update event status when approval changes
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET status = NEW.status,
      updated_at = now()
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update event status
CREATE TRIGGER update_event_status_trigger
AFTER INSERT OR UPDATE ON event_approvals
FOR EACH ROW
EXECUTE FUNCTION update_event_status();