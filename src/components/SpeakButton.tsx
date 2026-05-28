import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

interface SpeakButtonProps {
  text: string
  speechKey: string
  label?: string
  className?: string
  lang?: string
}

export function SpeakButton({
  text,
  speechKey,
  label = '发音',
  className = '',
  lang,
}: SpeakButtonProps) {
  const { supported, activeKey, speak } = useSpeechSynthesis()

  if (!supported) return null

  const isActive = activeKey === speechKey

  return (
    <button
      className={`speak-btn ${isActive ? 'active' : ''} ${className}`.trim()}
      type="button"
      onClick={() => speak(speechKey, text, lang ? { lang } : undefined)}
      aria-label={`${label}: ${text}`}
      title={isActive ? '停止发音' : `${label}: ${text}`}
    >
      {isActive ? '停止' : label}
    </button>
  )
}
