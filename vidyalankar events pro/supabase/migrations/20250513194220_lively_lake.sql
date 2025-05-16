/*
  # Event Notifications System

  1. New Tables
    - `notifications` - Store user notifications
    - `notification_preferences` - Store user notification preferences
    - `push_subscriptions` - Store web push notification subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('event_update', 'event_reminder', 'event_registration', 'event_cancellation', 'event_approval', 'forum_reply', 'forum_mention', 'system')),
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  data jsonb,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  event_updates boolean DEFAULT true,
  event_reminders boolean DEFAULT true,
  forum_notifications boolean DEFAULT true,
  system_notifications boolean DEFAULT true,
  UNIQUE(user_id)
);

-- Create push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subscription jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Notification preferences policies
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Push subscriptions policies
CREATE POLICY "Users can manage their own push subscriptions"
  ON push_subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to create default notification preferences
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create default notification preferences
CREATE TRIGGER create_notification_preferences_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_default_notification_preferences();

-- Create function to send notifications for event registration
CREATE OR REPLACE FUNCTION send_event_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify student of successful registration
  INSERT INTO notifications (user_id, title, message, type, data)
  VALUES (
    NEW.user_id,
    'Event Registration Confirmed',
    format('Your registration for %s has been confirmed', (SELECT title FROM events WHERE id = NEW.event_id)),
    'event_registration',
    jsonb_build_object(
      'event_id', NEW.event_id,
      'ticket_id', NEW.ticket_id
    )
  );

  -- Notify event organizer
  INSERT INTO notifications (user_id, title, message, type, data)
  VALUES (
    (SELECT organizer_id FROM events WHERE id = NEW.event_id),
    'New Event Registration',
    format('New registration for %s by %s', (SELECT title FROM events WHERE id = NEW.event_id), NEW.name),
    'event_registration',
    jsonb_build_object(
      'event_id', NEW.event_id,
      'registration_id', NEW.id
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for event registration notifications
CREATE TRIGGER event_registration_notification_trigger
AFTER INSERT ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION send_event_registration_notification();

-- Create function to send notifications for event approval
CREATE OR REPLACE FUNCTION send_event_approval_notification()
RETURNS TRIGGER AS $$
DECLARE
  event_data events%ROWTYPE;
BEGIN
  -- Get event details
  SELECT * INTO event_data FROM events WHERE id = NEW.event_id;

  IF NEW.status = 'approved' THEN
    -- Notify event organizer
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (
      event_data.organizer_id,
      'Event Approved',
      format('Your event "%s" has been approved', event_data.title),
      'event_approval',
      jsonb_build_object(
        'event_id', event_data.id,
        'approval_id', NEW.id
      )
    );

    -- Notify all users (in a real implementation, this would be handled by a background job)
    -- This is just a placeholder to demonstrate the concept
    INSERT INTO notifications (user_id, title, message, type, data)
    SELECT 
      p.id,
      'New Event Available',
      format('New event: %s on %s', event_data.title, event_data.date),
      'event_update',
      jsonb_build_object(
        'event_id', event_data.id,
        'event_date', event_data.date,
        'event_time', event_data.time,
        'event_location', event_data.location
      )
    FROM profiles p
    WHERE p.id != event_data.organizer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for event approval notifications
CREATE TRIGGER event_approval_notification_trigger
AFTER INSERT OR UPDATE ON event_approvals
FOR EACH ROW
EXECUTE FUNCTION send_event_approval_notification();

-- Create function to send notifications for new events
CREATE OR REPLACE FUNCTION send_new_event_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify admins of new event requiring approval
  INSERT INTO notifications (user_id, title, message, type, data)
  SELECT 
    p.id,
    'New Event Pending Approval',
    format('New event "%s" requires approval', NEW.title),
    'event_approval',
    jsonb_build_object(
      'event_id', NEW.id,
      'event_title', NEW.title,
      'organizer_id', NEW.organizer_id,
      'organizer_name', NEW.organizer_name
    )
  FROM profiles p
  WHERE p.role = 'admin';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new event notifications
CREATE TRIGGER new_event_notification_trigger
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION send_new_event_notification();