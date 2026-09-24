-- Remove the free tier: new users no longer get an automatic
-- subscriptions row. They stay locked out of (app) routes
-- (hasAnyPaidPlan() = false with no row) until they complete a
-- paid Stripe checkout, at which point the webhook's upsert
-- creates their first subscriptions row with plan='paid'.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
