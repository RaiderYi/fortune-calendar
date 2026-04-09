# MysticEast - AI Project Handoff Document

## 📋 Executive Summary

**Project**: MysticEast - Western-facing BaZi (Four Pillars) Destiny Reading Platform  
**Status**: Beta Phase (No pricing, email-based service)  
**Tech Stack**: Next.js 14 + TypeScript + Tailwind CSS  
**Target Audience**: Western "Conscious Seekers" (28-45, wellness-oriented)  
**Contact Email**: bazirili@foxmail.com

---

## 🎯 Project Mission

Transform ancient Chinese BaZi metaphysics into an accessible Western wellness experience. Position BaZi as "pattern recognition" (not fortune-telling) that helps users understand their elemental nature and life rhythms.

**Key Differentiator**: BaZi as practical life guidance + wellness tool, not mystical prediction.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    MYSTICEAST                           │
├─────────────────────────────────────────────────────────┤
│  Frontend: Next.js 14 (App Router)                      │
│  ├── Route Groups: (marketing) for public pages        │
│  ├── Route Groups: (app) for authenticated features    │
│  └── API Routes: /api/calculate, /api/email            │
├─────────────────────────────────────────────────────────┤
│  Styling: Tailwind CSS + Custom Design Tokens          │
│  ├── Colors: Indigo/Gold/Jade/Cream system             │
│  ├── Fonts: Cormorant Garamond + Inter                 │
│  └── Components: Reusable UI library                   │
├─────────────────────────────────────────────────────────┤
│  State: React Hooks + sessionStorage (client-side)     │
│  Build Output: Static export to Vercel                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
mysticeast/
│
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page (Hero + Features)
│   │   ├── calculator/page.tsx   # BaZi calculator form
│   │   ├── services/page.tsx     # Services overview
│   │   ├── about/page.tsx        # About/BaZi philosophy
│   │   └── result/page.tsx       # Mini results + email CTA
│   │
│   ├── api/                      # API routes
│   │   ├── calculate/route.ts    # BaZi calculation endpoint
│   │   └── email/route.ts        # Email capture endpoint
│   │
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout with fonts
│   └── not-found.tsx             # 404 page
│
├── components/                   # React components
│   ├── marketing/                # Landing page sections
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Features.tsx          # Features grid
│   │   ├── HowItWorks.tsx        # 3-step process
│   │   ├── Testimonials.tsx      # Social proof
│   │   ├── ServicesPreview.tsx   # Services cards
│   │   └── CTA.tsx               # Call-to-action section
│   │
│   ├── calculator/               # Calculator components
│   │   ├── BirthForm.tsx         # Main input form
│   │   ├── ElementIcon.tsx       # Element display icons
│   │   ├── ElementReveal.tsx     # Animation component
│   │   └── InsightCard.tsx       # Result cards
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Site footer
│   │
│   └── ui/                       # Reusable UI components
│       └── Button.tsx            # Button variants
│
├── lib/                          # Utilities and types
│   ├── types/
│   │   └── bazi.ts               # BaZi TypeScript types
│   └── utils/
│       └── cn.ts                 # Tailwind class merge
│
├── styles/
│   └── design-tokens.ts          # Design system constants
│
├── public/                       # Static assets
│
└── Configuration Files
    ├── next.config.js            # Next.js config
    ├── tailwind.config.ts        # Tailwind + theme
    ├── tsconfig.json             # TypeScript config
    └── vercel.json               # Vercel deployment config
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-950` | `#2D1B4E` | Dark backgrounds, headers |
| `--gold-500` | `#C9A227` | CTAs, accents, premium elements |
| `--gold-400` | `#E5C458` | Hover states, highlights |
| `--jade-500` | `#00A86B` | Success, wellness, growth |
| `--cream` | `#F5F1E8` | Light backgrounds, cards |
| `--charcoal` | `#2C2C2C` | Body text |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Cormorant Garamond | 700 | 4rem (64px) |
| H2 | Cormorant Garamond | 700 | 3rem (48px) |
| H3 | Cormorant Garamond | 600 | 1.5rem (24px) |
| Body | Inter | 400 | 1rem (16px) |
| Button | Inter | 600 | 1rem (16px) |

### Component Patterns

```typescript
// Button variants
<Button variant="primary">    // Dark background, white text
<Button variant="gold">       // Gold gradient, dark text
<Button variant="outline">    // Border, transparent bg
<Button variant="ghost">      // No border, hover bg

// Card style (crystal-card)
<div className="crystal-card">
  bg-white rounded-2xl shadow-soft
</div>
```

---

## 📝 Content Translation Guide

**MANDATORY**: All content must translate Eastern concepts to Western wellness language.

| ❌ Don't Use | ✅ Use Instead | Rationale |
|--------------|----------------|-----------|
| BaZi / 八字 | Elemental Blueprint | More accessible |
| Day Master / 日主 | Core Element | Easier to understand |
| Luck Cycle / 大运 | Energy Cycle | Wellness framing |
| Feng Shui | Space Energy Alignment | Modern positioning |
| Five Elements | Five Energies | Simpler concept |
| Destiny / 命运 | Natural Patterns | Empowering language |
| Fortune-telling | Pattern Recognition | Removes mysticism |
| Predict your future | Understand your nature | Empowering vs passive |

### Brand Voice

- **Empowering**: "Discover" not "We tell you"
- **Scientific-spiritual**: Pattern recognition, ancient wisdom
- **Premium-accessible**: High quality, approachable
- **Privacy-focused**: Emphasize data security

---

## 🔄 Business Logic

### Current Phase: Beta (No Pricing)

**User Flow:**
1. Landing page → Learn about BaZi
2. Free Calculator → Enter birth details → Get mini result
3. Email CTA → Send details to bazirili@foxmail.com
4. Manual processing → Send full reading via email

**Future Monetization** (post-beta):
- $99 Complete Destiny Map
- $79 Annual Forecast
- $89 Compatibility Reading

### Key Conversion Points

1. **Hero CTA**: "Calculate Your Chart (Free)"
2. **Result Page**: Email capture gate before full content
3. **Services Page**: Email inquiry for detailed readings
4. **Footer**: Contact email everywhere

---

## 🧪 Development Workflow

### Setup

```bash
cd mysticeast
npm install
npm run dev        # Starts on localhost:3002
npm run build      # Production build
```

### Environment Variables

```env
# .env.local (create this file)
NEXT_PUBLIC_API_URL=http://localhost:3002
# Add other env vars as needed
```

### Code Standards

1. **TypeScript**: Strict mode enabled
2. **Components**: Function components + Hooks only
3. **Styling**: Tailwind classes, no inline styles
4. **Icons**: Lucide React only
5. **Images**: Use Next.js Image component
6. **Forms**: Client-side validation + error handling

### Adding New Pages

1. Create `app/(marketing)/new-page/page.tsx`
2. Add metadata export
3. Import layout components from `@/components`
4. Follow design system tokens
5. Test mobile responsiveness
6. Add to navigation if needed

---

## 🚀 Deployment

### Vercel Configuration

**Root Directory**: `mysticeast` (Critical!)

**Build Settings**:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

**Environment Variables**:
Set in Vercel dashboard if needed

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/new-feature

# Deploy to production
git checkout master
git merge feature/new-feature
git push origin master  # Auto-deploys to Vercel
```

---

## 🐛 Common Issues & Solutions

### Issue: Page shows old content
**Solution**: Check Vercel deployment status, clear browser cache

### Issue: Build fails
**Solutions**:
- Check TypeScript errors: `npx tsc --noEmit`
- Check for missing imports
- Verify `next.config.js` settings

### Issue: Chinese text appears
**Solutions**:
- Check browser language settings
- Verify date input locale
- Replace with English placeholder text

### Issue: Styles not applying
**Solutions**:
- Check Tailwind class names
- Verify `tailwind.config.ts` includes paths
- Clear `.next` cache: `rm -rf .next`

---

## 📞 Contact & Support

**Project Owner**: bazirili@foxmail.com  
**GitHub**: https://github.com/RaiderYi/fortune-calendar  
**Staging URL**: https://fortunecalendar-git-master-shijie-fangs-projects.vercel.app/

---

## 🎓 AI Assistant Instructions

When working on this project, you MUST:

1. **Apply Superpower Skills**:
   - Content: Translate Eastern concepts to Western wellness language
   - Design: Maintain Fusion aesthetic (Ink wash + Crystal)
   - UX: Guide users to free calculator or email capture
   - Code: TypeScript strict, reusable components

2. **Follow Beta Phase Rules**:
   - NO pricing on any page
   - Email contact: bazirili@foxmail.com
   - Emphasize "experience phase"

3. **Check Before Committing**:
   - [ ] Content follows translation guide?
   - [ ] Design matches color palette?
   - [ ] Mobile responsive?
   - [ ] No hardcoded Chinese text?
   - [ ] All links work?

4. **Ask When Uncertain**:
   - "Does this copy follow the brand voice?"
   - "Should I translate this Eastern concept differently?"
   - "Is this component reusable?"

---

## 📚 Reference Documents

- `AGENTS.md` - Detailed agent guidelines
- `.cursorrules` - Cursor IDE rules
- `.claude-project-rules.md` - Claude-specific rules
- `styles/design-tokens.ts` - Design system constants
- `lib/types/bazi.ts` - TypeScript type definitions

---

**Last Updated**: 2026-04-08  
**Document Version**: 1.0  
**Status**: Beta Phase
