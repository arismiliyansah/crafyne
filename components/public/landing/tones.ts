export const TONES = ['crimson', 'peach', 'navy', 'orange', 'cream', 'navy-2'] as const
export type Tone = (typeof TONES)[number]
export const toneByIndex = (i: number): Tone => TONES[i % TONES.length]

export const CASE_SHAPES = ['phone', 'dashboard', 'blocks', 'card', 'grid'] as const
export type CaseShape = (typeof CASE_SHAPES)[number]
export const shapeByIndex = (i: number): CaseShape => CASE_SHAPES[i % CASE_SHAPES.length]
