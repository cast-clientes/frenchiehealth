export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          preferred_language: "en" | "es";
          is_founding_member: boolean;
          founding_member_number: number | null;
          parent_role: string;
          parent_role_custom: string | null;
          parent_role_display: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          preferred_language?: "en" | "es";
          is_founding_member?: boolean;
          founding_member_number?: number | null;
          parent_role?: string;
          parent_role_custom?: string | null;
          parent_role_display?: string | null;
        };
        Update: {
          full_name?: string | null;
          preferred_language?: "en" | "es";
          is_founding_member?: boolean;
          founding_member_number?: number | null;
          parent_role?: string;
          parent_role_custom?: string | null;
          parent_role_display?: string | null;
          updated_at?: string;
        };
      };
      dogs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          birth_date: string | null;
          weight_kg: number | null;
          photo_url: string | null;
          microchip_number: string | null;
          breed_color: string | null;
          vet_name: string | null;
          vet_phone: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          known_allergies: string[] | null;
          current_medications: string[] | null;
          passport_public_url: string | null;
          nickname: string | null;
          pronoun: string;
          gender: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          birth_date?: string | null;
          weight_kg?: number | null;
          photo_url?: string | null;
          microchip_number?: string | null;
          breed_color?: string | null;
          vet_name?: string | null;
          vet_phone?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          known_allergies?: string[] | null;
          current_medications?: string[] | null;
          passport_public_url?: string | null;
          nickname?: string | null;
          pronoun?: string;
          gender?: string;
        };
        Update: {
          name?: string;
          birth_date?: string | null;
          weight_kg?: number | null;
          photo_url?: string | null;
          microchip_number?: string | null;
          breed_color?: string | null;
          vet_name?: string | null;
          vet_phone?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          known_allergies?: string[] | null;
          current_medications?: string[] | null;
          passport_public_url?: string | null;
          nickname?: string | null;
          pronoun?: string;
          gender?: string;
        };
      };
      skin_entries: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          entry_date: string;
          photo_url: string | null;
          itch_score: number;
          affected_zone:
            | "facial_folds"
            | "back"
            | "paws"
            | "ears"
            | "other";
          notes: string | null;
          food_of_day: string | null;
          environment: "indoor" | "outdoor" | "mixed" | null;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          entry_date?: string;
          photo_url?: string | null;
          itch_score: number;
          affected_zone: "facial_folds" | "back" | "paws" | "ears" | "other";
          notes?: string | null;
          food_of_day?: string | null;
          environment?: "indoor" | "outdoor" | "mixed" | null;
        };
        Update: {
          photo_url?: string | null;
          itch_score?: number;
          affected_zone?: "facial_folds" | "back" | "paws" | "ears" | "other";
          notes?: string | null;
          food_of_day?: string | null;
          environment?: "indoor" | "outdoor" | "mixed" | null;
        };
      };
      daily_tips: {
        Row: {
          id: string;
          category: string;
          content_en: string;
          content_es: string;
          tip_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      feeding_plans: {
        Row: {
          id: string;
          section: string;
          title_en: string;
          title_es: string;
          content_en: string;
          content_es: string;
          display_order: number;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          dog_id: string | null;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          dog_id?: string | null;
          role: "user" | "assistant";
          content: string;
        };
        Update: Record<string, unknown>;
      };
      consents: {
        Row: {
          id: string;
          user_id: string;
          consent_type: "terms" | "privacy" | "medical_disclaimer";
          document_version: string;
          accepted_at: string;
          ip_address: string | null;
        };
        Insert: {
          user_id: string;
          consent_type: "terms" | "privacy" | "medical_disclaimer";
          document_version?: string;
          ip_address?: string | null;
        };
        Update: Record<string, unknown>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          plan: "free" | "paid";
          plan_type: "monthly" | "annual" | "founder_monthly" | "founder_annual" | null;
          renewal_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          plan?: "free" | "paid";
          plan_type?: "monthly" | "annual" | "founder_monthly" | "founder_annual" | null;
          renewal_date?: string | null;
        };
        Update: {
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
          plan?: "free" | "paid";
          plan_type?: "monthly" | "annual" | "founder_monthly" | "founder_annual" | null;
          renewal_date?: string | null;
        };
      };
      respiratory_entries: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          date: string;
          episode_occurred: boolean;
          episode_duration_minutes: number | null;
          trigger_suspected: string | null;
          severity: number | null;
          temperature_celsius: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          date: string;
          episode_occurred?: boolean;
          episode_duration_minutes?: number | null;
          trigger_suspected?: string | null;
          severity?: number | null;
          temperature_celsius?: number | null;
          notes?: string | null;
        };
        Update: Record<string, unknown>;
      };
      ear_eye_checks: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          date: string;
          ear_left_clean: boolean | null;
          ear_right_clean: boolean | null;
          ear_discharge: boolean | null;
          ear_odor: boolean | null;
          eye_discharge: boolean | null;
          eye_redness: boolean | null;
          cherry_eye_visible: boolean | null;
          notes: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          date: string;
          ear_left_clean?: boolean | null;
          ear_right_clean?: boolean | null;
          ear_discharge?: boolean | null;
          ear_odor?: boolean | null;
          eye_discharge?: boolean | null;
          eye_redness?: boolean | null;
          cherry_eye_visible?: boolean | null;
          notes?: string | null;
          photo_url?: string | null;
        };
        Update: Record<string, unknown>;
      };
      joint_entries: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          date: string;
          limping: boolean;
          affected_limb: string | null;
          pain_score: number | null;
          activity_level: string | null;
          exercise_minutes: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          date: string;
          limping?: boolean;
          affected_limb?: string | null;
          pain_score?: number | null;
          activity_level?: string | null;
          exercise_minutes?: number | null;
          notes?: string | null;
        };
        Update: Record<string, unknown>;
      };
      weight_entries: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          date: string;
          weight_kg: number;
          gas_bloating: boolean;
          vomiting: boolean;
          stool_consistency: string | null;
          appetite: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          date: string;
          weight_kg: number;
          gas_bloating?: boolean;
          vomiting?: boolean;
          stool_consistency?: string | null;
          appetite?: string | null;
          notes?: string | null;
        };
        Update: Record<string, unknown>;
      };
      health_events: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          event_type: string;
          event_name: string;
          event_date: string;
          next_due_date: string | null;
          vet_name: string | null;
          notes: string | null;
          reminder_sent: boolean;
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          event_type: string;
          event_name: string;
          event_date: string;
          next_due_date?: string | null;
          vet_name?: string | null;
          notes?: string | null;
          reminder_sent?: boolean;
        };
        Update: Record<string, unknown>;
      };
      waitlist_modules: {
        Row: {
          id: string;
          email: string;
          module: string;
          locale: string;
          created_at: string;
        };
        Insert: {
          email: string;
          module: string;
          locale?: string;
        };
        Update: Record<string, unknown>;
      };
      founding_members_counter: {
        Row: {
          id: number;
          total_spots: number;
          spots_taken: number;
          offer_active: boolean;
          offer_ends_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: {
          spots_taken?: number;
          offer_active?: boolean;
          offer_ends_at?: string;
        };
      };
      dog_milestones: {
        Row: {
          id: string;
          dog_id: string;
          user_id: string;
          milestone_date: string;
          title: string;
          description: string | null;
          photo_url: string | null;
          emoji: string | null;
          milestone_type: "birthday" | "vet_visit" | "first_time" | "achievement" | "memory" | "other";
          created_at: string;
        };
        Insert: {
          dog_id: string;
          user_id: string;
          milestone_date: string;
          title: string;
          description?: string | null;
          photo_url?: string | null;
          emoji?: string | null;
          milestone_type?: "birthday" | "vet_visit" | "first_time" | "achievement" | "memory" | "other";
        };
        Update: {
          milestone_date?: string;
          title?: string;
          description?: string | null;
          photo_url?: string | null;
          emoji?: string | null;
          milestone_type?: "birthday" | "vet_visit" | "first_time" | "achievement" | "memory" | "other";
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          dog_id: string | null;
          category: "logro" | "pregunta" | "tip" | "foto";
          title: string;
          content: string;
          photo_url: string | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          dog_id?: string | null;
          category: "logro" | "pregunta" | "tip" | "foto";
          title: string;
          content: string;
          photo_url?: string | null;
          is_pinned?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          photo_url?: string | null;
          is_pinned?: boolean;
        };
      };
      community_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction: "heart" | "paw" | "muscle";
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          reaction: "heart" | "paw" | "muscle";
        };
        Update: Record<string, unknown>;
      };
      community_challenges: {
        Row: {
          id: string;
          title_en: string;
          title_es: string;
          description_en: string;
          description_es: string;
          duration_days: number;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      user_challenge_progress: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          day_number: number;
          completed_at: string;
          notes: string | null;
        };
        Insert: {
          user_id: string;
          challenge_id: string;
          day_number: number;
          notes?: string | null;
        };
        Update: Record<string, unknown>;
      };
    };
  };
}
