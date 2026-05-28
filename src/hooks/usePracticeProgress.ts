import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPracticeExplanation, getPracticePrompt, getPracticeQuestionId } from '../utils/practice'
import type { PracticeQuestion, PracticeStats, PracticeStore } from '../types/content'

const STORAGE_KEY = 'ogden-basic-english-practice-v1'
const RECENT_LIMIT = 20

function createEmptyStore(): PracticeStore {
  return {
    stats: { total: 0, correct: 0 },
    recent: [],
    mistakes: [],
  }
}

function loadPracticeStore(): PracticeStore {
  if (typeof window === 'undefined') return createEmptyStore()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyStore()
    const parsed = JSON.parse(raw) as PracticeStore
    if (!parsed || typeof parsed !== 'object') return createEmptyStore()
    return {
      stats: parsed.stats || { total: 0, correct: 0 },
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    }
  } catch {
    return createEmptyStore()
  }
}

export function usePracticeProgress() {
  const [store, setStore] = useState<PracticeStore>(() => loadPracticeStore())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    }
  }, [store])

  const recordAnswer = useCallback((question: PracticeQuestion, userAnswer: string, isCorrect: boolean) => {
    const id = getPracticeQuestionId(question)
    const now = new Date().toISOString()
    const prompt = getPracticePrompt(question)
    const explanation = getPracticeExplanation(question)

    setStore((current) => {
      const stats: PracticeStats = {
        total: current.stats.total + 1,
        correct: current.stats.correct + (isCorrect ? 1 : 0),
      }

      const recent = [
        {
          id,
          type: question.type,
          prompt,
          answer: question.answer,
          userAnswer,
          isCorrect,
          explanation,
          updatedAt: now,
        },
        ...current.recent,
      ].slice(0, RECENT_LIMIT)

      const nextMistakes = [...current.mistakes]
      const mistakeIndex = nextMistakes.findIndex((item) => item.id === id)

      if (isCorrect) {
        if (mistakeIndex >= 0) {
          nextMistakes.splice(mistakeIndex, 1)
        }
      } else if (mistakeIndex >= 0) {
        nextMistakes[mistakeIndex] = {
          ...nextMistakes[mistakeIndex],
          lastUserAnswer: userAnswer,
          wrongCount: nextMistakes[mistakeIndex].wrongCount + 1,
          updatedAt: now,
          explanation,
        }
      } else {
        nextMistakes.unshift({
          id,
          type: question.type,
          prompt,
          answer: question.answer,
          lastUserAnswer: userAnswer,
          explanation,
          wrongCount: 1,
          updatedAt: now,
        })
      }

      nextMistakes.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

      return {
        stats,
        recent,
        mistakes: nextMistakes,
      }
    })
  }, [])

  const clearMistake = useCallback((id: string) => {
    setStore((current) => ({
      ...current,
      mistakes: current.mistakes.filter((item) => item.id !== id),
    }))
  }, [])

  const clearAllMistakes = useCallback(() => {
    setStore((current) => ({
      ...current,
      mistakes: [],
    }))
  }, [])

  const resetPracticeHistory = useCallback(() => {
    setStore(createEmptyStore())
  }, [])

  const accuracy = useMemo(
    () => (store.stats.total ? Math.round((store.stats.correct / store.stats.total) * 100) : 0),
    [store.stats],
  )

  return {
    stats: store.stats,
    recent: store.recent,
    mistakes: store.mistakes,
    accuracy,
    recordAnswer,
    clearMistake,
    clearAllMistakes,
    resetPracticeHistory,
  }
}
