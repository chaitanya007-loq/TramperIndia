# TRAMPER India

Frontend for the TRAMPER India travel website.

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
npm run lint
```

## Project locations

- Brand and navigation placeholders: `src/data/company.js`
- Sample packages: `src/data/packages.js`
- Destinations: `src/data/destinations.js`
- Gallery images: `src/data/gallery.js`
- Placeholder testimonials: `src/data/testimonials.js`
- Reusable homepage and route components: `src/App.jsx`
- Responsive visual system: `src/App.css`
- Official logo: `public/assets/tramper-logo.png`, used by the shared `Logo()` component.
- Hero media: add approved files at `public/media/tramper-hero.mp4` and `public/media/tramper-hero-poster.jpg`.

The project includes Stage 1–3 implementation: responsive homepage, data-driven sections, GSAP reveals, Swiper carousels, gallery lightbox, and a video-ready hero. Supabase, enquiry handling, and admin functionality are deferred.
