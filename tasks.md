# 🧠 Routineo MVP Build Tasks

Each task is:
- Tiny and testable
- Focused on one concern
- Sequenced for easy agent handoff

---

## ✅ PHASE 1: Project Setup

### 1.1 — Initialize Next.js Project
- Start: Run `npx create-next-app@latest routineo`
- End: App renders a “Hello World” home screen on `localhost:3000`

### 1.2 — Set Up Tailwind CSS
- Start: Install Tailwind per [official guide](https://tailwindcss.com/docs/guides/nextjs)
- End: A `.bg-blue-500` class shows a blue element on screen

### 1.3 — Set Up Supabase Client
- Start: Install `@supabase/supabase-js` and create `lib/supabaseClient.ts`
- End: A test page logs `supabase.auth.getSession()` result in console

### 1.4 — Set Up Environment Variables
- Start: Create `.env.local` with `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- End: `supabaseClient.ts` reads values correctly without crashing

---

## 🔐 PHASE 2: Auth MVP

### 2.1 — Build Signup Form (Email/Password)
- Start: Create form at `/auth/signup`
- End: User can sign up and see success in Supabase dashboard

### 2.2 — Build Login Form
- Start: Create form at `/auth/login`
- End: User can log in and token is stored via `supabase.auth`

### 2.3 — Create `useUser()` Hook
- Start: Add a hook to get current session and user
- End: Any component can show logged-in user email

### 2.4 — Add Protected Route Wrapper
- Start: Create HOC or layout to redirect unauthenticated users
- End: `/` redirects to `/auth/login` if no session exists

---

## 📋 PHASE 3: Routines Data Model

### 3.1 — Create `routines` Table in Supabase
- Start: Run SQL or use Supabase UI to define schema
- End: Table created with fields: id, user_id, name, part_of_day, day_of_week[], order, is_checked

### 3.2 — Create `user_settings` Table
- Start: Add table with user_id (PK) and `reset_time` (default `'05:00'`)
- End: Settings table appears in Supabase with no errors

---

## 🧱 PHASE 4: Routine Creation

### 4.1 — Create `RoutineForm` UI Component
- Start: UI to input name, part_of_day, days, order
- End: Form renders with all fields and local state updates correctly

### 4.2 — Add `createRoutine()` to `services/routines.ts`
- Start: Create a function to insert routine into Supabase
- End: Routine is saved and visible in DB

### 4.3 — Wire Form to Save Routine
- Start: Submit form calls `createRoutine()`
- End: User sees routine appear after submission

---

## ✅ PHASE 5: Viewing + Checking Routines

### 5.1 — Create `useRoutines()` Hook
- Start: Fetch today’s routines based on day of week and user ID
- End: Component logs routines in the console

### 5.2 — Display Routines in Order by Part of Day
- Start: Use `RoutineCard` to render list by `part_of_day`, `order`
- End: Routines display grouped and ordered

### 5.3 — Toggle `is_checked` Status
- Start: Add checkbox to each routine
- End: Clicking checkbox updates `is_checked` in Supabase

---

## ⚙️ PHASE 6: User Settings

### 6.1 — Create Reset Time Settings UI
- Start: UI with a time input at `/settings`
- End: User can select a daily reset time (e.g. 04:30)

### 6.2 — Add `updateResetTime()` in `services/settings.ts`
- Start: Write function to upsert into `user_settings`
- End: Reset time stored and visible in Supabase

### 6.3 — Load Reset Time on App Init
- Start: Fetch `user_settings` on app load
- End: Show selected reset time in settings screen

---

## 🔄 PHASE 7: Daily Auto-Reset Logic

### 7.1 — Track Last Reset Time in Local Storage
- Start: Save today's reset run in `localStorage`
- End: App does not run reset twice in same day

### 7.2 — Compare Current Time to Reset Time
- Start: On app load, compare time and decide whether to reset
- End: Logs "Reset required" or "Skip reset" correctly

### 7.3 — Run Reset Routine When Needed
- Start: For all routines today, set `is_checked = false`
- End: All items are reset when reset time is crossed

---

## 📦 PHASE 8: Capacitor Wrap

### 8.1 — Initialize Capacitor Project
- Start: Run `npx cap init` in Next.js root
- End: `capacitor.config.ts` is generated

### 8.2 — Build & Copy Web Files
- Start: `next build && next export && npx cap copy`
- End: Static files are copied into `android/` and `ios/`

### 8.3 — Run App on Simulator
- Start: `npx cap open ios` or `npx cap open android`
- End: App runs on native device/simulator

---

## 🧪 Final Test Checklist

- [ ] Can sign up and log in
- [ ] Can create routines with required fields
- [ ] Can check off routines and see visual feedback
- [ ] Routines reset automatically at user-set time
- [ ] App runs natively on Android/iOS via Capacitor
