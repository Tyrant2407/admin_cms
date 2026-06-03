# PRD — AI Automation Services: Landing Page + Admin CMS

**Project**: Landing Page & Lead Management CMS untuk layanan AI Automation  
**Tech Stack**: Next.js 14 (App Router) · Prisma ORM · PostgreSQL (Supabase) · Deployed via DokPloy  
**Scope dokumen ini**: Design/Frontend Requirements · Core Features · User Flow

---

## 1. Estetika & Design Direction

### Konsep Visual
**"Refined Industrial"** — Kesan presisi, teknis, dan profesional tanpa terasa dingin.  
Memancarkan kepercayaan dan keahlian, bukan hype AI generik.

| Token | Nilai |
|---|---|
| **Primary BG** | `#0A0A0F` (near-black with blue undertone) |
| **Surface** | `#111118` |
| **Card** | `#16161F` |
| **Accent** | `#4FFFB0` (electric mint — sinyal "aktif", "berjalan") |
| **Accent 2** | `#3B82F6` (biru proses — untuk state & highlight) |
| **Text Primary** | `#F0F0F5` |
| **Text Muted** | `#6B7280` |
| **Border** | `#1E1E2E` |

### Tipografi
- **Display / Heading**: `Syne` (weight 700–800) — geometris, berkarakter kuat
- **Body**: `DM Sans` (weight 400–500) — bersih, mudah dibaca
- **Monospace / Label teknis**: `JetBrains Mono` — untuk kode, badge, status

### Atmosfer & Detail
- Latar belakang: subtle animated grid (CSS `background-image` dot-matrix atau line-grid)
- Subtle noise texture overlay pada hero section
- Glow effect pada elemen accent (`box-shadow: 0 0 24px rgba(79,255,176,0.15)`)
- Transition halaman dengan fade-slide menggunakan `next/navigation` + Framer Motion
- Micro-interaction pada semua CTA button: skala naik + glow pulse saat hover
- Border gradient pada card: `border: 1px solid transparent` + `background-clip: padding-box` + gradient border
- Cursor custom (opsional, desktop only): titik kecil dengan trail accent

---

## 2. Struktur Halaman (Landing Page)

### 2.1 Layout Global
```
├── Navbar (sticky, blur backdrop)
├── Hero Section
├── Services Section
├── How It Works Section
├── Testimonial / Social Proof (opsional, bisa placeholder)
├── FAQ Section
├── CTA + Lead Form Section
└── Footer
```

---

### 2.2 Navbar
- **Logo**: Nama brand + ikon kecil (SVG inline)
- **Nav links**: Services · How It Works · FAQ · Contact
- **CTA Button**: "Mulai Konsultasi" → scroll ke form
- **Behavior**:
  - Transparan saat di atas hero, berubah jadi blur/frosted glass saat scroll
  - Hamburger menu untuk mobile (drawer dari kanan, full-height)
  - Active link dengan underline accent color

---

### 2.3 Hero Section
**Layout**: Split asymmetric — teks kiri (60%) + visual kanan (40%)

**Konten kiri**:
- Badge kecil: `[ ⚡ AI Automation Expert ]` dengan border accent
- Heading utama (2–3 baris): *"Otomasi Bisnis Anda.\nLebih Cepat, Lebih Cerdas."*
- Sub-heading: deskripsi singkat layanan (1–2 kalimat)
- Dua CTA: `"Lihat Layanan"` (secondary) + `"Konsultasi Gratis"` (primary, accent)
- Trust signal row: ikon + angka (mis. "15+ Klien · 30+ Alur Otomasi Dibangun")

**Konten kanan**:
- Animated card/mockup yang menampilkan alur otomasi (node-graph mini, animated dash lines)
- Atau: terminal-style block yang menampilkan log otomasi berjalan (typewriter effect)

**Animasi**: Staggered reveal — badge → heading → sub → CTA → trust bar (delay per elemen)

---

### 2.4 Services Section
**Heading**: "Apa yang Kami Tawarkan"

**Dua layanan utama** ditampilkan sebagai card besar horizontal:

**Card 1 — Training AI Automation**
- Ikon (SVG): brain/circuit
- Judul: "Workshop & Training"
- Deskripsi: target audience, format, output peserta
- Tag: `[ Online ]` `[ Intensif ]` `[ Sertifikat ]`
- CTA link: "Lihat Detail →"

**Card 2 — Jasa Pembuatan Sistem Otomasi**
- Ikon (SVG): workflow/gear
- Judul: "Custom Automation System"
- Deskripsi: jenis sistem, tools/platform yang dipakai
- Tag: `[ n8n ]` `[ Make ]` `[ API Integration ]`
- CTA link: "Konsultasi Project →"

**Behavior card**: Hover → border gradient menyala + subtle card lift (`translateY(-4px)`)

---

### 2.5 How It Works Section
**Layout**: Numbered step horizontal (desktop) / vertical stepper (mobile)

**4 Steps**:
1. 📋 Isi Form — Ceritakan kebutuhan Anda
2. 💬 Konsultasi — Diskusi via WhatsApp/meeting
3. 🔧 Eksekusi — Training / Development sistem
4. 🚀 Go Live — Sistem berjalan, Anda terima hasilnya

**Visual**: Garis konektor antar step dengan animated dash (CSS `stroke-dashoffset` animation)

---

### 2.6 FAQ Section
**Layout**: Accordion — klik expand/collapse per item  
**Jumlah**: 5–7 pertanyaan umum (harga, timeline, tools, support, dsb.)  
**Animasi**: Smooth height expand dengan CSS `grid-template-rows: 0fr → 1fr`

---

### 2.7 Lead Form Section (CTA Utama)
**Heading**: "Siap Mulai? Hubungi Kami"  
**Sub**: "Isi form di bawah dan kami akan menghubungi Anda dalam 1×24 jam"

**Form Fields**:
| Field | Type | Validasi |
|---|---|---|
| Nama Lengkap | `text` | Required, min 2 karakter |
| Nomor WhatsApp | `tel` | Required, format `08xx` / `+62xx`, hanya angka |
| Email | `email` | Required, format valid |
| Jenis Layanan | `select` | Options: Training / Jasa Otomasi / Keduanya |
| Detail Tujuan / Project | `textarea` | Required, min 20 karakter, max 1000 |

**UX Detail**:
- Label floating (animasi label naik saat input aktif)
- Real-time validation dengan pesan error inline di bawah field
- Nomor WA: auto-format display tapi simpan sebagai string plain
- Submit button: loading spinner saat proses, disable saat loading
- **Success state**: Form diganti dengan card sukses — ikon centang animasi + pesan "Terima kasih! Kami akan menghubungi Anda segera."
- **Error state**: Toast notification merah di atas form
- Honeypot field tersembunyi untuk basic spam protection

---

### 2.8 Footer
- Logo + tagline singkat
- Kolom link: Services · FAQ · Privacy Policy
- Social links: Instagram · LinkedIn · WhatsApp langsung
- Copyright line
- Tidak ada newsletter (scope di luar)

---

## 3. Halaman Admin CMS

### 3.1 Autentikasi Admin
- Route: `/admin/login`
- Single admin account (credentials via env variable, tidak ada registrasi publik)
- Session management dengan `next-auth` atau JWT cookie (httpOnly)
- Redirect otomatis ke `/admin/dashboard` jika sudah login
- Redirect ke `/admin/login` jika akses tanpa sesi valid
- Halaman login: Centered card, minimal, logo + email + password + button

---

### 3.2 Dashboard Admin — Struktur Sidebar
```
Admin Panel
├── 📊 Dashboard (overview & stats)
├── 📋 Leads (tabel semua submission)
├── 🏠 Landing Page Content (CMS editor)
│   ├── Hero
│   ├── Services
│   ├── How It Works
│   └── FAQ
└── ⚙️ Settings (ganti password)
```

**Sidebar**: Collapsible di desktop, drawer di mobile. Avatar/nama admin di bawah sidebar.

---

### 3.3 Dashboard — Overview Page
**Stats Cards (row atas)**:
- Total Leads (all time)
- Leads Bulan Ini
- Leads Minggu Ini
- Breakdown per Jenis Layanan (Training vs Jasa)

**Chart**: Bar chart sederhana — jumlah lead per hari (30 hari terakhir)  
**Tabel mini**: 5 lead terbaru dengan kolom Nama, WA, Layanan, Tanggal

---

### 3.4 Leads Management Page
**Tabel kolom**:
| Kolom | Keterangan |
|---|---|
| # | ID / nomor urut |
| Nama | Nama lengkap |
| WhatsApp | Nomor (clickable → `wa.me/`) |
| Email | Clickable mailto |
| Layanan | Badge berwarna |
| Detail Project | Truncated, expandable modal |
| Tanggal | Format `DD MMM YYYY HH:mm` |
| Aksi | Tombol: Detail · Hapus |

**Fitur tabel**:
- Search/filter: by nama, email, jenis layanan, rentang tanggal
- Sort: per kolom (tanggal default descending)
- Pagination: 20 baris per halaman
- Export CSV: tombol di header tabel
- Modal detail lead: seluruh info + field detail project full text
- Konfirmasi sebelum hapus (modal: "Yakin hapus lead ini?")

---

### 3.5 Landing Page CMS Editor
**Pendekatan**: Structured field editor (bukan WYSIWYG/rich text penuh) — lebih aman dan predictable.

**Hero Editor**:
- Badge text
- Heading (textarea, max 80 karakter)
- Sub-heading (textarea, max 200 karakter)
- CTA Primary label
- CTA Secondary label
- Trust signal items (list: icon + text, add/remove)

**Services Editor**:
- Per card: Judul · Deskripsi · Tags (add/remove) · CTA label

**How It Works Editor**:
- Per step: Nomor (auto) · Ikon (emoji picker atau SVG name) · Judul · Deskripsi

**FAQ Editor**:
- List accordion items: Pertanyaan + Jawaban
- Drag-to-reorder
- Tambah item baru / hapus item

**Behavior CMS**:
- Auto-save draft setiap perubahan (debounced 3 detik ke localStorage)
- Tombol **"Simpan & Publish"** → POST ke API → update database → invalidate cache
- Preview button → buka tab baru `/preview?token=xxx` dengan data draft

---

### 3.6 Settings Page
- Form ganti password (password lama + password baru + konfirmasi)
- Tombol logout

---

## 4. Core Features Summary

### Landing Page
| # | Fitur | Prioritas |
|---|---|---|
| F1 | Tampilan landing page responsif (mobile-first) | P0 |
| F2 | Animasi hero section (staggered reveal) | P1 |
| F3 | Form lead dengan validasi client-side & server-side | P0 |
| F4 | Spam protection (honeypot) | P1 |
| F5 | Success/error state form | P0 |
| F6 | Semua konten landing page bersumber dari DB (CMS-driven) | P1 |
| F7 | SEO: meta title, description, OG image | P1 |
| F8 | Performance: image optimization, font preload | P1 |

### Admin CMS
| # | Fitur | Prioritas |
|---|---|---|
| A1 | Auth admin (login/logout/session) | P0 |
| A2 | Dashboard stats & chart leads | P1 |
| A3 | Tabel leads dengan search, filter, sort, pagination | P0 |
| A4 | Detail lead (modal) | P0 |
| A5 | Export CSV | P1 |
| A6 | Hapus lead (dengan konfirmasi) | P0 |
| A7 | Editor konten hero, services, how-it-works, FAQ | P1 |
| A8 | Publish konten dari CMS ke landing page | P1 |
| A9 | Ganti password admin | P1 |

---

## 5. User Flow

### 5.1 Flow Pengunjung (Prospek)

```
Buka landing page
    │
    ▼
Hero Section → baca value proposition
    │
    ├─ Klik "Lihat Layanan" ──→ Scroll ke Services Section
    │                                   │
    │                          Baca detail layanan
    │                                   │
    └─────────────────────────────────→ ┘
                                        │
                              Scroll ke Form Section
                                        │
                              Isi 5 field form
                                        │
                              Klik "Kirim"
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                    Validasi gagal              Validasi berhasil
                         │                             │
                  Error inline                 Loading spinner
                  di field terkait                     │
                         │                    POST /api/leads
                         │                             │
                    User perbaiki          ┌───────────┴───────────┐
                    & kirim ulang          │                       │
                                      Berhasil                  Gagal
                                          │                       │
                               Form → Success Card          Toast error
                               "Terima kasih!"             "Coba lagi"
```

---

### 5.2 Flow Admin — Login

```
Akses /admin/*
    │
    ▼
Cek session valid?
    │
    ├─ Ya ──→ Lanjut ke halaman tujuan
    │
    └─ Tidak ──→ Redirect ke /admin/login
                        │
               Isi email + password
                        │
                   Klik Login
                        │
            ┌───────────┴───────────┐
            │                       │
       Credentials benar      Credentials salah
            │                       │
    Set session cookie         Pesan error merah
            │                  "Email atau password salah"
    Redirect /admin/dashboard
```

---

### 5.3 Flow Admin — Kelola Leads

```
/admin/leads
    │
    ▼
Tampil tabel leads (default: terbaru)
    │
    ├─ Search nama/email ──→ Filter realtime tabel
    │
    ├─ Filter jenis layanan / rentang tanggal ──→ Update tabel
    │
    ├─ Klik header kolom ──→ Sort ascending/descending
    │
    ├─ Klik "Detail" ──→ Modal detail lead (semua field)
    │
    ├─ Klik "Hapus" ──→ Modal konfirmasi
    │                         │
    │              ┌──────────┴──────────┐
    │              │                     │
    │          Konfirmasi             Batal
    │              │                     │
    │       DELETE /api/leads/:id    Tutup modal
    │              │
    │       Lead hilang dari tabel
    │
    └─ Klik "Export CSV" ──→ Download file leads_YYYY-MM-DD.csv
```

---

### 5.4 Flow Admin — Edit & Publish Konten

```
/admin/landing-page (pilih section)
    │
    ▼
Load data konten dari DB
    │
    ▼
Edit field (teks, tag, urutan)
    │
    ▼
Auto-save draft ke localStorage (debounce 3s)
    │
    ├─ Klik "Preview" ──→ Buka /preview?token=xxx (tab baru)
    │                      Render landing page dengan data draft
    │
    └─ Klik "Simpan & Publish"
                │
        PUT /api/cms/content
                │
        ┌───────┴───────┐
        │               │
     Berhasil         Gagal
        │               │
  Toast hijau       Toast merah
  "Konten           "Gagal menyimpan,
   dipublish"        coba lagi"
        │
  Landing page update
  tanpa perlu deploy ulang
```

---

## 6. Responsivitas

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Single column, hamburger nav, form full-width, tabel horizontal scroll |
| `640–1024px` (tablet) | 2 column services, sidebar admin collapsed |
| `> 1024px` (desktop) | Layout penuh, sidebar admin expanded |

---

## 7. API Endpoints (Referensi Frontend)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/leads` | Submit form lead dari landing page |
| `GET` | `/api/leads` | Ambil semua leads (admin, dengan query params filter) |
| `GET` | `/api/leads/:id` | Detail satu lead |
| `DELETE` | `/api/leads/:id` | Hapus lead |
| `GET` | `/api/leads/export` | Download CSV |
| `GET` | `/api/cms/content` | Ambil semua konten landing page |
| `PUT` | `/api/cms/content` | Update konten landing page |
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/logout` | Admin logout |
| `GET` | `/api/stats` | Data statistik untuk dashboard |

---

## 8. Database Schema (Referensi)

### Tabel `leads`
```
id            UUID (PK)
name          VARCHAR(100)
whatsapp      VARCHAR(20)
email         VARCHAR(100)
service_type  ENUM('training', 'automation', 'both')
project_detail TEXT
created_at    TIMESTAMP
```

### Tabel `cms_content`
```
id            UUID (PK)
section       VARCHAR(50)   -- 'hero', 'services', 'faq', etc.
content       JSONB         -- data konten per section
updated_at    TIMESTAMP
```

### Tabel `admin_users`
```
id            UUID (PK)
email         VARCHAR(100)
password_hash VARCHAR(255)
created_at    TIMESTAMP
```

---

*Dokumen ini mencakup design/frontend requirements, core features, dan user flow. Implementasi backend detail (migrations, API handlers, auth middleware) didefinisikan terpisah.*