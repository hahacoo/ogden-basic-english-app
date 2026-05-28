import { heroBadges, quickActions } from '../data/ui'
import { getModeLabel } from '../utils/content'
import type { ModeKey, StudyStats } from '../types/content'

interface HeroProps {
  mode: ModeKey
  studyDateLabel: string
  stats: StudyStats
  onQuickAction: (mode: ModeKey) => void
  onResetToday: () => void
}

export function Hero({ mode, studyDateLabel, stats, onQuickAction, onResetToday }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-main">
          <h1>Ogden Basic English 850</h1>
          <p>面向入门学习者的英语学习应用。首屏优先展示今日学习入口、当前进度和核心模式切换，减少说明堆叠，让移动端打开就能马上开始学。</p>
          <div className="hero-badges">{(heroBadges as string[]).map((badge) => <span key={badge} className="hero-badge">{badge}</span>)}</div>
          <div className="quick-actions">{(quickActions as { key: ModeKey; label: string }[]).map((action) => <button key={action.key} className="quick-btn" type="button" onClick={() => onQuickAction(action.key)}>{action.label}</button>)}</div>
          <div className="hero-note">词表保持 Ogden 原始结构；短语和语法属于学习辅助层，不改动官方 850 词本体。</div>
        </div>
        <aside className="hero-side">
          <div className="hero-side-header">
            <div className="hero-side-meta">
              <h3>今日学习打卡</h3>
              <p className="study-date">{studyDateLabel}</p>
              <p>当前模式：{getModeLabel(mode)}</p>
            </div>
            <button className="secondary-btn" type="button" onClick={onResetToday}>重置今日打卡</button>
          </div>
          <div className="hero-side-stats">
            <div className="hero-stat"><strong>{stats.total}</strong><span>今日总打卡</span></div>
            <div className="hero-stat"><strong>{stats.streak}</strong><span>连续天数</span></div>
            <div className="hero-stat"><strong>{stats.vocab}</strong><span>词表</span></div>
            <div className="hero-stat"><strong>{stats.phrases}</strong><span>短语</span></div>
            <div className="hero-stat optional-mobile"><strong>{stats.grammar}</strong><span>语法</span></div>
          </div>
        </aside>
      </div>
    </section>
  )
}
