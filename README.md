# Justin Joel · minimal neon portfolio

A personal, single-page introduction built with Astro static output, TypeScript, Tailwind CSS 4 and a small vanilla TypeScript carousel. No navigation bar, framework hydration, backend, remote fonts or runtime logo requests.

## Run locally

Use Node 24 LTS (`.nvmrc`) and npm. The system's older Node 22.15 cannot run this Astro version. Current pinned versions were verified against npm on 25 October 2026: Astro 7.4.2, Tailwind 4.3.3, and TypeScript 6.0.3. TypeScript 6 is the current compatible major for `@astrojs/check` 0.9.12; TypeScript 7 is outside its peer range.

```sh
npm ci
npm run dev
```

Open the printed local address. On Windows with PowerShell script execution disabled, use `npm.cmd` instead of `npm`. This implementation used a portable Node 24.22.1 runtime under `C:\SWE_Projects\.tools`; it is not a project dependency.

```sh
npm run check
npm run build
npm run preview
npm run test:browser
```

Browser tests start and stop their own production preview. Windows uses installed Microsoft Edge; Linux/macOS uses Playwright Chromium (`npx playwright install chromium`). CI installs Chromium with system dependencies. The focused tests exercise real browser scrolling, drag/click separation, keyboard controls, touch, reduced motion, offscreen/hidden states, no-JS fallback, responsive layouts, assets and axe accessibility checks. Screenshots are written to `docs/preview-{width}.png`.

## Edit content

| File | Content |
| --- | --- |
| `src/data/profile.ts` | Identity, welcome, background, strengths, languages, contact |
| `src/data/tools.ts` | Typed categories, tool names, descriptions and official links |
| `src/data/projects.ts` | Typed project summaries, features, tool IDs, visibility and nullable repository URLs |
| `src/data/interests.ts` | Personal interest cards |
| `src/data/brand-assets.ts` | Typed adapter for the verified asset manifest |
| `docs/asset-verification.json` | Exact official asset URLs, local filenames, attributions, hashes and destination checks |
| `src/styles/global.css` | Neon tokens, shared components, responsive and reduced-motion styles |

Tool IDs are shared by the toolkit and project chips; an unknown ID fails the build. Set `repoUrl` only to the verified project's URL. A null URL renders readable, non-clickable text. Category and optional lifecycle are separate. Optional future projects can be added with `visible: false` until their wording is confirmed.

All external links use ordinary same-tab navigation, preserving native modifier-click and open-in-new-tab behavior without unexpected new windows. Brand images are decorative beside visible names. Missing assets render explicit text tiles, never guessed logos. For asset provenance and usage terms see [ASSET_SOURCES.md](ASSET_SOURCES.md); unresolved content is in [CONTENT_TODO.md](CONTENT_TODO.md).

## Carousel behavior

Each labeled region contains one semantic list. Native horizontal scrolling works without JavaScript; script-dependent controls stay hidden until initialized. The script moves at 24 CSS pixels/second and reverses gently at either end. It accumulates fractional positions and caps frame deltas to avoid stalls and jumps.

Hover pauses temporarily. Focus, horizontal manual scrolling, touch interaction, dragging, or Previous/Next persist a pause until Play. Play clears persistent pause requests, but motion still waits while the pointer or focus remains in the row. Reduced motion starts paused; explicit Play can opt in. Resizing, hidden tabs and offscreen observations never clear a selected pause. Rows without overflow hide unnecessary controls. Dragging starts only after six horizontal pixels; links keep ordinary, keyboard and modifier-click behavior. Vertical page scrolling is not intercepted.

## GitHub Pages, when publication is requested

The configuration targets the existing `JustinJ03/JustinJ03.github.io` repository and `https://justinj03.github.io/`, with no base prefix. This change was prepared locally: no push, remote repository creation or publication was performed.

The workflow follows the [official Astro Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/), using the official Astro build/upload action. Pull requests only run checks. A later push to `main` or manual dispatch runs checks, then uploads and deploys. Pages write and OIDC permissions are limited to the deploy job; builds use read-only repository access. Configure repository **Settings → Pages → Source → GitHub Actions** before a future authorized deployment. Keep the generated `package-lock.json` with the source.

For a project repository, set `BASE_PATH=/portfolio` for **all** build/check-preview jobs, or change `base` in `astro.config.mjs`. Local asset paths and the 404 return link use `withBase()`. PowerShell example:

```powershell
$env:BASE_PATH = '/portfolio'
npm.cmd run build
npm.cmd run test:browser
Remove-Item Env:BASE_PATH
npm.cmd run build
```

For a custom domain, change `site` and add the real `public/CNAME` only when configured. No social image is referenced until a real one is provided. Build artifacts are in `dist/`; development files and tests are not included in the published output.

The Tailwind integration follows the [official Astro framework guide](https://tailwindcss.com/docs/installation/framework-guides/astro). Validation details and limitations are recorded in [docs/VERIFICATION.md](docs/VERIFICATION.md).
