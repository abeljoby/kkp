# KKP Group website prototype

An Astro landing page prototype for KKP Group, a UAE-based group described on the existing Beamco International website. The current page is a static concept for design review; it is not yet approved brand or production copy.

## Run locally

Requirements: Node.js `>=22.23.4` (see `package.json`) and npm.

```sh
npm install
npm run dev -- --background
```

Astro's CLI can manage the background server:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

To build and preview the production output locally:

```sh
npm run build
npm run preview
```

The static build is written to `dist/`. The build currently completes successfully.

## GitHub Pages deployment

The project is configured for the project-page URL `https://abeljoby.github.io/kkp/`. Astro's `site` and `base` settings include the repository path, and local images and the favicon use that base path. The `.github/workflows/deploy.yml` workflow builds and deploys the static site to GitHub Pages whenever changes are pushed to `dev`; it can also be run manually from the Actions tab. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The generated static site is written to `dist/`. Node.js is used by the workflow to build the site; GitHub Pages serves the resulting static files without a server runtime.

The page has no working form submission or server-side behavior. Email and phone links use the contact details currently published by Beamco; confirm them before launch. Future dynamic features should be designed separately from this static marketing page.

## Design concepts

The floating **Explore designs** control offers exactly seven saved directions, in this order:

| Option | Direction | Content and layout |
| --- | --- | --- |
| 01 | Signature · Reference concepts | Restored from commit `9a84895`: photographic group overview and six-company grid |
| 02 | Corporate · Reference concepts | Restored from `9a84895`: split-screen introduction and company profile cards |
| 03 | Precision · Reference concepts | Restored from `9a84895`: dark editorial presentation and numbered company index |
| 04 | Pastel Serif · Reference concepts | Modern's layout with archive photography, a soft heritage palette and Cormorant Garamond headings |
| 05 | Signature · Requirement-led concepts | Royal blue and gold, requirement-led copy, interactive service explorer and company profiles |
| 06 | Corporate · Requirement-led concepts | White and navy, requirement-led copy, interactive service explorer and company profiles |
| 07 | Precision · Requirement-led concepts | Ink blue and gold, requirement-led copy, interactive service explorer and company profiles |

Option 01 is the default. Selection persists under `kkp-design-v3` in browser `localStorage`; blocked storage does not prevent switching. The previous storage key is not reused because the review set has changed. The standalone Modern, Heritage and Editorial options have been replaced in the switcher by the requested combined option; their historical source remains in Git.

The first three reference concepts are preserved in `src/components/OriginalHome.astro` and isolated in `src/styles/original.css` under `.previous-shell`. Their anchors have a `previous-` prefix, and the hero photos now advance automatically without selectors or captions. All seven concepts now share the service strip, interactive company expansion and company preview described below. Pastel Serif uses `src/components/LegacyHome.astro` and `src/styles/legacy.css`, with colors and fonts overlaid by `src/styles/hybrid.css`. It retains Modern's section geometry rather than adopting Heritage's split hero or centered layouts. Option 04 uses `hbanner01.jpg` in place of the architectural illustration. Supporting text is at least 2px larger across desktop and mobile, including navigation, buttons, descriptions, labels, captions and footer text; heading and company-title sizes are unchanged. Its company cards show full-color photos above solid white text panels, with three columns on desktop, two on tablet and one on mobile.

The current three designs share the page in `src/pages/index.astro` and `.new-shell[data-design]` styles. Only one page is visible at a time; all page IDs are unique. Company identity and image mappings come from `src/data/group.ts`, while current editorial copy lives in `src/data/homepage.ts`. Changes to current copy do not rewrite the previous iterations.

Option 02 uses a navy top contact bar with light text, followed by the same light grey navigation background as its chairman section (`--paper`, `#f3f5f7`) and a fine divider to separate the header from its white split hero; the mobile navigation matches the header. Its service carousel and attached heading use the same light grey with the Corporate blue used by its links and buttons, plus neutral dividers.

The previous and current Signature/Corporate/Precision designs retain Inter typography and the logo-derived blue, navy and gold palettes. The hybrid uses Heritage's `#142d4d` navy, `#d6a94c` gold and light neutral surfaces. Fonts load from Google Fonts with system fallbacks. The supplied logo is unchanged.

### Scrolling service strip and company interactions

All seven designs place **Find the service you need** in a box at the bottom of the hero, visually attached to the continuously moving row below. The heading box shares the strip’s background and text colors. The strip is 82px tall on desktop and 76px at tablet/mobile widths; it has no heading or pause/play button inside it. Links and actions across all seven designs use a shared, understated 16px stroke arrow pointing right. Diagonal arrows are reserved for external web pages; utility/contact links and non-interactive value rows omit arrows. Each theme supplies its own colors and typography; Pastel Serif retains its larger supporting text and white company-card panels.

| Service phrase | Destination company |
| --- | --- |
| Building services | Beam Electro-Mechanical Contracting |
| Property building | Eminent Contracting |
| Interior fit-out | FIS Interior Decoration |
| Custom joinery | Beam Carpentry |
| Building care | Superfine Services |
| Office space | Mint Business Center |
| Building systems maintenance | Beam Electro-Mechanical Contracting |
| Property repairs | Eminent Contracting |

These labels describe existing Beamco-derived scope. No additional capabilities have been introduced. `src/data/services.ts` is the single service-to-company mapping; `ServiceStrip.astro` renders it with page-specific anchor prefixes.

- The row loops seamlessly and pauses on hover/focus, with no visible playback controls. Offscreen strips pause. Reduced-motion preferences disable autoplay and expose an ordinary manually scrollable row; keyboard navigation also uses the static row. Duplicate loop links are excluded from the accessibility tree and tab order.
- A service click scrolls to its company card first. After scrolling settles for 120ms, a further 60ms pause precedes focusing and pinning the lift reveal. Hover/focus reveals are suppressed during this navigation, and another service selection or pointer, keyboard, wheel or touch input cancels the pending reveal. The selection stays expanded until dismissed or another company is selected. Hover and keyboard focus reveal the same content; tap/click pins or closes it. Following the [Tarento industry-card reference](https://www.tarento.com/industries/), hover uses a 60ms entry delay and a 160ms exit delay and lifts the company title and description together inside a fixed frame over 400ms. Card and grid geometry do not change during interaction. CSS transitions reverse smoothly; reduced-motion preferences skip the movement. Frames reserve enough room for the full profile at each width; content and font changes update that measurement independently of hover. Escape closes an expanded card. All six companies have the interaction in all seven designs.
- **Explore services** opens a themed, accessible in-page company preview with service information and an email enquiry link. This is the working prototype destination until dedicated company pages are built. It does not submit a form or send an enquiry automatically. The dialog supports Escape, a close button, focus containment and focus restoration.
- `CompanyCard.astro`, `CompanyReveal.astro`, `CompanyPreview.astro`, `src/scripts/company-interactions.ts`, `src/styles/company-cards.css` and `src/styles/services.css` implement the shared behavior without changing the seven-way design selection.

### Content and information architecture

The current revision keeps Signature, Corporate and Precision as visual directions but rebuilds their content around a prospective client's needs:

1. **Opening statement:** “From the first build to the everyday.” A short explanation of the group leads into four requirement links, followed by the scrolling service strip.
2. **Service explorer:** “What does your space need next?” Four native disclosure panels cover building, interiors, property care and workspace. Each explains the scope and links to the relevant businesses. Selecting a requirement updates the accompanying archive image.
3. **Work in context:** “Some of the work you see. Some you rely on.” An asymmetrical photographic spread connects completed interiors with the mechanical work behind them. The images come from the Beamco archive and do not represent a newly documented case study.
4. **Company directory:** “Get to know your specialist.” Six fixed-frame profiles explain each business and open a company preview with an email enquiry link. Links from the service explorer open the destination profile automatically; direct profile hashes also work.
5. **Chairman’s message:** All seven designs show the same message adapted from the text supplied for this section, alongside the chairman photograph. It retains the 1980 Boeing Electro-Engineering and Maintenance origin, the progression from maintenance to MEP works and the commitment to investing in equipment, technology and technical expertise. Options 01–03 pair the portrait with a compact “Built on experience — Since 1980” note rather than an oversized year. Shared copy is in `src/data/group.ts`; it remains subject to the content-review requirements below.
6. **Enquiry:** “What are you working on?” Practical guidance asks for the space, scope and location, alongside email, phone and office details. There is no submission form or backend.

The generic values section, repeated service summaries and statistics strip are absent from options 05–07. Their company directories now use the same lift-reveal cards as the reference concepts, retaining the two-column Corporate directory and wider Signature/Precision entries. Options 01–03 retain their photographic layouts, with the proof strip replaced by services and the cards enhanced with expandable profiles. All seven hero layouts now share an automatic slideshow of archived `hbanner01.jpg` and `hbanner04.jpg` images, advancing every six seconds with a crossfade and no selectors or captions. All seven designs begin with the rooftop image. Slideshows advance every six seconds even while the hero is hovered or focused. The next photo loads and decodes during that interval. Playback pauses when the hero is offscreen, the browser tab is hidden, or reduced motion is requested. Without JavaScript, the first image remains visible. The six company image mappings, chairman photograph and mechanical project image remain. New copy restates existing service facts in a different narrative; it adds no claims about awards, scale, certifications or named project results.

The design chooser supports Escape, outside click, focus restoration and an announcement of the selected design. Mobile navigation remains available in all seven options. Service disclosures work with the keyboard and without JavaScript. Company descriptions remain visible without JavaScript; JavaScript enables hover/focus/tap reveals, automatic profile opening from links and accompanying image changes. Transitions respect reduced-motion preferences.

The visual references are [Emrill](https://www.emrill.com/), [ServeU](https://serveu.ae/), [EFS](https://www.efsme.com/) and [Imdaad](https://imdaad.ae/). Their photography, clear service hierarchy and varied section layouts informed this revision. No competitor claims, statistics or imagery have been copied. On 10 November 2026, the Beamco homepage returned an HTTP 406 ModSecurity response during review, so the established Beamco-derived service facts and archived imagery were used as the basis for fresh copy. The blocked homepage and chairman page were retried during the content rewrite; no unsupported factual additions were made.

## Validation of the redesign

The lift-reveal revision was checked across all seven designs: hover leaves card dimensions, page height and scroll position unchanged; all six company profiles fit at 320, 390, 768 and 1440px. Touch pin/close, keyboard service navigation, preview focus restoration, reduced motion and the no-JavaScript descriptions were verified.

- `npm run build` passes with static output; editor diagnostics report no errors in the changed Astro, TypeScript or CSS files.
- Production-browser checks cover all seven switcher choices, saved selection after refresh, mobile menu open/close, Escape and focus restoration, requirement links, company-profile opening, deep links, unique page IDs and runtime errors. Service-strip checks cover all eight mappings in all seven designs, both copies of the loop, pointer/keyboard activation, card expansion, preview focus restoration and reduced motion.
- All seven options are checked at 390px; the new concepts are also checked for horizontal overflow at 320, 600, 768, 1024, 1440 and 1920px.
- Automated axe checks for WCAG 2 A/AA and 2.1 AA found no violations in the three new concepts or open design chooser. This is an automated check, not a full accessibility audit of the legacy designs.
- The chooser works when browser storage is blocked. With JavaScript disabled, the default previous Signature content and links remain visible.

## Image assets

The original Beamco website's publicly referenced images are retained in
`public/images/beamco/webimg/`. This is a source archive of 172 files,
preserving the former site's filenames so a relevant photo can be identified
and promoted into a future KKP page without depending on the old host. The
archive includes brand-era logos, responsive banners, team and company imagery,
project photography, and interface graphics.

These images are source material only. Confirm client ownership and which images
are approved for the KKP Group before publishing them on the new site. The
client-supplied KKP Group logo is at `public/images/brand/kkp-group-logo.png`
and is used in the site header and footer.

The landing page uses the six relevant legacy inner banners as
cover images for the group-company cards: Beam Electro-Mechanical (13), Beam
Carpentry (04), FIS Interior Decoration (05), Superfine Services (08), Mint
Business Center (07), and Eminent Contracting (09). The shared Astro company
data keeps company names and image mappings consistent across all
seven review options. Current requirement descriptions and company profiles are separate
from both previous-iteration and hybrid copy.

The landing page also uses the former site’s chairman photograph and a Beam
Electro-Mechanical project photograph. These assets are shown with captions or
alt text and remain subject to client approval for the KKP Group site.

## Page content and open decisions

Marketing copy, header labels and metadata avoid geographic limits such as “across the UAE” and “based in Dubai”. Location descriptions in narrative and image alt text are generalized, and the chairman’s message summarizes the progression from maintenance to MEP works rather than listing location-specific client references. Specific locations remain in the office addresses; no wider geographic footprint is claimed.

The claim that operations began in 1980 as Beamco Group was identified as incorrect and removed from page copy. The chairman’s supplied message identifies the original venture as Boeing Electro-Engineering and Maintenance.

Public copy uses service- and expertise-led language in navigation, headings, enquiry guidance and profile actions, avoiding generic references such as “our companies” or “the relevant company”. The individual business names and internal routing/data identifiers remain unchanged.

Public-facing archive disclaimers, client-confirmation notes and prototype labels have been removed from the seven page designs. Source provenance and provisional-content review requirements remain documented here; this presentation change does not imply client approval. The design chooser remains available for stakeholder review.

The new homepage and seven-way design switcher are in `src/pages/index.astro`; new page styles are in `src/styles/global.css`; preserved reference markup/styles are in `src/components/LegacyHome.astro` and `src/styles/legacy.css`; shared company identity data and reference principles are in `src/data/group.ts`, with new editorial copy in `src/data/homepage.ts`. Document metadata and the shared layout are in `src/layouts/Layout.astro`.

The current content was adapted from [beamcointl.com](https://beamcointl.com/), with visual references from ServeU, EFS, Imdaad, and Emrill. It includes these six company names: Beam Electro-Mechanical, Beam Carpentry, FIS Interior Decoration, Superfine Services, Mint Business Center, and Eminent Contracting. The previous site is not fully consistent about the group portfolio and age, and does not establish the new KKP brand. Verify with the client before treating names, history, service descriptions, contact details, project claims, or the KKP Group logo treatment as final.

Before public launch, confirm:

- KKP's approved logo, brand colors, typefaces, and preferred design direction.
- Which businesses belong in the group and their approved names and descriptions.
- The founding/history wording and any claims about group scale or projects.
- Current contact details, office address, careers destination, and legal/privacy requirements.
- Whether the design switcher should be removed after a direction is selected.

## Future MRF workflow

A material request form with approvals needs a trusted backend, identity/access control, durable storage, and an approval workflow. Do not model approvals or store sensitive requests only in browser state. The static public site can remain on GitHub Pages while the MRF is provided by a separate API/application, or the hosting plan can be revisited when a server runtime is chosen.

## Handoff notes

- Keep the design concepts switchable while stakeholder review is in progress; keep all seven in the documented order, preserve previous iterations separately, and update company identity data in its shared module.
- Keep provisional source-site details identified as provisional until the client confirms them.
- There is no React/Vue/Svelte island or backend integration in the prototype.
- The GitHub Pages workflow deploys the generated `dist/` output; do not publish `src/` or `node_modules/` as the site.
- Avoid adding a backend adapter unless server-rendered routes are intentionally introduced and the target runtime is available.

## Project structure

```text
src/
  layouts/Layout.astro      Shared HTML shell, metadata, and stylesheet import
  pages/index.astro         Landing page, company content, and design switcher
  styles/global.css         New responsive layouts, typography, and review switcher
  styles/legacy.css         Scoped original reference styles
  components/LegacyHome.astro Modern layout used by the hybrid
  components/OriginalHome.astro Original-content concepts
  styles/original.css       Isolated styles for options 01–03
  styles/hybrid.css         Heritage color and typography overlay for option 04
  data/group.ts             Shared company identity and reference principles
  data/homepage.ts          New requirement-led copy and company profiles
  data/services.ts          Shared service-to-company mapping
  components/ServiceStrip.astro Scrolling service navigation
  components/ServiceHeading.astro Hero-attached service label
  components/HeroSlideshow.astro Shared automatic hero photography
  scripts/hero-slideshow.ts  Visibility-aware six-second slideshow
  components/CompanyCard.astro Fixed-frame company card and sliding panel
  components/CompanyReveal.astro Company description and preview action
  styles/company-cards.css   Lift-reveal layouts and theme treatments
  components/CompanyPreview.astro Shared company preview dialog
  scripts/company-interactions.ts Strip, card and dialog behavior
  styles/services.css       Shared interactions and theme treatments
public/
  favicon.svg               Prototype KKP monogram favicon
  images/beamco/webimg/     Archived public Beamco source imagery (172 files)
```

See [Astro documentation](https://docs.astro.build/) for framework guidance.
