# Interactive preview (does not publish the site)

**For a visual test of the real source branch, open this repository commit in StackBlitz.** The preview contains the existing static markup, typography, styles, scripts, illustrations, route hierarchy and PDF. It is not a new implementation and does not modify GitHub `main`. Browser-powered StackBlitz imports are documented at https://developer.stackblitz.com/guides/user-guide/importing-projects.

The zero-dependency preview server exists solely for local and WebContainer visual testing. `package.json` starts it with `npm run dev`, and `.stackblitzrc` configures the WebContainer automatically. The server treats folders as `index.html` routes, sends standard content types and returns an X-Robots-Tag of `noindex, nofollow` on every response. It blocks source directories and directory traversal. Analytics in `site.js` loads only on the intended public hostname, not in StackBlitz.

Preview checks:

- Homepage desktop and phone: lettering, portrait, water and light imagery, horizontal overflow, contrast, font loading.
- Projects: sailing drawing, Youth Leadership Workshops tactical board, the four-phase Listen/Decide/Act/Reflect interaction.
- Navigation: About, Experience, Awards, Projects, Sources, Timeline; search, skills filters, old URL redirects and PDF download.
- Motion: reduced-motion OS preference, pause/resume control, scroll transitions and delayed navigation.
- Accessibility: keyboard focus, mobile tap targets, the search dialog, legible responsive type, long text.
- Data: visible awards, schools and training match `data/profile.json`; the pilot remains marked as uncompleted.

This preview is not a substitute for production browser QA or a root GitHub Pages deployment. The stable source of truth is draft PR #9. Any observation on StackBlitz should be fixed in the draft GitHub branch before production publication.


## Unified atmospheric edition — October 14

The former separate home-only spotlight style and motion assets are **not loaded**. All published pages use `styles.css` and `site.js` as the one shared design and interaction system. Source files remain archived in GitHub if an earlier approach needs reviewing; they are not production dependencies.

Check the whole four-movement page—not isolated screenshots. The atmosphere, lighting, typography and continuous background should read as one visual place from the opening through About, the three interactive highlights, and the closing quotation. The original full-colour portrait is shown completely without an aspect-ratio crop, clipping mask or grayscale treatment. The circular Discover control is removed. The hero compass ornament was also retired.

The current public-facing homepage remains deliberately short: introduction, three verified highlights, LinkedIn handoff and quote/contact. Projects remain out of the public navigation and legacy projects are noindex.

See `docs/ATMOSPHERE-ART-DIRECTION.md` for comparison with Steven Mengin, Milan Compain and other immersive references, plus source and accessibility notes.
