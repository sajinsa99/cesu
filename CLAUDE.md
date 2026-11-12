# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`cesu` computes the monthly CESU salary (French *Chèque Emploi Service Universel* home-employment
pay) with the legal bonuses. There are **two independent implementations** of the same business rules:

- **`cesu.py`** — a self-contained Python 3.6+ CLI. Standard library only, no external deps.
  Prints a human-readable French report (or `--json`) and saves the result to `YYYY_MM.md`.
- **`cesu_web/`** — a Node.js + Express web app that **reimplements the same calculation in
  JavaScript** (`cesu_web/lib/cesu.js`). It does **not** call the Python script. The browser UI is
  vanilla HTML/CSS/JS in `cesu_web/public/`.

> The two implementations must stay in agreement. When you change a calculation rule, change it in
> **both** `cesu.py` and `cesu_web/lib/cesu.js`.

All user-facing strings, docstrings, comments, and commit messages are in **French**. Keep that
convention when editing. The `YYYY_MM.md` files (e.g. `2026_02.md`) are **generated output** of the
Python CLI, not hand-written docs.

## Calculation rules (the contract both implementations share)

| Component | Rule |
|---|---|
| Base hours | 1 hour per calendar day in the month |
| Sunday bonus | +1 hour per Sunday (effectively ×2) |
| Holiday bonus | +1 hour per public holiday **not** falling on a Sunday |
| Thursday bonus | `ceil(number_of_thursdays × 0.25)` hours |
| Absence | −1 hour per absent day |
| 10% premium | base salary (`hours × rate`) × 1.10 |
| Transport | flat monthly allowance added to the total |

**Formula:** `((total_hours × hourly_rate) × 1.10) + transport`

Public holidays come from the French ICS feed
(`etalab/jours-feries-france-data`), downloaded on demand and cached locally with a 30-day TTL.
Both implementations download it themselves if missing.

## Commands

### Python CLI
```bash
python3 cesu.py                       # interactive, current month, default values
python3 cesu.py -q                    # quiet: no prompts, use defaults
python3 cesu.py -m 6 -s 15 -t 80 -n 2 # month, net hourly salary, transport, absent days
python3 cesu.py -j                    # JSON output
python3 cesu.py --help
```
Key options: `-m/--month`, `-y/--year`, `-s/--salary-nett` (default 12.0), `-n/--nb-absent-days`
(default 0), `-t/--transport` (default 60.0), `--ics <path>`, `-j/--json`, `-q/--quiet`.
Exit 0 on success, 1 on error. Result is also written to `YYYY_MM.md`.

### Web app (from `cesu_web/`)
```bash
cd cesu_web && npm install
cd cesu_web && npm start              # node server.js, listens on 127.0.0.1:PORT (default 4000) at BASE_PATH (default /cesu)
```
There is **no test suite** in this repo.

### Linting / checks
```bash
bash checks.sh                        # runs all linters/scanners in the xmk_linters Docker image → checks-report.md
```
`checks.sh` requires Docker (internal SAP image) and runs pylint, eslint, markdownlint, semgrep,
trivy, gitleaks, etc.

## Web architecture (`cesu_web/`)

- **`server.js`** (CommonJS) — binds to loopback only, behind nginx. Uses `helmet` (CSP disabled).
  All routes are mounted under `BASE_PATH` via an Express `Router`. JSON body limit is 4 KB.
- **`lib/cesu.js`** — `calculateSalary(...)`, the JS port of the salary logic; returns the result
  plus a `breakdown` (sundays, holidays, thursdays, bonus hours). `lib/holidays.js` downloads/parses
  the ICS feed (with a parse-once in-memory cache); `lib/constants.js` has `MONTHS_FR`, `entryKey`,
  `daysInMonth`.
- **History** — every successful `/api/calculate` is persisted to `data/history.json` (gitignored),
  keyed by `YYYY-MM` (one entry per month, upserted). The left panel lists past calculations.
- **Past-month guard** — `POST /api/calculate` and `DELETE /api/history/:key` reject any month
  earlier than the current month (403). Past months cannot be created, modified, or deleted.

### API (all under `BASE_PATH`, default `/cesu`)

| Method | URL | Description |
|--------|-----|-------------|
| GET  | `/healthz` | Liveness `{ ok, uptime }` |
| POST | `/api/calculate` | Compute + persist a month (rejects past months) |
| GET  | `/api/history` | Full history list |
| DELETE | `/api/history/:key` | Delete one month by `YYYY-MM` (rejects past months) |

### Deployment
`install.sh` (run as **root**) deploys `cesu_web/` to `/opt/cesu_web`, runs `npm install --production`,
installs the `cesu_web/deploy/cesu.service` systemd unit (runs as `www-data`, port 4000), drops the
`cesu_web/deploy/nginx-cesu.conf` snippet into `/etc/nginx/snippets/cesu_location.conf`, and injects
the `include` into the nginx vhost `/etc/nginx/sites-available/bruno` at `/cesu/`. Existing `data/`
is backed up before overwrite. Configurable via `/opt/cesu_web/.env` (`PORT`, `BASE_PATH`).

## Conventions
- Python targets 3.6+ and uses the **standard library only** — don't add third-party Python deps.
- `cesu_web/` is pinned to Node 20.20.2 / npm 10.8.2 (see `package.json` engines and `.nvmrc`);
  dependencies are only `express` and `helmet`.
- Gitignored in `cesu_web/`: `node_modules/`, `data/`, `.env`, the cached `jours_feries_metropole.ics`.
- The `# nosemgrep:` / `// nosemgrep:` comments suppress known false positives — keep them when
  touching those lines.
