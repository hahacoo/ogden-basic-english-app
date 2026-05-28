import { useCallback, useEffect, useState } from 'react'

type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
}

export type SpeechAccent = 'en-US' | 'en-GB'

export type SpeechSettings = {
  accent: SpeechAccent
  rate: number
}

let currentSpeechKey: string | null = null
const listeners = new Set<(key: string | null) => void>()
const speechSettingsListeners = new Set<(settings: SpeechSettings) => void>()
const STORAGE_KEY = 'ogden-basic-english-speech-settings'
const DEFAULT_SETTINGS: SpeechSettings = {
  accent: 'en-US',
  rate: 0.95,
}

let currentSpeechSettings = loadStoredSpeechSettings()

function emitSpeechKey(key: string | null) {
  currentSpeechKey = key
  listeners.forEach((listener) => listener(key))
}

function emitSpeechSettings(settings: SpeechSettings) {
  currentSpeechSettings = settings
  speechSettingsListeners.forEach((listener) => listener(settings))
}

function getSpeechSynthesisSafe() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  return window.speechSynthesis
}

function clampRate(value: number) {
  return Math.min(1.4, Math.max(0.7, Number(value.toFixed(2))))
}

function loadStoredSpeechSettings(): SpeechSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS

    const parsed = JSON.parse(raw) as Partial<SpeechSettings>
    const accent = parsed.accent === 'en-GB' ? 'en-GB' : 'en-US'
    const rate = typeof parsed.rate === 'number' ? clampRate(parsed.rate) : DEFAULT_SETTINGS.rate
    return { accent, rate }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveStoredSpeechSettings(settings: SpeechSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function pickVoice(lang: string) {
  const synth = getSpeechSynthesisSafe()
  if (!synth) return null

  const voices = synth.getVoices()
  const lowerLang = lang.toLowerCase()

  if (lowerLang === 'en-gb') {
    return (
      voices.find((voice) => voice.lang.toLowerCase() === 'en-gb' && /uk|british|england/i.test(voice.name)) ||
      voices.find((voice) => voice.lang.toLowerCase() === 'en-gb') ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en-gb')) ||
      voices.find((voice) => /uk|british|england/i.test(voice.name) && voice.lang.toLowerCase().startsWith('en')) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
      null
    )
  }

  if (lowerLang === 'en-us') {
    return (
      voices.find((voice) => voice.lang.toLowerCase() === 'en-us' && /us|american|united states/i.test(voice.name)) ||
      voices.find((voice) => voice.lang.toLowerCase() === 'en-us') ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en-us')) ||
      voices.find((voice) => /us|american|united states/i.test(voice.name) && voice.lang.toLowerCase().startsWith('en')) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
      null
    )
  }

  return (
    voices.find((voice) => voice.lang.toLowerCase() === lowerLang) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(lowerLang.split('-')[0])) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
    null
  )
}

export function useSpeechSynthesis() {
  const [activeKey, setActiveKey] = useState<string | null>(currentSpeechKey)
  const [settings, setSettings] = useState<SpeechSettings>(currentSpeechSettings)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    listeners.add(setActiveKey)
    return () => {
      listeners.delete(setActiveKey)
    }
  }, [])

  useEffect(() => {
    const storedSettings = loadStoredSpeechSettings()
    emitSpeechSettings(storedSettings)
  }, [])

  useEffect(() => {
    speechSettingsListeners.add(setSettings)
    return () => {
      speechSettingsListeners.delete(setSettings)
    }
  }, [])

  useEffect(() => {
    const synth = getSpeechSynthesisSafe()
    if (!synth) return

    const handleVoicesChanged = () => {
      synth.getVoices()
    }

    synth.addEventListener?.('voiceschanged', handleVoicesChanged)
    return () => {
      synth.removeEventListener?.('voiceschanged', handleVoicesChanged)
    }
  }, [])

  const stop = useCallback(() => {
    const synth = getSpeechSynthesisSafe()
    if (!synth) return
    synth.cancel()
    emitSpeechKey(null)
  }, [])

  const speak = useCallback((key: string, text: string, options: SpeakOptions = {}) => {
    const synth = getSpeechSynthesisSafe()
    if (!synth || !text.trim()) return

    if (currentSpeechKey === key && synth.speaking) {
      stop()
      return
    }

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options.lang ?? currentSpeechSettings.accent
    utterance.rate = options.rate ?? currentSpeechSettings.rate
    utterance.pitch = options.pitch ?? 1

    const voice = pickVoice(utterance.lang)
    if (voice) {
      utterance.voice = voice
    }

    utterance.onend = () => {
      emitSpeechKey(null)
    }
    utterance.onerror = () => {
      emitSpeechKey(null)
    }

    emitSpeechKey(key)
    synth.speak(utterance)
  }, [stop])

  const setAccent = useCallback((accent: SpeechAccent) => {
    const nextSettings: SpeechSettings = { ...currentSpeechSettings, accent }
    saveStoredSpeechSettings(nextSettings)
    emitSpeechSettings(nextSettings)
  }, [])

  const setRate = useCallback((rate: number) => {
    const nextSettings: SpeechSettings = { ...currentSpeechSettings, rate: clampRate(rate) }
    saveStoredSpeechSettings(nextSettings)
    emitSpeechSettings(nextSettings)
  }, [])

  return {
    supported,
    activeKey,
    settings,
    speak,
    stop,
    setAccent,
    setRate,
  }
}
