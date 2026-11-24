# Amin Ragab | Software Pioneers (`aminrajab.tech`)

Official 3D Spatial Portfolio & Digital Showcase for **Amin Ragab (أمين رجب)** — Senior Flutter & Web Architect, Founder of **رواد البرمجيات (Software Pioneers)**.

- **Live Website:** [https://aminrajab.tech/](https://aminrajab.tech/)

---

## Architecture & Highlights

- **Apple VisionOS 3D Spatial + Luxury Fintech UI (RTL Arabic):**
  - Obsidian Void (`#05070c`), Royal Gold (`#d4af37`), Neon Cyan (`#00e5ff`), and Emerald Live (`#10b981`) visual system with `Cairo`, `Tajawal`, and `Plus Jakarta Sans` typography.
  - Multi-plane 3D orbital Hero stage with gyroscopic rings, holographic portrait prism, and depth-tagged spatial HUD badges.
  - 3D titanium browser mockups and holographic mobile device frames inside `#portfolio`, complete with a studio pedestal presentation for light-canvas client logos.
- **60fps / 120Hz Zero-Dependency ES6 Engine (`script.js`):**
  - Interactive perspective-projected 3D constellation backdrop (`#spatial-canvas`) with DPR capping, scroll/pointer camera parallax, `visibilitychange` auto-pause, and `prefers-reduced-motion` static fallback.
  - GPU-composited scroll progress (`--scroll-scale` + `scaleX`), GPU cursor glow (`translate3d`), `IntersectionObserver` scroll-spy/reveals/counters, cached-rect zero-lag 3D card tilt, and race-condition-free portfolio filtering.
  - Rich 3D case-study modal hydrated from per-project `data-*` attributes and an interactive 30-second **"مستشار المشاريع الذكي"** WhatsApp brief configurator.
- **SEO & Safe Subpath-Isolated PWA:**
  - Complete OpenGraph (`ar_EG`), Twitter Card (`summary_large_image`), `@graph` `JSON-LD` (`WebSite`, `Person`, `ProfessionalService`, 8-item `ItemList`), `favicon.svg`, `robots.txt`, and `sitemap.xml`.
  - Root-scoped Service Worker (`sw.js`, `amin-portfolio-v2`) with Network-First HTML navigation, Stale-While-Revalidate assets, and a strict sibling-subpath guard that never hijacks separate hosted repositories.

---

## Featured Applications & Live Client Platforms

### Flutter & Offline-First Applications (Google Play / Windows ERP)
1. **Nova Academy Plus** — Multi-center educational ERP (Android & Windows, Isar DB, QR attendance, atomic backups, WhatsApp automation) — [Google Play](https://play.google.com/store/apps/details?id=com.amin.novaacademy)
2. **Nova Academy** — Independent instructor management & QR attendance with PDF reports — [Google Play](https://play.google.com/store/apps/details?id=com.amin.doctors_pro)
3. **Market Control** — Offline-First POS & 14,000+ item inventory management with Shift Z-Reports — [Google Play](https://play.google.com/store/apps/details?id=com.amin.market_control)
4. **تطبيق ميزانيتي (Mizaniti)** — Personal & business finance tracker with Hive DB, interactive charts, and PDF statements — [Google Play](https://play.google.com/store/apps/details?id=com.amin_mizanitil)
5. **القرآن الكريم** — Serene 100% offline mushaf & azkar experience with Zero-Ads UX — [Google Play](https://play.google.com/store/apps/details?id=com.arkestra.quran80)

### Live Client Web Platforms
6. **شركة Arkestra للمقاولات** — Luxury architectural & hotel-finishing corporate showcase — [https://aminrajab.tech/Arkestra/](https://aminrajab.tech/Arkestra/)
7. **منصة المحاضر د. أحمد رزق** — University accounting courses, Firebase integration & online exams platform — [https://mesho0184484142-oss.github.io/ahmed-rizk-landing/](https://mesho0184484142-oss.github.io/ahmed-rizk-landing/)
8. **عيادة د. عمرو الكيكي** — Orthopedic & joint arthroscopy consultant medical portal (RWTH Aachen & Munich fellowships + clinic booking flow) — [https://mesho0184484142-oss.github.io/dr-amr-elkiki/](https://mesho0184484142-oss.github.io/dr-amr-elkiki/)

---

## Project Structure

```text
amin-portfolio-main/
├── index.html        # Semantic RTL HTML5, 3D spatial layers, SEO/OG/@graph JSON-LD, case-study data & configurator
├── style.css         # VisionOS 3D Spatial + Luxury Fintech CSS design system (responsive down to 320px–360px)
├── script.js         # Zero-dependency ES6 3D canvas engine, physics tilt, modal & smart concierge logic
├── sw.js             # Safe root-scoped PWA Service Worker (amin-portfolio-v2)
├── manifest.json     # RTL Arabic PWA Web App Manifest
├── favicon.svg       # Obsidian & Royal Gold geometric AR monogram icon
├── robots.txt        # Crawler indexing rules
├── sitemap.xml       # XML sitemap for aminrajab.tech
├── CNAME             # GitHub Pages custom domain (aminrajab.tech)
└── images/           # Portrait, app icons, and client showcase visuals
```

## Tech Stack
- **Core:** Semantic HTML5, Modern CSS3 (Custom Properties, Grid, 3D Transforms, Backdrop Blur), Vanilla ES6 JavaScript
- **Performance & PWA:** Canvas 2D Perspective 3D, `requestAnimationFrame` + `IntersectionObserver`, Service Worker API, Web App Manifest
- **Hosting:** GitHub Pages (`aminrajab.tech`)
