routineo/
├── app/                    # Next.js App Router (pages if using Pages Router)
│   ├── layout.tsx          # Common layout wrapper
│   ├── page.tsx            # Home / Main screen
│   ├── routines/           # Routes for viewing, editing routines
│   ├── auth/               # Auth pages (login, signup)
│   └── settings/           # Settings page (e.g. reset time)
│
├── components/             # Reusable UI components
│   ├── RoutineCard.tsx
│   ├── RoutineForm.tsx
│   └── Header.tsx
│
├── lib/                    # Client helpers and utils
│   ├── supabaseClient.ts   # Supabase client instance
│   ├── time.ts             # Helpers for reset scheduling
│   └── constants.ts        # Static values (e.g., days of week)
│
├── types/                  # TypeScript types
│   └── routine.ts
│
├── services/               # Client-side service logic
│   ├── routines.ts         # Read/update routines from Supabase
│   └── auth.ts             # Login/signup helpers
│
├── hooks/                  # React hooks
│   ├── useUser.ts          # Get and track Supabase user session
│   └── useRoutines.ts      # Fetch and manage routine list state
│
├── capacitor/              # Capacitor project config (native shell)
│   ├── android/
│   ├── ios/
│   └── capacitor.config.ts
│
├── public/                 # Static files
├── styles/                 # Tailwind or CSS modules
├── .env.local              # Environment variables (Supabase URL, anon key)
├── package.json
└── README.md