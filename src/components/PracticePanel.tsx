import { useEffect, useMemo, useState } from 'react'
import { practiceTabs } from '../data/ui'
import { usePracticeProgress } from '../hooks/usePracticeProgress'
import { buildPracticeQuestion, checkPracticeAnswer } from '../utils/practice'
import type { PracticeQuestion, PracticeType } from '../types/content'

export function PracticePanel() {
  const [practiceType, setPracticeType] = useState<PracticeType>('zhToEn')
  const [refreshKey, setRefreshKey] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const {
    stats,
    recent,
    mistakes,
    accuracy,
    recordAnswer,
    clearMistake,
    clearAllMistakes,
    resetPracticeHistory,
  } = usePracticeProgress()

  const question = useMemo<PracticeQuestion>(() => buildPracticeQuestion(practiceType), [practiceType, refreshKey])

  useEffect(() => {
    setInputValue('')
    setSelectedOption('')
    setSubmitted(false)
    setIsCorrect(false)
  }, [question])

  function nextQuestion(nextType = practiceType) {
    if (nextType !== practiceType) {
      setPracticeType(nextType)
      return
    }
    setRefreshKey((current) => current + 1)
  }

  function submitAnswer() {
    if (submitted) return

    const answer = question.type === 'grammarPick' ? selectedOption : inputValue
    if (!answer.trim()) return

    const correct = checkPracticeAnswer(question, answer)
    setSubmitted(true)
    setIsCorrect(correct)
    recordAnswer(question, answer, correct)
  }

  return (
    <section className="practice-panel panel">
      <div className="practice-header">
        <div>
          <span className="learning-kicker">轻量练习</span>
          <h3>看中文说英文、看短语补句子、看句子选语法</h3>
          <p className="practice-intro">每次只做一题，马上判断，适合把刚学过的词、短语和语法迅速从“认识”切到“会用”。</p>
        </div>
        <div className="practice-stats">
          <div className="practice-stat">
            <strong>{stats.correct}</strong>
            <span>答对</span>
          </div>
          <div className="practice-stat">
            <strong>{stats.total}</strong>
            <span>总题数</span>
          </div>
          <div className="practice-stat">
            <strong>{accuracy}%</strong>
            <span>正确率</span>
          </div>
        </div>
      </div>

      <div className="practice-tabs">
        {(practiceTabs as { key: PracticeType; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            className={`subtab ${tab.key === practiceType ? 'active' : ''}`}
            type="button"
            onClick={() => nextQuestion(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="practice-card">
        {question.type === 'zhToEn' && (
          <>
            <div className="practice-prompt">
              <span className="tag tag-operators">看中文说英文</span>
              <strong>{question.promptZh}</strong>
              <p>{question.meta}。{question.hint}</p>
            </div>
            <input
              className="practice-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="输入你想到的英文"
            />
          </>
        )}

        {question.type === 'phraseFill' && (
          <>
            <div className="practice-prompt">
              <span className="tag tag-phrase">看短语补句子</span>
              <strong>{question.phrase} · {question.zh}</strong>
              <p>{question.sentenceZh}</p>
            </div>
            <div className="practice-sentence">{question.sentence}</div>
            <input
              className="practice-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="把短语填进句子"
            />
          </>
        )}

        {question.type === 'grammarPick' && (
          <>
            <div className="practice-prompt">
              <span className="tag tag-grammar">看句子选语法</span>
              <strong>{question.sentence}</strong>
              <p>{question.sentenceZh}</p>
            </div>
            <div className="practice-options">
              {question.options.map((option) => (
                <button
                  key={option}
                  className={`practice-option ${selectedOption === option ? 'active' : ''}`}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="practice-actions">
          <button className="secondary-btn" type="button" onClick={submitAnswer}>
            提交答案
          </button>
          <button className="checkin-btn" type="button" onClick={() => nextQuestion()}>
            换一题
          </button>
          <button className="secondary-btn" type="button" onClick={resetPracticeHistory}>
            清空练习记录
          </button>
        </div>

        {submitted && (
          <div className={`practice-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            <strong>{isCorrect ? '回答正确' : '这题答错了'}</strong>
            <span>
              正确答案：
              {question.answer}
            </span>
            {question.type === 'grammarPick' && <p>{question.summary}</p>}
          </div>
        )}
      </div>

      <div className="practice-history-grid">
        <section className="practice-history-card">
          <div className="practice-history-head">
            <h4>错题本</h4>
            {mistakes.length > 0 && (
              <button className="history-link" type="button" onClick={clearAllMistakes}>
                清空错题
              </button>
            )}
          </div>
          {mistakes.length === 0 && <p className="history-empty">当前没有错题，继续保持。</p>}
          {mistakes.slice(0, 8).map((item) => (
            <article key={item.id} className="history-item">
              <div className="history-item-head">
                <strong>{item.prompt}</strong>
                <button className="history-link" type="button" onClick={() => clearMistake(item.id)}>
                  移出错题本
                </button>
              </div>
              <span>正确答案：{item.answer}</span>
              <span>你的答案：{item.lastUserAnswer || '未作答'}</span>
              <span>错题次数：{item.wrongCount}</span>
              {item.explanation && <p>{item.explanation}</p>}
            </article>
          ))}
        </section>

        <section className="practice-history-card">
          <div className="practice-history-head">
            <h4>最近练习</h4>
          </div>
          {recent.length === 0 && <p className="history-empty">还没有练习记录，先做一题试试。</p>}
          {recent.slice(0, 8).map((item) => (
            <article key={`${item.id}-${item.updatedAt}`} className="history-item">
              <div className="history-item-head">
                <strong>{item.prompt}</strong>
                <span className={`history-badge ${item.isCorrect ? 'correct' : 'wrong'}`}>
                  {item.isCorrect ? '答对' : '答错'}
                </span>
              </div>
              <span>你的答案：{item.userAnswer}</span>
              <span>正确答案：{item.answer}</span>
              {item.explanation && <p>{item.explanation}</p>}
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}
