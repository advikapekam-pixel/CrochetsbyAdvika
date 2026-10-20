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
| 1 | App shell: global CSS, header/nav, footer, routing, empty pages | Next |
| 2 | Catalog data + Home + Gallery + Product pages | — |
| 3 | Wishlist + Cart (guest localStorage) | — |
| 4 | Firebase/EmailJS services from .env | — |
| 5 | Checkout + Custom Order + WhatsApp handoff | — |
| 6 | Auth (login/signup/phone verify) + Account | — |
| 7 | Track Order | — |
| 8 | Admin dashboard + Excel export | — |
| 9 | About, Policies, FAQ, testimonials | — |
| 10 | Security fixes (firestore.rules, XSS, phone-auth bug) | — |

## 4. Decisions
| Question | Decision | Status |
|----------|----------|--------|
| Framework | React 19 + Vite 6 | Decided |
| Config location | `.env` (gitignored), `.env.example` committed | Decided |
| JS package manager | npm (uv is Python-only) | Provisional |
| Run locally | `start.bat` → http://localhost:5173 | Decided |
| URL style for pages | — | Open |

## 5. Run
Double-click `start.bat`.
