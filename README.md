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
| `.github/workflows/deploy.yml` | Auto-deploys `src/` to Apps Script on push to `main` |
| `icons/` | App icon (diya) |

## Set it up (about 5 minutes)

> **Do the setup on a laptop or desktop browser.** The Google Sheets phone app
> has no **Extensions** menu, so Apps Script can't be opened from it. After
> setup, you use the journal from your phone through its web link.

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

Set up **automatic deploys** once (below) and every change merged into `main`
goes live by itself. Without it: paste the new code, then **Deploy → Manage
deployments → ✏️ Edit → Version: New version → Deploy**.

## Automatic deploys (GitHub Actions)

`.github/workflows/deploy.yml` uses Google's `clasp` tool to upload `src/` to
your Apps Script project and update your existing web app deployment, so
the link on your phone never changes. It runs on every push to `main` that
touches `src/`, or by hand from the **Actions** tab (**Run workflow**).

One-time setup (on your laptop):

1. **Turn on the Apps Script API:** open
   <https://script.google.com/home/usersettings> and switch
   **Google Apps Script API** to **On**.
2. **Log in with clasp.** Install [Node.js](https://nodejs.org) (LTS), then in
   a terminal run:
   ```
   npx @google/clasp@3.4.1 login
   ```
   A browser window opens; sign in with the Google account that owns the
   journal Sheet and click **Allow**. This creates a file called `.clasprc.json`
   in your home folder (`C:\Users\<you>\.clasprc.json` on Windows,
   `~/.clasprc.json` on Mac).
3. **Find two IDs** in the Apps Script editor:
   - **Script ID:** ⚙ **Project Settings → IDs → Script ID**.
   - **Deployment ID:** **Deploy → Manage deployments**, select your web app,
     and copy its **Deployment ID** (starts with `AKfycb…`).
4. **Add three secrets** to the GitHub repo: **Settings → Secrets and
   variables → Actions → New repository secret**:

   | Name | Value |
   |---|---|
   | `CLASPRC_JSON` | the entire contents of `.clasprc.json` |
   | `SCRIPT_ID` | the Script ID |
   | `DEPLOYMENT_ID` | the Deployment ID |

5. **Name the main branch `main`.** On GitHub: **Settings → General → Default
   branch** (or **Branches**), click the ✏️ rename icon, and rename it to `main`.
6. **Test it:** **Actions → Deploy to Apps Script → Run workflow**. A green
   tick means your web app has been updated.

Notes:
- The first automatic deploy also uploads `src/appsscript.json`. If you
  skipped that file during manual setup, the app may ask you to **Allow**
  access once more next time you open it. That's expected.
- `.clasprc.json` is a login token for your Google account's Apps Script
  projects. Keep it only in the GitHub secret; never commit it or share it.
  Secrets are not given to pull requests from forks, and you can revoke the
  token at any time at <https://myaccount.google.com/permissions>.
- If a deploy fails with an auth error after months of no use, run
  `npx @google/clasp@3.4.1 login` again and update the `CLASPRC_JSON` secret.

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
