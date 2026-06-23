'use strict';

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { calculateSalary, daysInMonth } = require('./lib/cesu');
const { entryKey } = require('./lib/constants');

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
app.set('trust proxy', 'loopback');
app.use(helmet({ contentSecurityPolicy: false }));

const router = express.Router();

app.use(express.json({ limit: '4kb' }));
app.use(BASE_PATH, router);

router.use(express.static(path.join(__dirname, 'public')));

router.get('/healthz', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

router.post('/api/calculate', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Corps de requête invalide' });
  }

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

  const dim = daysInMonth(y, m);
  if (a > dim) return res.status(400).json({ error: `Les jours d'absence (${a}) dépassent le nombre de jours du mois (${dim})` });

  const now = new Date();
  const currentKey = entryKey(now.getFullYear(), now.getMonth() + 1);
  const requestedKey = entryKey(y, m);
  if (requestedKey < currentKey) return res.status(403).json({ error: 'Impossible de modifier un mois passé.' });

  try {
    const result = await calculateSalary({
      month: m, year: y, salaryNett: s,
      nbAbsentDays: a, transport: t, icsFile: ICS_FILE,
    });

    const history = loadHistory();
    const key = entryKey(y, m);
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
  const { key } = req.params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(key)) {
    return res.status(400).json({ error: 'Format de clé invalide (YYYY-MM)' });
  }

  const now = new Date();
  const currentKey = entryKey(now.getFullYear(), now.getMonth() + 1);
  if (key < currentKey) return res.status(403).json({ error: 'Impossible de supprimer un mois passé.' });

  const history = loadHistory();
  const idx = history.findIndex(e => e.key === key);
  if (idx < 0) return res.status(404).json({ error: 'Entrée introuvable.' });

  history.splice(idx, 1);
  saveHistory(history);
  res.json({ ok: true });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`CESU web running on port ${PORT} at ${BASE_PATH}`);
});
