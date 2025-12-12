export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      figure: {
        Row: {
          adult: boolean | null;
          category_id: string | null;
          character_id: string | null;
          created_at: string | null;
          description: string | null;
          final_release_date: string | null;
          id: string;
          is_reissue: boolean | null;
          limited: boolean | null;
          manufacturer_id: string | null;
          material: string | null;
          name: string;
          name_en: string | null;
          name_jp: string | null;
          paint_work: string[] | null;
          parent_figure_id: string | null;
          price_cn: number | null;
          price_jp: number | null;
          price_kr: number | null;
          release_month: number | null;
          release_text: string | null;
          release_year: number | null;
          scale_id: string | null;
          sculptors: string[] | null;
          series_id: string | null;
          size: string | null;
          specifications: string | null;
          status: Database["public"]["Enums"]["archive_figure_status"] | null;
          updated_at: string | null;
        };
        Insert: {
          adult?: boolean | null;
          category_id?: string | null;
          character_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          final_release_date?: string | null;
          id?: string;
          is_reissue?: boolean | null;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
          parent_figure_id?: string | null;
          price_cn?: number | null;
          price_jp?: number | null;
          price_kr?: number | null;
          release_month?: number | null;
          release_text?: string | null;
          release_year?: number | null;
          scale_id?: string | null;
          sculptors?: string[] | null;
          series_id?: string | null;
          size?: string | null;
          specifications?: string | null;
          status?: Database["public"]["Enums"]["archive_figure_status"] | null;
          updated_at?: string | null;
        };
        Update: {
          adult?: boolean | null;
          category_id?: string | null;
          character_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          final_release_date?: string | null;
          id?: string;
          is_reissue?: boolean | null;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name?: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
          parent_figure_id?: string | null;
          price_cn?: number | null;
          price_jp?: number | null;
          price_kr?: number | null;
          release_month?: number | null;
          release_text?: string | null;
          release_year?: number | null;
          scale_id?: string | null;
          sculptors?: string[] | null;
          series_id?: string | null;
          size?: string | null;
          specifications?: string | null;
          status?: Database["public"]["Enums"]["archive_figure_status"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "figure_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "figure_character";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_new_category_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "figure_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_new_manufacturer_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "figure_manufacturer";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_new_scale_fkey";
            columns: ["scale_id"];
            isOneToOne: false;
            referencedRelation: "figure_scale";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_parent_figure_id_fkey";
            columns: ["parent_figure_id"];
            isOneToOne: false;
            referencedRelation: "figure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "figure_series";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_category: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string;
          name_ko: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en: string;
          name_ko: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string;
          name_ko?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      figure_character: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string | null;
          name_ja: string | null;
          name_ko: string;
          series_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en?: string | null;
          name_ja?: string | null;
          name_ko: string;
          series_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string | null;
          name_ja?: string | null;
          name_ko?: string;
          series_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "figure_character_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "figure_series";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_image: {
        Row: {
          created_at: string | null;
          figure_id: string | null;
          id: string;
          image_url: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          figure_id?: string | null;
          id?: string;
          image_url: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          figure_id?: string | null;
          id?: string;
          image_url?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "figure_image_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_manufacturer: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string | null;
          name_ko: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en?: string | null;
          name_ko: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string | null;
          name_ko?: string;
        };
        Relationships: [];
      };
      figure_release: {
        Row: {
          created_at: string | null;
          figure_id: string;
          id: string;
          is_reissue: boolean | null;
          price_cn: number | null;
          price_jp: number | null;
          price_kr: number | null;
          release_month: number | null;
          release_no: number | null;
          release_text: string | null;
          release_year: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          figure_id: string;
          id?: string;
          is_reissue?: boolean | null;
          price_cn?: number | null;
          price_jp?: number | null;
          price_kr?: number | null;
          release_month?: number | null;
          release_no?: number | null;
          release_text?: string | null;
          release_year?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          figure_id?: string;
          id?: string;
          is_reissue?: boolean | null;
          price_cn?: number | null;
          price_jp?: number | null;
          price_kr?: number | null;
          release_month?: number | null;
          release_no?: number | null;
          release_text?: string | null;
          release_year?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "figure_release_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_release_delay: {
        Row: {
          created_at: string | null;
          id: string;
          new_date: string;
          previous_date: string;
          reason: string | null;
          release_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          new_date: string;
          previous_date: string;
          reason?: string | null;
          release_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          new_date?: string;
          previous_date?: string;
          reason?: string | null;
          release_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "figure_release_delay_release_id_fkey";
            columns: ["release_id"];
            isOneToOne: false;
            referencedRelation: "figure_release";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_scale: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          ratio: number;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          ratio: number;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          ratio?: number;
        };
        Relationships: [];
      };
      figure_series: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string;
          name_ja: string | null;
          name_ko: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en: string;
          name_ja?: string | null;
          name_ko: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string;
          name_ja?: string | null;
          name_ko?: string;
        };
        Relationships: [];
      };
      figure_shop: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          is_official: boolean | null;
          logo_url: string | null;
          name: string;
          name_en: string | null;
          region: string | null;
          url: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_official?: boolean | null;
          logo_url?: string | null;
          name: string;
          name_en?: string | null;
          region?: string | null;
          url?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_official?: boolean | null;
          logo_url?: string | null;
          name?: string;
          name_en?: string | null;
          region?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      figure_shop_grade: {
        Row: {
          benefits: JSON | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          level: number;
          min_total_spent: number | null;
          name: string;
          shop_id: string;
        };
        Insert: {
          benefits?: JSON | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          level: number;
          min_total_spent?: number | null;
          name: string;
          shop_id: string;
        };
        Update: {
          benefits?: JSON | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          level?: number;
          min_total_spent?: number | null;
          name?: string;
          shop_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "figure_shop_grade_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "figure_shop";
            referencedColumns: ["id"];
          }
        ];
      };
      profile: {
        Row: {
          avatar_url: string | null;
          id: string;
          is_admin: boolean | null;
          is_updated: boolean | null;
          nickname: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          id: string;
          is_admin?: boolean | null;
          is_updated?: boolean | null;
          nickname?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          id?: string;
          is_admin?: boolean | null;
          is_updated?: boolean | null;
          nickname?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_figure: {
        Row: {
          balance_paid_at: string | null;
          balance_price: number;
          created_at: string;
          delivered_at: string | null;
          deposit_paid_at: string | null;
          deposit_price: number;
          figure_id: string | null;
          id: string;
          memo: string | null;
          paid_at: string | null;
          rating: number | null;
          release_id: string;
          shop_id: string;
          status: Database["public"]["Enums"]["user_figure_status"];
          total_price: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance_paid_at?: string | null;
          balance_price?: number;
          created_at?: string;
          delivered_at?: string | null;
          deposit_paid_at?: string | null;
          deposit_price?: number;
          figure_id?: string | null;
          id?: string;
          memo?: string | null;
          paid_at?: string | null;
          rating?: number | null;
          release_id: string;
          shop_id: string;
          status: Database["public"]["Enums"]["user_figure_status"];
          total_price: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance_paid_at?: string | null;
          balance_price?: number;
          created_at?: string;
          delivered_at?: string | null;
          deposit_paid_at?: string | null;
          deposit_price?: number;
          figure_id?: string | null;
          id?: string;
          memo?: string | null;
          paid_at?: string | null;
          rating?: number | null;
          release_id?: string;
          shop_id?: string;
          status?: Database["public"]["Enums"]["user_figure_status"];
          total_price?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_figure_purchase_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "figure_shop";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_figure_release_id_fkey";
            columns: ["release_id"];
            isOneToOne: false;
            referencedRelation: "figure_release";
            referencedColumns: ["id"];
          }
        ];
      };
      user_figure_history: {
        Row: {
          changed_at: string | null;
          id: string;
          new_status: Database["public"]["Enums"]["user_figure_status"];
          previous_status:
            | Database["public"]["Enums"]["user_figure_status"]
            | null;
          user_figure_id: string;
        };
        Insert: {
          changed_at?: string | null;
          id?: string;
          new_status: Database["public"]["Enums"]["user_figure_status"];
          previous_status?:
            | Database["public"]["Enums"]["user_figure_status"]
            | null;
          user_figure_id: string;
        };
        Update: {
          changed_at?: string | null;
          id?: string;
          new_status?: Database["public"]["Enums"]["user_figure_status"];
          previous_status?:
            | Database["public"]["Enums"]["user_figure_status"]
            | null;
          user_figure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_history_user_figure_id_fkey";
            columns: ["user_figure_id"];
            isOneToOne: false;
            referencedRelation: "user_figure";
            referencedColumns: ["id"];
          }
        ];
      };
      user_figure_review: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          is_public: boolean | null;
          rating: number | null;
          title: string | null;
          updated_at: string | null;
          user_figure_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          rating?: number | null;
          title?: string | null;
          updated_at?: string | null;
          user_figure_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          rating?: number | null;
          title?: string | null;
          updated_at?: string | null;
          user_figure_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_review_user_figure_id_fkey";
            columns: ["user_figure_id"];
            isOneToOne: true;
            referencedRelation: "user_figure";
            referencedColumns: ["id"];
          }
        ];
      };
      user_figure_review_image: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string;
          review_id: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url: string;
          review_id: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string;
          review_id?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_review_image_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "user_figure_review";
            referencedColumns: ["id"];
          }
        ];
      };
      user_shop_grade: {
        Row: {
          grade_id: string | null;
          id: string;
          shop_id: string | null;
          total_spent: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          grade_id?: string | null;
          id?: string;
          shop_id?: string | null;
          total_spent?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          grade_id?: string | null;
          id?: string;
          shop_id?: string | null;
          total_spent?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_shop_grade_grade_id_fkey";
            columns: ["grade_id"];
            isOneToOne: false;
            referencedRelation: "figure_shop_grade";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_shop_grade_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "figure_shop";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_figure_with_release_and_images: {
        Args: {
          _category: string;
          _images: string[];
          _is_reissue: boolean;
          _manufacturer: string;
          _name: string;
          _name_jp: string;
          _price_cn: number;
          _price_jp: number;
          _price_kr: number;
          _release_month: number;
          _release_text: string;
          _release_year: number;
          _scale: string;
          _series: string;
        };
        Returns: string;
      };
      register_figure: {
        Args: {
          p_category_id: string;
          p_character_id: string;
          p_images?: string[];
          p_is_reissue?: boolean;
          p_manufacturer_id: string;
          p_material?: string;
          p_name: string;
          p_name_en?: string;
          p_name_jp?: string;
          p_price_cn?: number;
          p_price_jp?: number;
          p_price_kr: number;
          p_release_month: number;
          p_release_text: string;
          p_release_year: number;
          p_scale_id: string;
          p_series_id: string;
          p_size?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      archive_figure_status: "upcoming" | "released" | "delayed" | "canceled";
      figure_status: "RESERVED" | "ORDERED" | "DELIVERED" | "IN_COLLECTION";
      payment_status: "PENDING" | "COMPLETED" | "CANCELLED";
      user_figure_status: "reserved" | "ordered" | "owned";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      archive_figure_status: ["upcoming", "released", "delayed", "canceled"],
      figure_status: ["RESERVED", "ORDERED", "DELIVERED", "IN_COLLECTION"],
      payment_status: ["PENDING", "COMPLETED", "CANCELLED"],
      user_figure_status: ["reserved", "ordered", "owned"],
    },
  },
} as const;
