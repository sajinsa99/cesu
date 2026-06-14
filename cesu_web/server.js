'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const { calculateSalary } = require('./lib/cesu');

const PORT = process.env.PORT || 4000;
const BASE_PATH = process.env.BASE_PATH || '/cesu';
const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const ICS_FILE = path.join(__dirname, 'jours_feries_metropole.ics');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

const app = express(); // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
const router = express.Router();

app.use(express.json());
app.use(BASE_PATH, router);

router.use(express.static(path.join(__dirname, 'public')));

router.post('/api/calculate', async (req, res) => {
  const { month, year, salaryNett, nbAbsentDays, transport } = req.body;

  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const s = parseFloat(salaryNett);
  const a = parseInt(nbAbsentDays, 10) || 0;
  const t = parseFloat(transport) || 0;

  if (!m || m < 1 || m > 12) return res.status(400).json({ error: 'Mois invalide (1-12)' });
  if (!y || y < 1900 || y > 2100) return res.status(400).json({ error: 'Année invalide' });
  if (!s || s <= 0) return res.status(400).json({ error: 'Salaire doit être > 0' });
  if (a < 0) return res.status(400).json({ error: "Jours d'absence négatifs" });
  if (t < 0) return res.status(400).json({ error: 'Transport négatif' });

  try {
    const result = await calculateSalary({
      month: m, year: y, salaryNett: s,
      nbAbsentDays: a, transport: t, icsFile: ICS_FILE,
    });

    const history = loadHistory();
    const key = `${y}-${String(m).padStart(2, '0')}`;
    const idx = history.findIndex(e => e.key === key);
    const entry = { key, ...result, salaryNett: s, savedAt: new Date().toISOString() };
    if (idx >= 0) history[idx] = entry;
    else history.unshift(entry);
    saveHistory(history);

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/api/history', (req, res) => {
  res.json(loadHistory());
});

router.delete('/api/history/:key', (req, res) => {
  const history = loadHistory().filter(e => e.key !== req.params.key);
  saveHistory(history);
  res.json({ ok: true });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`CESU web running on port ${PORT} at ${BASE_PATH}`);
});
