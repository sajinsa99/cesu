'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const ICS_URL = 'https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_REDIRECTS = 3;

// Parse-once cache: { mtime, map: Map<"YYYY-MM", number[]> }
let _cache = null;

function _needsRefresh(icsFile) {
  try {
    const { mtimeMs } = fs.statSync(icsFile);
    return (Date.now() - mtimeMs) > TTL_MS;
  } catch {
    return true;
  }
}

function _downloadIcs(url, destination, redirectsLeft) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft < 0) { reject(new Error('Too many redirects')); return; }
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        _downloadIcs(res.headers.location, destination, redirectsLeft - 1)
          .then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const tmp = destination + '.tmp';
      const file = fs.createWriteStream(tmp);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          try { fs.renameSync(tmp, destination); resolve(); }
          catch (e) { try { fs.unlinkSync(tmp); } catch {} reject(e); }
        });
      });
      file.on('error', e => {
        try { fs.unlinkSync(tmp); } catch {}
        reject(e);
      });
    }).on('error', e => {
      reject(e);
    });
  });
}

function _parseIcs(icsFile) {
  const { mtimeMs } = fs.statSync(icsFile);
  if (_cache && _cache.mtime === mtimeMs) return _cache.map;

  const content = fs.readFileSync(icsFile, 'utf8');
  const pattern = /DTSTART[;:].*?(\d{8})/g;
  const map = new Map();
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const s = m[1];
    const mapKey = `${s.slice(0, 4)}-${s.slice(4, 6)}`;
    if (!map.has(mapKey)) map.set(mapKey, []);
    map.get(mapKey).push(parseInt(s.slice(6, 8), 10));
  }
  for (const days of map.values()) days.sort((a, b) => a - b);
  _cache = { mtime: mtimeMs, map };
  return map;
}

async function getHolidays(icsFile, year, month) {
  const stale = _needsRefresh(icsFile);
  if (stale) {
    try {
      await _downloadIcs(ICS_URL, icsFile, MAX_REDIRECTS);
      _cache = null; // invalidate parse cache after refresh
    } catch (e) {
      if (!fs.existsSync(icsFile)) {
        console.warn(`Could not download ICS and no local copy: ${e.message}`);
        return [];
      }
      console.warn(`ICS refresh failed, using stale file: ${e.message}`);
    }
  }

  try {
    const map = _parseIcs(icsFile);
    const key = `${year}-${String(month).padStart(2, '0')}`;
    return map.get(key) || [];
  } catch (e) {
    console.warn(`Could not parse ICS: ${e.message}`);
    return [];
  }
}

module.exports = { getHolidays };
