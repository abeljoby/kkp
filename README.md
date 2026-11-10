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

The floating **Explore designs** control now offers six visual directions. The three new concepts are listed first; **Modern, Heritage and Editorial** are preserved under “Earlier concepts” for comparison. Signature is the default. Selection persists under `kkp-design-v2` in browser `localStorage`; blocked storage does not prevent switching. The old selection key is deliberately not reused, so returning reviewers see the new default first.

| Direction | Palette and typography | Layout |
| --- | --- | --- |
| Signature (new) | Logo-derived royal blue `#123d8d`, navy `#0a2349`, gold `#d9b55c`; Inter | Panoramic photographic hero, varied company grid, blue history section, three-column principles |
| Corporate (new) | White, navy `#102b50`, blue `#173c76`, gold `#d2ac55`; Inter | Split hero, photo-led company cards, chairman image beside history, vertical principles |
| Precision (new) | Ink blue `#101d33`, blue `#143d80`, gold `#dbb967`; Inter | Dark inset-photo hero, horizontal company index, three-part history layout |
| Modern (reference) | Original Manrope / DM Sans, green palette | Original architectural hero and company grid |
| Heritage (reference) | Original Cormorant Garamond / Source Sans 3 | Original split hero and classic corporate layout |
| Editorial (reference) | Original Space Grotesk | Original oversized dark hero and company index |

The new palette takes its blue and gold from the supplied logo; the lotus colors remain in the unmodified logo. The new typography is intentionally restrained, with no cursive or decorative accent face. Font files load from Google Fonts with system sans-serif fallbacks. The original font families are retained only for the reference concepts.

The three new directions share semantic content and use `data-design` on `.new-shell` to select layouts. The reference page lives in `src/components/LegacyHome.astro`, with its original styles scoped under `.legacy-shell` in `src/styles/legacy.css`. Company and principles data are shared from `src/data/group.ts`. Only the selected page is visible; reference anchors are prefixed to avoid duplicate IDs. Existing heading wording, wider content treatment, readable supporting text, removed eyebrow labels and image mappings are retained.

New hero photography comes from the archived Beamco banners (`hbanner03.jpg`, `hbanner01.jpg`, `hbanner04.jpg`). It can be changed with labelled, keyboard-accessible controls; there is no autoplay. Transitions respect reduced-motion preferences. The design chooser supports Escape, outside click, focus restoration and an announcement of the selected design. Mobile navigation remains available in all six concepts. New company enquiry links open an email addressed to the existing group contact with the relevant company in the subject.

The visual references are [Emrill](https://www.emrill.com/), [ServeU](https://serveu.ae/), [EFS](https://www.efsme.com/) and [Imdaad](https://imdaad.ae/). Their photography, clear service hierarchy and varied section layouts informed this revision. No competitor claims, statistics or imagery have been copied. On 10 November 2026, the Beamco homepage returned an HTTP 406 ModSecurity response during review, so existing Beamco-derived copy and archived imagery were retained rather than adding claims that could not be rechecked.

## Validation of the redesign

- `npm run build` passes with static output; editor diagnostics report no errors in the changed Astro, TypeScript or CSS files.
- Production-browser checks cover all six switcher choices, saved selection after refresh, mobile menu open/close, Escape and focus restoration, hero image selection, image loading, unique page IDs and runtime errors.
- All six concepts were checked at 390px; the new concepts were additionally checked for horizontal overflow at 320, 600, 768, 1024 and 1920px.
- Automated axe checks for WCAG 2 A/AA and 2.1 AA found no violations in the three new concepts or open design chooser. This is an automated check, not a full accessibility audit of the legacy designs.
- The chooser works when browser storage is blocked. With JavaScript disabled, the default Signature content and links remain visible.

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
data keeps those labels, descriptions, and image mappings identical in all
six review concepts.

The landing page also uses the former site’s chairman photograph and a Beam
Electro-Mechanical project photograph. These assets are shown with captions or
alt text and remain subject to client approval for the KKP Group site.

## Page content and open decisions

The new homepage and six-way design switcher are in `src/pages/index.astro`; new page styles are in `src/styles/global.css`; preserved reference markup/styles are in `src/components/LegacyHome.astro` and `src/styles/legacy.css`; shared company and principles data are in `src/data/group.ts`. Document metadata and the shared layout are in `src/layouts/Layout.astro`.

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

- Keep the design concepts switchable while stakeholder review is in progress; keep the three new concepts on one shared page, preserve the earlier reference concepts, and update company data in its shared module.
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
  components/LegacyHome.astro Original reference page
  data/group.ts             Shared company and principles data
public/
  favicon.svg               Prototype KKP monogram favicon
  images/beamco/webimg/     Archived public Beamco source imagery (172 files)
```

See [Astro documentation](https://docs.astro.build/) for framework guidance.
