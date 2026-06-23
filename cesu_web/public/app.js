'use strict';

// MONTHS_FR, entryKey, daysInMonth come from constants.js loaded before this script

const API = (document.querySelector('meta[name="base-path"]')?.content || '') + '/api';

const NF = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = n => NF.format(Number(n));

// ── Init form defaults ──
const monthSel = document.getElementById('month');
const yearIn = document.getElementById('year');
const now = new Date();
const currentKey = entryKey(now.getFullYear(), now.getMonth() + 1);

MONTHS_FR.forEach((n, i) => {
  const o = document.createElement('option');
  o.value = i + 1;
  o.textContent = n;
  monthSel.appendChild(o);
});
monthSel.value = now.getMonth() + 1;
yearIn.value = now.getFullYear();
document.getElementById('salaryNett').value = '12.00';

function isPast(key) {
  return key < currentKey;
}

// ── Readonly mode ──
function setReadonly(readonly) {
  document.querySelectorAll('#calc-form input, #calc-form select')
    .forEach(el => { el.disabled = readonly; });
  document.getElementById('submit-btn').disabled = readonly;
  const banner = document.getElementById('readonly-banner');
  if (readonly) banner.classList.remove('hidden');
  else banner.classList.add('hidden');
}

// ── Toast ──
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// ── Confirm dialog ──
function confirmDialog() {
  return new Promise(resolve => {
    const overlay = document.getElementById('confirm-overlay');
    overlay.classList.remove('hidden');
    function finish(result) {
      overlay.classList.add('hidden');
      document.getElementById('confirm-ok').removeEventListener('click', onOk);
      document.getElementById('confirm-cancel').removeEventListener('click', onCancel);
      resolve(result);
    }
    function onOk() { finish(true); }
    function onCancel() { finish(false); }
    document.getElementById('confirm-ok').addEventListener('click', onOk);
    document.getElementById('confirm-cancel').addEventListener('click', onCancel);
  });
}

// ── History ──
let historyEntries = [];

async function loadHistory() {
  try {
    const r = await fetch(`${API}/history`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    historyEntries = await r.json();
    renderHistory();
  } catch (e) {
    const el = document.getElementById('history-list');
    const p = document.createElement('p');
    p.className = 'empty history-error';
    p.textContent = 'Erreur de chargement de l\'historique.';
    el.replaceChildren(p);
  }
}

function renderHistory() {
  const el = document.getElementById('history-list');
  if (!historyEntries.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Aucun calcul enregistré.';
    el.replaceChildren(p);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const e of historyEntries) {
    const past = isPast(e.key);

    const div = document.createElement('div');
    div.className = 'history-entry' + (past ? ' h-past' : '');
    div.dataset.key = e.key;

    const label = document.createElement('div');
    label.className = 'h-label';
    label.textContent = `${MONTHS_FR[e.month - 1]} ${e.year}`;

    const total = document.createElement('div');
    total.className = 'h-total';
    total.textContent = `${fmt(e.totalSalary)} €`;

    const meta = document.createElement('div');
    meta.className = 'h-meta';
    meta.textContent = `${e.totalHours}h · taux ${fmt(e.salaryNett)}€/h`;

    div.appendChild(label);
    div.appendChild(total);
    div.appendChild(meta);

    if (!past) {
      const btn = document.createElement('button');
      btn.className = 'h-delete';
      btn.title = 'Supprimer';
      btn.dataset.key = e.key;
      btn.textContent = '×';
      div.appendChild(btn);
    }

    fragment.appendChild(div);
  }
  el.replaceChildren(fragment);
}

document.getElementById('history-list').addEventListener('click', async e => {
  const btn = e.target.closest('.h-delete');
  if (btn) {
    e.stopPropagation();
    const confirmed = await confirmDialog();
    if (!confirmed) return;
    await fetch(`${API}/history/${btn.dataset.key}`, { method: 'DELETE' });
    historyEntries = historyEntries.filter(h => h.key !== btn.dataset.key);
    renderHistory();
    return;
  }
  const entry = e.target.closest('.history-entry');
  if (entry) {
    const h = historyEntries.find(x => x.key === entry.dataset.key);
    if (h) {
      monthSel.value = h.month;
      yearIn.value = h.year;
      document.getElementById('salaryNett').value = h.salaryNett;
      document.getElementById('nbAbsentDays').value = h.breakdown.absentDays;
      document.getElementById('transport').value = h.transportAllowance;
      setReadonly(isPast(h.key));
      showResult(h, h.salaryNett);
    }
  }
});

// Reset readonly when month/year selectors are changed manually
function checkCurrentMonth() {
  const key = entryKey(yearIn.value, monthSel.value);
  setReadonly(isPast(key));
}
monthSel.addEventListener('change', checkCurrentMonth);
yearIn.addEventListener('change', checkCurrentMonth);
yearIn.addEventListener('input', checkCurrentMonth);

// ── Form submit ──
document.getElementById('calc-form').addEventListener('submit', async ev => {
  ev.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Calcul en cours…';
  hideError();
  hideResult();

  const body = {
    month: monthSel.value,
    year: yearIn.value,
    salaryNett: document.getElementById('salaryNett').value,
    nbAbsentDays: document.getElementById('nbAbsentDays').value,
    transport: document.getElementById('transport').value,
  };

  try {
    const res = await fetch(`${API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showError(data.error || 'Erreur inconnue'); return; }
    showResult(data, parseFloat(body.salaryNett));
    showToast();
    await loadHistory();
  } catch (e) {
    showError('Erreur réseau : ' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Calculer';
  }
});

function showResult(r, salaryNett) {
  const box = document.getElementById('result-box');
  const mn = MONTHS_FR[r.month - 1];
  const bd = r.breakdown;
  box.innerHTML = `
    <h2>Résultat — ${mn} ${r.year}</h2>
    <div class="result-total">${fmt(r.totalSalary)} €</div>

    <table class="result-table">
      <thead><tr><th>Heures</th><th>Valeur</th></tr></thead>
      <tbody>
        <tr><td>Base (1h/jour × ${r.daysInMonth} jours)</td><td>${r.daysInMonth}</td></tr>
        <tr><td>Majoration dimanches (×2)</td><td>+${bd.sundayBonusHours}</td></tr>
        <tr><td>Majoration jours fériés (×2)</td><td>+${bd.holidayBonusHours}</td></tr>
        <tr><td>Majoration jeudis (+25%, arrondi ↑)</td><td>+${bd.thursdayBonusHours}</td></tr>
        <tr><td>Jours d'absence</td><td>${bd.absentDays ? '-' + bd.absentDays : 0}</td></tr>
        <tr class="bold"><td>Total heures</td><td>${r.totalHours}</td></tr>
      </tbody>
    </table>

    <table class="result-table">
      <thead><tr><th>Salaire</th><th>Montant</th></tr></thead>
      <tbody>
        <tr><td>${r.totalHours}h × ${fmt(salaryNett)} €/h</td><td>${fmt(r.baseSalary)} €</td></tr>
        <tr><td>Prime de 10%</td><td>${fmt(r.salaryWithBonus)} €</td></tr>
        <tr><td>Indemnité de transport</td><td>+${fmt(r.transportAllowance)} €</td></tr>
        <tr class="bold"><td>Salaire total</td><td>${fmt(r.totalSalary)} €</td></tr>
      </tbody>
    </table>

    ${bd.holidays.length ? `<p style="margin-top:10px;font-size:12px;color:var(--muted)">Jours fériés du mois : ${bd.holidays.join(', ')}</p>` : ''}
  `;
  box.classList.remove('hidden');
}

function hideResult() { document.getElementById('result-box').classList.add('hidden'); }
function showError(msg) {
  const el = document.getElementById('error-box');
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError() { document.getElementById('error-box').classList.add('hidden'); }

// ── Boot ──
loadHistory();
