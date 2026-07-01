-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES: extends auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOGS
CREATE TABLE dogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  weight_kg DECIMAL(5,2),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKIN_ENTRIES
CREATE TABLE skin_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE DEFAULT CURRENT_DATE NOT NULL,
  photo_url TEXT,
  itch_score INTEGER CHECK (itch_score BETWEEN 1 AND 10) NOT NULL,
  affected_zone TEXT CHECK (affected_zone IN ('facial_folds', 'back', 'paws', 'ears', 'other')) NOT NULL,
  notes TEXT,
  food_of_day TEXT,
  environment TEXT CHECK (environment IN ('indoor', 'outdoor', 'mixed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DAILY_TIPS
CREATE TABLE daily_tips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT CHECK (category IN ('fold_cleaning', 'nutrition', 'temperature', 'ears', 'seasonal_allergies', 'warning_signs', 'post_bath', 'weight_control')) NOT NULL,
  content_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  tip_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEEDING_PLANS
CREATE TABLE feeding_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_es TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT_MESSAGES
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dog_id UUID REFERENCES dogs(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONSENTS
CREATE TABLE consents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT CHECK (consent_type IN ('terms', 'privacy', 'medical_disclaimer')) NOT NULL,
  document_version TEXT NOT NULL DEFAULT '1.0',
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  UNIQUE(user_id, consent_type)
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')) DEFAULT 'active',
  plan TEXT CHECK (plan IN ('free', 'paid')) DEFAULT 'free',
  renewal_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
