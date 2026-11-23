# Micro Journal 🪔

One line a day, saved to your own Google Sheet. Works on phone and laptop.
India-inspired and minimal: a diya for your streak, a mala for milestones,
and a rangoli that fills in as the month goes on.

See [SPEC.md](SPEC.md) for the full design.

## What's in here

| File | What it is |
|---|---|
| `src/Code.gs` | Apps Script backend: reads and writes the `Journal` tab |
| `src/Index.html` | The whole app (layout, styles, logic) |
| `src/appsscript.json` | Optional manifest: time zone, minimal permissions, "only me" access |

## Set it up (about 5 minutes)

1. **Create the Sheet.** Go to [sheets.new](https://sheets.new) and name it
   e.g. *Micro Journal*. In **File → Settings**, set the time zone to your
   own, e.g. *(GMT-05:00) Eastern Time - Toronto* or *(GMT-08:00) Pacific Time -
   Vancouver*. This controls how the Created/Updated timestamps are shown.
2. **Open Apps Script.** In the Sheet: **Extensions → Apps Script**.
3. **Add the backend.** Replace everything in `Code.gs` with the contents of
   [`src/Code.gs`](src/Code.gs). Save.
4. **Add the page.** Click **＋ → HTML**, name it exactly `Index`
   (no `.html`), and replace its contents with [`src/Index.html`](src/Index.html). Save.
5. *(Optional, recommended)* **Project Settings ⚙ → tick "Show
   appsscript.json manifest file in editor"**, then paste
   [`src/appsscript.json`](src/appsscript.json) into it. This limits the
   script to *this one spreadsheet* only. It's set to `America/Toronto`; if
   you're in another Canadian zone, change `timeZone` to e.g.
   `America/Vancouver`, `America/Edmonton`, `America/Winnipeg`,
   `America/Halifax` or `America/St_Johns`.
6. **Deploy.** **Deploy → New deployment → ⚙ Select type → Web app**
   - Execute as: **Me**
   - Who has access: **Only myself**
   - Click **Deploy**, then **Authorize access**.
   - Google will warn *"Google hasn't verified this app"*. That's expected for
     your own script: click **Advanced → Go to Micro Journal (unsafe)** → **Allow**.
7. **Open the Web app URL** it gives you (ends in `/exec`). Bookmark it.
   The `Journal` tab is created automatically on first save.

### Put it on your phone's home screen

- **iPhone (Safari):** open the URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL → ⋮ menu → **Add to Home screen**.

You must be signed into the same Google account in that browser.

### Updating after code changes

Paste the new code, then **Deploy → Manage deployments → ✏️ Edit →
Version: New version → Deploy**. The URL stays the same.

## How it behaves

- **One entry per day.** Saving again today updates today's row.
- **786 characters max**, single line (Enter saves; line breaks become spaces).
- **Day changes at midnight** on your device's clock, wherever you are
  (travel included). The Sheet's time zone doesn't affect which day you're writing for.
- **Strict streak.** Miss a day and the diya streak starts again from zero.
- **Mala milestones** at 7 → 21 → 51 → 108 days, then every 108 after.
- **Rangoli:** one dot per day of the month; a full month blooms with petals.
- **One year ago:** shows last year's line for today, once you have one.
- You can edit the Sheet by hand too. Keep column A as `yyyy-mm-dd`.

## Sharing with friends later

Don't share your personal journal Sheet. Instead:

1. Make a **fresh, empty copy** of the Sheet (File → Make a copy). The
   script comes with it.
2. Share that copy as **"Anyone with the link: Viewer"**, and send friends the
   link with `/edit…` replaced by `/copy`.
3. Each friend gets their own private Sheet and does step 6 above to deploy
   their own web app. Their entries never touch yours.

## Preview without Google

Open `src/Index.html` directly in a browser. It runs in **preview mode**:
entries are kept in that browser only, which is handy for trying out the look.
