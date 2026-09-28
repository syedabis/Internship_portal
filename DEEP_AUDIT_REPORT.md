# 🔍 Technical Audit & Active Issue Catalog

**Project:** Cortexa AI — Internship & Campus Ambassador Portal (Profile Architect)  
**Audit Date:** September 28, 2026  
**Auditor:** Antigravity AI (Google DeepMind Team)  
**Status:** 8 High/Critical Issues Resolved Locally | Active Catalog Updated  

---

## Executive Summary

A full-stack technical audit was conducted across all files, components, API routes, database schemas, and configuration files of the **Cortexa AI Internship Portal**.

Eight foundational security and architecture issues have been resolved locally—including server-side admin middleware, Supabase RLS hardening, OpenAI chat rate-limiting, and credentials cleanup. 

This catalog tracks the remaining open issues across architecture, authentication, database persistence, mocked frontend features, and code health.

---

## Issue Status Dashboard

| Severity | Remaining Open | Resolved Locally | Total Audited | Primary Remaining Impact Areas |
| :--- | :---: | :---: | :---: | :--- |
| 🔴 **Critical** | 3 | 4 | 7 | Auth duality (Clerk vs Supabase), unauthenticated Puppeteer PDF SSRF |
| 🟠 **High** | 7 | 2 | 9 | Missing database tables, UUID type conflicts, CSV formula injection |
| 🟡 **Medium** | 10 | 2 | 12 | Simulated ATS/LinkedIn audit, private beta lockout, ephemeral job apps |
| 🟢 **Low / Quality** | 8 | 0 | 8 | 427 ESLint errors, dead document downloads, Base64 image bloat |
| **Total** | **28** | **8** | **36** | |

---

## 1. Critical Architectural & Authentication Flaws

### 1.1 Auth Duality: Split Identity between Clerk and Supabase
- **Files:** [`app/layout.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/layout.tsx), [`proxy.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/proxy.ts), [`app/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/page.tsx), [`components/AuthModal.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/AuthModal.tsx), [`lib/serverAuth.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/serverAuth.ts)
- **Description:** 
  - `app/layout.tsx` mounts `<ClerkProvider publishableKey={publishableKey}>`.
  - Next.js 16 proxy middleware in `proxy.ts` executes `clerkMiddleware()`.
  - In contrast, the user interface in `app/page.tsx` and `components/AuthModal.tsx` authenticates solely against **Supabase Auth** (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`).
  - As a result, users authenticated via Supabase do **not** have an active Clerk session in their cookies. All server-side API routes relying on Clerk's `currentUser()` or `auth()` return `null`.
- **Consequence:** The server perceives every single authenticated user as anonymous unless customized headers are passed, causing widespread authorization failures or security bypasses.

### 1.2 Broken Password Reset Flow in AuthModal
- **File:** [`components/AuthModal.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/AuthModal.tsx#L308-L326)
- **Description:**
  - In `handleForgotVerifySubmit`, the component calls `supabase.auth.updateUser({ password })`.
  - Supabase's `updateUser` requires an existing authenticated session. A user trying to reset a forgotten password is not logged in.
- **Consequence:** The password reset submission fails with an unauthenticated session error.

### 1.3 SSO OAuth Callback Misconfiguration
- **Files:** [`app/sso-callback/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/sso-callback/page.tsx), [`components/AuthModal.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/AuthModal.tsx#L198-L207)
- **Description:**
  - `app/sso-callback/page.tsx` renders Clerk's `<AuthenticateWithRedirectCallback />`.
  - However, `AuthModal.tsx` triggers Supabase OAuth (`supabase.auth.signInWithOAuth`).
- **Consequence:** If redirected to `/sso-callback`, Clerk fails to find a valid OAuth handshake exchange.
- **Easy 5-Line Explanation:**
  1. When a user clicks "Sign in with Google", the app starts a login with Supabase.
  2. After Google approves the user, it redirects back to the `/sso-callback` page.
  3. That page is still running old Clerk code instead of Supabase code.
  4. Because Clerk has no record of the Supabase login attempt, the handshake crashes.
  5. The callback page must be updated to complete the login with Supabase instead.

---

## 2. Security Vulnerabilities & Authorization Flaws

### 2.1 Unauthenticated Headless Puppeteer Chromium Endpoint (SSRF / DoS)
- **File:** [`app/api/pdf/route.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/api/pdf/route.ts#L6-L36)
- **Description:**
  - `POST /api/pdf` accepts arbitrary raw HTML from any unauthenticated caller and launches Puppeteer to render a PDF.
  - In serverless environments, it attempts to download a 50MB Chromium binary from GitHub (`https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar`) during execution.
- **Consequence:** Attackers can spam the endpoint to trigger Lambda timeouts, exhaust server memory, or probe internal networks (SSRF) via malicious `<iframe>` tags in the HTML body.
- **Easy 5-Line Explanation:**
  1. The website has an endpoint (`/api/pdf`) that turns HTML into a downloadable PDF.
  2. It launches a heavy, invisible web browser on your server without asking who is calling.
  3. Every single request downloads a 50MB browser engine, hogging server memory and CPU.
  4. An attacker could flood this endpoint to crash your server or reach internal services.
  5. The endpoint must require login and only convert verified internal resume templates.

### 2.2 CSV Formula Injection (Formula Injection Vulnerability)
- **File:** [`app/admin/chapters/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/chapters/page.tsx#L236-L250)
- **Description:**
  - The CSV export function serializes ambassador records directly into CSV strings without sanitizing formula prefixes (`=`, `+`, `-`, `@`).
- **Consequence:** If an applicant registers with a name or phone number starting with `=cmd|' /C calc'!A0` or `=HYPERLINK(...)`, opening the exported CSV in Microsoft Excel or Google Sheets executes arbitrary formula payloads.
- **Easy 5-Line Explanation:**
  1. When an admin clicks "Export Ambassadors", the website downloads an Excel spreadsheet.
  2. If a student signs up with a name starting with `=`, `+`, or `-`, it is written directly into the file.
  3. When the admin double-clicks to open that spreadsheet, Microsoft Excel treats that name as a formula.
  4. Hackers can use this to run commands on the admin's computer or steal private data.
  5. The exporter must add an apostrophe `'` before any cell starting with `=`, `+`, `-`, or `@`.

---

## 3. Database Schema & Data Persistence Desynchronization

### 3.1 Missing Tables in Supabase Setup SQL
- **Files:** [`supabase_setup.sql`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/supabase_setup.sql), [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L394-L440), [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L98)
- **Description:**
  - The frontend and admin panel actively query and upsert to `projects` and `project_submissions` tables.
  - Neither `projects` nor `project_submissions` exists in `supabase_setup.sql`.
- **Consequence:** Every remote project submission or admin project update fails silently with a database error and falls back to `localStorage`. Only the local browser remembers the submission; admins and other users cannot see it.

### 3.2 Primary Key Type Conflict (UUID vs String Identifiers)
- **Files:** [`supabase_setup.sql`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/supabase_setup.sql#L133-L158), [`lib/chaptersData.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/chaptersData.ts#L3-L20), [`app/admin/chapters/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/chapters/page.tsx#L140-L165)
- **Description:**
  - In `supabase_setup.sql`, `chapters.id` is defined as `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`.
  - In `INITIAL_CHAPTERS`, IDs are strings like `"c_1"`, `"c_2"`, `"c_3"`.
  - The admin page contains hardcoded regex workarounds (`!editingChapterId.startsWith('c_')`) to prevent passing `"c_1"` to Supabase.
- **Consequence:** Querying `.eq('id', id)` when `id` is `"c_1"` causes PostgreSQL to crash with: `invalid input syntax for type uuid: "c_1"`.

### 3.3 Flawed Deletion by Chapter Name
- **File:** [`app/admin/chapters/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/chapters/page.tsx#L165)
- **Description:**
  - When deleting a chapter, the code calls:
    ```typescript
    await supabase.from('chapters').delete().eq('name', chapName);
    ```
  - In `seed_chapters.sql`, duplicate chapters existed with the exact same name (e.g., "GIK Institute of Technology").
- **Consequence:** Deleting one chapter inadvertently wipes out all satellite chapters with the same name instead of targeting the unique primary key.

### 3.4 WhatsApp Capacity Cap Member Count Reset Glitch
- **File:** [`components/ChaptersAmbassadorsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/ChaptersAmbassadorsView.tsx#L131-L136)
- **Description:**
  - The code resets `members_count` to `0` whenever `members_count > 3`:
    ```typescript
    members_count: typeof c.members_count === 'number' && c.members_count > 3 ? 0 : (c.members_count || 0)
    ```
- **Consequence:** Real chapter statistics from the imported CSV (which had 39, 46, 53 members) are forcibly wiped to 0 in local state.

---

## 4. Mocked Features, Fake APIs, and Dead UI Elements

### 4.1 60% of Portal Tabs Blocked by Private Beta Gate
- **Files:** [`lib/accessConfig.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/accessConfig.ts#L21-L28), [`app/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/page.tsx#L72-L78)
- **Description:**
  - The following 6 tabs are restricted to 7 `@datacrumbs.org` emails:
    1. `leaderboard`
    2. `resources`
    3. `inbox`
    4. `jobopportunities`
    5. `cvaudit`
    6. `linkedinaudit`
- **Consequence:** When any normal intern signs in, clicking 6 out of the 10 portal tabs opens a modal reading: *"Private Beta: Feature Under Testing."*

### 4.2 Simulated ATS CV Audit Engine
- **File:** [`components/CvAuditView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/CvAuditView.tsx#L24-L30)
- **Description:**
  - Re-auditing is simulated client-side via `setTimeout`:
    ```typescript
    setAtsScore(Math.min(96, atsScore + Math.floor(Math.random() * 8) + 2));
    ```
  - The 466-line backend deterministic ATS scorer in `app/api/ats-score/route.ts` is never called.
  - "Upload PDF" button does not have a file input or `onClick` handler.
  - "Auto-Enhance Bullet Points" triggers the same random score increment.
  - Feedback cards are hardcoded strings that never update even if the textarea is emptied.

### 4.3 Mocked LinkedIn Profile Audit
- **File:** [`components/LinkedinAuditView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/LinkedinAuditView.tsx#L11-L17)
- **Description:**
  - The view displays a static score of 46.
  - Clicking "Run Audit" triggers a 1-second `setTimeout` that hardcodes the score to 88.
  - There is no LinkedIn URL input, profile scraper, or AI analysis.

### 4.4 Hardcoded Leaderboard, Points & Achievements
- **File:** [`components/InternshipLeaderboardView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipLeaderboardView.tsx#L43-L184)
- **Description:**
  - Point totals (`997 / 2400`), milestone tiers, earned achievements, category breakdowns, and weekly activity charts are static constants.
  - Completing tasks or submitting projects does not increment points or unlock achievements in the database.

### 4.5 Resources View Disconnected from Supabase
- **Files:** [`components/InternshipResourcesView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipResourcesView.tsx#L24-L132), [`app/admin/resources/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/resources/page.tsx)
- **Description:**
  - `InternshipResourcesView.tsx` uses a static `MASTERCLASSES` array. It never queries the Supabase `resources` table.
  - Resource links point to `#`.
  - Any tutorial or masterclass created in `/admin/resources` is completely invisible to interns.

### 4.6 Ephemeral Job Applications
- **File:** [`components/JobOpportunitiesView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/JobOpportunitiesView.tsx#L111-L115)
- **Description:**
  - Jobs are a hardcoded 4-element array.
  - "Quick Apply" simply pushes the job ID into local React state:
    ```typescript
    setAppliedJobs([...appliedJobs, jobId]);
    ```
  - No database record is created. Switching tabs or refreshing the page instantly erases all application records.

### 4.7 Hardcoded Support Inbox Mockup
- **File:** [`components/InternshipInboxView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipInboxView.tsx#L25-L100)
- **Description:**
  - The inbox renders mock email threads.
  - It is not connected to user accounts, real emails, or admin replies.

### 4.8 Dead Document Download Buttons
- **File:** [`components/InternshipDocumentsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipDocumentsView.tsx#L60-L63)
- **Description:**
  - "Download Official PDF" buttons on certificates and experience letters have no `onClick` handlers or file download triggers.

### 4.9 Silent Support Ticket Submission Failure
- **File:** [`components/InternshipCommunityView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipCommunityView.tsx#L75-L94)
- **Description:**
  - `handleSendSupport` does not check the error return value from `supabase.from('support_messages').insert(...)`.
  - It sets `sent = true` unconditionally even if the network fails or RLS rejects the query.

---

## 5. Code Quality, Linting & Production Health

### 5.1 427 ESLint Errors and Warnings
- **Execution:** `npm run lint`
- **Output:** `✖ 427 problems (141 errors, 286 warnings)`
- **Key Categories:**
  - Forbidden `require()` imports in `scripts/generate_sql_and_ts.js`, `scripts/seed_chapters.js`, and `test-api.js`.
  - Unescaped HTML entities (`"`, `'`) across `components/Sidebar.tsx`, `components/UpgradeModal.tsx`.
  - Over 100+ instances of `@typescript-eslint/no-explicit-any`.
  - Unused imported icons and variables across `components/ResumeEditor.tsx`, `components/ResumeLandingView.tsx`.

### 5.2 Base64 Image Bloat in Supabase Auth Metadata
- **File:** [`components/InternshipLeaderboardView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipLeaderboardView.tsx#L141-L156)
- **Description:**
  - When a user uploads a custom avatar, the full Base64 data URL string is saved directly into `supabase.auth.updateUser({ data: { avatar_url: croppedDataUrl } })`.
- **Consequence:** Storing massive Base64 strings in user metadata bloats auth JWT tokens, often exceeding cookie and header size limits (causing 431 Request Header Fields Too Large HTTP errors).

---

## 6. Comprehensive Remediation Matrix (Remaining Open Issues)

| Category | Priority | Problem Summary | Recommended Remediation |
| :--- | :---: | :--- | :--- |
| **Auth** | 🔴 P0 | Split Clerk / Supabase Identity | Deprecate Clerk; standardize on Supabase Auth across `layout.tsx`, `proxy.ts`, and all `/api` endpoints. |
| **Security** | 🟠 P1 | Puppeteer PDF unauthenticated DoS / SSRF | Protect `POST /api/pdf` with authentication, rate limiting, and HTML payload sanitization. |
| **Security** | 🟠 P1 | CSV Formula Injection on Export | Sanitize leading formula characters (`=`, `+`, `-`, `@`) with prepended apostrophe `'`. |
| **Database** | 🟠 P1 | Missing `projects` & `project_submissions` tables | Add `CREATE TABLE projects` and `CREATE TABLE project_submissions` to `supabase_setup.sql`. |
| **Database** | 🟠 P1 | UUID vs string ID crash (`c_1`) | Standardize `chapters.id` and `ambassadors.id` as `TEXT` or generate standard UUIDs across datasets. |
| **Database** | 🟠 P1 | Deletion by Chapter Name | Change delete query in `app/admin/chapters/page.tsx` to delete strictly by unique chapter `id`. |
| **Features** | 🟡 P2 | Private Beta gate locks 60% of portal | Remove `RESTRICTED_BETA_FEATURES` or enable access for all verified authenticated interns. |
| **Features** | 🟡 P2 | Mocked CV Audit & LinkedIn Audit | Connect `CvAuditView.tsx` to the real `/api/ats-score` engine; implement real LinkedIn heuristic parser. |
| **Features** | 🟡 P2 | Ephemeral job applications & static resources | Create `jobs` and `job_applications` tables; connect `InternshipResourcesView.tsx` to Supabase. |
| **Features** | 🟡 P2 | Dead Certificate Download Buttons | Wire download handlers to fetch official certificate templates or trigger dynamic PDF export. |
| **Performance**| 🟢 P3 | Base64 avatar data in auth metadata | Upload cropped profile images to Supabase Storage or Cloudinary and store the CDN URL. |
| **Quality** | 🟢 P3 | 427 ESLint errors & warnings | Run ESLint automated fixes, eliminate `require()` in scripts, and fix unescaped JSX characters. |

---

## 7. Resolved Issues Log (8 Issues Completed Locally)

| # | Issue Title | Resolution Summary | Key Files Modified |
| :-: | :--- | :--- | :--- |
| **1** | **Dead Admin Guard & Legacy API Routes** | Re-implemented hybrid Supabase + Clerk `getCurrentUser()` and `requireAdmin()` guard in `lib/adminAuth.ts`. Re-wired all 13 `/api/admin/*` endpoints. | [`lib/adminAuth.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/adminAuth.ts), [`lib/serverAuth.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/serverAuth.ts), [`lib/adminEmails.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/adminEmails.ts), all `/api/admin/*` routes |
| **2** | **Broken Server-Rendered Admin Pages** | Removed dead `auth = await requireAdmin()` redirect calls in SSR pages. Admin authentication and cookie synchronization are cleanly enforced in `AdminLayout`. | [`app/admin/layout.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/layout.tsx), [`users/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/users/page.tsx), [`payments/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/payments/page.tsx), [`name-requests/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/name-requests/page.tsx), [`issues/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/issues/page.tsx) |
| **3** | **Unauthenticated OpenAI API Abuse** | Added `getCurrentUser()` authentication checks (HTTP 401), enforced 5-message free tier quotas, and allowed admin quota bypasses. | [`app/api/resume-chat/route.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/api/resume-chat/route.ts), [`github-chat/route.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/api/github-chat/route.ts), [`linkedin-chat/route.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/api/linkedin-chat/route.ts), [`linkedin-rich-chat/route.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/api/linkedin-rich-chat/route.ts) |
| **4** | **Duplicate Seed Data in `seed_chapters.sql`** | Automated deduplication by canonical WhatsApp invite code merged 13 duplicate chapter groups into 135 unique chapters and 29 verified ambassadors. | [`seed_chapters.sql`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/seed_chapters.sql), [`parsed_data.json`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/parsed_data.json), [`scripts/deduplicate_chapters.js`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/scripts/deduplicate_chapters.js) |
| **5** | **Permissive Supabase Row-Level Security** | Created PostgreSQL `is_admin()` security definer function. Removed all blanket `USING (true)` mutation policies. Restricted write access on core tables to admins and user-scoped messages/submissions. | [`supabase_setup.sql`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/supabase_setup.sql) |
| **6** | **Client-Side-Only Admin Guard** | Extended Next.js 16 server middleware in `proxy.ts` to inspect session JWTs and redirect unauthenticated users to `/admin/login` before serving admin page HTML. | [`proxy.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/proxy.ts), [`app/admin/layout.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/layout.tsx), [`app/admin/login/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/login/page.tsx), [`lib/adminEmails.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/adminEmails.ts) |
| **7** | **Hardcoded Supabase Secrets in Source Code** | Removed hardcoded URL and JWT strings from code. Strictly enforced `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. | [`lib/supabase.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/supabase.ts), [`scripts/push_to_supabase.js`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/scripts/push_to_supabase.js) |
| **8** | **Hardcoded Fallback User Persona** | Removed all hardcoded `"Nmesoma Anita"` and `"nmesoanita@gmail.com"` fallbacks. Resolved name/email dynamically from active user session with neutral fallbacks. | [`app/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/page.tsx), [`components/InternshipSidebar.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipSidebar.tsx), [`components/InternshipLeaderboardView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipLeaderboardView.tsx), [`components/CvAuditView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/CvAuditView.tsx), [`components/InternshipInboxView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipInboxView.tsx) |
