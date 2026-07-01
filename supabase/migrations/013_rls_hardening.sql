-- ============================================================
-- 013_rls_hardening.sql
-- Production-grade RLS hardening — all 20 tables covered.
--
-- What this migration changes versus previous migrations:
--   [critical] claim_founding_member_spot() had WHERE id = 1 which never
--              matched the UUID primary key — the entire founding-member
--              claim flow was silently broken. Fixed below.
--   [critical] Drops "Users insert own subscription" and
--              "Users update own subscription" — free users could self-
--              upgrade by PATCHing their subscription row directly.
--   [high]     daily_tips and feeding_plans restricted to `authenticated`
--              role; changed to unrestricted USING (true) so anon visitors
--              can read content during onboarding/landing pages.
--   [medium]   All FOR ALL policies replaced with granular per-operation
--              policies: SELECT/INSERT/UPDATE/DELETE controlled separately.
--   [medium]   dog_id ownership validated on INSERT for all health tables
--              (skin_entries, respiratory_entries, ear_eye_checks,
--               joint_entries, weight_entries, health_events, dog_milestones,
--               community_posts) — previously any user could write a health
--              entry tagged to another user's dog.
--   [medium]   Added missing UPDATE policy for community_posts.
--   [medium]   community_reactions FOR ALL replaced with SELECT/INSERT/DELETE.
--   [medium]   user_challenge_progress FOR ALL replaced with granular ops.
--   [low]      waitlist_modules SELECT clarified (service_role reads only).
-- ============================================================


-- ============================================================
-- SECTION 0: Re-assert RLS on every table
-- (idempotent — safe to run even if already enabled)
-- ============================================================

ALTER TABLE profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_entries            ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips              ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents                ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE respiratory_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ear_eye_checks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_entries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_modules        ENABLE ROW LEVEL SECURITY;
ALTER TABLE founding_members_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_milestones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SECTION 1: profiles
--
-- profiles.id = auth.users.id (no user_id column).
-- SELECT / UPDATE own row only.
-- No DELETE — cascade is handled by ON DELETE CASCADE on auth.users.
-- No INSERT — handle_new_user() SECURITY DEFINER trigger creates the row;
--             the old "Users insert own profile" policy is dropped here.
-- ============================================================

DROP POLICY IF EXISTS "Users read own profile"   ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;  -- dropped: trigger handles creation

CREATE POLICY "Users read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- WITH CHECK mirrors USING to block column-level bypass attempts.
CREATE POLICY "Users update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ============================================================
-- SECTION 2: dogs
--
-- Full CRUD on own dogs. Granular policies replace the prior FOR ALL.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own dogs" ON dogs;  -- was FOR ALL

CREATE POLICY "Users read own dogs"
  ON dogs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own dogs"
  ON dogs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own dogs"
  ON dogs
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own dogs"
  ON dogs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 3: skin_entries
--
-- Users own rows via user_id.
-- INSERT WITH CHECK also verifies dog_id belongs to the caller —
-- fixes the cross-user dog_id injection vulnerability.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own entries"       ON skin_entries;  -- was FOR ALL

CREATE POLICY "Users read own skin entries"
  ON skin_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own skin entries"
  ON skin_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = skin_entries.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own skin entries"
  ON skin_entries
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own skin entries"
  ON skin_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 4: daily_tips
--
-- [high fix] Was restricted to `authenticated` role only.
-- Anon visitors need to read tips on landing / onboarding screens.
-- No USING clause restriction needed — entire table is public read.
-- No mutations from any non-service_role caller.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users read tips" ON daily_tips;
DROP POLICY IF EXISTS "Public read tips"              ON daily_tips;

CREATE POLICY "Public read tips"
  ON daily_tips
  FOR SELECT
  USING (true);


-- ============================================================
-- SECTION 5: feeding_plans
--
-- [high fix] Same as daily_tips — restricted to authenticated only.
-- Changed to open public read so anon users see feeding content.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users read feeding" ON feeding_plans;
DROP POLICY IF EXISTS "Public read feeding plans"        ON feeding_plans;

CREATE POLICY "Public read feeding plans"
  ON feeding_plans
  FOR SELECT
  USING (true);


-- ============================================================
-- SECTION 6: chat_messages
--
-- Immutable chat history: users can SELECT and INSERT own rows only.
-- No UPDATE or DELETE — previous FOR ALL policy allowed both.
-- dog_id is nullable; the EXISTS check is only applied when set.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own messages" ON chat_messages;  -- was FOR ALL

CREATE POLICY "Users read own messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      dog_id IS NULL
      OR EXISTS (
        SELECT 1 FROM dogs
        WHERE  dogs.id      = chat_messages.dog_id
          AND  dogs.user_id = auth.uid()
      )
    )
  );


-- ============================================================
-- SECTION 7: consents
--
-- Legal immutability: users can SELECT and INSERT own rows only.
-- No UPDATE or DELETE — consent records must not be altered.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own consents" ON consents;  -- was FOR ALL

CREATE POLICY "Users read own consents"
  ON consents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own consents"
  ON consents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- SECTION 8: subscriptions
--
-- [critical fix] Drop the INSERT and UPDATE policies.
-- Free users were able to PATCH plan='paid', status='active' directly.
-- All subscription writes must come from the Stripe webhook handler
-- running with service_role credentials (bypasses RLS automatically).
-- The SECURITY DEFINER trigger handle_new_user() creates the initial row.
-- Users may only SELECT their own subscription row.
-- ============================================================

DROP POLICY IF EXISTS "Users insert own subscription" ON subscriptions;  -- DROPPED: free-upgrade vector
DROP POLICY IF EXISTS "Users update own subscription" ON subscriptions;  -- DROPPED: free-upgrade vector
DROP POLICY IF EXISTS "Users read own subscription"   ON subscriptions;

-- Recreate SELECT only.
CREATE POLICY "Users read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- NOTE: INSERT, UPDATE, and DELETE on subscriptions are performed exclusively
-- by the Stripe webhook handler via service_role, which bypasses RLS.
-- There is no client-side mutation surface for this table.


-- ============================================================
-- SECTION 9: respiratory_entries
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- Replaces FOR ALL with granular policies.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own respiratory entries" ON respiratory_entries;  -- was FOR ALL

CREATE POLICY "Users read own respiratory entries"
  ON respiratory_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own respiratory entries"
  ON respiratory_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = respiratory_entries.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own respiratory entries"
  ON respiratory_entries
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own respiratory entries"
  ON respiratory_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 10: ear_eye_checks
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own ear eye checks" ON ear_eye_checks;  -- was FOR ALL

CREATE POLICY "Users read own ear eye checks"
  ON ear_eye_checks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own ear eye checks"
  ON ear_eye_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = ear_eye_checks.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own ear eye checks"
  ON ear_eye_checks
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own ear eye checks"
  ON ear_eye_checks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 11: joint_entries
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own joint entries" ON joint_entries;  -- was FOR ALL

CREATE POLICY "Users read own joint entries"
  ON joint_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own joint entries"
  ON joint_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = joint_entries.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own joint entries"
  ON joint_entries
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own joint entries"
  ON joint_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 12: weight_entries
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own weight entries" ON weight_entries;  -- was FOR ALL

CREATE POLICY "Users read own weight entries"
  ON weight_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own weight entries"
  ON weight_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = weight_entries.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own weight entries"
  ON weight_entries
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own weight entries"
  ON weight_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 13: health_events
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own health events" ON health_events;  -- was FOR ALL

CREATE POLICY "Users read own health events"
  ON health_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own health events"
  ON health_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = health_events.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own health events"
  ON health_events
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own health events"
  ON health_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 14: waitlist_modules
--
-- No user_id column exists — table is email + module only.
-- Anon and authenticated users can submit a waitlist entry (INSERT).
-- Reads are handled exclusively by service_role (bypasses RLS);
-- no SELECT policy is created for regular callers.
-- ============================================================

DROP POLICY IF EXISTS "Anyone can join module waitlist" ON waitlist_modules;
DROP POLICY IF EXISTS "Anon insert waitlist"            ON waitlist_modules;

-- Allowing both anon and authenticated so the sign-up form works
-- whether the visitor is logged in or not.
CREATE POLICY "Anyone can join module waitlist"
  ON waitlist_modules
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT policy: admin/analytics queries must use the service_role key.
-- service_role bypasses RLS automatically — no table-level policy needed.


-- ============================================================
-- SECTION 15: founding_members_counter
--
-- Single-row table. Public SELECT (anon + authenticated) for the
-- live counter displayed on the landing page.
-- No user-facing mutations — only the claim_founding_member_spot()
-- SECURITY DEFINER RPC (called with service_role) writes to this table.
-- ============================================================

DROP POLICY IF EXISTS "Anyone can read founding counter" ON founding_members_counter;
DROP POLICY IF EXISTS "Public read founding members"     ON founding_members_counter;

CREATE POLICY "Public read founding members"
  ON founding_members_counter
  FOR SELECT
  USING (true);

-- No INSERT / UPDATE / DELETE policies for any user role.
-- Writes happen only via the corrected RPC in SECTION 22 below.


-- ============================================================
-- SECTION 16: dog_milestones
--
-- Users own rows via user_id. INSERT validates dog_id ownership.
-- Replaces prior FOR ALL with granular policies.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own milestones" ON dog_milestones;  -- was FOR ALL

CREATE POLICY "Users read own milestones"
  ON dog_milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own milestones"
  ON dog_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM dogs
      WHERE  dogs.id      = dog_milestones.dog_id
        AND  dogs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users update own milestones"
  ON dog_milestones
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own milestones"
  ON dog_milestones
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 17: community_posts
--
-- SELECT: all authenticated users can read the community feed.
-- INSERT: own posts only. dog_id is nullable; when provided it must
--         belong to the caller to prevent cross-user dog tagging.
-- UPDATE: own posts only. [medium fix] This policy was missing.
-- DELETE: own posts only.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users see posts" ON community_posts;
DROP POLICY IF EXISTS "Users create own posts"        ON community_posts;
DROP POLICY IF EXISTS "Users delete own posts"        ON community_posts;
DROP POLICY IF EXISTS "Users update own posts"        ON community_posts;  -- did not exist; safe to drop

CREATE POLICY "Authenticated users see posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users create own posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- dog_id is nullable; validate ownership only when a dog is tagged.
      dog_id IS NULL
      OR EXISTS (
        SELECT 1 FROM dogs
        WHERE  dogs.id      = community_posts.dog_id
          AND  dogs.user_id = auth.uid()
      )
    )
  );

-- [medium fix] Missing UPDATE policy — users could not edit their own posts.
CREATE POLICY "Users update own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 18: community_reactions
--
-- SELECT: all authenticated users can see reactions (feed counts).
-- INSERT: one reaction per (post_id, user_id) pair — enforced by
--         the UNIQUE constraint on the table.
-- DELETE: own reactions only (toggle / undo).
-- No UPDATE: reactions are toggled by delete + re-insert.
-- Drops prior FOR ALL policy that allowed users to UPDATE any reaction.
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users see reactions" ON community_reactions;
DROP POLICY IF EXISTS "Users manage own reactions"        ON community_reactions;  -- was FOR ALL

CREATE POLICY "Authenticated users see reactions"
  ON community_reactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users insert own reactions"
  ON community_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own reactions"
  ON community_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- SECTION 19: community_challenges
--
-- Public read (anon + authenticated) — displayed on landing and
-- inside the app before and after login.
-- No mutations from user callers (seed data managed by migrations).
-- ============================================================

DROP POLICY IF EXISTS "Anyone can see challenges" ON community_challenges;
DROP POLICY IF EXISTS "Public read challenges"    ON community_challenges;

CREATE POLICY "Public read challenges"
  ON community_challenges
  FOR SELECT
  USING (true);


-- ============================================================
-- SECTION 20: user_challenge_progress
--
-- Users can SELECT, INSERT, and UPDATE their own progress rows.
-- No DELETE — historical progress is kept for badge/leaderboard logic.
-- Replaces prior FOR ALL with granular policies.
-- ============================================================

DROP POLICY IF EXISTS "Users manage own challenge progress" ON user_challenge_progress;  -- was FOR ALL

CREATE POLICY "Users read own challenge progress"
  ON user_challenge_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own challenge progress"
  ON user_challenge_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own challenge progress"
  ON user_challenge_progress
  FOR UPDATE
  TO authenticated
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- SECTION 21: Realtime publication
--
-- Tables that need live push updates for the UI.
-- The DO block makes each ADD idempotent — safe to run on a project
-- where some tables were already added to the publication.
-- ============================================================

DO $$
DECLARE
  v_tables text[] := ARRAY[
    'founding_members_counter',
    'community_posts',
    'community_reactions',
    'chat_messages',
    'user_challenge_progress'
  ];
  v_table text;
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM   pg_publication_tables
      WHERE  pubname   = 'supabase_realtime'
        AND  tablename = v_table
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', v_table);
    END IF;
  END LOOP;
END $$;


-- ============================================================
-- SECTION 22: Fix claim_founding_member_spot() RPC
--
-- [critical fix] The original function had WHERE id = 1 which
-- is an integer literal compared against a UUID column — the types
-- are incompatible and the UPDATE matched zero rows on every call.
-- claimed_spot was always NULL and no founding-member spot could
-- ever be claimed.
--
-- Root cause: the table's PRIMARY KEY is `id uuid DEFAULT gen_random_uuid()`
-- so the scalar 1 can never equal a UUID value.
--
-- Fix: Remove the id filter entirely. The active row is identified
-- by its offer state (offer_active, spots_taken, offer_ends_at),
-- which is unambiguous for a single-row table.
--
-- Secondary clarification: offer_active in the SET clause uses the
-- OLD row's spots_taken (Postgres evaluates all SET expressions
-- against the pre-UPDATE snapshot). Expressing it as a CASE makes
-- the intent explicit: the offer closes the moment the final spot
-- is claimed (old spots_taken + 1 = total_spots).
-- ============================================================

-- DROP first because CREATE OR REPLACE cannot change the return type
-- of an existing function. The original returns integer; we keep that.
DROP FUNCTION IF EXISTS claim_founding_member_spot();

CREATE FUNCTION claim_founding_member_spot()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_claimed_spot integer;
BEGIN
  -- Previous bug: WHERE id = 1 — integer 1 never equals a UUID.
  -- Fixed: identify the active row by offer-state columns only.
  --
  -- SET expressions in Postgres evaluate against OLD row values:
  --   spots_taken + 1 is the value AFTER the increment.
  --   When (old spots_taken + 1) >= total_spots the offer is exhausted;
  --   set offer_active = false. Otherwise leave it true.
  --
  -- WHERE spots_taken < total_spots allows claiming the very last spot
  -- (old = total_spots - 1). After the UPDATE spots_taken = total_spots
  -- and offer_active = false.
  UPDATE founding_members_counter
  SET
    spots_taken  = spots_taken + 1,
    offer_active = CASE
                     WHEN spots_taken + 1 >= total_spots THEN false
                     ELSE offer_active            -- keep true (old value is always true here)
                   END,
    updated_at   = now()
  WHERE offer_active  = true
    AND spots_taken   < total_spots     -- allows the final spot; blocks when full
    AND offer_ends_at > now()
  RETURNING spots_taken
  INTO v_claimed_spot;

  -- Returns the claimed spot number (e.g. 47 = 47th founding member),
  -- or NULL if the offer was inactive, expired, or already sold out.
  RETURN v_claimed_spot;
END;
$$;

-- Only the Stripe webhook handler (service_role) may call this function.
-- Revoke from PUBLIC first, then grant explicitly to service_role.
REVOKE ALL     ON FUNCTION claim_founding_member_spot() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION claim_founding_member_spot() TO service_role;
