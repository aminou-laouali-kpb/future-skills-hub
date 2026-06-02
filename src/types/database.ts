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
      };
    };
  };
}
