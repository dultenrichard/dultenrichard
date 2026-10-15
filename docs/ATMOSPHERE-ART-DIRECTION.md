# The Current — art-direction research and final design principles

October 14, 2026 · Design investigation for draft PR #9.

## The brief

The website should not be a catalogue or an accumulation of independently styled sections. It must be a memorable, atmospheric personal introduction with *only* the essential highlights, a full-colour uncropped portrait, and a deliberate closing with the owner's quote. Professional detail lives on LinkedIn. The circular "Discover" ornament is explicitly not wanted.

## Sites studied

### Steven Mengin — https://stevenmengin.com/

Primary lesson: a creative-director portfolio can speak through scale, editorial hierarchy, immersive audiovisual tone, intentional pacing, and confidently sparse labels rather than by filling every inch of the interface. The creative work is showcased in a singular visual grammar. The site documents its own interactive experiences, experiential environments, and photography-driven narratives. Our site is **not** a design agency portfolio and should never invent creative clients, motion work or production credentials. Adopt the deliberate tone and precision; not the content.

### Milan Compain — https://milancompain.com/

The Awwwards nominee listing from September 8, 2026 describes "Follow the star", one cosmic journey with a particle-door entrance, an emerald guiding star, a constellation of words and WebGL. Source: https://www.awwwards.com/sites/milan-compain

Primary lesson: the design's connective thread is a continuously developing visual universe that visitors travel through. We do *not* reproduce the star, space theme, or technical showpiece. Our connective thread is atmospheric water/light with the same film grain, palette, type and luminous path across the entire page. The current already has a valid reason to exist for this person: maritime interests and his own saying, "To be a leader is to be liquid."

### DNA Media by The Ash Design — https://www.theash.design/work/dna

The case study treats an animated portfolio like a film sequence. The key insight is that motion is a narrative tool: it organizes attention and pace and connects content in one consistent voice, rather than functioning as section-by-section decoration.

### Veloste — https://www.veloste.com/case-studies/veloste/

Its case study details a single scroll axis, a unified visual transition metaphor, and a conventional underlying interface. Important lesson: an unusually creative interaction should not demand a new user gesture or create navigation confusion. Visitors must be able to use ordinary scrolling and keyboard controls. We therefore removed the large circular discovery interaction and let the site navigation/waypoints remain conventional.

### 14islands — https://www.14islands.com/services

The studio emphasizes branded spatial experiences, coherent identity, spatial navigation, progressive enhancement, accessibility and functional UX. Lesson: depth and branded emotion are valuable when they clarify the story and stay usable.

### Engineering references

- https://web.dev/learn/css/view-transitions-spas — native transition continuity; ensure fallback and reduced motion.
- https://web.dev/learn/accessibility/motion — pause/motion control and respect for user preferences.
- https://web.dev/articles/prefers-reduced-motion — avoid forced movement.
- https://web.dev/src/site/content/en/blog/animations-and-performance/index.md — prefer transform/opacity, throttle canvas animation, avoid layout thrashing.

## Chosen direction: one environment, four movements

The design story is not four pages nested in a single scroll. It is the experience of moving through the same location in changing light.

1. **Surface (Introduction):** full-screen water, unusually large live HTML lettering, subtle hand-drawn/current-field motion. The initial visual belongs to the hero and remains as the atmospheric foundation under every subsequent movement. No circular discovery control, compass widget or fake loading delay.
2. **Depth (About):** the palette remains dark-water blue with a measured lift in teal light, not a sudden switch to a beige paper page. The original portrait remains in full colour and its native proportion: no grayscale, clipping, object-fit cover or imposed aspect ratio. The portrait is an actual image, not a composited cutout.
3. **Current (Highlights):** one deliberate immersive stage where three *verified* highlights can be explored. The same background and micro-label system continues. The stage's motion and typographic scale are restrained by the primary data, and the interaction accepts pointer, keyboard and touch.
4. **Horizon (Closing):** the same space returns to deeper twilight. The original quotation has room to hold attention, followed by LinkedIn and contact. This is the only major poetic callout and therefore earns its position.

**One design vocabulary:** sea-abyss, deep mineral navy, cyan-lit mist, warm natural ivory, quiet antique gold. Newsreader display and condensed/small editorial captions. One understated current/film-grain layer, shared by all home sections. Line weights, baseline labels, active-state language, corner treatment and spacing repeat throughout.

## What must NOT return

- Black-and-white CSS filter, fake portrait crop or rotated-image treatment.
- The hero's large circular discover overlay or decorative compass widget.
- A projects gallery, sprawling résumé, overly detailed timelines on the homepage.
- Abrupt beige/white intermissions and separate unrelated coloured cards.
- Generic neon 3D planet, star guide, glassmorphism dashboard, badges or excessive scroll-jacking.
- Unsourced achievements or implied completed workshops/partnerships.

## Quality criteria before merge

- The image must render full colour with its natural width-to-height proportion on desktop and phone.
- The menu, chapter navigation, LinkedIn and contact links must remain functional.
- No horizontal overflow on mobile, text collisions, broken images or invisible spotlight panels.
- Home scenes should feel related in colour and texture in *full-page* screenshots; individual viewport screenshots are insufficient.
- Reduced-motion devices should have readable, still compositions; Pause Motion stops nonessential movement.
- Project URLs may remain quiet legacy noindex routes, while project data stays stored for possible future publication.
- The production site remains unchanged until draft review and an explicit merge decision.

This document records design reasoning and source references; it does not claim that a reference site was captured and dissected frame by frame or that awards/public search ranking are guaranteed.
