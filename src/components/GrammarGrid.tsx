import { SpeakButton } from './SpeakButton'
import { getGrammarItemId, grammarCategoryLabel, tagClass } from '../utils/content'
import type { GrammarLesson } from '../types/content'

interface GrammarGridProps {
  results: GrammarLesson[]
  hasCheckedIn: (type: 'grammar', id: string) => boolean
  onToggleCheckIn: (type: 'grammar', id: string) => void
}

export function GrammarGrid({ results, hasCheckedIn, onToggleCheckIn }: GrammarGridProps) {
  if (!results.length) return <section className="cards"><div className="empty">没有匹配到语法结果，请换个关键词试试。</div></section>
  return <section className="cards">{results.map((item) => { const itemId = getGrammarItemId(item); const checked = hasCheckedIn('grammar', itemId); return <article key={itemId} className="grammar-card"><span className={tagClass('grammar')}>{grammarCategoryLabel(item.category)}</span><h3>{item.title}</h3><div className="grammar-pattern">{item.pattern}</div><p className="grammar-tip">{item.summary}</p><div className="grammar-points">{item.points.map((point) => <div key={point} className="point-box">{point}</div>)}</div><div className="examples">{item.examples.map((example) => <div key={`${item.title}-${example.en}`} className="example-box"><div className="example-head"><span className="example-en">{example.en}</span><SpeakButton text={example.en} speechKey={`grammar-example:${item.title}:${example.en}`} label="例句发音" className="small" /></div><span className="example-zh">{example.zh}</span></div>)}</div><div className="card-actions"><button className={`checkin-btn ${checked ? 'done' : ''}`} type="button" onClick={() => onToggleCheckIn('grammar', itemId)}>{checked ? '取消今日打卡' : '加入今日打卡'}</button></div></article>})}</section>
}
