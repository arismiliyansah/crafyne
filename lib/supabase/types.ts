export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

/**
 * Skema database yang ditulis tangan.
 *
 * Relationships/Views/Functions WAJIB ada meski kosong: supabase-js mencocokkan
 * tipe ini dengan GenericSchema-nya, dan kalau tidak cocok ia diam-diam mundur
 * ke tipe kosong — semua baris jadi `never` dan setiap query harus di-cast
 * `as any`. Itulah kenapa file ini dulu ada tapi tidak berefek apa pun.
 *
 * Kalau skema di Supabase berubah, regenerate dengan:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 * (lalu kembalikan lagi convenience type di bagian bawah file).
 */
export interface Database {
  public: {
    Tables: {
      case_studies: {
        Row: {
          id: string
          slug: string
          name: string
          year: number | null
          tagline: string | null
          kind: string | null
          summary: string | null
          outcome: string | null
          challenge: string | null
          solution: string | null
          cover_image_url: string | null
          gallery_urls: string[]
          tags: string[]
          featured: boolean
          published: boolean
          display_order: number
          project_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['case_studies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['case_studies']['Insert']>
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          cover_image_url: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string | null
          photo_url: string | null
          linkedin_url: string | null
          github_url: string | null
          display_order: number
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          quote: string
          author_name: string
          author_role: string | null
          author_company: string | null
          rating: number
          featured: boolean
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
        Relationships: []
      }
      services: {
        Row: {
          id: string
          title: string
          body: string
          bullets: string[]
          tone: string
          glyph: string | null
          span: string
          display_order: number
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          value: number
          suffix: string
          decimals: number
          label: string
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['stats']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['stats']['Insert']>
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          id: string
          name: string
          tag: string | null
          price: string
          unit: string | null
          blurb: string | null
          features: string[]
          tone: string
          cta_label: string
          featured: boolean
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['pricing_tiers']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['pricing_tiers']['Insert']>
        Relationships: []
      }
      tech_groups: {
        Row: {
          id: string
          label: string
          items: string[]
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['tech_groups']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['tech_groups']['Insert']>
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>
        Relationships: []
      }
      site_settings: {
        Row: { key: string; value: string | null; updated_at: string }
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
        Relationships: []
      }
      project_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          project_type: string
          /** Tidak lagi diisi wizard sejak commit 511f261; tetap ada untuk baris lama. */
          budget_range: string | null
          timeline: string | null
          message: string
          package: string | null
          wants_care: boolean
          design_references: string | null
          status: 'new' | 'reviewing' | 'contacted' | 'won' | 'lost'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          company?: string | null
          project_type: string
          budget_range?: string | null
          timeline?: string | null
          message: string
          package?: string | null
          wants_care?: boolean
          design_references?: string | null
          status?: Database['public']['Tables']['project_inquiries']['Row']['status']
          admin_notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['project_inquiries']['Insert']> & {
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

// Convenience types
export type CaseStudy  = Database['public']['Tables']['case_studies']['Row']
export type Post       = Database['public']['Tables']['posts']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']

export type SiteSettings = Record<string, string>

// New table convenience types (redesign)
export type Service     = Database['public']['Tables']['services']['Row']
export type Stat        = Database['public']['Tables']['stats']['Row']
export type PricingTier = Database['public']['Tables']['pricing_tiers']['Row']
export type TechGroup   = Database['public']['Tables']['tech_groups']['Row']
export type Faq         = Database['public']['Tables']['faqs']['Row']

export type ProjectInquiry = Database['public']['Tables']['project_inquiries']['Row']
