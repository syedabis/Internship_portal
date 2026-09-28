# Comprehensive Audit Report: Projects System (User & Admin Portals)

**Date:** September 28, 2026  
**Project:** Cortexa AI Internship Portal  
**Scope:** User-facing Projects Portal (`components/InternshipProjectsView.tsx`, `lib/projectsData.ts`) & Admin Management Portal (`app/admin/projects/page.tsx`, Supabase persistence, Submissions workflow)

---

## Executive Summary

A comprehensive architectural and functional audit of the **Projects System** revealed that while the user interface and presentation layer are visually well-designed, there is a **fundamental decoupling between the database, the admin management panel, and the user interface**. 

The Supabase `projects` table is completely empty (`count: 0`) due to a **UUID type-mismatch error** during seeding. As a result, the entire feature runs on local mock data and single-browser `localStorage`. Furthermore, deliverables submitted by students cannot be reviewed, graded, or approved because **no admin submission interface exists**.

---

## Issue Severity Matrix

| Priority | Category | Issue Count | Impact |
| :--- | :--- | :---: | :--- |
| 🔴 **P0 (Critical)** | Database & Persistence | 4 | Real-time sync broken; Supabase empty; admin changes not visible to users |
| 🟠 **P1 (High)** | Functional & Business Logic | 5 | Submissions unreviewable; admin custom plans ignored; silent submission drops |
| 🟡 **P2 (Medium)** | Data Consistency & Missing Content | 4 | Missing domain case studies; JSON parsing traps; hardcoded stat counters |
| 🔵 **P3 (Low)** | Polish & Accessibility | 3 | Static asset naming; missing copy feedback; window-scoped event listeners |

---

## 1. Database & Persistence Architecture (🔴 P0 Critical)

### 1.1 Supabase Seeding Failure Due to UUID Type Mismatch
- **Files:** [`supabase_setup.sql`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/supabase_setup.sql#L108), [`lib/projectsData.ts`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/lib/projectsData.ts#L37-L50), [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L98)
- **Problem:**  
  In `supabase_setup.sql`, the `projects` table primary key is defined as `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`.  
  However, all 18 items in `INITIAL_PROJECTS` use string identifiers (`'p_ai1'`, `'p_swe1'`, `'p1'`, etc.).
- **Impact:**  
  When `AdminProjectsPage` executes `supabase.from('projects').upsert(projectsToSeed)`, PostgreSQL immediately aborts with:  
  `invalid input syntax for type uuid: "p_ai1"`.  
  **Result:** The remote `projects` table contains **0 rows**. All seeding fails permanently.

### 1.2 "Split-Brain" LocalStorage Fallback (Cross-User Desynchronization)
- **Files:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L86-L93), [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L455-L468)
- **Problem:**  
  Because Supabase queries return empty arrays, both the admin portal and user view fall back to reading and writing `localStorage.getItem('cortexa_projects_list')`.
- **Impact:**  
  `localStorage` is strictly sandboxed to the individual browser. Any project added, edited, or deleted by an administrator in their browser is **completely invisible to interns visiting from their devices**.

### 1.3 Duplicate Row Insertion on Project Edit
- **File:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L217-L221)
- **Problem:**  
  When saving an edited project, the code checks:
  ```typescript
  if (editingId && !editingId.startsWith('proj_') && !editingId.startsWith('p')) {
    await supabase.from('projects').update(dbPayload).eq('id', editingId);
  } else {
    await supabase.from('projects').insert([dbPayload]);
  }
  ```
- **Impact:**  
  Because all initial projects start with `'p'` and new local projects start with `'proj_'`, the code **never updates existing rows**. Instead, it executes an `INSERT` statement every time an admin clicks "Update Project", flooding the database with duplicate records.

### 1.4 Supabase Data Mapper Strips Advanced Fields
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L479-L491)
- **Problem:**  
  The `loadProjects()` function maps database columns to the frontend `Project` interface, but omits `case_study`, `weekly_plan`, `final_deliverable`, and `evaluation_criteria`:
  ```typescript
  const mapped: Project[] = data.map((p: any) => ({
    id: p.id,
    title: p.title,
    // ... basic fields ...
    // MISSING: caseStudy, weeklyPlan, finalDeliverable, evaluationCriteria
  }));
  ```
- **Impact:**  
  Even if projects are properly stored in Supabase with customized plans, the user frontend strips this data upon retrieval.

---

## 2. Business Logic & Plan Generation (🟠 P1 High)

### 2.1 Admin Custom Execution Plans Are Overwritten by Hardcoded Generator
- **Files:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L453-L586), [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L266-L283)
- **Problem:**  
  The admin portal provides an advanced form allowing administrators to define custom weekly plans, benchmark case studies, final deliverables, and evaluation rubrics.  
  However, in `InternshipProjectsView.tsx`, the `generatePlan(project)` function hardcodes:
  ```typescript
  return {
    overview: `...`,
    exampleCaseStudy: getExampleCaseStudy(project), // Overrides project.caseStudy
    weeklyPlan: weeklyPlans,                        // Overrides project.weeklyPlan
    finalDeliverable: `...`,                        // Overrides project.finalDeliverable
    evaluationCriteria: [...],                      // Overrides project.evaluationCriteria
  };
  ```
- **Impact:**  
  Admin customization is completely inert. Every student sees the exact same generic weekly boilerplate regardless of what the administrator configured.

### 2.2 Complete Lack of Admin Submission Review Interface (Orphaned Submissions)
- **Files:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx), [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L419-L453)
- **Problem:**  
  Interns submit weekly deliverable URLs and reflection notes through the submission modal. These records target `project_submissions`.  
  However, **there is zero UI in the admin portal (`/admin`) to inspect, grade, approve, or reject student submissions**.
- **Impact:**  
  Submissions accumulate in the database with no review workflow. Mentors cannot evaluate work, give feedback, or verify completion.

### 2.3 Silent Submission Failure for Guest / Unauthenticated Interns
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L422-L447)
- **Problem:**  
  If an unauthenticated user opens the submission modal:
  ```typescript
  const email = currentUser?.email || 'intern@datacrumbs.org';
  ```
  The code submits with `'intern@datacrumbs.org'`. Supabase RLS enforces `auth.role() = 'authenticated'` and checks the JWT email. Because the client is unauthenticated, Supabase rejects the request.  
  However, the `error` return value is not inspected:
  ```typescript
  const { data, error } = await supabase.from('project_submissions').upsert(...);
  // error is ignored; UI optimistically updates
  setSubmissions((prev) => ({ ...prev, [submittingWeek]: payload }));
  ```
- **Impact:**  
  The user is falsely shown *"Submitted (Pending Review)"*. Upon browser refresh, the submission is completely gone.

### 2.4 Submissions Disconnected from Leaderboard & Rewards
- **Files:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx), [`components/InternshipLeaderboardView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipLeaderboardView.tsx)
- **Problem:**  
  Each project prominently advertises point values (e.g. `500 pts`, `350 pts`). However, approving a deliverable or completing a project has no mechanism to increment user points in the database or update the leaderboard rankings.

### 2.5 No Overall Project Completion State
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L747-L801)
- **Problem:**  
  Submissions exist solely on an isolated week-by-week basis (e.g., Week 1, Week 2). Once all weeks are submitted, there is no overall "Project Completed" milestone, certificate trigger, or portfolio badge generated.

---

## 3. Data Consistency & Missing Content (🟡 P2 Medium)

### 3.1 Missing Real-World Case Studies for 3 Corporate Domains
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L100-L170)
- **Problem:**  
  The `getExampleCaseStudy()` function contains domain-specific scenarios for AI, SWE, Cybersecurity, HR, Sales, Marketing, Finance, and Product.  
  **Missing Domains:**
  1. `operations` (Supply Chain & Logistics)
  2. `customersuccess` (Customer Retention & CSAT)
  3. `design` (Brand Identity & UI/UX)
- **Impact:**  
  Students who select projects in Operations, Customer Success, or Graphic Design receive a generic fallback: *"The company needs a structured execution plan for [Title]..."*, reducing educational value.

### 3.2 Error-Prone Raw JSON Weekly Plan Editor in Admin Portal
- **File:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L550-L557)
- **Problem:**  
  Administrators must construct weekly plans by typing a raw JSON array into a textarea. If there is a syntax error (trailing comma, unescaped quote), `JSON.parse` fails silently and discards the weekly plan without notifying the admin:
  ```typescript
  } catch {
    console.warn('Weekly plan JSON parse failed, using raw string formatting');
  }
  ```

### 3.3 Project Deletion Matching by Title Fragility
- **File:** [`app/admin/projects/page.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/app/admin/projects/page.tsx#L238-L245)
- **Problem:**  
  When an admin deletes a project, the handler executes:
  ```typescript
  await supabase.from('projects').delete().eq('title', projTitle);
  ```
  Deleting by title rather than primary key `id` risks deleting multiple projects if titles match or failing if the title was edited.

### 3.4 Hardcoded Stats Bar
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L923-L940)
- **Problem:**  
  The stats bar displays:
  - **Total Projects:** Hardcoded to `PROJECTS.length.toString()` (`18`) rather than `projectsList.length`.
  - **Max Points:** Hardcoded to `'500'`.
  - **Avg Duration:** Hardcoded to `'4.2 wks'`.
- **Impact:**  
  When an admin adds or removes projects, the stats bar values do not dynamically recalculate.

---

## 4. UI Polish & Cross-Component Communication (🔵 P3 Low)

### 4.1 Asset Filename Formatting Issue
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L562)
- **Issue:**  
  `backgroundImage: url('/dark-abstract-textured-background-with-green-and-t-2026-08-20-19-21-18-utc.JPG (1).jpeg')`  
  Contains spaces and parentheses in the asset name. While supported by modern browsers, spaces in URL paths can cause 404s or CDN encoding mismatches in production builds.

### 4.2 Tab Event Listener Scoped to Single Window
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L504-L506)
- **Issue:**  
  The component listens for `cortexa_projects_updated` on `window`. Standard window events do not broadcast across browser tabs. If an admin edits a project in tab A, tab B will not update until refreshed.

### 4.3 Copy Plan Missing Toast Feedback
- **File:** [`components/InternshipProjectsView.tsx`](file:///c:/Users/Administrator/.gemini/antigravity/scratch/29%20-%20Internship%20Portal/components/InternshipProjectsView.tsx#L876-L899)
- **Issue:**  
  Clicking "Copy Full Plan as Markdown" changes button text temporarily, but does not trigger a global toast notification.

---

## Recommended Action Plan

### Phase 1: Database & Seeding Fix (Immediate)
1. **Change `id` column in `projects` table** from `UUID` to `TEXT` (or map initial text IDs to deterministic UUIDs like `gen_random_uuid()`).
2. Run a migration script to seed all 18 domain projects with their case studies and weekly plans directly into Supabase.
3. Update `AdminProjectsPage.tsx` to handle standard UUIDs and perform proper `upsert({ onConflict: 'id' })`.

### Phase 2: Plan Generator Integration
1. Update `generatePlan(project)` in `InternshipProjectsView.tsx` to first check `if (project.caseStudy) return project.caseStudy`, `if (project.weeklyPlan) return project.weeklyPlan`, etc.
2. Add rich case studies for the 3 missing domains: **Operations**, **Customer Success**, and **Graphic Design**.
3. Update `loadProjects()` mapper to preserve all advanced plan fields from Supabase.

### Phase 3: Admin Submissions Management Portal
1. Create a dedicated Admin Submissions View (e.g. `/admin/projects/submissions` or tab in `/admin/projects`) displaying:
   - Intern Name & Email
   - Project Title & Week Number
   - Deliverable URL (clickable) & Reflection Notes
   - Action buttons: **Approve (+Points)**, **Request Revision**, **Reject**.
2. Connect approved deliverables to user points and the Leaderboard.
