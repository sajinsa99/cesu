'use strict';

const BASE = document.querySelector('base')?.href.replace(/\/$/, '') || '';
const API = `${location.pathname.replace(/\/[^/]*$/, '')}/api`.replace('//', '/');

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin',
                   'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

// ── Init form defaults ──
const monthSel = document.getElementById('month');
const yearIn = document.getElementById('year');
const now = new Date();

MONTHS_FR.forEach((n, i) => {
  const o = document.createElement('option');
  o.value = i + 1;
  o.textContent = n;
  monthSel.appendChild(o);
});
monthSel.value = now.getMonth() + 1;
yearIn.value = now.getFullYear();
document.getElementById('salaryNett').value = '12.00';

// ── History ──
let history = [];

async function loadHistory() {
  try {
    const r = await fetch(`${API}/history`);
    history = await r.json();
    renderHistory();
  } catch { /* silent */ }
}

function renderHistory() {
  const el = document.getElementById('history-list');
  if (!history.length) {
    el.innerHTML = '<p class="empty">Aucun calcul enregistré.</p>';
    return;
  }
  el.innerHTML = history.map(e => {
    const mn = MONTHS_FR[e.month - 1];
    return `<div class="history-entry" data-key="${e.key}">
      <div class="h-label">${mn} ${e.year}</div>
      <div class="h-total">${fmt(e.totalSalary)} €</div>
      <div class="h-meta">${e.totalHours}h · taux ${fmtN(e.salaryNett)}€/h</div>
      <button class="h-delete" title="Supprimer" data-key="${e.key}">×</button>
    </div>`;
  }).join('');
}

document.getElementById('history-list').addEventListener('click', async e => {
  const btn = e.target.closest('.h-delete');
  if (btn) {
    e.stopPropagation();
    await fetch(`${API}/history/${btn.dataset.key}`, { method: 'DELETE' });
    history = history.filter(h => h.key !== btn.dataset.key);
    renderHistory();
    return;
  }
  const entry = e.target.closest('.history-entry');
  if (entry) {
    const h = history.find(x => x.key === entry.dataset.key);
    if (h) {
      monthSel.value = h.month;
      yearIn.value = h.year;
      document.getElementById('salaryNett').value = h.salaryNett;
      document.getElementById('nbAbsentDays').value = h.breakdown.absentDays;
      document.getElementById('transport').value = h.transportAllowance;
      showResult(h, h.salaryNett);
    }
  }
});

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
        <tr><td>${r.totalHours}h × ${fmtN(salaryNett)} €/h</td><td>${fmt(r.baseSalary)} €</td></tr>
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

function fmt(n) { return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtN(n) { return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// ── Boot ──
loadHistory();
