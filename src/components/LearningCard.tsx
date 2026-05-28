import { getVocabZh } from '../utils/content'
import { SpeakButton } from './SpeakButton'
import { WordPracticeSection } from './WordPracticeSection'
import type { LearningCardData } from '../types/content'

interface LearningCardProps {
  data: LearningCardData | null
  inline?: boolean
}

export function LearningCard({ data, inline = false }: LearningCardProps) {
  if (!data) {
    return <section className="learning-card panel"><div className="learning-card-title"><span className="learning-kicker">单词学习卡</span><div className="learning-word"><strong>点一个单词</strong><span>把词义、短语、语法和例句串起来</span></div><p className="learning-intro">先在下方词表里点击“展开学习卡”，页面会展示这个词的常见搭配、适合记忆的语法模板，以及能直接拿来复用的短句语境。</p></div></section>
  }
  return (
    <section className={`learning-card panel ${inline ? 'inline' : ''}`}>
      <div className="learning-card-header">
        <div className="learning-card-title"><span className="learning-kicker">单词学习卡</span><div className="learning-word"><strong>{data.item.word}</strong><span>{getVocabZh(data.item.word)}</span><SpeakButton text={data.item.word} speechKey={`learning-word:${data.item.word}`} label="单词发音" /></div><p className="learning-intro">{data.intro}</p></div>
        <div className="learning-route">{data.route.map((step) => <span key={step} className="route-chip">{step}</span>)}</div>
      </div>
      <div className="learning-grid">
        <div className="learning-column">
          <section className="learning-block"><h3>相关短语</h3><div className="learning-list">{data.relatedPhrases.length ? data.relatedPhrases.map((phrase) => <div key={phrase.phrase} className="learning-item"><div className="title-row"><strong>{phrase.phrase} · {phrase.zh}</strong><SpeakButton text={phrase.phrase} speechKey={`learning-phrase:${data.item.word}:${phrase.phrase}`} label="发音" className="small" /></div><span>{phrase.usage}</span><div className="example-head"><p>{phrase.exampleEn}</p><SpeakButton text={phrase.exampleEn} speechKey={`learning-phrase-example:${data.item.word}:${phrase.phrase}`} label="例句发音" className="small" /></div></div>) : <div className="learning-item"><strong>暂无直接短语</strong><span>可以先用这个词做一个最短句，再结合下方语法模板扩展。</span></div>}</div></section>
          <section className="learning-block"><h3>相关语法</h3><div className="learning-list">{data.relatedGrammar.map((grammar) => <div key={grammar.title} className="learning-item"><strong>{grammar.title}</strong><span>{grammar.pattern}</span><p>{grammar.summary}</p></div>)}</div></section>
        </div>
        <div className="learning-column">
          <section className="learning-block"><h3>例句语境</h3><div className="learning-list">{data.examples.map((example) => <div key={`${example.tag}-${example.en}`} className="sentence-card"><div className="example-head"><span className="sentence-tag">{example.tag || '例句'}</span><SpeakButton text={example.en} speechKey={`learning-example:${data.item.word}:${example.en}`} label="例句发音" className="small" /></div><span className="sentence-en">{example.en}</span><span className="sentence-zh">{example.zh}</span></div>)}</div></section>
          <section className="learning-block"><h3>怎么记更快</h3><div className="learning-list"><div className="learning-item"><strong>先读最短句</strong><span>先把 {data.item.word} 放进一句最短、最容易开口的句子里。</span></div><div className="learning-item"><strong>再替换场景</strong><span>把上面的句子改成学校、日常或时间场景，形成第二次记忆。</span></div><div className="learning-item"><strong>最后口头输出</strong><span>遮住中文，自己说出英文句子，再把主语或宾语换一个词。</span></div></div></section>
        </div>
      </div>
      <WordPracticeSection data={data} />
    </section>
  )
}
