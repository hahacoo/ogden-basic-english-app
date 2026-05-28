// @ts-nocheck

export const heroBadges = ['850 官方词表', '24 高频短语', '12 语法卡片', '3 种轻量练习']

export const quickActions = [
  { key: 'vocab', label: '继续背词' },
  { key: 'phrases', label: '刷短语' },
  { key: 'grammar', label: '学语法' },
  { key: 'practice', label: '做练习' },
]

export const notesSections = [
  {
    title: '短语模块怎么学',
    items: [
      '先看中文含义，再朗读英文短语，最后看例句理解语境。',
      '优先掌握和 operators 相关的搭配，比如 make up、go on、come back。',
      '短语搜索支持英文和中文关键词，适合按场景回看。',
    ],
  },
  {
    title: '语法模块怎么学',
    items: [
      '每张卡片都给出一个核心结构，先记模板再记例句。',
      'Basic English 重视简单结构反复复用，不追求一次记太多变体。',
      '建议配合词表里的 operators 一起看，理解 Basic English 的表达方式。',
    ],
  },
  {
    title: '练习模块怎么用',
    items: [
      '先做“看中文说英文”，把词和短语从识别记忆切到主动输出。',
      '再做“看短语补句子”，练短语放进语境的能力。',
      '最后做“看句子选语法”，把句型和语法点快速连起来。',
    ],
  },
]

export const modeTabs = [
              { key: 'vocab', label: '词表学习' },
              { key: 'phrases', label: '短语学习' },
              { key: 'grammar', label: '语法讲解' },
              { key: 'practice', label: '轻量练习' }
          ];

export const vocabMainTabs = [
              { key: 'all', label: '全部 850' },
              { key: 'things', label: 'Things 600' },
              { key: 'qualities', label: 'Qualities 150' },
              { key: 'operators', label: 'Operators 100' }
          ];

export const vocabSubTabs = {
              all: [],
              things: [
                  { key: 'all', label: '全部 things' },
                  { key: 'thingsGeneral', label: 'General 400' },
                  { key: 'thingsPicturable', label: 'Picturable 200' }
              ],
              qualities: [
                  { key: 'all', label: '全部 qualities' },
                  { key: 'qualitiesGeneral', label: 'General 100' },
                  { key: 'qualitiesOpposites', label: 'Opposites 50' }
              ],
              operators: [
                  { key: 'all', label: '官方 100 operators' }
              ]
          };

export const phraseTabs = [
              { key: 'all', label: '全部短语' },
              { key: 'daily', label: '日常交流' },
              { key: 'study', label: '学习场景' },
              { key: 'classroom', label: '课堂表达' },
              { key: 'operators', label: 'Operator 搭配' },
              { key: 'time', label: '时间表达' },
              { key: 'space', label: '空间表达' },
              { key: 'linking', label: '连接表达' },
              { key: 'social', label: '社交参与' }
          ];

export const grammarTabs = [
              { key: 'all', label: '全部语法' },
              { key: 'core', label: '核心思路' },
              { key: 'tense', label: '时态' },
              { key: 'sentence', label: '句型' },
              { key: 'quality', label: '词形与修饰' },
              { key: 'form', label: '构词规则' }
          ];

export const practiceTabs = [
              { key: 'zhToEn', label: '看中文说英文' },
              { key: 'phraseFill', label: '看短语补句子' },
              { key: 'grammarPick', label: '看句子选语法' }
          ];
