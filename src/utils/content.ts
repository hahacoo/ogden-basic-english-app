import { allWords, vocabTranslations } from '../data/words'
import { phrases } from '../data/phrases'
import { grammarByTitle, grammarLessons } from '../data/grammar'
import { wordLearningLinks } from '../data/learning'
import type { ExampleItem, GrammarLesson, LearningCardData, ModeKey, PhraseItem, VocabItem } from '../types/content'

export function getModeLabel(mode: ModeKey) {
  const labels: Record<ModeKey, string> = {
    vocab: '词表学习',
    phrases: '短语学习',
    grammar: '语法讲解',
    practice: '轻量练习',
  }
  return labels[mode]
}

export function getVocabZh(word: string) {
  return (vocabTranslations as Record<string, string>)[word] || '待补充'
}

export function getVocabItemId(item: VocabItem) {
  return `${item.type}:${item.subgroup}:${item.word}`
}

export function getPhraseItemId(item: PhraseItem) {
  return item.phrase
}

export function getGrammarItemId(item: GrammarLesson) {
  return item.title
}

export function tagClass(type: VocabItem['type'] | 'phrase' | 'grammar') {
  if (type === 'things') return 'tag tag-things'
  if (type === 'qualities') return 'tag tag-qualities'
  if (type === 'phrase') return 'tag tag-phrase'
  if (type === 'grammar') return 'tag tag-grammar'
  return 'tag tag-operators'
}

export function vocabTypeLabel(type: VocabItem['type'], subgroup: string) {
  if (type === 'things' && subgroup === 'thingsGeneral') return 'Thing · General'
  if (type === 'things' && subgroup === 'thingsPicturable') return 'Thing · Picturable'
  if (type === 'qualities' && subgroup === 'qualitiesGeneral') return 'Quality · General'
  if (type === 'qualities' && subgroup === 'qualitiesOpposites') return 'Quality · Opposite'
  return 'Operator'
}

export function phraseCategoryLabel(category: string) {
  const map: Record<string, string> = {
    daily: '日常交流',
    study: '学习场景',
    classroom: '课堂表达',
    operators: 'Operator 搭配',
    time: '时间表达',
    space: '空间表达',
    linking: '连接表达',
    social: '社交参与',
  }
  return map[category] || '短语'
}

export function grammarCategoryLabel(category: string) {
  const map: Record<string, string> = {
    core: '核心思路',
    tense: '时态',
    sentence: '句型',
    quality: '词形与修饰',
    form: '构词规则',
  }
  return map[category] || '语法'
}

function tokenizeLower(text: string) {
  return String(text).toLowerCase().split(/[^a-z/]+/).filter(Boolean)
}

function includesWordToken(text: string, word: string) {
  const target = word.toLowerCase()
  return tokenizeLower(text).some((token) => token === target || token.split('/').includes(target))
}

function uniqueBy<T>(list: T[], keyFn: (item: T) => string) {
  const seen = new Set<string>()
  return list.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getWordLearningConfig(word: string) {
  return (wordLearningLinks as Record<string, { phrases?: string[]; grammar?: string[]; examples?: ExampleItem[] }>)[word.toLowerCase()] || {}
}

function getFallbackGrammarTitles(item: VocabItem) {
  if (item.type === 'operators') {
    if (['will'].includes(item.word.toLowerCase())) return ['一般将来时', '18 个核心 operators', '用简单结构代替复杂动词']
    if (['do', 'not', 'no'].includes(item.word.toLowerCase())) return ['否定句', '一般疑问句', '18 个核心 operators']
    if (['how', 'when', 'where', 'why', 'who'].includes(item.word.toLowerCase())) return ['特殊疑问句', '一般疑问句']
    if (['in', 'on', 'at', 'under', 'over', 'between', 'through', 'across'].includes(item.word.toLowerCase())) return ['介词表达位置和方向', '一般现在时']
    return ['18 个核心 operators', '用简单结构代替复杂动词', '一般现在时']
  }
  if (item.type === 'qualities') return ['比较级和最高级', '副词和 -ly', '一般现在时']
  if (item.subgroup === 'thingsPicturable') return ['名词复数', '介词表达位置和方向', '一般现在时']
  return ['名词复数', '一般现在时', '否定句']
}

export function getRelatedPhrases(word: string): PhraseItem[] {
  const config = getWordLearningConfig(word)
  const manual = (config.phrases || [])
    .map((phrase) => (phrases as PhraseItem[]).find((item) => item.phrase === phrase))
    .filter(Boolean) as PhraseItem[]
  const auto = (phrases as PhraseItem[]).filter((item) => includesWordToken(item.phrase, word) || includesWordToken(item.exampleEn, word))
  return uniqueBy([...manual, ...auto], (item) => item.phrase).slice(0, 4)
}

export function getRelatedGrammar(item: VocabItem): GrammarLesson[] {
  const config = getWordLearningConfig(item.word)
  const titles = [...(config.grammar || []), ...getFallbackGrammarTitles(item)]
  return uniqueBy(
    titles.map((title) => (grammarByTitle as Record<string, GrammarLesson>)[title]).filter(Boolean),
    (lesson) => lesson.title,
  ).slice(0, 3)
}

function getFallbackExamples(item: VocabItem): ExampleItem[] {
  if (item.type === 'operators') {
    return [
      { en: `I use "${item.word}" in a short sentence.`, zh: `我把 ${item.word} 放进一个短句里。`, tag: '记忆提示' },
      { en: `This lesson gives a clear example with "${item.word}".`, zh: `这节课用 ${item.word} 给了一个清楚的例子。`, tag: '学习语境' },
    ]
  }
  if (item.type === 'qualities') {
    return [
      { en: `The word is ${item.word}.`, zh: `这个词是 ${getVocabZh(item.word)}的。`, tag: '最短句' },
      { en: `It is easy to use ${item.word} in a simple sentence.`, zh: `把 ${item.word} 放进简单句里很容易。`, tag: '记忆提示' },
    ]
  }
  if (item.subgroup === 'thingsPicturable') {
    return [
      { en: `This is a ${item.word}.`, zh: `这是一个${getVocabZh(item.word)}。`, tag: '最短句' },
      { en: `The ${item.word} is in the room.`, zh: `${getVocabZh(item.word)}在房间里。`, tag: '位置句' },
    ]
  }
  return [
    { en: `We talk about ${item.word} in this lesson.`, zh: `这节课里我们会谈到${getVocabZh(item.word)}。`, tag: '学习语境' },
    { en: `${item.word} is important in daily English.`, zh: `${getVocabZh(item.word)}在日常英语里很重要。`, tag: '记忆提示' },
  ]
}

export function buildLearningCardData(item: VocabItem): LearningCardData {
  const relatedPhrases = getRelatedPhrases(item.word)
  const relatedGrammar = getRelatedGrammar(item)
  const config = getWordLearningConfig(item.word)
  const examples = uniqueBy(
    [
      ...((config.examples || []) as ExampleItem[]),
      ...relatedPhrases.map((phrase) => ({ en: phrase.exampleEn, zh: phrase.exampleZh, tag: '相关短语' })),
      ...relatedGrammar
        .flatMap((grammar) => grammar.examples.map((example) => ({ ...example, tag: grammar.title })))
        .filter((example) => includesWordToken(example.en, item.word)),
      ...getFallbackExamples(item),
    ],
    (example) => example.en,
  ).slice(0, 4)

  const intro = item.type === 'operators'
    ? '先把这个 operator 放进高频结构里，再用一个相关短语和一个短句去记。'
    : item.type === 'qualities'
      ? '先用 be + 这个词做描述，再去看比较或修饰用法。'
      : '先记这个词的中文，再借助短语和例句把它放进一个具体语境里。'

  return {
    item,
    intro,
    route: [
      `词义：${getVocabZh(item.word)}`,
      relatedPhrases[0] ? `搭配：${relatedPhrases[0].phrase}` : `搭配：先用 ${item.word} 造最短句`,
      relatedGrammar[0] ? `语法：${relatedGrammar[0].title}` : '语法：先记一般现在时',
      '输出：先读句子，再替换主语或宾语',
    ],
    relatedPhrases,
    relatedGrammar,
    examples,
  }
}

export function getWordMeta(item: VocabItem) {
  if (item.type === 'operators') return '功能词 / 操作词'
  if (item.subgroup === 'thingsPicturable') return '可直观指认的具体事物'
  if (item.subgroup === 'qualitiesOpposites') return '对立性质词'
  return 'Ogden 官方词项'
}

export function getVocabResults(options: { vocabMain: string; vocabSub: string; keyword: string }) {
  const keyword = options.keyword.trim().toLowerCase()
  return (allWords as VocabItem[]).filter((item) => {
    const mainMatch = options.vocabMain === 'all' || item.type === options.vocabMain
    const subMatch = options.vocabSub === 'all' || item.subgroup === options.vocabSub
    const keywordMatch = !keyword || item.word.toLowerCase().includes(keyword)
    return mainMatch && subMatch && keywordMatch
  })
}

export function getPhraseResults(options: { category: string; keyword: string }) {
  const keyword = options.keyword.trim().toLowerCase()
  return (phrases as PhraseItem[]).filter((item) => {
    const categoryMatch = options.category === 'all' || item.category === options.category
    const keywordMatch = !keyword || [item.phrase, item.zh, item.usage, item.exampleEn, item.exampleZh].join(' ').toLowerCase().includes(keyword)
    return categoryMatch && keywordMatch
  })
}

export function getGrammarResults(options: { category: string; keyword: string }) {
  const keyword = options.keyword.trim().toLowerCase()
  return (grammarLessons as GrammarLesson[]).filter((item) => {
    const categoryMatch = options.category === 'all' || item.category === options.category
    const bundle = [item.title, item.pattern, item.summary, ...item.points, ...item.examples.map((example) => `${example.en} ${example.zh}`)].join(' ').toLowerCase()
    return categoryMatch && (!keyword || bundle.includes(keyword))
  })
}

export function getSummaryConfig(mode: ModeKey, state: { vocabMain: string; vocabSub: string; phraseCategory: string; grammarCategory: string }, count: number) {
  if (mode === 'vocab') {
    const labels: Record<string, string> = {
      all: '显示全部官方 850 词',
      things: '显示 600 个 things',
      qualities: '显示 150 个 qualities',
      operators: '显示 100 个 operators',
      thingsGeneral: '显示 400 个 general things',
      thingsPicturable: '显示 200 个 picturable things',
      qualitiesGeneral: '显示 100 个 general qualities',
      qualitiesOpposites: '显示 50 个 opposite qualities',
    }
    return { label: labels[state.vocabSub] || labels[state.vocabMain], count, placeholder: '输入词汇，例如 make / harbour / opposite' }
  }
  if (mode === 'phrases') {
    return {
      label: state.phraseCategory === 'all' ? '显示全部短语' : `显示 ${phraseCategoryLabel(state.phraseCategory)} 短语`,
      count,
      placeholder: '输入短语、中文或例句关键词',
    }
  }
  if (mode === 'practice') {
    return {
      label: '当前模式为轻量练习',
      count,
      placeholder: '练习模式不需要搜索',
    }
  }
  return {
    label: state.grammarCategory === 'all' ? '显示全部语法卡片' : `显示 ${grammarCategoryLabel(state.grammarCategory)} 语法`,
    count,
    placeholder: '输入语法点、结构或例句关键词',
  }
}
