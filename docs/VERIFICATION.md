# Implementation verification

25 October 2026, Asia/Kuala_Lumpur. Prepared locally; no remote push or deployment.

## Toolchain and build

- Portable Node **24.22.1**, npm, Astro **7.4.2**, Tailwind **4.3.3**, TypeScript **6.0.3**.
- `npm ci`: passed; 287 packages installed, audit reported **0 vulnerabilities** at that time.
- `npm run check`: passed, **0 errors, 0 warnings, 0 hints** across 22 files.
- `npm run build`: passed; static `index.html` and `404.html` generated. Final `dist/` uses the root user-site base.
- Client carousel bundle: **4,631 bytes** before gzip. Shared CSS: **16,632 bytes** before gzip. No runtime UI framework or carousel dependency.
- `git diff --check`: passed. Existing deletions of the old retro/arcade source were preserved; replacement files were created in the existing checkout.

## Browser checks

Playwright 1.64.1 with installed headless Microsoft Edge on Windows: **11/11 passed** on the root site. Two relevant tests also passed against a production build with `BASE_PATH=/portfolio`, including local images, styles, no-JS content and the 404 return link. The root build was restored afterward.

Covered behavior:

- Layout at **320, 375, 768 and 1440px**, no document-level horizontal overflow, visible project content and loaded local brand images.
- **200% CSS zoom** without horizontal page overflow; keyboard Tab through skip link and project CTA.
- Real animation movement, immediate hover pause with exact position retained, and eligible resume on leave.
- Keyboard Previous/Next/Play and persistent manual/user pauses across pointer leave and resizing.
- Focused links brought into view; leaving focus does not silently restart motion.
- Mouse dragging over anchors, ordinary clicks, Control-clicks and Enter activation.
- Pointer cancellation clears drag state; a trailing release cannot accidentally navigate. A regression test covers this edge case.
- Reduced-motion startup, manual controls, and hiding controls when a row no longer overflows.
- Offscreen pause, simulated document visibility events, bounded first animation frames on resume.
- Chromium touch emulation with actual browser touch events: native horizontal swipe and normal vertical page scrolling.
- JavaScript-disabled rendering: 30 working tool links, three project cards, native horizontal overflow and hidden script-only controls.

Screenshots: `preview-320.png`, `preview-375.png`, `preview-768.png`, `preview-1440.png`. These show the real portfolio, not generated application screenshots.

## Accessibility and performance

- axe-core WCAG 2 A/AA and WCAG 2.1 AA automated scan: **0 violations**, also checked under the project base path.
- Lighthouse **13.5.0**, mobile emulation (412 × 823, simulated throttling), local production preview, 25 October 2026 at 16:52 MYT: **Performance 100 / Accessibility 100**; LCP **0.9s**, CLS **0**, no run warnings. Full measured report: `lighthouse-mobile.json`.
- Brand colors are preserved. Text uses the specified off-white/muted colors on dark surfaces; dark text is used on filled cyan buttons. Focus outlines are cyan and reduced motion removes lift transitions.
- Calculated WCAG contrast ratios: main text/canvas **18.05:1**, muted text/card **9.55:1**, dark text/cyan button **13.25:1**, violet/card **6.89:1**.

These are local lab results, not field measurements or a guarantee of accessibility. A screen-reader session, physical mobile device, Safari and Firefox were not tested. Hidden-tab logic was exercised by simulated visibility events; offscreen behavior and window interaction used the real browser. The zoom check used CSS zoom rather than browser chrome zoom controls.

## Content and links

All 30 toolkit destinations, the Astro credit and GitHub profile returned HTTP 200. Exact sources, final URLs, local image hashes and asset ownership are in `asset-verification.json` and `../ASSET_SOURCES.md`. LinkedIn returned HTTP 999 due to automated-request blocking; email was not sent or delivery-tested.

MyFinance and EduSDG repositories were verified against their public READMEs and source trees. Chirper remains `repoUrl: null`. JavaScript, Shelf, Gemini API and WhatsApp Cloud API use documented text-only fallbacks. The remaining content inputs and pre-launch review are listed in `../CONTENT_TODO.md`.

## Deployment preparation

GitHub Pages workflow includes lockfile installation, type/build/browser checks, official Astro build/upload action, deployment concurrency, and deploy-only Pages/OIDC permissions. Pull requests cannot enter the deploy jobs. The workflow has been prepared and reviewed locally; GitHub Actions itself has not been run remotely, and the site has not been published.
