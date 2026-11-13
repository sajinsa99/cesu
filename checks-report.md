# Checks Report — cesu — 2026-11-13 16:40:54

## Summary

| Check | Status |
|---|---|
| shellcheck  install.sh | ✅ PASS |
| jsonlint  cesu_web/package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ✅ PASS |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| htmlhint  HTML files | ✅ PASS |
| stylelint  CSS files | ✅ PASS |
| yamllint  YAML files | ✅ PASS |
| pylint  cesu.py | ❌ FAIL |
| bandit  cesu.py | ✅ PASS |
| semgrep  cesu.py + cesu_web JS sources | ✅ PASS |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 10 · FAIL: 1 · SKIP: 2 |

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
    "node": "22.22.1",
    "npm": "9.2.0"
  },
  "license": "MIT"
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ✅ PASS

```
markdownlint-cli2 v0.24.1 (markdownlint v0.42.1)
Finding: ./README.md ./2026_02.md ./2026_03.md ./cesu_web/README.md ./CLAUDE.md ./2026_04.md ./2026_05.md
Linting: 7 files
Summary: 0 issues in 0 files
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## HTML

### `htmlhint  HTML files`

**Status:** ✅ PASS

```

Scanned 1 files, no errors found (13 ms).
```

---

## CSS

### `stylelint  CSS files`

**Status:** ✅ PASS

_no output_

---

## YAML

### `yamllint  YAML files`

**Status:** ✅ PASS

_no output_

---

## Python

### `pylint  cesu.py`

**Status:** ❌ FAIL (exit 28)

```
************* Module cesu
cesu.py:53:0: C0301: Line too long (147/100) (line-too-long)
cesu.py:66:0: C0301: Line too long (101/100) (line-too-long)
cesu.py:146:0: C0301: Line too long (137/100) (line-too-long)
cesu.py:169:0: C0301: Line too long (147/100) (line-too-long)
cesu.py:172:0: C0301: Line too long (128/100) (line-too-long)
cesu.py:190:0: C0301: Line too long (115/100) (line-too-long)
cesu.py:219:0: C0301: Line too long (126/100) (line-too-long)
cesu.py:268:0: C0301: Line too long (124/100) (line-too-long)
cesu.py:291:0: C0301: Line too long (116/100) (line-too-long)
cesu.py:299:0: C0301: Line too long (104/100) (line-too-long)
cesu.py:308:0: C0301: Line too long (112/100) (line-too-long)
cesu.py:323:0: C0301: Line too long (116/100) (line-too-long)
cesu.py:416:0: C0325: Unnecessary parens after 'not' keyword (superfluous-parens)
cesu.py:420:0: C0325: Unnecessary parens after 'not' keyword (superfluous-parens)
cesu.py:65:11: W0718: Catching too general exception Exception (broad-exception-caught)
cesu.py:70:0: R0914: Too many local variables (16/15) (too-many-locals)
cesu.py:119:11: W0718: Catching too general exception Exception (broad-exception-caught)
cesu.py:146:0: R0913: Too many arguments (7/5) (too-many-arguments)
cesu.py:146:0: R0917: Too many positional arguments (7/5) (too-many-positional-arguments)
cesu.py:146:0: R0914: Too many local variables (22/15) (too-many-locals)
cesu.py:320:4: C0103: Variable name "_UNSET" doesn't conform to snake_case naming style (invalid-name)
cesu.py:492:11: W0718: Catching too general exception Exception (broad-exception-caught)
cesu.py:318:0: R0912: Too many branches (18/12) (too-many-branches)
cesu.py:318:0: R0915: Too many statements (76/50) (too-many-statements)

-----------------------------------
Your code has been rated at 8.87/10
```

---

### `bandit  cesu.py`

**Status:** ✅ PASS

```
[main]	INFO	profile include tests: None
[main]	INFO	profile exclude tests: None
[main]	INFO	cli include tests: None
[main]	INFO	cli exclude tests: None
[main]	INFO	running on Python 3.14.4
[manager]	ERROR	Exception occurred when executing tests against ./cesu.py.
[manager]	ERROR	Run "bandit --debug ./cesu.py" to see the full traceback.
Run started:2026-11-13 15:40:40.551980

Test results:
	No issues identified.

Code scanned:
	Total lines of code: 389
	Total lines skipped (#nosec): 0
	Total potential issues skipped due to specifically being disabled (e.g., #nosec BXXX): 0

Run metrics:
	Total issues (by severity):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
	Total issues (by confidence):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
Files skipped (1):
	./cesu.py (exception while scanning file)
```

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

If Semgrep missed a finding, please send us feedback to let us know!
See https://semgrep.dev/docs/reporting-false-negatives/
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-11-13T15:40:46Z	INFO	[vulndb] Need to update DB
2026-11-13T15:40:46Z	INFO	[vulndb] Downloading vulnerability DB...
2026-11-13T15:40:46Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
21.94 MiB / 133.77 MiB [--------->__________________________________________________] 16.40% ? p/s ?55.29 MiB / 133.77 MiB [------------------------>___________________________________] 41.33% ? p/s ?87.36 MiB / 133.77 MiB [--------------------------------------->____________________] 65.31% ? p/s ?120.43 MiB / 133.77 MiB [---------------------------------------->____] 90.02% 164.07 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 164.07 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 164.07 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 154.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 154.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 154.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 144.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 144.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 144.92 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 135.57 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 135.57 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 135.57 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 126.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 126.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 126.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 118.65 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 118.65 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 118.65 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 110.99 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 110.99 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 110.99 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 103.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 103.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [------------------------------------------->] 100.00% 103.83 MiB p/s ETA 0s133.77 MiB / 133.77 MiB [-----------------------------------------------] 100.00% 25.60 MiB p/s 5.4s2026-11-13T15:40:52Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-11-13T15:40:52Z	INFO	[vuln] Vulnerability scanning is enabled
2026-11-13T15:40:52Z	INFO	[npm] Run "npm install" to collect the license information of packages	dir="cesu_web/node_modules"
2026-11-13T15:40:52Z	INFO	Number of language-specific files	num=1
2026-11-13T15:40:52Z	INFO	[npm] Detecting vulnerabilities...

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

[90m3:40PM[0m [32mINF[0m [1m47 commits scanned.[0m
[90m3:40PM[0m [32mINF[0m [1mscanned ~216637 bytes (216.64 KB) in 252ms[0m
[90m3:40PM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

