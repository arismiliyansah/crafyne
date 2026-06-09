export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

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
      }
      site_settings: {
        Row: { key: string; value: string | null; updated_at: string }
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
    }
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

// Legacy settings-JSON service shape — used only by the old homepage until it is
// replaced; removed in the page-assembly step.
export interface LegacyService {
  order: number
  name: string
  description: string
}

export interface ProjectInquiry {
  id: string
  name: string
  email: string
  company: string | null
  project_type: string
  budget_range: string | null
  timeline: string | null
  message: string
  status: 'new' | 'reviewing' | 'contacted' | 'won' | 'lost'
  admin_notes: string | null
  created_at: string
  updated_at: string
}
