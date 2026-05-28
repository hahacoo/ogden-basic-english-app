import type { TabItem } from '../types/content'

interface ToolbarProps {
  mode: 'vocab' | 'phrases' | 'grammar' | 'practice'
  search: string
  placeholder: string
  summaryLabel: string
  resultCount: number
  mainTabs: TabItem[]
  subTabs: TabItem[]
  activeMainKey: string
  activeSubKey: string
  onSearchChange: (value: string) => void
  onMainTabChange: (key: string) => void
  onSubTabChange: (key: string) => void
}

export function Toolbar(props: ToolbarProps) {
  const { mode, search, placeholder, summaryLabel, resultCount, mainTabs, subTabs, activeMainKey, activeSubKey, onSearchChange, onMainTabChange, onSubTabChange } = props
  return (
    <section className="toolbar">
      {mode !== 'practice' && <div className="search-box"><span>搜索</span><input value={search} onChange={(event) => onSearchChange(event.target.value)} type="text" placeholder={placeholder} /></div>}
      {mainTabs.length > 0 && <div className="tab-row">{mainTabs.map((tab) => <button key={tab.key} className={`tab ${tab.key === activeMainKey ? 'active' : ''}`} type="button" onClick={() => onMainTabChange(tab.key)}>{tab.label}</button>)}</div>}
      {subTabs.length > 0 && <div className="subtab-row">{subTabs.map((tab) => <button key={tab.key} className={`subtab ${tab.key === activeSubKey ? 'active' : ''}`} type="button" onClick={() => onSubTabChange(tab.key)}>{tab.label}</button>)}</div>}
      <div className="summary-bar"><div className="summary-pill">{summaryLabel}</div>{mode !== 'practice' && <div className="meta">当前结果：<strong>{resultCount}</strong> 个</div>}</div>
    </section>
  )
}
