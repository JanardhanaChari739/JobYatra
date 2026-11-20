# JobYatra (`jobyatra.in`) — *"Every Portal. One Search."*

A production-ready, full-stack universal job aggregator and direct hiring web application for India. JobYatra aggregates live openings across **LinkedIn, Naukri, Indeed, Apna, Govt NCS, Foundit, Glassdoor, and 1,200+ Company ATS Career Pages** into a single deduplicated search interface, serving candidates from **10th Pass, 12th/Inter, Diploma/ITI, Any Graduate, B.Tech/B.E, to Post-Graduates**, while providing B2B employers a verified direct hiring dashboard.

---

## 🎨 Visual Identity & Brand System (Pixel-Perfect Reference Match)

- **Corporate Primary Surface:** Deep Navy Blue (`#0B192C` / `#081220`)
- **Primary CTAs & Accents:** Warm Marigold Gold (`#EAB308` / `#E5A852`) with high-contrast Deep Navy (`#0B192C`) typography
- **Content Background:** Crisp Off-White / Cream (`#F8FAFC` / `#FAF7F2`)
- **Elevated Cards:** Crisp White (`#FFFFFF`) with multi-layered soft shadows (`shadow-elevated`)
- **Inline SVG Logo:** Vector icon uniting a Briefcase, an upward career growth arrow ("*Yatra*") in warm gold, and a Search Magnifying Lens paired with the bold wordmark **"JobYatra"** (`Job` in white, `Yatra` in warm gold).
- **Portal Provenance Badges:**
  - `via LinkedIn` (`#0A66C2`)
  - `via Naukri` (`#0078DB`)
  - `via Indeed` (`#2164F3`)
  - `via Apna` (`#059669`)
  - `Govt NCS` (`#C2410C`)
  - `Direct Company` (`#1E40AF` with verified checkmark)

---

## 🏗️ Architecture & Technical Stack

```
JobYatra/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, JobYatraLogo, Badges
│   │   │   ├── home/           # HeroSection, FeaturedOpportunities, DedupExplainer, WhyChooseJobYatra
│   │   │   └── jobs/           # JobCard, JobFilters, JobDrawer, ApplyModal
│   │   ├── pages/              # Home, Jobs, JobDetail, Companies, Candidate & Employer Dashboards
│   │   ├── context/            # AuthContext (JWT, 1-Click Demo Accounts)
│   │   ├── services/           # Axios instance with JWT interceptors
│   │   └── utils/              # Indian currency & date formatters
├── server/                     # Backend REST API & Aggregator Engine
│   ├── src/
│   │   ├── config/             # DB connection (MongoDB with embedded MongoMemoryServer fallback)
│   │   ├── models/             # User, Company, Job, Application schemas
│   │   ├── services/           # Normalizer, Deduplicator (SHA-256), Universal Aggregator
│   │   ├── workers/            # Multi-portal adapters (LinkedIn, Naukri, Indeed, Apna, ATS, NCS)
│   │   ├── controllers/        # Auth, Jobs, Companies, Applications, Admin
│   │   ├── routes/             # REST API routes under /api/v1
│   │   └── scripts/            # Database seed script (25+ realistic Indian jobs)
```

### 1. SHA-256 Smart Deduplicator
When employers cross-post identical jobs on LinkedIn, Naukri, and their careers page:
- Computes `sha256(normalizedCompany + normalizedTitle + normalizedCity)`
- Merges duplicates into **One Master Job Card** with a `sources[]` array
- Allows job seekers to choose whether to apply via Direct ATS or external portals

### 2. Qualification Normalizer
Standardizes raw job qualifications (`SSC`, `10+2`, `ITI`, `Polytechnic`, `B.Com`, `B.Tech`, `MBA`) into 6 filterable buckets:
- `10th Pass`
- `12th / Inter`
- `Diploma / ITI`
- `Any Graduate`
- `B.Tech / B.E`
- `Post Graduate`

---

## ⚡ Quick Start Guide (Windows PowerShell)

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Local MongoDB installed (Optional: JobYatra includes an automatic embedded database fallback that starts in-memory if local MongoDB is not running!)

### 1. Installation
In the project root directory (`c:\Users\HP\Desktop\JobYatra`):
```powershell
# Install root, server, and client dependencies
npm run install:all
```

### 2. Seed Database
Populate 20+ realistic Indian jobs (10th Pass to Senior Tech roles), verified companies, and test accounts:
```powershell
npm run seed
```

### 3. Run Development Servers
Launch both the backend API server and the Vite React frontend concurrently:
```powershell
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Health Check:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔑 Pre-Seeded 1-Click Demo Accounts

Both the `/login` page and the top navigation include 1-click instant login buttons:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@jobyatra.in` | `Pass@1234` | View job tracker, saved jobs, submit direct & external applications |
| **Employer** | `employer@jobyatra.in` | `Pass@1234` | Post new ATS openings, manage active jobs, review applicant pipeline |
| **Admin** | `admin@jobyatra.in` | `Pass@1234` | Trigger live multi-portal aggregation and view system metrics |

---

## 📡 REST API Reference (`/api/v1`)

### Authentication & Users
- `POST /api/v1/auth/register` — Register as Candidate or Employer
- `POST /api/v1/auth/login` — Sign in and receive JWT token
- `GET /api/v1/auth/me` — Retrieve current authenticated profile & application stats
- `PATCH /api/v1/auth/profile` — Update candidate qualification, skills, resume link

### Job Discovery Engine
- `GET /api/v1/jobs` — Compound indexed search & filter:
  - Query params: `q`, `qualification`, `city`, `portalSource`, `jobType`, `salaryMin`, `isRemote`, `sort`, `page`, `limit`
  - Returns: Paginated `jobs[]` + realtime `facets` (counts by qualification, portal, city)
- `GET /api/v1/jobs/:id` — Full JD, requirements, portal sources, view counter, related jobs
- `POST /api/v1/jobs` — Employer-only direct job creation (with Zod validation & SHA-256 deduplication)
- `POST /api/v1/jobs/:id/save` — Toggle job bookmark

### Applications
- `POST /api/v1/jobs/:id/apply` — Apply directly to employer or record external portal redirect
- `GET /api/v1/candidate/applications` — Candidate's application tracker with status
- `GET /api/v1/candidate/saved-jobs` — Candidate's saved jobs
- `GET /api/v1/employer/jobs` — Active employer jobs with applicant counts
- `GET /api/v1/employer/jobs/:id/applicants` — Applicant list for a job
- `PATCH /api/v1/employer/applications/:id/status` — Update candidate status (`SHORTLISTED`, `INTERVIEW`, `REJECTED`)

### Companies Directory
- `GET /api/v1/companies` — Verified employer list with total job counts across portals
- `GET /api/v1/companies/:slug/jobs` — Company profile with all aggregated openings

### Universal Aggregation Engine
- `POST /api/v1/admin/aggregate/run` — Run multi-portal ingestion and SHA-256 deduplication cycle
- `GET /api/v1/admin/stats` — Platform counts (jobs, companies, deduplicated savings)

---

## 🛡️ Production & Security Standards
- **Helmet:** Secure HTTP headers enabled
- **Rate Limiting:** Express rate limit on `/api` routes (1,000 req / 15 mins)
- **Validation:** Strict runtime input schema validation with Zod
- **Deduplication:** SHA-256 hash indexed uniquely to prevent database duplication
- **Password Security:** Salted bcrypt hashing with 10 rounds
- **Auth Tokens:** Standard JWT Bearer tokens with 7-day expiration
