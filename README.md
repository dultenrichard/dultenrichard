# Dulten Richard — Personal Website

A responsive, editorial personal website published through GitHub Pages.

**Live site:** https://dultenrichard.github.io/dultenrichard/

## Structure

- `index.html` — narrative homepage, biography, interests, timeline and contact paths.
- `styles.css` — responsive visual system, typography, accessibility and reduced-motion support.
- `script.js` — navigation, campaign attribution and privacy-conscious event instrumentation.
- `robots.txt` and `sitemap.xml` — search crawler guidance for the current GitHub Pages URL.

## Analytics and campaign attribution

The site records structured events into `window.dataLayer` and dispatches a `site:analytics` browser event. Events include:

- `page_view` with referrer and UTM campaign parameters.
- `section_view` when a content section enters the viewport.
- `scroll_depth` at 25%, 50%, 75% and 90%.
- `site_interaction` for navigation, booking and outbound profile links.
- `page_exit` with maximum scroll depth and a basic engagement-time estimate.

UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are retained for the current browser session.

**Important:** no analytics account or measurement ID has been connected yet. To send events to Google Analytics 4, create a GA4 web data stream and place its real `G-...` measurement ID in the `GA4_MEASUREMENT_ID` constant near the top of `script.js`. Until then, events are available locally to browser integrations but are not transmitted to an analytics dashboard. Review applicable privacy and consent requirements before enabling third-party analytics.

## SEO

The canonical URL, Open Graph URL, Person structured data, robots sitemap reference and sitemap all use the current GitHub Pages project URL. Update these together if a custom domain is connected in the future.

## Local preview

Open `index.html` in a browser or serve the repository directory with any static file server. No build step is required.
