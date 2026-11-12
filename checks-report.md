# Checks Report — cesu — 2026-11-12 15:48:07

## Summary

| Check | Status |
|---|---|
| shellcheck  cesu_web/install_cesu.sh | ❌ FAIL |
| jsonlint  cesu_web/package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ❌ FAIL |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  YAML files | ✅ PASS |
| semgrep  cesu.py + cesu_web JS sources | ✅ PASS |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 5 · FAIL: 2 · SKIP: 2 |

---

## Shell

### `shellcheck  cesu_web/install_cesu.sh`

**Status:** ❌ FAIL (exit 2)

```
cesu_web/install_cesu.sh: cesu_web/install_cesu.sh: openBinaryFile: does not exist (No such file or directory)
```

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

**Status:** ❌ FAIL (exit 1)

```
markdownlint-cli2 v0.24.0 (markdownlint v0.42.0)
Finding: ./README.md ./2026_02.md ./2026_03.md ./cesu_web/README.md ./CLAUDE.md ./2026_04.md ./2026_05.md
Linting: 7 files
Attempted: 126 fixes in 7 files
Summary: 4 issues in 1 file
README.md:230:7 error MD060/table-column-style Table column style [Table pipe does not align with header for style "aligned"]
README.md:230:23 error MD060/table-column-style Table column style [Table pipe does not align with header for style "aligned"]
README.md:231:7 error MD060/table-column-style Table column style [Table pipe does not align with header for style "aligned"]
README.md:231:74 error MD060/table-column-style Table column style [Table pipe does not align with header for style "aligned"]
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
2026-11-12T14:47:58Z	INFO	[vulndb] Need to update DB
2026-11-12T14:47:58Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-12T14:47:58Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
21.40 MiB / 133.50 MiB [--------->__________________________________________________] 16.03% ? p/s ?53.93 MiB / 133.50 MiB [------------------------>___________________________________] 40.40% ? p/s ?88.42 MiB / 133.50 MiB [--------------------------------------->____________________] 66.23% ? p/s ?125.73 MiB / 133.50 MiB [------------------------------------------>__] 94.18% 173.88 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 173.88 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 173.88 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.50 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.50 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 163.50 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 152.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 152.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 152.95 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 143.08 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.85 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.85 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 133.85 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.21 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.21 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 125.21 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.14 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.14 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 117.14 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.58 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.58 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 109.58 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [------------------------------------------->] 100.00% 102.51 MiB p/s ETA 0s133.50 MiB / 133.50 MiB [-----------------------------------------------] 100.00% 24.71 MiB p/s 5.6s2026-11-12T14:48:04Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-12T14:48:04Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-12T14:48:04Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="cesu_web/node_modules"
2026-11-12T14:48:04Z	INFO	Number of language-specific files	num=1
2026-11-12T14:48:04Z	INFO	[npm] Detecting vulnerabilities...

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

[90m2:48PM[0m [32mINF[0m [1m38 commits scanned.[0m
[90m2:48PM[0m [32mINF[0m [1mscanned ~200639 bytes (200.64 KB) in 304ms[0m
[90m2:48PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

