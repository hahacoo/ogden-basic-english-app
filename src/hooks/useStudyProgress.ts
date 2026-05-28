import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DayProgress, ProgressStore, ProgressType, StudyStats } from '../types/content'

const STORAGE_KEY = 'ogden-basic-english-progress-v1'

function createEmptyDayProgress(): DayProgress {
  return { vocab: [], phrases: [], grammar: [], updatedAt: '' }
}

function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return { history: {} }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { history: {} }
    const parsed = JSON.parse(raw) as ProgressStore
    if (!parsed || typeof parsed !== 'object' || !parsed.history) return { history: {} }
    return parsed
  } catch {
    return { history: {} }
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function formatTodayLabel() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function ensureDayProgress(progress: ProgressStore, dateKey = getTodayKey()): DayProgress {
  return progress.history[dateKey] || createEmptyDayProgress()
}

function getTypeKey(type: ProgressType) {
  return type === 'vocab' ? 'vocab' : type === 'phrases' ? 'phrases' : 'grammar'
}

function getActiveDayKeys(progress: ProgressStore) {
  return Object.keys(progress.history)
    .filter((dateKey) => {
      const day = progress.history[dateKey]
      return day && (day.vocab.length || day.phrases.length || day.grammar.length)
    })
    .sort()
}

function getCurrentStreak(progress: ProgressStore) {
  const activeDays = new Set(getActiveDayKeys(progress))
  let streak = 0
  const cursor = new Date()
  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (!activeDays.has(key)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function useStudyProgress() {
  const [progress, setProgress] = useState<ProgressStore>(() => loadProgress())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  }, [progress])

  const today = useMemo(() => ensureDayProgress(progress), [progress])
  const stats = useMemo<StudyStats>(() => ({
    total: today.vocab.length + today.phrases.length + today.grammar.length,
    vocab: today.vocab.length,
    phrases: today.phrases.length,
    grammar: today.grammar.length,
    streak: getCurrentStreak(progress),
  }), [progress, today])

  const studyDateLabel = stats.total ? `${formatTodayLabel()} 已开始打卡，继续保持。` : `${formatTodayLabel()} 还没有开始打卡。`

  const hasCheckedIn = useCallback((type: ProgressType, id: string) => today[getTypeKey(type)].includes(id), [today])

  const toggleCheckedIn = useCallback((type: ProgressType, id: string) => {
    setProgress((current) => {
      const dateKey = getTodayKey()
      const day = ensureDayProgress(current, dateKey)
      const typeKey = getTypeKey(type)
      const list = [...day[typeKey]]
      const index = list.indexOf(id)
      if (index >= 0) list.splice(index, 1)
      else list.push(id)
      return {
        history: {
          ...current.history,
          [dateKey]: { ...day, [typeKey]: list, updatedAt: new Date().toISOString() },
        },
      }
    })
  }, [])

  const resetTodayProgress = useCallback(() => {
    setProgress((current) => ({
      history: {
        ...current.history,
        [getTodayKey()]: createEmptyDayProgress(),
      },
    }))
  }, [])

  return { progress, today, stats, studyDateLabel, hasCheckedIn, toggleCheckedIn, resetTodayProgress }
}
