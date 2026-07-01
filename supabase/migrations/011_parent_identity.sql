-- Migration 011: Parent identity personalization
-- Adds parent role fields to profiles and dog personality fields

-- profiles: parent role
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_role text DEFAULT 'parent';
-- Values: 'mama', 'papa', 'tutor', 'guardian', 'abuelo', 'abuela', 'tio', 'tia', 'hermano', 'hermana', 'custom', 'parent'

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_role_custom text;
-- Used only when parent_role = 'custom'. E.g. "el humano de", "la madrina de"

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_role_display text;
-- Denormalized display string for performance. E.g. "mamá de Ñonki"
-- Recalculated when parent_role or dog name changes

-- dogs: personality / pronoun / nickname
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS nickname text;
-- Affectionate name used at home. E.g. "bebé", "el rey", "princesa", "el gordito"

ALTER TABLE dogs ADD COLUMN IF NOT EXISTS pronoun text DEFAULT 'el';
-- Spanish pronoun: 'el' or 'ella'

ALTER TABLE dogs ADD COLUMN IF NOT EXISTS gender text DEFAULT 'male';
-- 'male' or 'female'

-- Index for fast parent_role lookups in community feed
CREATE INDEX IF NOT EXISTS idx_profiles_parent_role ON profiles (parent_role);
