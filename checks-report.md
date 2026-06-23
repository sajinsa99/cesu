# Checks Report — cesu — 2026-06-23 14:41:03

## Summary

| Check | Status |
|---|---|
| shellcheck  cesu_web/install_cesu.sh | ✅ PASS |
| jsonlint  cesu_web/package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ✅ PASS |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  YAML files | ✅ PASS |
| semgrep  cesu.py + cesu_web JS sources | ✅ PASS |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 7 · FAIL: 0 · SKIP: 2 |

---

## Shell

### `shellcheck  cesu_web/install_cesu.sh`

**Status:** ✅ PASS

_no output_

---

## JSON

### `jsonlint  cesu_web/package.json`

**Status:** ✅ PASS

```
{
  "name": "cesu-web",
  "version": "1.0.0",
  "description": "Calculateur de salaire CESU - interface web",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^8.0.0"
  },
  "engines": {
    "node": ">=20"
  },
  "license": "MIT"
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ✅ PASS

```
markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: ./README.md ./2026_02.md ./2026_03.md ./cesu_web/README.md ./2026_04.md ./2026_05.md
Linting: 6 file(s)
Summary: 0 error(s)
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## YAML

### `yamllint  YAML files`

**Status:** ✅ PASS

_no output_

---

## Static Analysis

### `semgrep  cesu.py + cesu_web JS sources`

**Status:** ✅ PASS

```
               
               
┌─────────────┐
│ Scan Status │
└─────────────┘
  Scanning 5 files tracked by git with 1059 Code rules:
                                                                                                                        
  Language      Rules   Files          Origin      Rules                                                                
 ─────────────────────────────        ───────────────────                                                               
  <multilang>      47       5          Community    1059                                                                
  js              153       4                                                                                           
  python          243       1                                                                                           
                                                                                                                        
                
                
┌──────────────┐
│ Scan Summary │
└──────────────┘
✅ Scan completed successfully.
 • Findings: 0 (0 blocking)
 • Rules run: 442
 • Targets scanned: 5
 • Parsed lines: ~100.0%
 • No ignore information available
Ran 442 rules on 5 files: 0 findings.
(need more rules? `semgrep login` for additional free Semgrep Registry rules)


A new version of Semgrep is available. See https://semgrep.dev/docs/upgrading
If Semgrep missed a finding, please send us feedback to let us know!
See https://semgrep.dev/docs/reporting-false-negatives/
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-06-23T12:40:57Z	INFO	[vulndb] Need to update DB
2026-06-23T12:40:57Z	INFO	[vulndb] Downloading vulnerability DB...
2026-06-23T12:40:57Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
26.73 MiB / 96.98 MiB [---------------->____________________________________________] 27.57% ? p/s ?69.76 MiB / 96.98 MiB [------------------------------------------->_________________] 71.94% ? p/s ?96.98 MiB / 96.98 MiB [----------------------------------------------------------->] 100.00% ? p/s ?96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 117.05 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 117.05 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 117.05 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 109.50 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 109.50 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 109.50 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 102.43 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 102.43 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [--------------------------------------------->] 100.00% 102.43 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 95.83 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 95.83 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 95.83 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 89.64 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 89.64 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [---------------------------------------------->] 100.00% 89.64 MiB p/s ETA 0s96.98 MiB / 96.98 MiB [-------------------------------------------------] 100.00% 27.33 MiB p/s 3.7s2026-06-23T12:41:01Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-06-23T12:41:01Z	INFO	[vuln] Vulnerability scanning is enabled
2026-06-23T12:41:01Z	INFO	[npm] To collect the license information of packages, "npm install" needs to be performed beforehand	dir="cesu_web/node_modules"
2026-06-23T12:41:01Z	INFO	Number of language-specific files	num=1
2026-06-23T12:41:01Z	INFO	[npm] Detecting vulnerabilities...

Report Summary

┌────────────────────────────┬──────┬─────────────────┐
│           Target           │ Type │ Vulnerabilities │
├────────────────────────────┼──────┼─────────────────┤
│ cesu_web/package-lock.json │ npm  │        0        │
└────────────────────────────┴──────┴─────────────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)
```

---

## Secrets

### `gitleaks  secrets in repo`

**Status:** ✅ PASS

```

    ○
    │╲
    │ ○
    ○ ░
    ░    gitleaks

[90m12:41PM[0m [32mINF[0m [1m29 commits scanned.[0m
[90m12:41PM[0m [32mINF[0m [1mscanned ~171085 bytes (171.09 KB) in 240ms[0m
[90m12:41PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

