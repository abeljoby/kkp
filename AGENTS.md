## Development

When starting the dev server, use background mode:

```
npm run dev -- --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
If Astro is only installed in the project (the expected setup), use the npm script wrapper:

```
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Use the port reported by `status`; another process or stale lock can cause Astro to select a port other than 4321. In Codespaces, open the forwarded port shown by the Ports panel. The background server requires permission to bind a network port in restricted execution environments.

## Project handoff

- This is a static Astro landing-page prototype for the UAE-based KKP Group. The default Astro output is static, and `npm run build` writes deployable files to `dist/`.
- The intended cPanel deployment is to build with Node/npm, then upload the contents of `dist/` to the cPanel document root. Node.js is not required on the host for this static site.
- The current homepage has three review concepts (Modern, Heritage, Editorial) selected through the floating design switcher. Keep them switchable until stakeholders pick a direction. They share page content and use CSS themes selected by `.site-shell[data-design]`.
- Content and contact details were adapted from the former Beamco site and are provisional. Do not treat company names, group history, claims, or contact information as client-approved. See `README.md` for the review checklist and decisions.
- The future material request form and approval workflow are out of scope for this static prototype. They will need a backend with authentication, durable storage, and server-enforced approvals; do not implement approval state in local storage or the public page.
- Keep `README.md` current when hosting, content, architecture, or design-direction decisions change.

## Build

Use the project's Node.js requirement (`>=22.23.4`) and npm scripts:

```
npm run build
npm run preview
```

The project currently has no test script. Run the static build to catch Astro compilation and prerendering errors.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
