export type StepId = 'package' | 'scope' | 'details' | 'review'

export interface FormState {
  package: string          // tier display name, '' = none, NOT_SURE = explicit "unsure"
  wantsCare: boolean
  services: string[]
  timeline: string
  name: string
  email: string
  company: string
  role: string
  description: string
  references: string[]     // URL strings; always at least one (possibly empty) row
  referenceNotes: string
  how: string
}

export interface StepProps {
  value: FormState
  onChange: (patch: Partial<FormState>) => void
}

export const NOT_SURE = 'Not sure yet'

export const SERVICES  = ['Web', 'Mobile', 'AI / ML', 'Product Design', 'Enterprise', 'Other']
export const TIMELINES = ['ASAP', 'Within a month', 'Within a quarter', 'Just exploring']

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

export const emptyForm = (): FormState => ({
  package: '',
  wantsCare: false,
  services: [],
  timeline: '',
  name: '',
  email: '',
  company: '',
  role: '',
  description: '',
  references: [''],
  referenceNotes: '',
  how: '',
})
