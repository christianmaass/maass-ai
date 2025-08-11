# Assets Guide

This guide defines where to store and how to manage visual assets (images, icons, videos) across the project following NAVA Guidelines: Stability First, Security First, and Clean Architecture.

## Principles

- First-use ownership: store assets in the domain where they are first used (closest to the page/component).
- Promotion rule: when an asset becomes cross-domain, promote it to a shared location and update references.
- Public serving: prefer `public/` for static assets to leverage Next.js static serving, caching and CDN.
- Performance first: use modern formats (WebP/AVIF), right sizes, and `next/image` with proper `sizes`.
- Governance: document licensing/attribution for third-party assets.

## Locations

- Domain-local (first use):
  - Marketing: `public/marketing/...`
  - Admin: `public/admin/...`
  - App (authenticated): `public/app/...`
  - Payments: `public/payments/...`
- Shared (cross-domain):
  - `public/shared/brand/...` (logos, identity)
  - `public/shared/ui/...` (generic UI visuals)

For the course catalog previews used first on the marketing homepage:
- `public/shared/catalog/strategy/...`
- `public/shared/catalog/finance/...`
- `public/shared/catalog/communication/...`
- `public/shared/catalog/ai/...`

## Naming & Formats

- Filenames: kebab-case, include context and variant
  - Example: `strategy-track-cover@2x.webp`, `hero-cta-bg-mobile.webp`
- Prefer `.webp` (or `.avif` if toolchain allows) with fallbacks only if needed.
- Avoid excessively large dimensions; export at target DPR sizes.

## Usage with next/image

- Reference via absolute path from public: `/shared/catalog/strategy/cover.webp`
- Always set meaningful `alt` text.
- Provide `sizes` to avoid layout shifts and reduce bytes.
- Mark above-the-fold images with `priority`.

Example:

```tsx
import Image from 'next/image'

export function StrategyCard() {
  return (
    <Image
      src="/shared/catalog/strategy/cover.webp"
      alt="Strategy Track cover"
      width={640}
      height={360}
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={false}
    />
  )
}
```

## Promotion Rule (governance)

- If an asset is used in multiple domains, move it to `public/shared/...`.
- Update all references in code to the new path.
- Record the move in the PR description.

## Licensing & Attribution

- Keep third-party asset licenses in `docs/runbooks/assets-licensing.md`.
- Add attribution notes where required.

## Review Checklist (PRs touching assets)

- Domain matches first-use?
- Format is WebP/AVIF where possible?
- Dimensions appropriate and responsive `sizes` provided?
- Alt text meaningful?
- Cross-domain usage? Consider promotion.
