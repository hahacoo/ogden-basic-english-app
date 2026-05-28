import { grammarLessons } from '../data/grammar'
import { wordLearningLinks } from '../data/learning'
import { phrases } from '../data/phrases'
import { allWords, vocabTranslations } from '../data/words'
import type {
  GrammarLesson,
  GrammarPickQuestion,
  LearningCardData,
  PhraseItem,
  PhraseFillQuestion,
  PracticeQuestion,
  PracticeType,
  VocabItem,
  ZhToEnQuestion,
} from '../types/content'

function sampleOne<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[“”"'.,!?]/g, '').replace(/\s+/g, ' ').trim()
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getPracticeWordPool() {
  const priorityWords = Object.keys(wordLearningLinks as Record<string, unknown>)
  const prioritySet = new Set(priorityWords)
  const words = allWords as VocabItem[]
  const translations = vocabTranslations as Record<string, string>

  const priorityPool = words.filter((item) => prioritySet.has(item.word.toLowerCase()) && translations[item.word])
  const supportPool = words.filter(
    (item) =>
      translations[item.word] &&
      item.word.length > 1 &&
      !item.word.includes('/') &&
      !prioritySet.has(item.word.toLowerCase()),
  )

  return [...priorityPool, ...supportPool.slice(0, 120)]
}

export function buildZhToEnQuestion(): ZhToEnQuestion {
  const item = sampleOne(getPracticeWordPool())
  const translation = (vocabTranslations as Record<string, string>)[item.word]
  return {
    type: 'zhToEn',
    promptZh: translation,
    answer: item.word,
    meta: item.type === 'operators' ? '高频 operator' : item.type === 'qualities' ? 'quality 词' : 'thing 词',
    hint: item.type === 'operators' ? '先想最短句，再回忆这个核心词。' : '先说英文，再试着放进一句最短句里。',
  }
}

function canBuildPhraseFill(phrase: string, sentence: string) {
  return new RegExp(escapeRegExp(phrase), 'i').test(sentence)
}

export function buildPhraseFillQuestion(): PhraseFillQuestion {
  const pool = (phrases as PhraseItem[]).filter((item) => canBuildPhraseFill(item.phrase, item.exampleEn))
  const item = sampleOne(pool)
  return {
    type: 'phraseFill',
    phrase: item.phrase,
    zh: item.zh,
    sentence: item.exampleEn.replace(new RegExp(escapeRegExp(item.phrase), 'i'), '____'),
    sentenceZh: item.exampleZh,
    answer: item.phrase,
  }
}

export function buildGrammarPickQuestion(): GrammarPickQuestion {
  const lessons = grammarLessons as GrammarLesson[]
  const correctLesson = sampleOne(lessons)
  const example = sampleOne(correctLesson.examples)
  const distractors = shuffle(
    lessons.filter((lesson) => lesson.title !== correctLesson.title).map((lesson) => lesson.title),
  ).slice(0, 2)

  return {
    type: 'grammarPick',
    sentence: example.en,
    sentenceZh: example.zh,
    options: shuffle([correctLesson.title, ...distractors]),
    answer: correctLesson.title,
    summary: correctLesson.summary,
  }
}

export function buildPracticeQuestion(type: PracticeType): PracticeQuestion {
  if (type === 'zhToEn') return buildZhToEnQuestion()
  if (type === 'phraseFill') return buildPhraseFillQuestion()
  return buildGrammarPickQuestion()
}

export function buildWordPracticeSet(data: LearningCardData): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [
    {
      type: 'zhToEn',
      promptZh: data.item.word.includes('/') ? data.item.word : (vocabTranslations as Record<string, string>)[data.item.word] || data.item.word,
      answer: data.item.word,
      meta: `当前学习词 · ${data.item.type}`,
      hint: data.examples[0] ? `先想这个最短语境：${data.examples[0].en}` : '先回忆这个词最短、最容易开口的句子。',
    },
  ]

  if (data.relatedPhrases[0] && canBuildPhraseFill(data.relatedPhrases[0].phrase, data.relatedPhrases[0].exampleEn)) {
    const phrase = data.relatedPhrases[0]
    questions.push({
      type: 'phraseFill',
      phrase: phrase.phrase,
      zh: phrase.zh,
      sentence: phrase.exampleEn.replace(new RegExp(escapeRegExp(phrase.phrase), 'i'), '____'),
      sentenceZh: phrase.exampleZh,
      answer: phrase.phrase,
    })
  }

  if (data.relatedGrammar[0]) {
    const correctLesson = data.relatedGrammar[0]
    const example = sampleOne(correctLesson.examples)
    const distractors = shuffle(
      (grammarLessons as GrammarLesson[])
        .filter((lesson) => lesson.title !== correctLesson.title)
        .map((lesson) => lesson.title),
    ).slice(0, 2)

    questions.push({
      type: 'grammarPick',
      sentence: example.en,
      sentenceZh: example.zh,
      options: shuffle([correctLesson.title, ...distractors]),
      answer: correctLesson.title,
      summary: correctLesson.summary,
    })
  }

  return questions
}

export function checkPracticeAnswer(question: PracticeQuestion, answer: string) {
  return normalizeText(answer) === normalizeText(question.answer)
}

export function getPracticeQuestionId(question: PracticeQuestion) {
  if (question.type === 'zhToEn') return `${question.type}:${normalizeText(question.promptZh)}:${normalizeText(question.answer)}`
  if (question.type === 'phraseFill') return `${question.type}:${normalizeText(question.phrase)}:${normalizeText(question.answer)}`
  return `${question.type}:${normalizeText(question.sentence)}:${normalizeText(question.answer)}`
}

export function getPracticePrompt(question: PracticeQuestion) {
  if (question.type === 'zhToEn') return `中文：${question.promptZh}`
  if (question.type === 'phraseFill') return `短语：${question.phrase} · ${question.zh}`
  return `句子：${question.sentence}`
}

export function getPracticeExplanation(question: PracticeQuestion) {
  if (question.type === 'zhToEn') return question.hint || question.meta
  if (question.type === 'phraseFill') return question.sentenceZh
  return question.summary
}
