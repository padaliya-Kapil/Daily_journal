# Micro Journal — Spec (v1)

A one-line-a-day journal web app that writes to the user's own Google Sheet.
Works on mobile and laptop. India-inspired, minimalist.

## 1. Goals

- Open → see today → write a line → save. Under 10 seconds.
- Google Sheet is the source of truth (user can view/edit/export it directly).
- Personal first; easy to share later via "Make a copy" of the Sheet.

## 2. Architecture

- **Google Apps Script** web app bound to the Google Sheet.
  - `Code.gs` — server functions: read entries, save today's entry, compute stats.
  - `Index.html` (+ CSS/JS partials) — the UI, served via `HtmlService`.
- No external server, no Google Cloud project, no stored credentials.
- Deployed as "Execute as: me, Access: only myself".
- **Sharing later:** friends use a "Make a copy" link to the Sheet → the script comes
  with it → they deploy their own copy. Data stays in each person's own Drive.
- Future option (not v1): static PWA + Google Sign-In (`drive.file` scope) if many
  people want it, keeping the same Sheet schema.

## 3. Data model

Single sheet tab named `Journal`. Created automatically on first run if missing.

| Column | Name    | Type      | Notes                                  |
|--------|---------|-----------|----------------------------------------|
| A      | Date    | Date      | `yyyy-MM-dd`, one row per day (unique)  |
| B      | Entry   | Text      | Up to 786 characters, single line      |
| C      | Created | Date-time | First save                             |
| D      | Updated | Date-time | Last save                              |

Rules:
- **One entry per day.** Saving when today's row exists **updates** it (no new row).
- Rows may be edited by hand in the Sheet; the app tolerates unsorted rows and
  blank lines.
- Streak and milestones are **computed from dates**, never stored.

## 4. Date & time

- Day boundary: **12:00 AM (midnight)**, in the **device's local timezone**.
  The client sends its local date to the server; the server doesn't decide "today".
- No backfill in v1 (only today is editable).

## 5. Features (v1)

1. **Today's entry**
   - Date header (e.g. `Monday · 23 Nov 2026`).
   - Single text field, auto-grows; save via button or Ctrl/Cmd+Enter.
   - Limit: **786 characters**, with a quiet live counter (`120 / 786`). Enter saves.
   - If today is already written: show it, editable, button reads "Update".
   - States: Saving… → Saved ✓ (haldi accent) / error with retry.
2. **Diya streak** 🪔
   - Consecutive days with an entry, ending today (or yesterday if today isn't
     written yet — diya shown unlit until today is written).
   - **Strict:** one missed day resets the streak. No grace days.
3. **Mala milestones**
   - Bead ring filling toward next milestone: **7 → 21 → 51 → 108** days.
   - On reaching one: a quiet sindoor highlight + one-line message.
   - Also show best streak ever.
4. **Monthly rangoli**
   - Dot pattern for the current month; one coloured dot per day written,
     faint dot for missed/future days. Full month = complete pattern.
   - Swipe/arrows to view previous months.
5. **Recent entries**
   - Last 7 entries below the input, newest first.
6. **One year ago**
   - If an entry exists for this date last year, show it as a small card.

## 6. Design

- Language: **English**.
- Palette (light): khadi off-white background, **neel** (indigo) text/primary,
  **haldi** (turmeric) accent for streak/saved, **sindoor** (vermilion) for
  milestones only.
- Dark mode: deep indigo background, haldi accents. Follows system setting.
- Type: elegant serif for date/headings (e.g. Tiro Devanagari Hindi / similar),
  clean sans for text (e.g. Mukta).
- Motifs: thin block-print border top & bottom; rangoli dot grid; generous
  whitespace.
- Mobile-first, responsive up to laptop; large tap targets; can be added to
  home screen.

## 7. Out of scope (v1)

- Multiple entries per day, backfill of missed days, Hindi UI, offline mode,
  multi-user sign-in, notifications/reminders.

## 8. Decisions log

- Limit is 786 **characters** (not words). Line breaks are collapsed to spaces.
- Streak is strict: no grace days.
- Dates in column A are stored as plain text `yyyy-MM-dd` to avoid timezone drift.
- Possible v2: daily reminder email via Apps Script time trigger.
