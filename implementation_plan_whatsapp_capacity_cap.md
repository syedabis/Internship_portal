# Implementation Plan - WhatsApp Group Capacity Cap (Max 3 Interns)

This document outlines the step-by-step technical plan to restrict WhatsApp chapter groups to a **maximum of 3 interns** per group across the Internship Portal.

---

## 🎯 Goal & Key Behavior

1. **Capacity Limit:** Every chapter WhatsApp group will have a hard limit of **3 members**.
2. **Visual Indicators:** Chapter cards will display live seat availability (e.g., `🟢 1/3 Seats`, `🔴 3/3 Full`).
3. **Registration Guard:** New interns cannot register or get the link if a chapter is at capacity (`3/3`).
4. **Existing Member Pass:** Interns who have *already registered* for a chapter retain full access to their WhatsApp group link even when the group reaches capacity.

---

## 📐 Architecture & Logic Workflow

```mermaid
flowchart TD
    A[User clicks 'Join Chapter WhatsApp'] --> B{Already Registered in Chapter?}
    B -- Yes --> C[Open WhatsApp Link / Confirmation Modal]
    B -- No --> D{Members Count >= 3?}
    D -- Yes --> E[Disable Button & Show 'Group Full (3/3)']
    D -- No --> F[Open Registration Modal]
    F --> G[User Submits Phone Number]
    G --> H[Increment members_count & Save Ambassador]
    H --> I[Display WhatsApp Group Link]
```

---

## 📋 Detailed Step-by-Step Plan

### Step 1: Configuration & Constant Setup
- **Target Files:** `components/ChaptersAmbassadorsView.tsx` & `lib/chaptersData.ts`
- Define `MAX_GROUP_CAPACITY = 3`.
- Ensure `Chapter` objects track:
  - `members_count`: `number` (current number of registered ambassadors)
  - `capacity_limit`: `number` (defaults to `3`)

### Step 2: Live Capacity Badges on Chapter Cards
- **Target File:** `components/ChaptersAmbassadorsView.tsx`
- On each card header/badge area, display:
  - **If `members_count < 3`**: `🟢 {members_count}/3 Seats Filled` (e.g. `0/3`, `1/3`, `2/3`).
  - **If `members_count >= 3`**: `🔴 3/3 Full (Capacity Reached)`.

### Step 3: Button State & Registration Lock
- **Target File:** `components/ChaptersAmbassadorsView.tsx`
- Evaluate user status per chapter:
  1. `isAlreadyMember`: Check if the logged-in user's email/phone exists in `ambassadors` for this chapter.
  2. `isCapacityReached`: `members_count >= 3`.
- **Button Behavior:**
  - **`isAlreadyMember === true`**: Button reads **`Access My WhatsApp Group`** (Active green button - existing members can always access their link).
  - **`isAlreadyMember === false` AND `isCapacityReached === true`**: Button reads **`Group Full (3/3)`** (Disabled greyed-out button).
  - **`isAlreadyMember === false` AND `isCapacityReached === false`**: Button reads **`Join Chapter WhatsApp`** (Active button -> opens phone number registration modal).

### Step 4: Backend/Registration Validation Guard
- **Target File:** `components/ChaptersAmbassadorsView.tsx`
- Inside `handleRegisterAndJoin()`:
  - Perform a final check before saving: if `members_count >= 3` and user is not an existing member, halt registration and show notice:
    > *"This group has reached its 3-intern capacity limit. Registration is closed."*

### Step 5: Data Persistence Sync
- Sync `members_count` increments across both `localStorage` (`cortexa_chapters_list`) and Supabase (`chapters` & `ambassadors` tables).

---

## 🔍 Edge Cases Covered

| Edge Case | Handling Strategy |
| :--- | :--- |
| **Existing member re-visits when group is 3/3** | System recognizes their registered email/phone and lets them view the link without blocking. |
| **Duplicate submissions** | Prevents existing members from incrementing `members_count` a second time. |
| **Offline fallback** | LocalStorage state maintains cap enforcement if Supabase connection fails. |
