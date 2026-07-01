-- 009_community.sql
-- Community features

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dog_id uuid REFERENCES dogs(id),
  category text NOT NULL CHECK (category IN ('logro', 'pregunta', 'tip', 'foto')),
  content text NOT NULL,
  photo_url text,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction text NOT NULL CHECK (reaction IN ('heart', 'paw', 'muscle')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  challenge_type text,
  target_value int,
  badge_emoji text,
  badge_name text,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES community_challenges(id) ON DELETE CASCADE NOT NULL,
  current_streak int DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, challenge_id)
);

-- RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users see posts"
  ON community_posts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users create own posts"
  ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own posts"
  ON community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users see reactions"
  ON community_reactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users manage own reactions"
  ON community_reactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can see challenges"
  ON community_challenges FOR SELECT USING (true);

CREATE POLICY "Users manage own challenge progress"
  ON user_challenge_progress FOR ALL USING (auth.uid() = user_id);

-- Seed: first community challenge (July 2026)
INSERT INTO community_challenges (title, description, start_date, end_date, challenge_type, target_value, badge_emoji, badge_name, is_active)
VALUES (
  '21-Day Tracking Challenge',
  'Log your Frenchie''s health for 21 consecutive days',
  '2026-07-01',
  '2026-07-31',
  'streak',
  21,
  '🏆',
  '21-Day Champion',
  true
)
ON CONFLICT DO NOTHING;
