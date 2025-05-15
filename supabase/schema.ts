export type Database = {
  public: {
    Tables: {
      figure: {
        Row: {
          adult: boolean | null;
          category_id: string | null;
          character_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          limited: boolean | null;
          manufacturer_id: string | null;
          material: string | null;
          name: string;
          name_en: string | null;
          name_jp: string | null;
          paint_work: string[] | null;
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
          id?: string;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
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
          id?: string;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name?: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
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
          }
        ];
      };
      figure_backup: {
        Row: {
          adult: boolean | null;
          category_id: string | null;
          character_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          limited: boolean | null;
          manufacturer_id: string | null;
          material: string | null;
          name: string;
          name_en: string | null;
          name_jp: string | null;
          paint_work: string[] | null;
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
          id?: string;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
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
          id?: string;
          limited?: boolean | null;
          manufacturer_id?: string | null;
          material?: string | null;
          name?: string;
          name_en?: string | null;
          name_jp?: string | null;
          paint_work?: string[] | null;
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
            foreignKeyName: "figure_category_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "figure_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "figure_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_manufacturer_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "figure_manufacturer";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_manufacturer_id_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "figure_manufacturer";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "figure_scale_id_fkey";
            columns: ["scale_id"];
            isOneToOne: false;
            referencedRelation: "figure_scale";
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
            foreignKeyName: "figure_images_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure_backup";
            referencedColumns: ["id"];
          }
        ];
      };
      figure_manufacturer: {
        Row: {
          created_at: string | null;
          id: string;
          name_en: string;
          name_ko: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name_en: string;
          name_ko?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name_en?: string;
          name_ko?: string | null;
        };
        Relationships: [];
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
          benefits: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          level: number;
          min_total_spent: number | null;
          name: string;
          shop_id: string;
        };
        Insert: {
          benefits?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          level: number;
          min_total_spent?: number | null;
          name: string;
          shop_id: string;
        };
        Update: {
          benefits?: string | null;
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
          balance: number | null;
          created_at: string | null;
          deposit: number | null;
          figure_id: string;
          id: string;
          memo: string | null;
          payment_status: Database["public"]["Enums"]["payment_status"] | null;
          price: number | null;
          purchase_date: string | null;
          purchase_link: string | null;
          purchase_site: string | null;
          status: Database["public"]["Enums"]["figure_status"] | null;
          tax: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          balance?: number | null;
          created_at?: string | null;
          deposit?: number | null;
          figure_id: string;
          id?: string;
          memo?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          price?: number | null;
          purchase_date?: string | null;
          purchase_link?: string | null;
          purchase_site?: string | null;
          status?: Database["public"]["Enums"]["figure_status"] | null;
          tax?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          balance?: number | null;
          created_at?: string | null;
          deposit?: number | null;
          figure_id?: string;
          id?: string;
          memo?: string | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          price?: number | null;
          purchase_date?: string | null;
          purchase_link?: string | null;
          purchase_site?: string | null;
          status?: Database["public"]["Enums"]["figure_status"] | null;
          tax?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure_backup";
            referencedColumns: ["id"];
          }
        ];
      };
      user_figure_review: {
        Row: {
          content: string;
          created_at: string | null;
          figure_id: string;
          id: string;
          rating: number;
          updated_at: string | null;
          user_figure_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          figure_id: string;
          id?: string;
          rating: number;
          updated_at?: string | null;
          user_figure_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          figure_id?: string;
          id?: string;
          rating?: number;
          updated_at?: string | null;
          user_figure_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_figure_review_figure_id_fkey";
            columns: ["figure_id"];
            isOneToOne: false;
            referencedRelation: "figure_backup";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_figure_review_user_figure_id_fkey";
            columns: ["user_figure_id"];
            isOneToOne: false;
            referencedRelation: "user_figure";
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
      [_ in never]: never;
    };
    Enums: {
      archive_figure_status: "upcoming" | "released" | "delayed" | "canceled";
      figure_status: "RESERVED" | "ORDERED" | "DELIVERED" | "IN_COLLECTION";
      payment_status: "PENDING" | "COMPLETED" | "CANCELLED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      archive_figure_status: ["upcoming", "released", "delayed", "canceled"],
      figure_status: ["RESERVED", "ORDERED", "DELIVERED", "IN_COLLECTION"],
      payment_status: ["PENDING", "COMPLETED", "CANCELLED"],
    },
  },
} as const;
