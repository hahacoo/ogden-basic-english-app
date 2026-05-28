export type ModeKey = 'vocab' | 'phrases' | 'grammar' | 'practice'
export type VocabType = 'things' | 'qualities' | 'operators'
export type ProgressType = 'vocab' | 'phrases' | 'grammar'
export type PracticeType = 'zhToEn' | 'phraseFill' | 'grammarPick'

export interface TabItem {
  key: string
  label: string
}

export interface VocabItem {
  word: string
  type: VocabType
  subgroup: string
}

export interface PhraseItem {
  phrase: string
  zh: string
  category: string
  usage: string
  exampleEn: string
  exampleZh: string
}

export interface ExampleItem {
  en: string
  zh: string
  tag?: string
}

export interface GrammarLesson {
  title: string
  category: string
  pattern: string
  summary: string
  points: string[]
  examples: ExampleItem[]
}

export interface LearningCardData {
  item: VocabItem
  intro: string
  route: string[]
  relatedPhrases: PhraseItem[]
  relatedGrammar: GrammarLesson[]
  examples: ExampleItem[]
}

export interface DayProgress {
  vocab: string[]
  phrases: string[]
  grammar: string[]
  updatedAt: string
}

export interface ProgressStore {
  history: Record<string, DayProgress>
}

export interface StudyStats {
  total: number
  vocab: number
  phrases: number
  grammar: number
  streak: number
}

export interface PracticeStats {
  total: number
  correct: number
}

export interface PracticeAttempt {
  id: string
  type: PracticeType
  prompt: string
  answer: string
  userAnswer: string
  isCorrect: boolean
  explanation?: string
  updatedAt: string
}

export interface PracticeMistakeItem {
  id: string
  type: PracticeType
  prompt: string
  answer: string
  lastUserAnswer: string
  explanation?: string
  wrongCount: number
  updatedAt: string
}

export interface PracticeStore {
  stats: PracticeStats
  recent: PracticeAttempt[]
  mistakes: PracticeMistakeItem[]
}

export interface ZhToEnQuestion {
  type: 'zhToEn'
  promptZh: string
  answer: string
  meta: string
  hint?: string
}

export interface PhraseFillQuestion {
  type: 'phraseFill'
  phrase: string
  zh: string
  sentence: string
  sentenceZh: string
  answer: string
}

export interface GrammarPickQuestion {
  type: 'grammarPick'
  sentence: string
  sentenceZh: string
  options: string[]
  answer: string
  summary: string
}

export type PracticeQuestion = ZhToEnQuestion | PhraseFillQuestion | GrammarPickQuestion
