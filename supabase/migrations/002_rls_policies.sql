-- RLS on all user tables

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- daily_tips and feeding_plans are public read
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_plans ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- DOGS
CREATE POLICY "Users manage own dogs" ON dogs FOR ALL USING (auth.uid() = user_id);

-- SKIN_ENTRIES
CREATE POLICY "Users manage own entries" ON skin_entries FOR ALL USING (auth.uid() = user_id);

-- CHAT_MESSAGES
CREATE POLICY "Users manage own messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);

-- CONSENTS
CREATE POLICY "Users manage own consents" ON consents FOR ALL USING (auth.uid() = user_id);

-- SUBSCRIPTIONS
CREATE POLICY "Users read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own subscription" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- DAILY_TIPS: authenticated users can read
CREATE POLICY "Authenticated users read tips" ON daily_tips FOR SELECT TO authenticated USING (true);

-- FEEDING_PLANS: authenticated users can read
CREATE POLICY "Authenticated users read feeding" ON feeding_plans FOR SELECT TO authenticated USING (true);
