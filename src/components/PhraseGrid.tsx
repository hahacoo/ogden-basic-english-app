import { SpeakButton } from './SpeakButton'
import { getPhraseItemId, phraseCategoryLabel, tagClass } from '../utils/content'
import type { PhraseItem } from '../types/content'

interface PhraseGridProps {
  results: PhraseItem[]
  hasCheckedIn: (type: 'phrases', id: string) => boolean
  onToggleCheckIn: (type: 'phrases', id: string) => void
}

export function PhraseGrid({ results, hasCheckedIn, onToggleCheckIn }: PhraseGridProps) {
  if (!results.length) return <section className="cards"><div className="empty">没有匹配到短语结果，请换个词再试。</div></section>
  return <section className="cards">{results.map((item) => { const itemId = getPhraseItemId(item); const checked = hasCheckedIn('phrases', itemId); return <article key={itemId} className="phrase-card"><span className={tagClass('phrase')}>{phraseCategoryLabel(item.category)}</span><div className="title-row"><div className="phrase-title">{item.phrase}</div><SpeakButton text={item.phrase} speechKey={`phrase:${item.phrase}`} label="发音" /></div><div className="phrase-zh">{item.zh}</div><p className="phrase-note">{item.usage}</p><div className="example-box"><div className="example-head"><span className="example-en">{item.exampleEn}</span><SpeakButton text={item.exampleEn} speechKey={`phrase-example:${item.phrase}`} label="例句发音" className="small" /></div><span className="example-zh">{item.exampleZh}</span></div><div className="card-actions"><button className={`checkin-btn ${checked ? 'done' : ''}`} type="button" onClick={() => onToggleCheckIn('phrases', itemId)}>{checked ? '取消今日打卡' : '加入今日打卡'}</button></div></article>})}</section>
}
