-- 006_new_modules.sql
-- Frenchie Complete Health Companion — new health module tables

-- ── EXTEND daily_tips FOR MULTI-MODULE SUPPORT ────────────────────────────

ALTER TABLE daily_tips ADD COLUMN IF NOT EXISTS module TEXT NOT NULL DEFAULT 'skin';
UPDATE daily_tips SET module = 'skin';

ALTER TABLE daily_tips DROP CONSTRAINT IF EXISTS daily_tips_category_check;
ALTER TABLE daily_tips ADD CONSTRAINT daily_tips_category_check
  CHECK (category IN (
    'fold_cleaning','nutrition','temperature','ears','seasonal_allergies',
    'warning_signs','post_bath','weight_control',
    'respiratory_care','ear_eye_care','joint_care','weight_digestion','health_calendar'
  ));

-- ── MODULE TABLES ──────────────────────────────────────────────────────────

CREATE TABLE respiratory_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  episode_occurred boolean DEFAULT false,
  episode_duration_minutes int,
  trigger_suspected text,
  severity int CHECK (severity BETWEEN 1 AND 10),
  temperature_celsius numeric(4,1),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE ear_eye_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  ear_left_clean boolean,
  ear_right_clean boolean,
  ear_discharge boolean,
  ear_odor boolean,
  eye_discharge boolean,
  eye_redness boolean,
  cherry_eye_visible boolean,
  notes text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE joint_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  limping boolean DEFAULT false,
  affected_limb text,
  pain_score int CHECK (pain_score BETWEEN 1 AND 10),
  activity_level text,
  exercise_minutes int,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  weight_kg numeric(5,2) NOT NULL,
  gas_bloating boolean DEFAULT false,
  vomiting boolean DEFAULT false,
  stool_consistency text,
  appetite text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE health_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_date date NOT NULL,
  next_due_date date,
  vet_name text,
  notes text,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE waitlist_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  module text NOT NULL,
  locale text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  UNIQUE(email, module)
);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

ALTER TABLE respiratory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ear_eye_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own respiratory entries"
  ON respiratory_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own ear eye checks"
  ON ear_eye_checks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own joint entries"
  ON joint_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own weight entries"
  ON weight_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own health events"
  ON health_events FOR ALL USING (auth.uid() = user_id);

-- Waitlist: public write (no auth required), no reads needed
CREATE POLICY "Anyone can join module waitlist"
  ON waitlist_modules FOR INSERT WITH CHECK (true);
