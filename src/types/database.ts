export type LearnerLevel = "beginner" | "intermediate";
export type LearnerGoal = "employment" | "entrepreneurship" | "ai" | "productivity";

export interface Database {
  public: {
    Tables: {
      cohorts: {
        Row: {
          id: string;
          code: string;
          name: string;
          total_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          total_days?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cohorts"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          cohort_id: string | null;
          first_name: string | null;
          last_name: string | null;
          city: string | null;
          level: LearnerLevel | null;
          goal: LearnerGoal | null;
          whatsapp_opt_in: boolean;
          phone: string | null;
          contact: string | null;
          program_day: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          cohort_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          city?: string | null;
          level?: LearnerLevel | null;
          goal?: LearnerGoal | null;
          whatsapp_opt_in?: boolean;
          phone?: string | null;
          contact?: string | null;
          program_day?: number;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      user_lesson_progress: {
        Row: { user_id: string; lesson_id: string; completed_at: string };
        Insert: { user_id: string; lesson_id: string; completed_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_lesson_progress"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      user_quiz_scores: {
        Row: { user_id: string; module_id: string; best_percent: number; updated_at: string };
        Insert: { user_id: string; module_id: string; best_percent: number; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_quiz_scores"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      deliverables: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          type: string;
          file_name: string | null;
          link_url: string | null;
          context: string;
          status: string;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          type: string;
          file_name?: string | null;
          link_url?: string | null;
          context?: string;
          status: string;
          submitted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["deliverables"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      deliverable_feedback: {
        Row: {
          deliverable_id: string;
          score: number | null;
          strengths: string | null;
          improvements: string | null;
          next_steps: string | null;
          mentor_name: string | null;
          feedback_date: string | null;
        };
        Insert: {
          deliverable_id: string;
          score?: number | null;
          strengths?: string | null;
          improvements?: string | null;
          next_steps?: string | null;
          mentor_name?: string | null;
          feedback_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["deliverable_feedback"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      mentoring_registrations: {
        Row: { user_id: string; session_id: string; registered_at: string };
        Insert: { user_id: string; session_id: string; registered_at?: string };
        Update: Partial<Database["public"]["Tables"]["mentoring_registrations"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
      issued_certificates: {
        Row: { user_id: string; learner_name: string; cohort_code: string; issued_at: string };
        Insert: { user_id: string; learner_name: string; cohort_code: string; issued_at?: string };
        Update: Partial<Database["public"]["Tables"]["issued_certificates"]["Insert"]>;
        Relationships: [];
        Relationships: [];
      };
    };
    Functions: {
      mentoring_spots_left: {
        Args: { p_session_id: string; p_capacity: number };
        Returns: number;
      };
    };
  };
}
