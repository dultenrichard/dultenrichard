# In Good Company — Dulten Richard

A completely new website built from the clean-room October 2026 branch. The content and creative direction are grounded in `Dulten_Richard_Website_Research(1).md` provided by the owner.

## Editorial idea

One photographic essay: **Presence → Responsibility → Participation → Perspective → Invitation**.

The opening is a real, uncropped, full-colour portrait beside the owner's name. On desktop the portrait stays in place while the story moves from introduction to profile. Everything else follows the same columns, typography and spacing; nothing is presented as a card grid or separate coloured micro-site.

The interface is intentionally restrained. Native scrolling, real links, a small amount of optional scroll choreography, no canvas or 3D. Reduced-motion visitors receive exactly the same words and destinations.

## What is and is not included

- One verified original portrait (the full-colour image already provided in the owner's prior repository), natural ratio 360×495. Higher-resolution and documentary photographs have not been supplied, so the site does **not** invent or fabricate them.
- Selected public highlights: cadet instruction and Lord Strathcona Medal, 205 verified community hours, rugby silver and Manufacturing SHSM.
- Youth leadership workshops are described only as *in development*.
- Full professional records are linked to LinkedIn rather than duplicated.
- No analytics, cookies, tracking, accounts, backends, forum, or fabricated social proof.
- The website is staged **noindex**. Publishing and domain/host verification remain separate owner-approved steps.

## Local preview

`npm run dev` then open `http://localhost:3000/`.

For browser QA: `npm install --no-save playwright && npx playwright install chromium && node tests/browser-smoke.mjs`.

## Before publishing

1. Confirm the final public web domain and get hosting/deployment working.
2. Approve exact biographical wording, portrait permissions and the current cadet appointment.
3. Consider supplying 1–2 genuine documentary photographs of instruction/community activities for more intentional image transitions. These are **not** prerequisites for the current coherent one-photo composition.
4. Consider self-hosting the open-licensed font families after licence/size review. Current preview links to Google Fonts and has system fallbacks.
5. Remove the **noindex** directive and preview robots restrictions *only after* verified publication is authorised.
6. Check final metadata, OpenGraph image, real 404 behaviour and manually test on Android/iOS.
