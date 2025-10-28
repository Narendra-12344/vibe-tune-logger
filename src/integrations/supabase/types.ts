export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      custom_playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      liked_songs: {
        Row: {
          artist: string
          created_at: string
          id: string
          mood_id: string
          song_id: string
          title: string
          user_id: string
        }
        Insert: {
          artist: string
          created_at?: string
          id?: string
          mood_id: string
          song_id: string
          title: string
          user_id: string
        }
        Update: {
          artist?: string
          created_at?: string
          id?: string
          mood_id?: string
          song_id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_journal_entries: {
        Row: {
          created_at: string
          id: string
          mood_id: string
          mood_label: string
          note: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_id: string
          mood_label: string
          note: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_id?: string
          mood_label?: string
          note?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          id: string
          mood_id: string
          mood_label: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_id: string
          mood_label: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_id?: string
          mood_label?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_songs: {
        Row: {
          added_at: string
          artist: string
          id: string
          playlist_id: string
          song_id: string
          title: string
        }
        Insert: {
          added_at?: string
          artist: string
          id?: string
          playlist_id: string
          song_id: string
          title: string
        }
        Update: {
          added_at?: string
          artist?: string
          id?: string
          playlist_id?: string
          song_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "custom_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          favorite_moods: string[] | null
          id: string
          notification_enabled: boolean | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_moods?: string[] | null
          id?: string
          notification_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_moods?: string[] | null
          id?: string
          notification_enabled?: boolean | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_songs: {
        Row: {
          artist: string
          created_at: string
          duration: number | null
          file_path: string
          file_size: number | null
          id: string
          mood_tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist: string
          created_at?: string
          duration?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          mood_tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string
          created_at?: string
          duration?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          mood_tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
