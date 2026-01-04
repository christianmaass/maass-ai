# Decision OS Migration Concept

**Status:** Planning  
**Date:** 2025-01-27  
**Goal:** Radical transformation from EdTech platform to Decision Quality System

---

## 🎯 Product Vision

**Decision OS** is a system that helps users make real decisions by:
- Evaluating decision quality ex-ante (not outcomes)
- Forcing clarity around goals, options, assumptions, trade-offs, uncertainty
- Producing a Decision Quality Score (1-10)
- Storing decisions in an immutable Decision Log

**Single Entry Point:** "What decision are you making right now?"

---

## 🗺️ Migration Strategy

### Phase 1: Complete Deletion (No Compromises)

#### 1.1 Remove All EdTech/Learning Code

**Routes to Delete:**
- `src/app/(app)/catalog/` - Entire catalog system
- `src/app/(app)/tracks/` - All track pages
- `src/app/(app)/strategy-track/` - Strategy learning content
- `src/app/(app)/methodenbaukasten/` - Methods library
- `src/app/courses/` - Course pages
- `src/app/api/courses/` - Course API routes

**Components to Delete:**
- `src/components/course/` - All course components
  - `CourseShell.tsx`
  - `ProgressBar.tsx`
  - `StepBody.tsx`
  - `StepHero.tsx`
  - `NavButtons.tsx`
  - All quiz/problem components
- `src/components/tasks/` - Task system
- `src/shared/ui/components/course-card.tsx`
- `src/shared/ui/components/progress-bar.tsx`
- `src/shared/ui/components/step-overview.tsx`

**Modules/Services to Delete:**
- `src/modules/courses/` - Entire course module
- `src/config/onboarding-steps.config.ts`
- `src/hooks/useProgress.ts`

**Data/Content to Delete:**
- `src/app/(app)/catalog/modules.data.ts`
- All course-related images in `public/images/courses/`
- All course-related images in `public/images/Kurskatalog/`

#### 1.2 Remove All Consulting/Strategy Content

**Components to Keep (but refactor):**
- `src/components/StrategyAssessment.tsx` → **RENAME** to `DecisionAssessment.tsx`
  - Change questions to decision-focused
  - Remove strategy/consulting language
  - Keep the assessment pattern but reframe

**Content to Remove:**
- All strategy framework references
- Consulting case studies
- Industry vertical content
- Finance/change management tracks

#### 1.3 Remove UX Patterns

**Remove from UI:**
- Course catalog grids
- Content selection cards
- Progress bars (learning progress)
- Levels/badges/achievements
- Curriculum navigation
- "Back to catalog" links
- Learning path visualizations

**Keep (but refactor):**
- Base UI components (Button, Card, Input, Form)
- Layout structure
- Header/Footer (marketing)

#### 1.4 Remove Forbidden Vocabulary

**Search & Replace/Delete:**
- learning → decision
- course → [DELETE]
- module → [DELETE]
- lesson → [DELETE]
- strategy → decision (where appropriate, else delete)
- consulting → [DELETE]
- training → [DELETE]
- framework → [DELETE]
- skill → [DELETE]
- progress → [DELETE] (learning progress)
- mastery → [DELETE]
- onboarding → [DELETE] (learning onboarding)
- path → [DELETE] (learning path)
- curriculum → [DELETE]

**Files to Review for Language:**
- All component files
- All page files
- Marketing copy
- Error messages
- Navigation labels

---

### Phase 2: Infrastructure Cleanup

#### 2.1 Database Schema

**Tables to Remove (if exist):**
- `courses`
- `modules`
- `lessons`
- `user_progress`
- `enrollments`
- `achievements`
- `learning_paths`

**Tables to Prepare (future):**
- `decisions` (id, user_id, title, description, goal, created_at, updated_at)
- `decision_options` (id, decision_id, title, description, order)
- `decision_criteria` (id, decision_id, name, weight)
- `decision_scores` (id, decision_id, dimension, score, created_at)
- `decision_log` (immutable history)

#### 2.2 API Routes

**Delete:**
- `/api/courses`
- Any course-related endpoints

**Prepare (future):**
- `/api/decisions` (CRUD)
- `/api/decisions/[id]/score`
- `/api/decisions/[id]/log`

#### 2.3 Routes Structure (New)

```
src/app/
├── (marketing)/
│   ├── page.tsx              # Landing page (refactored)
│   └── layout.tsx            # Marketing layout
├── (app)/
│   ├── layout.tsx            # Auth required
│   ├── page.tsx              # SINGLE ENTRY: "What decision are you making?"
│   ├── decisions/
│   │   ├── new/
│   │   │   └── page.tsx     # Decision creation flow
│   │   ├── [id]/
│   │   │   └── page.tsx      # Decision detail & scoring
│   │   └── log/
│   │       └── page.tsx      # Decision log (history)
│   └── [nothing else]
└── (admin)/
    └── [keep minimal admin if needed]
```

---

### Phase 3: New Mental Model Implementation

#### 3.1 Single Entry Point

**After Login → Direct to:**
```
/app/page.tsx

"What decision are you making right now?"

[Text Input: Decision Title]
[Button: Start Decision]
```

**No menus.**
**No dashboards.**
**No navigation to other areas.**

#### 3.2 Decision Flow (Future Structure)

1. **Decision Creation**
   - Title: "What decision are you making?"
   - Goal: "What are you trying to achieve?"
   - Options: "What are your options?" (max 3)
   - Criteria: "What matters most?"
   - Assumptions: "What are you assuming?"
   - Uncertainty: "What don't you know?"
   - Reversibility: "Can you reverse this?"

2. **Decision Scoring**
   - 5 dimensions → Score 1-10
   - Decision Quality Score calculation
   - Display score

3. **Decision Log**
   - Immutable history
   - Timestamped
   - Review past decisions

---

### Phase 4: Marketing Page Refactor

#### 4.1 Keep Structure
- Header (MarketingHeader)
- Hero Section
- Feature Modules (but reframe)
- Footer (MarketingFooter)

#### 4.2 Reframe Content

**Hero:**
- Remove: "Lerne zu denken wie ein Top-Berater"
- New: "Make better decisions. Every time."

**Features:**
- Remove: Course cards
- New: Decision-focused value props
  - "Clarity on goals"
  - "Evaluate options systematically"
  - "Understand trade-offs"
  - "Track decision quality"

**Assessment:**
- Keep StrategyAssessment component
- Rename to DecisionAssessment
- Reframe questions to decision-making

---

## 📋 Execution Checklist

### Deletion Phase
- [ ] Delete all course routes
- [ ] Delete all course components
- [ ] Delete course modules/services
- [ ] Delete course-related images
- [ ] Remove forbidden vocabulary from code
- [ ] Remove forbidden vocabulary from UI
- [ ] Delete progress tracking
- [ ] Delete learning path logic
- [ ] Delete catalog system
- [ ] Clean up navigation

### Refactoring Phase
- [ ] Rename StrategyAssessment → DecisionAssessment
- [ ] Refactor marketing page copy
- [ ] Update hero section
- [ ] Remove course cards
- [ ] Update feature descriptions
- [ ] Simplify navigation (remove catalog links)

### Infrastructure Phase
- [ ] Clean up database schema (remove course tables)
- [ ] Remove course API routes
- [ ] Update route structure
- [ ] Prepare decision data models (types)
- [ ] Update TypeScript types

### New Entry Point
- [ ] Create `/app/page.tsx` with single question
- [ ] Remove all other app routes (temporarily)
- [ ] Ensure no navigation to deleted features
- [ ] Test auth flow → direct to decision entry

### Validation
- [ ] Search codebase for forbidden words
- [ ] Verify no course/learning references remain
- [ ] Test that old routes return 404
- [ ] Verify auth still works
- [ ] Verify base UI components work
- [ ] Check marketing page loads correctly

---

## 🚨 Critical Rules

1. **No Preservation:** Do not try to reuse old features
2. **No Softening:** Make a clean break
3. **No Hidden Features:** Delete, don't hide
4. **Radical Clarity:** If it doesn't help make a decision, delete it
5. **Single Entry:** One question, one path forward

---

## 📝 Commit Strategy

**Final Commit Message:**
```
chore: remove edtech and consulting product logic

- Delete all course/learning routes and components
- Remove consulting/strategy content
- Remove forbidden vocabulary
- Prepare codebase for Decision OS
- Single entry point: "What decision are you making?"
```

This commit is a **point of no return**.

---

## 🔮 Future Preparation (Do Not Build Yet)

**Data Models to Prepare:**
```typescript
interface Decision {
  id: string;
  userId: string;
  title: string;
  description: string;
  goal: string;
  options: DecisionOption[]; // max 3
  criteria: DecisionCriterion[];
  assumptions: string[];
  uncertainty: string[];
  reversibility: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

interface DecisionScore {
  decisionId: string;
  clarity: number; // 1-10
  options: number; // 1-10
  assumptions: number; // 1-10
  tradeoffs: number; // 1-10
  uncertainty: number; // 1-10
  overall: number; // 1-10 (calculated)
}
```

**Routes to Prepare:**
- `/app` - Single entry point
- `/app/decisions/new` - Decision creation
- `/app/decisions/[id]` - Decision detail & scoring
- `/app/decisions/log` - Decision history

---

## ✅ Validation Question

After completion, ask:

**"Does this codebase look like it exists to help someone make a real decision today?"**

If the answer is **no**, more must be deleted.

