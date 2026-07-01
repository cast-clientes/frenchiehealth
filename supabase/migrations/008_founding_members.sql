-- 008_founding_members.sql
-- Founding Members system

-- Add founding member fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_founding_member boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS founding_member_number int;

-- Add plan_type to subscriptions (monthly vs annual)
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_type text;

-- Founding member counter (single row table)
CREATE TABLE IF NOT EXISTS founding_members_counter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_spots int DEFAULT 100,
  spots_taken int DEFAULT 0,
  offer_active boolean DEFAULT true,
  offer_ends_at timestamptz DEFAULT '2026-07-31 23:59:59+00',
  updated_at timestamptz DEFAULT now()
);

-- Insert initial row if not exists
INSERT INTO founding_members_counter (total_spots, spots_taken, offer_active)
SELECT 100, 0, true
WHERE NOT EXISTS (SELECT 1 FROM founding_members_counter);

-- RLS: public read (needed for the counter display), service role writes
ALTER TABLE founding_members_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read founding counter"
  ON founding_members_counter FOR SELECT USING (true);
