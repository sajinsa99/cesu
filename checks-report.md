# Checks Report — cesu — 2026-06-14 11:34:29

## Summary

| Check | Status |
|---|---|
| shellcheck  cesu_web/install_cesu.sh | ✅ PASS |
| jsonlint  cesu_web/package.json | ✅ PASS |
| markdownlint-cli2  Markdown files | ❌ FAIL |
| eslint  (no eslint.config.js found — create one to enable) | ⏭ SKIP |
| yamllint  (no *.yaml / *.yml files found) | ⏭ SKIP |
| semgrep  cesu.py + cesu_web JS sources | ❌ FAIL |
| trivy  HIGH/CRITICAL CVEs | ✅ PASS |
| gitleaks  secrets in repo | ✅ PASS |
| detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline) | ⏭ SKIP |
| **Total** | PASS: 4 · FAIL: 2 · SKIP: 3 |

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
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18"
  },
  "license": "MIT"
}
```

---

## Markdown

### `markdownlint-cli2  Markdown files`

**Status:** ❌ FAIL (exit 1)

```
markdownlint-cli2 v0.17.2 (markdownlint v0.37.4)
Finding: ./README.md ./2026_02.md ./2026_03.md ./cesu_web/README.md ./2026_04.md ./2026_05.md
Linting: 6 file(s)
Summary: 31 error(s)
cesu_web/README.md:3:81 MD013/line-length Line length [Expected: 80; Actual: 154]
cesu_web/README.md:16:81 MD013/line-length Line length [Expected: 80; Actual: 147]
cesu_web/README.md:74 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
cesu_web/README.md:80:81 MD013/line-length Line length [Expected: 80; Actual: 154]
cesu_web/README.md:133:81 MD013/line-length Line length [Expected: 80; Actual: 181]
cesu_web/README.md:137:81 MD013/line-length Line length [Expected: 80; Actual: 245]
cesu_web/README.md:143 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
cesu_web/README.md:182:81 MD013/line-length Line length [Expected: 80; Actual: 340]
README.md:3:81 MD013/line-length Line length [Expected: 80; Actual: 133]
README.md:29:81 MD013/line-length Line length [Expected: 80; Actual: 126]
README.md:46:81 MD013/line-length Line length [Expected: 80; Actual: 86]
README.md:47:81 MD013/line-length Line length [Expected: 80; Actual: 103]
README.md:48:81 MD013/line-length Line length [Expected: 80; Actual: 84]
README.md:50:81 MD013/line-length Line length [Expected: 80; Actual: 120]
README.md:51:81 MD013/line-length Line length [Expected: 80; Actual: 104]
README.md:52:81 MD013/line-length Line length [Expected: 80; Actual: 86]
README.md:54:81 MD013/line-length Line length [Expected: 80; Actual: 97]
README.md:103 MD001/heading-increment Heading levels should only increment by one level at a time [Expected: h3; Actual: h4]
README.md:112:81 MD013/line-length Line length [Expected: 80; Actual: 82]
README.md:114:81 MD013/line-length Line length [Expected: 80; Actual: 88]
README.md:151 MD031/blanks-around-fences Fenced code blocks should be surrounded by blank lines [Context: "```"]
README.md:151 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
README.md:176 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
README.md:184:81 MD013/line-length Line length [Expected: 80; Actual: 94]
README.md:190:81 MD013/line-length Line length [Expected: 80; Actual: 100]
README.md:192 MD040/fenced-code-language Fenced code blocks should have a language specified [Context: "```"]
README.md:239:81 MD013/line-length Line length [Expected: 80; Actual: 97]
README.md:259:81 MD013/line-length Line length [Expected: 80; Actual: 89]
README.md:263:1 MD033/no-inline-html Inline HTML [Element: p]
README.md:264:3 MD033/no-inline-html Inline HTML [Element: sub]
README.md:265:4 MD047/single-trailing-newline Files should end with a single newline character
```

---

## JavaScript

### `eslint  (no eslint.config.js found — create one to enable)`

**Status:** ⏭ SKIP

---

## YAML

### `yamllint  (no *.yaml / *.yml files found)`

**Status:** ⏭ SKIP

---

## Static Analysis

### `semgrep  cesu.py + cesu_web JS sources`

**Status:** ❌ FAIL (exit 1)

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
 • Findings: 2 (2 blocking)
 • Rules run: 442
 • Targets scanned: 5
 • Parsed lines: ~100.0%
 • No ignore information available
Ran 442 rules on 5 files: 2 findings.
                   
                   
┌─────────────────┐
│ 2 Code Findings │
└─────────────────┘
           
    cesu.py
    ❯❱ python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
          ❰❰ Blocking ❱❱
          Detected a dynamic value being used with urllib. urllib supports 'file://' schemes, so a dynamic    
          value controlled by a malicious actor may allow them to read arbitrary files. Audit uses of urllib  
          calls to ensure user data cannot control the URLs, or consider using the 'requests' library instead.
          Details: https://sg.run/dKZZ                                                                        
                                                                                                              
           51┆ with urlopen(url, timeout=30) as response:
                      
    cesu_web/server.js
     ❱ javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
          ❰❰ Blocking ❱❱
          A CSRF middleware was not detected in your express application. Ensure you are either using one such
          as `csurf` or `csrf` (see rule references) and/or you are properly doing CSRF validation in your    
          routes with a token or cookies.                                                                     
          Details: https://sg.run/BxzR                                                                        
                                                                                                              
           29┆ const app = express();
```

---

## Dependency CVEs

### `trivy  HIGH/CRITICAL CVEs`

**Status:** ✅ PASS

```
2026-06-14T09:34:23Z	INFO	[vulndb] Need to update DB
2026-06-14T09:34:23Z	INFO	[vulndb] Downloading vulnerability DB...
2026-06-14T09:34:23Z	INFO	[vulndb] Downloading artifact...	repo="mirror.gcr.io/aquasec/trivy-db:2"
22.45 MiB / 96.06 MiB [-------------->______________________________________________] 23.37% ? p/s ?51.14 MiB / 96.06 MiB [-------------------------------->____________________________] 53.24% ? p/s ?83.39 MiB / 96.06 MiB [---------------------------------------------------->________] 86.81% ? p/s ?96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 122.49 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 122.49 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 122.49 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 114.59 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 114.59 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 114.59 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 107.20 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 107.20 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 107.20 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 100.28 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 100.28 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [--------------------------------------------->] 100.00% 100.28 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 93.81 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 93.81 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 93.81 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 87.76 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 87.76 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [---------------------------------------------->] 100.00% 87.76 MiB p/s ETA 0s96.06 MiB / 96.06 MiB [-------------------------------------------------] 100.00% 23.89 MiB p/s 4.2s2026-06-14T09:34:27Z	INFO	[vulndb] Artifact successfully downloaded	repo="mirror.gcr.io/aquasec/trivy-db:2"
2026-06-14T09:34:27Z	INFO	[vuln] Vulnerability scanning is enabled
2026-06-14T09:34:27Z	INFO	Number of language-specific files	num=0
2026-06-14T09:34:27Z	WARN	[report] Supported files for scanner(s) not found.	scanners=[vuln]

Report Summary

┌────────┬──────┬─────────────────┐
│ Target │ Type │ Vulnerabilities │
├────────┼──────┼─────────────────┤
│   -    │  -   │        -        │
└────────┴──────┴─────────────────┘
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

[90m9:34AM[0m [32mINF[0m [1m17 commits scanned.[0m
[90m9:34AM[0m [32mINF[0m [1mscanned ~100963 bytes (100.96 KB) in 251ms[0m
[90m9:34AM[0m [32mINF[0m [1mno leaks found[0m
```

---

### `detect-secrets  (run: detect-secrets scan > .secrets.baseline  to create baseline)`

**Status:** ⏭ SKIP

---

