# CrochetsBy_Advika — Current State

## 1. Whole system
```
Browser (React + Vite SPA)
  ├─ Firebase Auth ........ login / signup / phone verify
  ├─ Firestore ............ users, orders, carts, tracking
  ├─ EmailJS .............. order + signup emails to Advika
  └─ WhatsApp (wa.me) ..... payment finalized via UPI QR
Config: .env (VITE_*), never hardcoded.
```

## 2. Source of truth
The proven spec is the live site, saved as
`C:\Users\Advika Pekam\Downloads\CrochetsBy_Advika_live copy_files\index.html`.
The React port must match its behavior unless a decision below says otherwise.

## 3. Build plan (one step at a time, PM approves each)
| # | Step | Status |
|---|------|--------|
| 1 | App shell: global CSS, header/nav, footer, routing, empty pages | Done |
| 2 | Catalog data + Home (incl. testimonials, FAQ) + Gallery + Product pages; shared cart/wishlist/toast state | Done |
| 3 | Wishlist page + Cart page (coupons, gift note) | Done |
| 4 | Firebase/EmailJS services from .env (`src/services/`) | Done |
| 5 | Checkout + Custom Order + WhatsApp handoff | Done |
| 6 | Auth (login/signup/phone verify) + Account | Done |
| 7 | Track Order | Done |
| 8 | Admin dashboard + Excel export | Done |
| 9 | About, Policies | Next |
| 10 | Security fixes (firestore.rules, XSS, phone-auth bug) | — |

## 4. Decisions
| Question | Decision | Status |
|----------|----------|--------|
| Framework | React 19 + Vite 6 | Decided |
| Config location | `.env` (gitignored), `.env.example` committed | Decided |
| JS package manager | npm (uv is Python-only) | Provisional |
| Run locally | `start.bat` → http://localhost:5173 | Decided |
| URL style for pages | Clean paths via react-router (`/gallery`); `firebase.json` rewrites all to index.html | Decided |
| Styling | Old site CSS reused as-is in `src/index.css` | Decided |
| Git remote / PRs | GitHub advikapekam-pixel/CrochetsbyAdvika; push to `test`, owner opens PR test → main | Decided |
| Gallery category filter | In URL (`/gallery?cat=hats`) so collection links work | Decided |
| Wishlist persistence | In memory only, same as old site | Provisional |
| Hint/share links | Point to `/product/<id>` (old site linked to `#product`) | Decided |
| FREESHIP coupon | Fixed: old site subtracted ₹60 twice (₹350 item cost ₹290) | Decided |
| "Proceed to Details" | Shows "coming soon" until checkout (step 5) | Provisional |
| Firebase SDK style | Modular v10 imports (old site used compat CDN scripts) | Decided |
| Deployed Firestore rules | Live rules denied a public tracking read that local `firestore.rules` allows — live rules may differ; check in step 7 | Open |
| Phone verification | SMS at signup (and "Verify Phone" on Account), linked to the same account; checkout autofills and marks verified if it matches | Decided |

## 5. Run
Double-click `start.bat`.
