# Wujood Repository Instructions

These rules are mandatory for humans and AI agents (ChatGPT/Codex, Claude, Gemini, or any other tool) modifying Wujood cards.

1. Read `docs/WUJOOD-CARD-STANDARD.md` before creating or editing a card.
2. Cards own content and visual composition. Shared behavior belongs to Wujood Engine.
3. Never embed or reimplement Gallery/Viewer, vCard, Share, Phone, Email, WhatsApp, Maps, Analytics, Business Hours, Clipboard, or Form behavior when an Engine behavior exists.
4. Never load Google Fonts, Font Awesome, cdnjs, or third-party render-blocking font/icon CSS in a card.
5. Use Wujood self-hosted fonts through `/engine/v1/assets/fonts/fonts.css` and CSS variables from `/engine/v1/styles/wujood-base.css`.
6. Use Wujood icons from `/engine/v1/assets/icons/icons.svg` or approved inline SVG for above-the-fold critical icons. Do not add an icon font/library.
7. Gallery images should be AVIF/WebP when available and use lazy loading; the primary above-the-fold profile/hero image must not be lazy-loaded.
8. Images must declare intrinsic `width` and `height` (or a stable `aspect-ratio`) to prevent layout shift.
9. Do not introduce external render-blocking resources without an explicit architectural decision.
10. Before considering a card production-ready, run `node tools/validate-card.js <card.html>` and resolve all errors.

Performance baseline established on card 1029: Lighthouse mobile Performance 98, FCP 0.8s, LCP 0.8s, TBT 10ms, CLS 0.095. This is a reference result, not a guarantee for every card.
