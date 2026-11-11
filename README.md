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

## Deployment decision

The prototype uses Astro's default static output. Build it in CI or on a machine with Node.js, then upload the **contents** of `dist/` to the cPanel document root (commonly `public_html`). The website host does not need to run Node.js for these static files.

The page has no working form submission or server-side behavior. Email and phone links use the contact details currently published by Beamco; confirm them before launch. Future dynamic features should be designed separately from this static marketing page.

## Design concepts

The floating **Explore designs** control offers exactly seven saved directions, in this order:

| Option | Direction | Content and layout |
| --- | --- | --- |
| 01 | Signature · Reference concepts | Restored from commit `9a84895`: photographic group overview and six-company grid |
| 02 | Corporate · Reference concepts | Restored from `9a84895`: split-screen introduction and company profile cards |
| 03 | Precision · Reference concepts | Restored from `9a84895`: dark editorial presentation and numbered company index |
| 04 | Pastel Serif · Reference concepts | Modern's layout and architectural illustration, with a soft heritage palette and Cormorant Garamond headings |
| 05 | Signature · Requirement-led concepts | Royal blue and gold, requirement-led copy, interactive service explorer and company profiles |
| 06 | Corporate · Requirement-led concepts | White and navy, requirement-led copy, interactive service explorer and company profiles |
| 07 | Precision · Requirement-led concepts | Ink blue and gold, requirement-led copy, interactive service explorer and company profiles |

Option 01 is the default. Selection persists under `kkp-design-v3` in browser `localStorage`; blocked storage does not prevent switching. The previous storage key is not reused because the review set has changed. The standalone Modern, Heritage and Editorial options have been replaced in the switcher by the requested combined option; their historical source remains in Git.

The first three reference concepts are preserved in `src/components/OriginalHome.astro` and isolated in `src/styles/original.css` under `.previous-shell`. Their anchors have a `previous-` prefix, and their photo controls still work. Pastel Serif uses `src/components/LegacyHome.astro` and `src/styles/legacy.css`, with colors and fonts overlaid by `src/styles/hybrid.css`. It retains Modern's section geometry rather than adopting Heritage's split hero or centered layouts.

The current three designs share the page in `src/pages/index.astro` and `.new-shell[data-design]` styles. Only one page is visible at a time; all page IDs are unique. Company identity and image mappings come from `src/data/group.ts`, while current editorial copy lives in `src/data/homepage.ts`. Changes to current copy do not rewrite the previous iterations.

The previous and current Signature/Corporate/Precision designs retain Inter typography and the logo-derived blue, navy and gold palettes. The hybrid uses Heritage's `#142d4d` navy, `#d6a94c` gold and light neutral surfaces. Fonts load from Google Fonts with system fallbacks. The supplied logo is unchanged.

### Content and information architecture

The current revision keeps Signature, Corporate and Precision as visual directions but rebuilds their content around a prospective client's needs:

1. **Opening statement:** “From the first build to the everyday.” A short explanation of the group leads into four requirement links, without the old statistics strip.
2. **Service explorer:** “What does your space need next?” Four native disclosure panels cover building, interiors, property care and workspace. Each explains the scope and links to the relevant businesses. Selecting a requirement updates the accompanying archive image.
3. **Work in context:** “Some of the work you see. Some you rely on.” An asymmetrical photographic spread connects completed interiors with the mechanical work behind them. It is explicitly archive photography, not an invented case study.
4. **Company directory:** “Get to know your specialist.” Six expandable profiles explain each business and provide a company-specific email enquiry. Links from the service explorer open the destination profile automatically; direct profile hashes also work.
5. **Group background:** A concise origin story and the chairman photograph provide context later in the page. There are no invented leadership quotes or new historical milestones.
6. **Enquiry:** “What are you working on?” Practical guidance asks for the space, scope and location, alongside email, phone and office details. There is no submission form or backend.

The generic values section, repeated service summaries, statistics strip, company-card wall and hero slideshow are absent from options 05–07; options 01–03 preserve their previous layouts and slideshow. Hero photography still uses the archived `hbanner03.jpg`; the six company image mappings, chairman photograph and mechanical project image remain. New copy restates existing service facts in a different narrative; it adds no claims about awards, scale, certifications or named project results.

The design chooser supports Escape, outside click, focus restoration and an announcement of the selected design. Mobile navigation remains available in all seven options. Service and company disclosures work with the keyboard and without JavaScript. JavaScript adds automatic profile opening from links and accompanying image changes. Transitions respect reduced-motion preferences.

The visual references are [Emrill](https://www.emrill.com/), [ServeU](https://serveu.ae/), [EFS](https://www.efsme.com/) and [Imdaad](https://imdaad.ae/). Their photography, clear service hierarchy and varied section layouts informed this revision. No competitor claims, statistics or imagery have been copied. On 10 November 2026, the Beamco homepage returned an HTTP 406 ModSecurity response during review, so the established Beamco-derived service facts and archived imagery were used as the basis for fresh copy. The blocked homepage and chairman page were retried during the content rewrite; no unsupported factual additions were made.

## Validation of the redesign

- `npm run build` passes with static output; editor diagnostics report no errors in the changed Astro, TypeScript or CSS files.
- Production-browser checks cover all seven switcher choices, saved selection after refresh, mobile menu open/close, Escape and focus restoration, requirement links, company-profile opening, deep links, unique page IDs and runtime errors.
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

The new homepage and seven-way design switcher are in `src/pages/index.astro`; new page styles are in `src/styles/global.css`; preserved reference markup/styles are in `src/components/LegacyHome.astro` and `src/styles/legacy.css`; shared company identity data and reference principles are in `src/data/group.ts`, with new editorial copy in `src/data/homepage.ts`. Document metadata and the shared layout are in `src/layouts/Layout.astro`.

The current content was adapted from [beamcointl.com](https://beamcointl.com/), with visual references from ServeU, EFS, Imdaad, and Emrill. It includes these six company names: Beam Electro-Mechanical, Beam Carpentry, FIS Interior Decoration, Superfine Services, Mint Business Center, and Eminent Contracting. The previous site is not fully consistent about the group portfolio and age, and does not establish the new KKP brand. Verify with the client before treating names, history, service descriptions, contact details, project claims, or the KKP Group logo treatment as final.

Before public launch, confirm:

- KKP's approved logo, brand colors, typefaces, and preferred design direction.
- Which businesses belong in the group and their approved names and descriptions.
- The founding/history wording and any claims about group scale or projects.
- Current contact details, office address, careers destination, and legal/privacy requirements.
- Whether the design switcher should be removed after a direction is selected.

## Future MRF workflow

A material request form with approvals needs a trusted backend, identity/access control, durable storage, and an approval workflow. Do not model approvals or store sensitive requests only in browser state. The static public site can remain on cPanel while the MRF is provided by a separate API/application, or the hosting plan can be revisited when a server runtime is chosen.

## Handoff notes

- Keep the design concepts switchable while stakeholder review is in progress; keep all seven in the documented order, preserve previous iterations separately, and update company identity data in its shared module.
- Keep provisional source-site details identified as provisional until the client confirms them.
- There is no React/Vue/Svelte island or backend integration in the prototype.
- For cPanel, deploy the generated `dist/` files, not `src/` or `node_modules/`.
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
public/
  favicon.svg               Prototype KKP monogram favicon
  images/beamco/webimg/     Archived public Beamco source imagery (172 files)
```

See [Astro documentation](https://docs.astro.build/) for framework guidance.
