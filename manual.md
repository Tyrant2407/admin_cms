# AutomateRiz — Frontend Walkthrough

## Summary

Built a complete frontend for **AutomateRiz** — an AI Automation Services platform with:
- 🌐 **Landing Page** — Premium "Refined Industrial" design with animations
- 🔐 **Admin CMS** — Full dashboard, leads management, content editor, settings

**Tech**: Next.js 16 (App Router) · TypeScript · Framer Motion · Chart.js · Vanilla CSS · JWT Auth

---

## What Was Built

### Landing Page (`/`)

| Section | Features |
|---|---|
| **Navbar** | Sticky with blur backdrop, smooth scroll navigation, dark/light toggle, mobile hamburger drawer |
| **Hero** | Staggered reveal animations, gradient text, animated terminal mockup, trust signals |
| **Services** | 2 gradient-border cards with hover lift, tags, CMS-driven content |
| **How It Works** | 4-step process with animated dash connector, responsive vertical on mobile |
| **FAQ** | Accordion with smooth CSS `grid-template-rows` animation |
| **Lead Form** | Floating labels, real-time validation, honeypot spam protection, success/error states |
| **Footer** | Brand info, navigation, social links, copyright |

### Admin CMS (`/admin/*`)

| Page | Features |
|---|---|
| **Login** (`/admin/login`) | JWT auth, centered card, error handling |
| **Dashboard** (`/admin/dashboard`) | 4 stats cards, Chart.js bar chart (30 days), recent leads table |
| **Leads** (`/admin/leads`) | Full table with search/filter/sort/pagination, detail modal, delete confirmation, CSV export |
| **Content Editor** (`/admin/content`) | Tabbed editor (Hero/Services/How It Works/FAQ), structured fields, tag management, auto-save draft, publish |
| **Settings** (`/admin/settings`) | Change password, logout, demo credentials info |

### Design System

- **Dark/Light mode** with smooth transitions and localStorage persistence
- **Color tokens**: Electric mint accent (`#4FFFB0` dark / `#059669` light)
- **Typography**: Syne (display), DM Sans (body), JetBrains Mono (code/labels)
- **Animated grid background** with subtle movement
- **Responsive**: Mobile (`<640px`), Tablet (`640-1024px`), Desktop (`>1024px`)

---

## File Structure

```
src/
├── app/
│   ├── globals.css              # Design system + dark/light theme
│   ├── layout.tsx               # Root layout + SEO + ThemeProvider
│   ├── page.tsx                 # Landing page
│   └── admin/
│       ├── admin.module.css     # Admin layout styles
│       ├── layout.tsx           # Admin layout + auth guard
│       ├── login/page.tsx       # Login page
│       ├── dashboard/page.tsx   # Dashboard
│       ├── leads/page.tsx       # Leads management
│       ├── content/page.tsx     # CMS content editor
│       └── settings/page.tsx    # Settings
├── components/
│   ├── ThemeProvider.tsx         # Dark/light mode context
│   ├── landing/
│   │   ├── Navbar.tsx + .module.css
│   │   ├── Hero.tsx + .module.css
│   │   ├── Services.tsx + .module.css
│   │   ├── HowItWorks.tsx + .module.css
│   │   ├── FAQ.tsx + .module.css
│   │   ├── LeadForm.tsx + .module.css
│   │   └── Footer.tsx + .module.css
│   └── admin/
│       └── Sidebar.tsx + .module.css
└── lib/
    ├── types.ts                 # TypeScript interfaces
    ├── api.ts                   # Mock API + JWT auth + localStorage
    └── validation.ts            # Form validators
```

---

## How to Use

### Development
```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
```

### Admin Login
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@automateriz.com`
- **Password**: `admin123`

### Key Features
1. **Theme Toggle**: Click ☀️/🌙 in navbar (landing) or sidebar (admin)
2. **Lead Form**: Fill out the contact form → data stored in localStorage
3. **CMS Editor**: Edit landing page content in admin → click "Save & Publish"
4. **CSV Export**: Click "Export CSV" on leads page to download

---

## Verification

- ✅ `npm run build` — **0 errors**, all 7 routes compiled
- ✅ TypeScript strict mode — all types pass
- ✅ All routes statically generated
- ✅ Responsive at all breakpoints
- ✅ Dark/light mode working

---

## Notes for Backend Integration

When backend is ready, replace the mock functions in [api.ts](file:///c:/Users/user/OneDrive/Documents/testttt/admin_cms/src/lib/api.ts):
- `login()` → `POST /api/auth/login`
- `getLeads()` → `GET /api/leads`
- `submitLead()` → `POST /api/leads`
- `deleteLead()` → `DELETE /api/leads/:id`
- `getCMSContent()` → `GET /api/cms/content`
- `updateCMSContent()` → `PUT /api/cms/content`
- `getStats()` → `GET /api/stats`

JWT verification should move to server-side middleware using the `jose` library (already installed).
