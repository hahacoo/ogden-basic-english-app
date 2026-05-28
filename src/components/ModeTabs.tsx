import { modeTabs } from '../data/ui'
import type { ModeKey } from '../types/content'

interface ModeTabsProps {
  mode: ModeKey
  onChange: (mode: ModeKey) => void
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <section className="mode-nav">
      {(modeTabs as { key: ModeKey; label: string }[]).map((tab) => (
        <button key={tab.key} className={`mode-btn ${tab.key === mode ? 'active' : ''}`} type="button" onClick={() => onChange(tab.key)}>{tab.label}</button>
      ))}
    </section>
  )
}
