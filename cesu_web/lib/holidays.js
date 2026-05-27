'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const ICS_URL = 'https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics';

function downloadIcs(destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(ICS_URL, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function getHolidays(icsFile, year, month) {
  if (!fs.existsSync(icsFile)) {
    try {
      await downloadIcs(icsFile);
    } catch (e) {
      console.warn(`Could not download ICS: ${e.message}`);
      return [];
    }
  }

  const content = fs.readFileSync(icsFile, 'utf8');
  const pattern = /DTSTART[;:].*?(\d{8})/g;
  const holidays = [];
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const s = m[1];
    const y = parseInt(s.slice(0, 4), 10);
    const mo = parseInt(s.slice(4, 6), 10);
    const d = parseInt(s.slice(6, 8), 10);
    if (y === year && mo === month) holidays.push(d);
  }
  return holidays.sort((a, b) => a - b);
}

module.exports = { getHolidays };
