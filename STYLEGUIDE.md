# navaa UI Styleguide (V1)

This guide codifies the current typography, layout, and interaction standards used on the Strategy course pages and sets the baseline for rollout across the app. It is pragmatic, Tailwind-friendly, and componentized.

## Typography

- **Display/Hero**
  - Classes: `text-4xl font-bold text-gray-900`
  - Usage: Course hero title (`components/courses/CourseTemplate.tsx`)
- **H1 (primary section/box titles)**
  - Classes: `text-2xl font-bold text-gray-900`
  - Usage: Onboarding step title (`StepWrapper`), Context title (`ContextPanel`)
- **H2 (secondary titles/questions)**
  - Classes: `text-lg font-semibold text-gray-900`
  - Usage: Mini-Case heading, MultipleChoice question
- **Body (primary running text)**
  - Classes: `text-lg text-gray-700` (prefer `text-gray-700` over `600` for contrast)
  - Usage: Hero description, context paragraphs, mini-case text, MC option text
- **Small (meta/labels)**
  - Classes: `text-sm text-gray-600`
  - Usage: Step label ("Schritt X von Y"), back link, info lists
- **Micro (chips/badges)**
  - Classes: `text-xs text-gray-500`

UX recommendations:

- **Line height**: Use `leading-relaxed` for long paragraphs; keep lists/meta `leading-normal`.
- **Max line length**: Wrap long copy with `max-w-prose` or `max-w-[68ch]` to improve readability.
- **Color contrast**: Prefer `text-gray-700` for body; reserve `600` for subdued/secondary copy.

## Colors

- Primary text: `text-gray-900`
- Secondary text: `text-gray-700` / `text-gray-600`
- Brand accent: `#009e82` (bullets, progress, accents)
- Info blue: headings `text-blue-900`, list `text-blue-800`

UX recommendations:

- **Hover/Active**: Use consistent brand accent for interactive states (`[#009e82]`), with subtle background (`bg-emerald-50`) where helpful.
- **Focus rings**: Always show focus: `focus:outline-none focus:ring-2 focus:ring-[#009e82] focus:ring-offset-2`.

## Layout & Containers

- **Panel/Card**: `bg-white rounded-xl shadow p-6`
- **Lists**: vertical spacing `space-y-2` (bullets), `space-y-3/4` (sections/options)
- **Spacing rhythm**: Titles `mb-2/3/4/6`, paragraphs `mb-4/6`
- **Onboarding grid**: Context left, Onboarding right; mobile shows Onboarding first.

UX recommendations:

- **Vertical rhythm**: Keep consistent section spacings (e.g., 24–32px) for predictability.
- **Container width**: Page header `max-w-7xl`; text-heavy columns constrained (`max-w-3xl`) when appropriate.

## Interactive Elements

- **Option/Button base**: `border-2 rounded-lg p-4 transition-all`
  - Pre-answer hover: `border-gray-200 hover:border-[#00bfae] hover:bg-gray-50`
  - Answered: green/red border & background, strong contrast text
- **Progress**: bar segment `w-8 h-2 rounded-full`; current/completed `bg-[#009e82]`

UX recommendations:

- **Hit area**: Minimum 44×44px; add `px-2 py-1` around small targets.
- **Reduced motion**: Respect `prefers-reduced-motion` to limit transitions.

## Shared Components

- `components/ui/Typography.tsx`
  - `<Heading variant="display|h1|h2|h3" as?>`
  - `<Text variant="body|small|micro|muted" as?>`
- `components/ui/Panel.tsx`
  - `<Panel>` wrapper with default panel classes

These allow centralized, consistent styling while staying Tailwind-first.

## Marketing Pages Standards

- **Typography Components**
  - Marketing sections under `components/sections/` MUST use `Heading`/`Text`.
  - No raw `<h*>`/`<p>` in new sections/components.
- **CTA Buttons**
  - Base: `inline-flex items-center px-8 py-3 rounded-lg font-semibold`
  - Primary: `bg-[#009e82] text-white hover:bg-[#007a66] transition-colors`
- **Container Widths**
  - Page container: `w-full max-w-6xl mx-auto px-6`
  - Hero containers may use `max-w-7xl`.

## Image Usage (Next.js Image)

- **Only `next/image`** for all images. No `<img>`.
- **Above the fold** (Hero): use `priority`, set `sizes` accurately.
- **Below the fold**: omit `priority`.
- **Layout**
  - Prefer `fill` with a sized parent and `object-cover`/`object-contain`.
  - Always provide `alt` text.
- **Assets** live under `public/assets/` with descriptive names (e.g., `track-hero.png`, `onboarding.png`).

## Reviewer Checklist (UI)

- **No `<img>` tags**: all images via `next/image`.
- **Typography**: `Heading`/`Text` used for titles/copy.
- **Readability**: long copy uses `leading-relaxed` and constrained width where needed (`max-w-prose`).
- **Performance**: Hero images use `priority` and correct `sizes`.
- **Consistency**: CTA styling matches primary pattern.

## Current Implementations (Strategy pages)

- `components/courses/CourseTemplate.tsx`
  - Hero title: `<Heading variant="display" />`
  - Hero description: `<Text variant="body" className="text-gray-600" />`
- `components/tracks/strategy/onboarding/shared/StepWrapper.tsx`
  - Step title: `<Heading variant="h1" />`
  - Step meta: `<Text variant="small" />`
- `components/tracks/strategy/onboarding/ContextPanel.tsx`
  - Title: `<Heading variant="h1" />`
  - Subtitle: `<Text variant="small" />`
  - Copy: `<Text variant="body" />` + brand bullets
- `components/tracks/strategy/onboarding/shared/MultipleChoice.tsx`
  - Question: `<Heading variant="h2" />`
  - Option text: `<Text variant="body" />`
- `components/tracks/strategy/onboarding/steps/Step1_Problem.tsx`
  - Mini-Case heading: `<Heading variant="h2" />`
  - Mini-Case text: `<Text variant="body" />`
  - Info box heading: `<Heading as="h3" variant="h3" />`
  - Info list: small text

## Open Decisions

- Context title hierarchy: Keep as H1 (equal to step) or demote to H2 (recommended: H2 to let step dominate).
- Progress label size: Neutral vs. `small` (recommended: `small`).
- Global body line-height: Adopt `leading-relaxed` for long copy.

## Rollout Plan

1. Use Typography + Panel for Strategy pages (complete).
2. Migrate other course pages, dashboard, and shared sections to these components.
3. Clean up redundant classes and optionally add lint rules or codemods to enforce usage.
