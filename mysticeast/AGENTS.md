# MysticEast Project - Agent Guidelines

## Project Overview
**MysticEast** - A Western-facing BaZi (Four Pillars) destiny reading website built with Next.js 14, TypeScript, and Tailwind CSS.

## Core Requirements

### Mandatory: Superpower Skills Framework

All development work on this project **MUST** follow the **Superpower Skills** methodology:

#### 1. Content Optimization (Copywriting Superpower)
- All user-facing text must be optimized for:
  - **Clarity**: Simple, direct language that Western audiences understand
  - **Emotional resonance**: Connect with "Conscious Seekers" (28-45, wellness-oriented)
  - **Actionability**: Clear CTAs and next steps
  - **Cultural bridge**: Translate Eastern concepts (BaZi, Feng Shui) into Western wellness language

#### 2. Visual Design (Design Superpower)
- **Fusion aesthetic**: Balance Eastern ink wash with Western crystal/earth wellness visual language
- **Color psychology**: 
  - Indigo (#2D1B4E) - wisdom, depth
  - Gold (#C9A227) - premium, warmth
  - Jade (#00A86B) - wellness, growth
- **Typography**: Cormorant Garamond (elegance) + Inter (readability)

#### 3. UX/UI Optimization (Experience Superpower)
- **Mobile-first**: All components must be fully responsive
- **Conversion-focused**: Every page guides users toward the free calculator or email capture
- **Trust building**: Privacy emphasis, satisfaction guarantees, social proof

#### 4. Technical Excellence (Code Superpower)
- TypeScript strict mode
- Component reusability
- Performance optimization
- Accessibility compliance

## Project Structure

```
mysticeast/
├── app/(marketing)/          # Public pages
│   ├── page.tsx              # Landing page
│   ├── calculator/page.tsx   # BaZi calculator
│   ├── services/page.tsx     # Services overview
│   ├── about/page.tsx        # About/BaZi philosophy
│   └── result/page.tsx       # Mini results + email capture
├── components/
│   ├── marketing/            # Landing page sections
│   ├── calculator/           # Calculator components
│   ├── layout/               # Header, Footer
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
└── styles/                   # Design tokens
```

## Content Guidelines

### BaZi Concept Translation
| Eastern Term | Western-Friendly Description |
|--------------|------------------------------|
| BaZi / Four Pillars | "Elemental Blueprint" or "Birth Chart Analysis" |
| Day Master | "Core Element" or "Personal Element" |
| Luck Cycle | "Energy Cycles" or "Life Rhythm" |
| Feng Shui | "Space Energy Alignment" |
| Yin Yang | "Balance" or "Dual Nature" |
| Five Elements | "Five Energies" (Wood, Fire, Earth, Metal, Water) |

### Brand Voice
- **Empowering**: "Discover your nature" not "We tell your fortune"
- **Scientific-meets-spiritual**: Pattern recognition, not mysticism
- **Premium but accessible**: Quality insights for everyone
- **Privacy-focused**: "Your data stays with you"

## Technical Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3+ |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Cormorant Garamond + Inter |

## Business Model (Current Phase)

### Beta Program
- **Free elemental assessment** via calculator
- **Complete readings** via email: bazirili@foxmail.com
- **No pricing** displayed during beta phase
- **Value-first approach**: Give before asking

### Future Monetization
- $99 Complete Destiny Map
- $79 Annual Forecast  
- $89 Compatibility Reading
- Crystal & Feng Shui product recommendations

## Development Checklist

Before any code is committed:

- [ ] **Content review**: Does copy follow Superpower Content guidelines?
- [ ] **Design review**: Does it match the Fusion aesthetic?
- [ ] **Mobile test**: Is it fully responsive?
- [ ] **Performance check**: Is it optimized for Core Web Vitals?
- [ ] **Accessibility check**: Is it keyboard/screen-reader friendly?
- [ ] **Conversion check**: Does it guide users to the next step?

## Contact

For questions about the Superpower Skills methodology:
- Review the skill documentation in `.claude/skills/superpower/`
- Or ask the AI assistant to explain the specific skill being applied

---

*Last updated: 2026-04-08*
*Version: 1.0 - Beta Phase*
