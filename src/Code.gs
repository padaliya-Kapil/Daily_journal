/**
 * Micro Journal — Google Apps Script backend.
 *
 * Bound to a Google Sheet. Serves the web app (Index.html) and reads/writes
 * one row per day in the "Journal" tab:  Date | Entry | Created | Updated
 */

const SHEET_NAME = 'Journal';
const HEADERS = ['Date', 'Entry', 'Created', 'Updated'];
const MAX_CHARS = 786;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Web app entry point. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Micro Journal')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/** Returns every entry, newest first: [{date: 'yyyy-MM-dd', text: '...'}]. */
function getEntries() {
  const byDate = {};
  readRows_(getSheet_()).forEach(function (r) {
    if (r.text) byDate[r.date] = r.text; // later duplicate rows win
  });
  return Object.keys(byDate).sort().reverse().map(function (d) {
    return { date: d, text: byDate[d] };
  });
}

/**
 * Saves the entry for `dateKey` (the user's local date, 'yyyy-MM-dd').
 * One entry per day: updates the existing row if there is one.
 * Returns the full, refreshed entry list.
 */
function saveEntry(dateKey, text) {
  dateKey = String(dateKey || '');
  if (!DATE_RE.test(dateKey)) throw new Error('Invalid date.');

  // The client decides "today" in its own timezone; just guard against nonsense.
  const ms = Date.parse(dateKey + 'T12:00:00Z');
  if (isNaN(ms) || Math.abs(ms - Date.now()) > 2 * 86400000) {
    throw new Error('Only today’s entry can be saved.');
  }

  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) throw new Error('Write something first.');
  if (clean.length > MAX_CHARS) throw new Error('Keep it under ' + MAX_CHARS + ' characters.');
  // Stop the Sheet from treating the entry as a formula.
  const cellText = /^[=+\-@]/.test(clean) ? "'" + clean : clean;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    const now = new Date();
    const existing = readRows_(sheet).filter(function (r) { return r.date === dateKey; });
    if (existing.length) {
      const row = existing[existing.length - 1].row;
      sheet.getRange(row, 2).setValue(cellText);
      sheet.getRange(row, 4).setValue(now);
    } else {
      const row = sheet.getLastRow() + 1;
      sheet.getRange(row, 1).setNumberFormat('@');
      sheet.getRange(row, 1, 1, 4).setValues([[dateKey, cellText, now, now]]);
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  return getEntries();
}

/** Gets the Journal tab, creating and formatting it on first run. */
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('@');
    sheet.getRange('C:D').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange('B:B').setWrap(true);
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 520);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 140);
  }
  return sheet;
}

/** Reads data rows as [{row, date, text}], skipping rows without a usable date. */
function readRows_(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  return sheet.getRange(2, 1, last - 1, 2).getValues()
    .map(function (r, i) {
      return { row: i + 2, date: toDateKey_(r[0], tz), text: String(r[1] || '').trim() };
    })
    .filter(function (r) { return r.date; });
}

/** Accepts real Date cells (hand-typed) or 'yyyy-MM-dd' text. */
function toDateKey_(value, tz) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
  }
  const s = String(value || '').trim();
  return DATE_RE.test(s) ? s : null;
}
