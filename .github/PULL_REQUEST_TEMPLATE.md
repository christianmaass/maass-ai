## Summary

- What does this PR do?

## Checklist

- [ ] Follows [Development Guidelines](../docs/navaa-development-guidelines.md)
- [ ] Follows [UI Styleguide](../STYLEGUIDE.md) (Typography, Marketing Pages, Image Usage)
- [ ] CI green (lint, typecheck, build)
- [ ] Tests added/updated for critical paths
- [ ] Migration plan & rollback (if schema changes)
- [ ] Docs updated as needed

### UI/Marketing Specific

- [ ] Uses `Heading`/`Text` for titles and copy (no raw `<h*>`/`<p>` in `components/sections/`)
- [ ] Uses `next/image` (no `<img>`); `priority` only above the fold with correct `sizes`
- [ ] Long copy uses `leading-relaxed`; widths constrained where needed (`max-w-prose`)
- [ ] Primary CTAs follow `bg-[#009e82] hover:bg-[#007a66]`

## Risk & Rollback

- Risk level: Low / Medium / High
- Rollback plan:

## Screenshots / Logs

(attach if applicable)

## Linked Issues

- Closes #
