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

The floating **Explore designs** control switches between three visual directions. The selected direction is stored in browser `localStorage`, so it remains selected on that browser after refresh.

| Direction | Typography | Layout |
| --- | --- | --- |
| Modern | Manrope headings, DM Sans body | Open three-column company grid and architectural hero |
| Heritage | Cormorant Garamond headings, Source Sans 3 body | Split hero, centered company cards, three-column values |
| Editorial | Space Grotesk throughout | Dark oversized hero and single-column company index |

All directions share one set of semantic page content; `data-design` on the `.site-shell` selects the visual treatment. The architecture illustration is drawn with CSS. Fonts load from Google Fonts, with system fallbacks in the stylesheet.

Supporting text follows a shared readability scale across concepts: body text is roughly 15–17px, secondary copy 13–15px, and labels at least 12px; display-heading sizes are intentionally preserved.

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

## Page content and open decisions

The homepage is in `src/pages/index.astro`; its page-level styles are in `src/styles/global.css`; the document metadata and shared layout are in `src/layouts/Layout.astro`.

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

- Keep the design concepts switchable while stakeholder review is in progress; edit the single shared page rather than creating near-duplicate pages for each concept.
- Keep provisional source-site details identified as provisional until the client confirms them.
- There is no React/Vue/Svelte island or backend integration in the prototype.
- For cPanel, deploy the generated `dist/` files, not `src/` or `node_modules/`.
- Avoid adding a backend adapter unless server-rendered routes are intentionally introduced and the target runtime is available.

## Project structure

```text
src/
  layouts/Layout.astro      Shared HTML shell, metadata, and stylesheet import
  pages/index.astro         Landing page, company content, and design switcher
  styles/global.css         Responsive layout, typography, illustrations, and themes
public/
  favicon.svg               Prototype KKP monogram favicon
  images/beamco/webimg/     Archived public Beamco source imagery (172 files)
```

See [Astro documentation](https://docs.astro.build/) for framework guidance.
