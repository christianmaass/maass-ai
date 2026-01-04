# Decision OS Route Structure

**Status:** Prepared (Not Yet Implemented)  
**Date:** 2025-01-27

## Route Structure

```
src/app/
├── (marketing)/
│   ├── page.tsx              # Landing page ✅
│   └── layout.tsx            # Marketing layout ✅
├── (app)/
│   ├── layout.tsx            # Auth required ✅
│   ├── page.tsx              # SINGLE ENTRY: "What decision are you making?" ✅
│   ├── decisions/
│   │   ├── new/
│   │   │   └── page.tsx     # Decision creation flow (TODO)
│   │   ├── [id]/
│   │   │   └── page.tsx      # Decision detail & scoring (TODO)
│   │   └── log/
│   │       └── page.tsx      # Decision log (history) (TODO)
│   └── [nothing else]
└── (admin)/
    └── [keep minimal admin if needed] ✅
```

## Current Status

✅ **Implemented:**
- Marketing landing page
- App entry point (`/app/page.tsx`) with single question
- Auth layout and guards
- Admin layout

⏳ **To Be Implemented:**
- `/app/decisions/new` - Decision creation
- `/app/decisions/[id]` - Decision detail & scoring
- `/app/decisions/log` - Decision history

## Entry Point Behavior

After login, users are redirected to `/app` which shows:
- **Single question:** "What decision are you making right now?"
- **Input field:** For decision title
- **Button:** "Start Decision"

No menus. No dashboards. No navigation to other areas.

