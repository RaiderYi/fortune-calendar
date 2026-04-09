export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  author: string;
  keywords: string[];
  sections: BlogSection[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'what-your-day-master-means',
    title: 'What Your Core Element Really Means',
    description:
      'Learn how your Day Master points to your natural style, strengths, and the kinds of decisions that feel most aligned.',
    publishedAt: '2026-04-09',
    readingTime: '6 min read',
    category: 'Core Elements',
    author: 'MysticEast',
    keywords: ['BaZi', 'Day Master', 'core element', 'five elements'],
    sections: [
      {
        paragraphs: [
          'Your Core Element is one of the clearest starting points in a BaZi reading. It describes the quality of energy that sits closest to your sense of self: how you respond under pressure, how you make decisions, and what tends to restore your confidence.',
          'At MysticEast, we treat this as pattern recognition rather than a fixed label. Your chart does not trap you inside one personality. Instead, it helps you see where your natural style is strongest and where balance creates better outcomes.',
        ],
      },
      {
        heading: 'Think of it as your default operating style',
        paragraphs: [
          'A Wood person may grow through vision and expansion. A Fire person may lead through warmth and visibility. An Earth person often stabilizes. A Metal person clarifies and refines. A Water person adapts, connects, and senses the hidden pattern beneath the surface.',
          'This is useful because many people try to solve life with strategies that do not match their own energy. When your choices match your natural style, progress usually feels cleaner and more sustainable.',
        ],
      },
      {
        heading: 'How to use this insight in daily life',
        paragraphs: [
          'Start by noticing what kind of work, relationships, and environments bring out your best energy. Then look at where stress causes you to overuse your strengths. The same quality that makes you effective can also become your blind spot if it is pushed too far.',
        ],
        bullets: [
          'Notice when your strength becomes overcompensation.',
          'Choose routines that support your natural energy instead of fighting it.',
          'Use your chart as a guide for reflection, not as a rigid rulebook.',
        ],
      },
      {
        heading: 'The best next step',
        paragraphs: [
          'If you have already used the free calculator, read your result slowly and focus on one sentence that feels immediately true. Then test one practical change for the coming week. The goal is not to memorize astrology language. The goal is to understand yourself with more honesty and less friction.',
        ],
      },
    ],
  },
  {
    slug: 'bazi-pattern-recognition-not-fortune-telling',
    title: 'BaZi as Pattern Recognition, Not Fortune-Telling',
    description:
      'A grounded explanation of how BaZi can support clarity and self-understanding without fatalism or magical promises.',
    publishedAt: '2026-04-09',
    readingTime: '7 min read',
    category: 'Philosophy',
    author: 'MysticEast',
    keywords: ['BaZi meaning', 'pattern recognition', 'fortune telling', 'Chinese astrology'],
    sections: [
      {
        paragraphs: [
          'Many people first encounter BaZi through dramatic language about destiny. That framing can make the practice sound fixed, superstitious, or disempowering. We do not see it that way.',
          'BaZi is better understood as a pattern recognition system. It maps the qualities present at your birth and helps you notice recurring tendencies in energy, timing, behavior, and life transitions. That gives you a clearer lens for decision-making, not a script that removes your agency.',
        ],
      },
      {
        heading: 'Why this framing matters',
        paragraphs: [
          'When people believe a system predicts everything, they often become passive. They wait. They fear. Or they hand their choices to someone else. A healthier approach is to use insight as context. Good insight helps you act with more awareness, not less.',
          'This is especially important for modern seekers who want both meaning and practicality. BaZi can offer language for your natural patterns without forcing you into mystical thinking.',
        ],
      },
      {
        heading: 'What BaZi can do well',
        paragraphs: [
          'A strong reading can highlight the environments where you flourish, the patterns you repeat under stress, the kinds of timing that support growth, and the habits that create better alignment.',
        ],
        bullets: [
          'Reveal strengths that may already be visible to others.',
          'Name tensions you feel but have not clearly articulated.',
          'Offer better timing and pacing for important decisions.',
          'Help you choose support strategies that fit your energy.',
        ],
      },
      {
        heading: 'What BaZi should not replace',
        paragraphs: [
          'It should not replace discernment, therapy, medical care, or personal responsibility. It is one reflective tool among many. When used well, it gives language to your patterns so you can make better choices in the real world.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-use-your-elemental-insight-in-daily-life',
    title: 'How to Use Your Elemental Insight in Daily Life',
    description:
      'Turn your free result into action with simple ways to apply elemental guidance to work, relationships, and weekly planning.',
    publishedAt: '2026-04-09',
    readingTime: '5 min read',
    category: 'Practical Guidance',
    author: 'MysticEast',
    keywords: ['elemental insight', 'daily life', 'BaZi practical guide', 'self reflection'],
    sections: [
      {
        paragraphs: [
          'Insight only becomes useful when it changes how you move through the week. After you read your elemental result, avoid the urge to collect more theory immediately. Start with one small adjustment in behavior, environment, or communication.',
        ],
      },
      {
        heading: 'Apply it at work',
        paragraphs: [
          'Ask yourself how your natural energy shows up in decision-making. Do you bring structure, momentum, steadiness, precision, or adaptability? Then ask what happens when that strength is pushed too far. The second question is often where the breakthrough lives.',
        ],
      },
      {
        heading: 'Apply it in relationships',
        paragraphs: [
          'Elemental insight can also soften conflict. Instead of judging yourself or others as simply difficult, you can begin to recognize different energetic styles. That creates more room for timing, pacing, and better communication.',
        ],
        bullets: [
          'Name one recurring tension without blaming yourself.',
          'Choose one calmer way to express your needs this week.',
          'Notice where compatibility comes from rhythm, not sameness.',
        ],
      },
      {
        heading: 'Apply it to your weekly rhythm',
        paragraphs: [
          'Use your result as a weekly planning tool. Pick one habit that supports your strongest qualities and one habit that helps balance your excess. A useful reading should make your next week more intentional, not just more interesting.',
          'If you want a good place to start, return to your free result and choose the most actionable line. Let that become your experiment for the next seven days.',
        ],
      },
    ],
  },
];

export function getAllArticles() {
  return [...blogArticles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 2) {
  return getAllArticles().filter((article) => article.slug !== slug).slice(0, limit);
}
