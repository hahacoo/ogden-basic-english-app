import { useEffect, useMemo, useState } from 'react'
import { usePracticeProgress } from '../hooks/usePracticeProgress'
import { buildWordPracticeSet, checkPracticeAnswer, getPracticeQuestionId } from '../utils/practice'
import type { LearningCardData, PracticeQuestion } from '../types/content'

interface WordPracticeSectionProps {
  data: LearningCardData
}

export function WordPracticeSection({ data }: WordPracticeSectionProps) {
  const { recordAnswer } = usePracticeProgress()
  const questions = useMemo(() => buildWordPracticeSet(data), [data])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setAnswers({})
    setSubmitted({})
    setResults({})
  }, [data.item.word])

  function setAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  function submitQuestion(question: PracticeQuestion) {
    const questionId = getPracticeQuestionId(question)
    if (submitted[questionId]) return

    const answer = answers[questionId] || ''
    if (!answer.trim()) return

    const correct = checkPracticeAnswer(question, answer)
    setSubmitted((current) => ({ ...current, [questionId]: true }))
    setResults((current) => ({ ...current, [questionId]: correct }))
    recordAnswer(question, answer, correct)
  }

  return (
    <section className="learning-block word-practice-block">
      <div className="word-practice-head">
        <h3>这个词的专属练习</h3>
        <span className="word-practice-tip">点开单词后，马上练 2 到 3 道相关小题</span>
      </div>

      <div className="word-practice-grid">
        {questions.map((question) => {
          const questionId = getPracticeQuestionId(question)
          const isSubmitted = submitted[questionId]
          const isCorrect = results[questionId]

          return (
            <article key={questionId} className="word-practice-card">
              {question.type === 'zhToEn' && (
                <>
                  <span className="tag tag-operators">看中文说英文</span>
                  <strong>{question.promptZh}</strong>
                  <p>{question.hint}</p>
                  <input
                    className="practice-input"
                    type="text"
                    value={answers[questionId] || ''}
                    onChange={(event) => setAnswer(questionId, event.target.value)}
                    placeholder="输入这个词的英文"
                  />
                </>
              )}

              {question.type === 'phraseFill' && (
                <>
                  <span className="tag tag-phrase">看短语补句子</span>
                  <strong>{question.phrase} · {question.zh}</strong>
                  <p>{question.sentenceZh}</p>
                  <div className="practice-sentence">{question.sentence}</div>
                  <input
                    className="practice-input"
                    type="text"
                    value={answers[questionId] || ''}
                    onChange={(event) => setAnswer(questionId, event.target.value)}
                    placeholder="把短语填进句子"
                  />
                </>
              )}

              {question.type === 'grammarPick' && (
                <>
                  <span className="tag tag-grammar">看句子选语法</span>
                  <strong>{question.sentence}</strong>
                  <p>{question.sentenceZh}</p>
                  <div className="practice-options">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        className={`practice-option ${answers[questionId] === option ? 'active' : ''}`}
                        type="button"
                        onClick={() => setAnswer(questionId, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="practice-actions">
                <button className="secondary-btn" type="button" onClick={() => submitQuestion(question)}>
                  提交答案
                </button>
              </div>

              {isSubmitted && (
                <div className={`practice-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                  <strong>{isCorrect ? '回答正确' : '再记一次'}</strong>
                  <span>正确答案：{question.answer}</span>
                  {question.type === 'grammarPick' && <p>{question.summary}</p>}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
