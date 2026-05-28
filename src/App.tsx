import { useMemo, useState } from 'react'
import { grammarTabs, phraseTabs, vocabMainTabs, vocabSubTabs } from './data/ui'
import { GrammarGrid } from './components/GrammarGrid'
import { Hero } from './components/Hero'
import { ModeTabs } from './components/ModeTabs'
import { NotesSection } from './components/NotesSection'
import { PhraseGrid } from './components/PhraseGrid'
import { PracticePanel } from './components/PracticePanel'
import { SpeechSettingsPanel } from './components/SpeechSettingsPanel'
import { Toolbar } from './components/Toolbar'
import { VocabGrid } from './components/VocabGrid'
import { useStudyProgress } from './hooks/useStudyProgress'
import './styles/app.css'
import { buildLearningCardData, getGrammarResults, getPhraseResults, getSummaryConfig, getVocabResults } from './utils/content'
import type { ModeKey } from './types/content'

function App() {
  const [mode, setMode] = useState<ModeKey>('vocab')
  const [search, setSearch] = useState('')
  const [vocabMain, setVocabMain] = useState('all')
  const [vocabSub, setVocabSub] = useState('all')
  const [phraseCategory, setPhraseCategory] = useState('all')
  const [grammarCategory, setGrammarCategory] = useState('all')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const { stats, studyDateLabel, hasCheckedIn, toggleCheckedIn, resetTodayProgress } = useStudyProgress()

  const vocabResults = useMemo(() => getVocabResults({ vocabMain, vocabSub, keyword: search }), [vocabMain, vocabSub, search])
  const phraseResults = useMemo(() => getPhraseResults({ category: phraseCategory, keyword: search }), [phraseCategory, search])
  const grammarResults = useMemo(() => getGrammarResults({ category: grammarCategory, keyword: search }), [grammarCategory, search])

  const selectedItem = useMemo(() => vocabResults.find((item) => item.word === selectedWord) || null, [selectedWord, vocabResults])
  const learningCardData = useMemo(() => (mode === 'vocab' && selectedItem ? buildLearningCardData(selectedItem) : null), [mode, selectedItem])

  const currentCount = mode === 'vocab' ? vocabResults.length : mode === 'phrases' ? phraseResults.length : mode === 'grammar' ? grammarResults.length : 3
  const summary = getSummaryConfig(mode, { vocabMain, vocabSub, phraseCategory, grammarCategory }, currentCount)
  const mainTabs = mode === 'vocab' ? (vocabMainTabs as { key: string; label: string }[]) : mode === 'phrases' ? (phraseTabs as { key: string; label: string }[]) : mode === 'grammar' ? (grammarTabs as { key: string; label: string }[]) : []
  const subTabs = mode === 'vocab' ? ((vocabSubTabs as Record<string, { key: string; label: string }[]>)[vocabMain] || []) : []
  const activeMainKey = mode === 'vocab' ? vocabMain : mode === 'phrases' ? phraseCategory : mode === 'grammar' ? grammarCategory : ''
  const activeSubKey = mode === 'vocab' ? vocabSub : ''

  function switchMode(nextMode: ModeKey) {
    setMode(nextMode)
    setSearch('')
  }

  function handleMainTabChange(key: string) {
    if (mode === 'vocab') {
      setVocabMain(key)
      setVocabSub('all')
      return
    }
    if (mode === 'phrases') {
      setPhraseCategory(key)
      return
    }
    setGrammarCategory(key)
  }

  function handleSubTabChange(key: string) {
    setVocabSub(key)
  }

  function handleResetToday() {
    if (!window.confirm('确认要清空今天的打卡记录吗？')) return
    resetTodayProgress()
  }

  function handleSelectWord(word: string) {
    setSelectedWord((current) => (current === word ? null : word))
  }

  return (
    <div className="container">
      <Hero mode={mode} studyDateLabel={studyDateLabel} stats={stats} onQuickAction={switchMode} onResetToday={handleResetToday} />
      <SpeechSettingsPanel />
      <ModeTabs mode={mode} onChange={switchMode} />
      <Toolbar
        mode={mode}
        search={search}
        placeholder={summary.placeholder}
        summaryLabel={summary.label}
        resultCount={summary.count}
        mainTabs={mainTabs}
        subTabs={subTabs}
        activeMainKey={activeMainKey}
        activeSubKey={activeSubKey}
        onSearchChange={setSearch}
        onMainTabChange={handleMainTabChange}
        onSubTabChange={handleSubTabChange}
      />
      {mode === 'vocab' && <VocabGrid results={vocabResults} selectedWord={selectedWord} learningCardData={learningCardData} hasCheckedIn={hasCheckedIn} onSelectWord={handleSelectWord} onToggleCheckIn={toggleCheckedIn} />}
      {mode === 'phrases' && <PhraseGrid results={phraseResults} hasCheckedIn={hasCheckedIn} onToggleCheckIn={toggleCheckedIn} />}
      {mode === 'grammar' && <GrammarGrid results={grammarResults} hasCheckedIn={hasCheckedIn} onToggleCheckIn={toggleCheckedIn} />}
      {mode === 'practice' && <PracticePanel />}
      <NotesSection />
    </div>
  )
}

export default App
