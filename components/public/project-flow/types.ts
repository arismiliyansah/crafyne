export type StepId = 'package' | 'scope' | 'details' | 'review'

export interface FormState {
  package: string          // tier display name, '' = none, NOT_SURE = explicit "unsure"
  wantsCare: boolean
  services: string[]
  budget: string
  timeline: string
  name: string
  email: string
  company: string
  role: string
  description: string
  references: string[]     // URL strings; always at least one (possibly empty) row
  referenceNotes: string
  how: string
  website: string          // honeypot
}

export interface StepProps {
  value: FormState
  onChange: (patch: Partial<FormState>) => void
}

export const NOT_SURE = 'Not sure yet'

export const SERVICES  = ['Web', 'Mobile', 'AI / ML', 'Product Design', 'Enterprise', 'Other']
export const BUDGETS   = ['Under $25k', '$25k–$75k', '$75k–$200k', '$200k+', 'Not sure yet']
export const TIMELINES = ['ASAP', 'Within a month', 'Within a quarter', 'Just exploring']

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

export const emptyForm = (initialPackage = '', initialCare = false): FormState => ({
  package: initialPackage,
  wantsCare: initialCare,
  services: [],
  budget: '',
  timeline: '',
  name: '',
  email: '',
  company: '',
  role: '',
  description: '',
  references: [''],
  referenceNotes: '',
  how: '',
  website: '',
})
