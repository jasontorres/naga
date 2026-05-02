# Naga City AIP 2026 Transparency Dashboard

A public-facing, single-page web dashboard visualising Naga City's **2026 Annual Investment Program (AIP)** — ₱2.85 billion across 1,216 programs, projects and activities (PAPs) submitted by 94 implementing offices.

## Stack

- **Vite** + **React 19** + **TypeScript**
- Zero external charting libraries — custom SVG treemap and donut
- Google Fonts: Bebas Neue, DM Serif Display, Inter, JetBrains Mono

## Features

- **Landing page** — Magazine-style editorial with animated counters, parallax, and 8 Finish-Line cluster spotlights
- **Band A** — Hero KPI strip (total AIP, PS/MOOE/CO split, climate ring, data quality)
- **Band B** — Sector overview stacked bars + Finish-Line donut chart
- **Band C** — Squarified treemap with drill-down (sector → unit → program)
- **Band D** — Sortable, paginated line-item table with CSV export
- **Band E** — Strategic overlays (Finish-Line spend, mainstreaming matrix, schedule swimlane)
- **Filter rail** — Cross-filtering across all panels (sector, funding source, subcategory, office, cluster, climate, data quality)
- **Tweaks panel** — Accent palette switcher (Indigo / Teal / Sunrise)
- **Responsive** — Desktop-first, table collapses to cards on mobile

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data

All amounts in **₱ millions**. Source: `public/data/aip2026.json` (~1.7 MB, nested sectors → units → subcategories → programs → items).

22 OSCA rows are flagged as data-quality outliers (entered in raw pesos instead of millions). 299 PAPs have no recorded funding source and appear in an "Unspecified" bucket.
