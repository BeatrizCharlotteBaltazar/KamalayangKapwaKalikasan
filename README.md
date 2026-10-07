# Kamalayang Kapwa Kalikasan (Web-Based Environmental Advocacy Platform)

A modern, responsive, and accessible NGO website built for **Kamalayang Kapwa Kalikasan**, a Philippine environmental organization anchored in the indigenous Filipino value of ***pakikipagkapwa*** (shared responsibility for people and nature).

---

## 🌿 100% Free Stack Architecture
- **Framework:** Next.js 16+ (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + Custom organic design system + Google Fonts (*Poppins* for headings, *Inter* for body)
- **Icons:** `lucide-react`
- **Database & Auth (Step 3+):** Supabase Free Tier (PostgreSQL, Row Level Security, Auth, Storage)
- **Maps:** 100% Free OpenStreetMap interactive embed (No paid Google Maps API key required)
- **Spam Mitigation:** Free In-Memory Rate Limiter + Bot Honeypot fields (No paid Captcha service required)
- **Compliance:** Full compliance with the **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)**

---

## 🎨 Design System & Color Palette
- **Primary Forest Green:** `#2E5E34` (Hover: `#1F4425`)
- **Light Green Accent:** `#5A8F3E`
- **Earth Brown:** `#8B5A2B` (Hover: `#6E4620`)
- **Cream Background:** `#F8F5EE`
- **Soft Green Tint:** `#EAF1E4`
- **Text Dark:** `#1E2A1F` | **Muted Text:** `#5B655C`
- **Typography:** `font-heading` (*Poppins*), `font-body` (*Inter*)

---

## 🚀 Live Pages Completed (Steps 1 & 2)

| Route | Page | Description |
|---|---|---|
| `/` | **Home (Tahanan)** | Hero, Impact metrics (48,500+ trees, 3,200+ volunteers), Featured programs, Latest news, Partners strip, Bayanihan CTA |
| `/about` | **About Us (Sino Kami)** | Organization history, Vision, Mission, the Filipino philosophy of *Pakikipagkapwa*, and Officers directory |
| `/programs` | **Programs & Advocacy** | Sierra Madre reforestation, Manila Bay mangroves, Barangay composting, with interactive status filters (*Ongoing*, *Upcoming*, *Completed*) |
| `/resources` | **Environmental Education** | Practical guides (Bokashi, native trees, low-waste hacks) with live instant search and category filter |
| `/resources/[slug]` | **Article Detail** | Full reading view with tags, read time, and related reading suggestions |
| `/gallery` | **Gallery & Media** | Photo & video grid with album filtering, video badges, and interactive keyboard-accessible Lightbox modal |
| `/news-events` | **News & Events** | Community updates, events, tree-walk assemblies with filter |
| `/news-events/[slug]` | **Post Detail** | Detailed news and event page with location, date, organizer, and RSVP callout |
| `/partners` | **Partners & Stakeholders** | Categorized by Environmental NGOs, Academic & Schools, Government Units (DENR/LGUs), and Eco-Businesses |
| `/get-involved` | **Volunteer Sign-up** | Comprehensive registration with location, interests, availability, bot honeypot, and mandatory RA 10173 consent |
| `/donate` | **Manual Donation** | GCash QR & mobile number, BPI bank details with one-click copy, preset donation amounts, 2MB proof upload, RA 10173 consent |
| `/donate/thank-you` | **Thank You Page** | Verification notice explaining the *Pending* to *Verified* workflow |
| `/contact` | **Contact & Map** | Inquiry form with bot honeypot, contact details, and free OpenStreetMap embed |
| `/privacy-policy` | **Data Privacy Manual** | Full legal compliance with RA 10173, Data Subject rights, and DPO contact details |
| `/terms-of-use` | **Terms of Use** | Volunteer code of conduct, CC BY-NC 4.0 open educational licensing, transparent fund utilization |
| `/login` & `/register` | **Auth Portal** | Sign in and registration for members and staff |
| `/member/dashboard` | **Member Dashboard** | Volunteer hours tracking, active badges, and donation history |

---

## 💻 Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📜 Next Implementation Steps
- **Step 3:** Supabase schema (`supabase/schema.sql`, `supabase/seed.sql`) + Auth + RLS + Middleware protection
- **Step 4:** Volunteer, newsletter, and contact database integration
- **Step 5:** Member portal real-time dashboard
- **Step 6:** Admin CMS (content editor, volunteer manager, donation verification, CSV export)
- **Step 7:** Payment proof storage upload to Supabase private storage
