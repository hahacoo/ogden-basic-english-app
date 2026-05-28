import { Fragment } from 'react'
import { LearningCard } from './LearningCard'
import { SpeakButton } from './SpeakButton'
import { getVocabItemId, getVocabZh, getWordMeta, tagClass, vocabTypeLabel } from '../utils/content'
import type { LearningCardData, VocabItem } from '../types/content'

interface VocabGridProps {
  results: VocabItem[]
  selectedWord: string | null
  learningCardData: LearningCardData | null
  hasCheckedIn: (type: 'vocab', id: string) => boolean
  onSelectWord: (word: string) => void
  onToggleCheckIn: (type: 'vocab', id: string) => void
}

export function VocabGrid({ results, selectedWord, learningCardData, hasCheckedIn, onSelectWord, onToggleCheckIn }: VocabGridProps) {
  if (!results.length) return <section className="cards"><div className="empty">没有匹配到词汇结果，请换个关键词试试。</div></section>
  return <section className="cards">{results.map((item) => { const itemId = getVocabItemId(item); const active = selectedWord === item.word; const checked = hasCheckedIn('vocab', itemId); return <Fragment key={itemId}><article className={`word-card ${active ? 'is-selected' : ''}`}><span className={tagClass(item.type)}>{vocabTypeLabel(item.type, item.subgroup)}</span><div className="title-row"><div className="word">{item.word}</div><SpeakButton text={item.word} speechKey={`word:${item.word}`} label="发音" /></div><div className="word-zh">{getVocabZh(item.word)}</div><p className="meta">{getWordMeta(item)}</p><div className="card-actions"><button className={`secondary-btn learn-btn ${active ? 'active' : ''}`} type="button" onClick={() => onSelectWord(item.word)}>{active ? '收起学习卡' : '展开学习卡'}</button><button className={`checkin-btn ${checked ? 'done' : ''}`} type="button" onClick={() => onToggleCheckIn('vocab', itemId)}>{checked ? '取消今日打卡' : '加入今日打卡'}</button></div></article>{active && learningCardData && <div className="inline-learning-card-wrap"><LearningCard data={learningCardData} inline /></div>}</Fragment>})}</section>
}
