# Checks Report — cesu — 2026-11-12 16:00:32

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
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

### `shellcheck  install.sh`

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
    "express": "^5.3.0",
    "helmet": "^8.3.0"
  },
  "engines": {
    "node": "20.20.2",
    "npm": "10.8.2"
  },
  "license": "MIT"
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ✅ PASS

```
markdownlint-cli2 v0.24.0 (markdownlint v0.42.0)
Finding: ./README.md ./2026_02.md ./2026_03.md ./cesu_web/README.md ./CLAUDE.md ./2026_04.md ./2026_05.md
Linting: 7 files
Summary: 0 issues in 0 files
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
  Scanning 5 files tracked by git with 1074 Code rules:
                                                                                                                        
  Language      Rules   Files          Origin      Rules                                                                
 ─────────────────────────────        ───────────────────                                                               
  <multilang>      47       5          Community    1074                                                                
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
2026-11-12T15:00:23Z	INFO	[vulndb] Need to update DB
2026-11-12T15:00:23Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-12T15:00:23Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
28.43 MiB / 133.50 MiB [------------>_______________________________________________] 21.30% ? p/s ?68.71 MiB / 133.50 MiB [------------------------------>_____________________________] 51.46% ? p/s ?107.39 MiB / 133.50 MiB [----------------------------------------------->___________] 80.44% ? p/s ?133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 174.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 174.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 174.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.67 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.67 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.67 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 153.11 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 153.11 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 153.11 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.23 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.23 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.23 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.99 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.99 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.99 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.34 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.34 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.34 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.26 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.26 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.26 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.69 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.69 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.69 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 102.62 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-----------------------------------------------] 100.00% 24.72 MiB p/s 5.6s2026-11-12T15:00:29Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-12T15:00:29Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-12T15:00:29Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="cesu_web/node_modules"
2026-11-12T15:00:29Z	INFO	Number of language-specific files	num=1
2026-11-12T15:00:29Z	INFO	[npm] Detecting vulnerabilities...

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

[90m3:00PM[0m [32mINF[0m [1m40 commits scanned.[0m
[90m3:00PM[0m [32mINF[0m [1mscanned ~206686 bytes (206.69 KB) in 330ms[0m
[90m3:00PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

