-- 010_album_passport.sql
-- Life Album and Health Passport features

-- Extended dog profile fields for passport
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS microchip_number text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS breed_color text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS vet_name text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS vet_phone text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS known_allergies text[];
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS current_medications text[];
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS passport_public_url text;

-- Dog milestones for the life album
CREATE TABLE IF NOT EXISTS dog_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  title text NOT NULL,
  note text,
  photo_url text,
  milestone_type text CHECK (milestone_type IN ('llegada', 'vacuna', 'cumpleanos', 'cirugia', 'logro', 'otro')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dog_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own milestones"
  ON dog_milestones FOR ALL USING (auth.uid() = user_id);
