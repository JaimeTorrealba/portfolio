# Mistakes log

Mistakes in my own reasoning or approach, logged as found. Check before starting work.

- **2026-10-03 — `dist/` is stale.** `dist/` was built on 2025-09-05 by the old Vite setup (`dist/assets/*`), before the Nuxt migration. Don't use it as evidence of what the current build ships; reason from the source instead.
- **2026-10-03 — Misread the scope of a request.** "let's go with calm and fix the highest impact based on your table" meant *fix every item in the table, carefully*, not *fix only the top one*. I did #1 and #10, then stopped and listed the rest as "next". When a request points at a list, do the whole list unless told otherwise; ask only when a specific item needs a decision.
