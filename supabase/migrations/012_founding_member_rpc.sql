-- Migration 012: Atomic founding member spot claim
-- Prevents TOCTOU race condition in webhook handler.
-- Returns the claimed spot number, or NULL if no spot available.

CREATE OR REPLACE FUNCTION claim_founding_member_spot()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claimed_spot integer;
BEGIN
  UPDATE founding_members_counter
  SET
    spots_taken = spots_taken + 1,
    offer_active = (spots_taken + 1 < total_spots),
    updated_at   = now()
  WHERE id           = 1
    AND offer_active = true
    AND spots_taken  < total_spots
    AND offer_ends_at > now()
  RETURNING spots_taken INTO claimed_spot;

  RETURN claimed_spot;
END;
$$;

-- Only the service role (webhook) should call this.
REVOKE EXECUTE ON FUNCTION claim_founding_member_spot() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION claim_founding_member_spot() TO service_role;
