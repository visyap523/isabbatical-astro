# isabbatical changelog

## Technologies Used

### Languages
- HTML
- CSS
- JavaScript
- Markdown

### Frameworks & Tools
- Astro (static site generator)
- Leaflet.js (interactive maps)
- Vite (dev server, bundler — runs under the hood in Astro)

### Platforms & Services
- Cloudflare Pages (hosting, auto-deploy)
- Cloudflare Registrar (domain — isabbatical.net)
- Cloudflare Email Routing (hello@isabbatical.net → Gmail)
- GitHub (code storage, version control)
- Cloudinary (image hosting + transformations)
- Stadia Maps (map tile provider)
- OpenStreetMap (map data)
- Web3Forms (form submissions)
- Google Fonts (Lora + DM Sans)
- Cloudflare R2 (object storage — photo uploads)

### Developer Tools
- VS Code (code editor)
- Terminal / zsh (command line)
- Git (version control)
- npm (package manager)
- Node.js (JavaScript runtime)
- Chrome DevTools (mobile preview, debugging)

### Concepts Learned
- Git workflow (init, add, commit, push, aliases)
- HTML/CSS fundamentals (box model, flexbox, grid, CSS variables)
- Responsive design (media queries)
- DNS + CNAME records
- Open Graph meta tags
- Netlify Forms → Web3Forms migration
- Astro components, layouts, props, slots, scoped styles
- JavaScript DOM manipulation
- Event listeners (click, scroll)
- Intersection Observer API
- getBoundingClientRect()
- define:vars (Astro frontmatter → client script bridge)
- JSON.stringify / JSON.parse
- CDN (content delivery network)
- Cloudflare D1
- Cloudflare Workers sessions (Astro.session, KV-backed)
- Cloudflare R2 (buckets, bindings, public access via r2.dev)
- D1 local vs. remote bindings (astro dev defaults to local emulation unless configured otherwise)
- wrangler.toml bindings ([[d1_databases]], [[r2_buckets]], [vars])
- Environment secrets vs. plain vars (wrangler secret vs. [vars])
- Astro middleware (defineMiddleware, request interception before routing)
- Astro dynamic routes ([id].astro, nested [id]/edit.astro)
- FormData + multipart form uploads
- DataTransfer API (client-side drag-to-reorder of file inputs)
- CSS scroll-snap (touch carousels without a JS library)
- SQL: FOREIGN KEY constraints, ON CONFLICT DO UPDATE, RETURNING/last_row_id
- zsh quirks (glob patterns on [brackets], line-editing shortcuts)

# Changelog Entries

## September 17, 2026
- Built henro.isabbatical.net/journal — full read/write pilgrimage journal
- Set up R2 bucket for photo storage, D1 schema for entries/photos/temples/reactions
- Built password-protected auth with session-based middleware
- Built entry input form — text fields, temple multi-select (pilgrimage order), draft/publish toggle
- Added photo upload to R2 with client-side drag-to-reorder before submit
- Built public journal index — published/draft sections, date strip, previews
- Built individual entry page — swipeable photo carousel, prev/next nav, temple chips, timestamps
- Built edit page — pre-filled form, photo delete + add
- Debugged and resolved an upstream Cloudflare Vite plugin bug (chicken-and-egg wrangler.toml `main` field validation) via package upgrades
- Fixed D1/R2 local-vs-remote binding mismatch (`remote = true` in wrangler.toml)

## July 25, 2026
- Built Henro app as separate Cloudflare Worker at henro.isabbatical.net
- Set up Cloudflare D1 database with all 88 temples, addresses, Wikimedia image URLs
- Built temple tracker with search, filtering, and check-off
- Built packing list with 60+ pre-seeded items
- Built DDIA notes section with content collections and dynamic routing
- Rebuilt sidequests page as tiled card grid with emoji and status badges
- Added NYC tag filtering (restaurant, art, show, other)
- Fixed Stadia Maps 401 with API key
- Migrated main site back to clean static deployment

## July 24, 2026
- Built NYC walking map page (/sidequests/new-york) with Leaflet.js + Stadia Maps
- Implemented click-to-activate map interaction (entries + markers)
- Added tag filtering (restaurant, art, show, other) to NYC page
- Fixed Stadia Maps 401 error by adding API key
- Migrated to define:vars to eliminate duplicate place data
- Added 5 entries: Rockaway Beach, The Frick Collection, Konban, Two Strangers, The Red Door Place
- Fixed essay meta mobile layout (date/tags/reading time on separate lines)
- Fixed sidequests link color
- Added DDIA chapter one
- Updated sidequests page with tiles
- Shipped all updates to isabbatical.net

## July 21, 2026
- Full Astro migration — shared layout, no more copy-pasting nav/footer
- Homepage, About, Essays, Sidequests all converted to .astro files
- First real essay live — "Why the sabbatical"
- Tag filtering with empty state
- Reading time + progress bar on essays
- isabbatical.net pointed at the new Astro deployment
- Email forwarding intact

## July 10, 2026
- Migrated from Netlify to Cloudflare Pages
- Added about.html with full bio and circular photo
- Set up hello@isabbatical.net email forwarding
- Replaced Netlify Forms with Web3Forms
- Built essays.html skeleton with tag filter bar
- Built individual essay template
- Added Sidequests placeholder

## June 26, 2026
- First deploy — isabbatical.netlify.app live (set up Terminal and VS Code)
- Added nav, newsletter form, contact form
- Fixed mobile nav wrapping