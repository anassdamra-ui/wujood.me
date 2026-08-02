# Wujood Card Standard v1

## Purpose
Make performance and shared functionality platform rules rather than per-card memory.

## Architecture contract
- **Card:** content, data, semantic HTML, layout, theme.
- **Engine:** reusable behavior (gallery/viewer, vCard, share, phone, email, WhatsApp, etc.).
- **Base CSS/assets:** fonts, icon primitives, performance-safe defaults.
- **Validator:** enforcement before production.

## Fonts
Canonical stylesheet: `/engine/v1/assets/fonts/fonts.css`.

Cards MUST NOT request Google Fonts or other remote font providers. Use:
- Arabic/UI: `var(--wj-font-ar)`
- Latin/UI: `var(--wj-font-en)`
- Generic UI: `var(--wj-font-ui)`

Font files are self-hosted on Wujood. `font-display: swap` is mandatory. WOFF2 is preferred. Current Space Grotesk TTF remains compatible but should be replaced with WOFF2 when available.

The font stylesheet should be loaded non-blocking:
```html
<link rel="preload" href="/engine/v1/assets/fonts/fonts.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/engine/v1/assets/fonts/fonts.css"></noscript>
```

## Icons
No Font Awesome, icon fonts, cdnjs, or external icon CSS.

Canonical sprite: `/engine/v1/assets/icons/icons.svg`.

Example:
```html
<svg class="wj-icon" aria-hidden="true"><use href="/engine/v1/assets/icons/icons.svg#phone"></use></svg>
```

For a tiny number of critical above-the-fold icons, approved inline SVG is allowed when it measurably avoids an extra request. Do not duplicate large SVG sets per card.

## Images
- Prefer AVIF, then WebP, then optimized JPEG/PNG only when necessary.
- Above-the-fold profile/hero image: `loading="eager"`, `decoding="async"`, explicit dimensions; `fetchpriority="high"` only when it is the likely LCP image.
- Gallery/offscreen images: `loading="lazy"`, `decoding="async"`, explicit dimensions/aspect ratio.
- Gallery interaction belongs to Engine, never bespoke card JavaScript.

## Third-party critical path
A production card MUST NOT load render-blocking Google Fonts, Font Awesome, cdnjs icon CSS, or equivalent third-party presentation dependencies.

## Engine behavior
Use `data-wj-behavior` contracts. Do not duplicate built-in behavior implementation in the card.

## Performance acceptance
Required engineering targets:
- LCP <= 2.5s
- CLS < 0.1
- TBT <= 200ms in Lighthouse lab testing
- No known third-party render-blocking font/icon dependency

Preferred Wujood target on representative mobile tests: Performance >= 90. Card 1029 achieved 98 with FCP/LCP 0.8s after self-hosted fonts, removal of Font Awesome/CDN icon CSS, optimized images, and Engine-based behavior.

## Production gate
Run:
```bash
node tools/validate-card.js path/to/card.html
```
Any ERROR blocks production. WARN items require review.
