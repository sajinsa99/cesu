# CESU Salary Calculator

> Automated calculation of monthly CESU (Chèque Emploi Service Universel) salary with French labor law compliant bonuses.

[![Jenkins](https://img.shields.io/badge/Jenkins-Pipeline-blue?logo=jenkins)](https://www.jenkins.io/)
[![Python](https://img.shields.io/badge/Python-3.6%2B-blue?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![France](https://img.shields.io/badge/Region-France-blue)](https://www.service-public.fr/particuliers/vosdroits/F2107)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
  - [Jenkins Pipeline](#jenkins-pipeline)
  - [Python Script](#python-script)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Jenkins Pipeline Usage](#jenkins-pipeline-usage)
  - [Python Script Usage](#python-script-usage)
- [Configuration](#configuration)
- [Calculation Methodology](#calculation-methodology)
- [Example Output](#example-output)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## Overview

This project provides two ways to automate the calculation of monthly salaries for CESU-based employment contracts in France:

1. **Jenkins Pipeline** - For automated CI/CD integration
2. **Python Script** - For standalone command-line usage

Both implementations account for:

- Variable monthly durations
- Sunday premium rates
- French public holiday bonuses
- Thursday scheduling considerations
- Absent days deduction
- Transport allowances

---

## Features

| Feature | Description |
|---------|-------------|
| **Dynamic Calendar** | Automatically determines days in selected month |
| **Holiday Integration** | Fetches official French public holidays from government API |
| **Bonus Calculation** | Applies legally compliant multipliers for special days |
| **Absent Days Support** | Deducts absent days from total hours |
| **Auto-download** | Python script automatically downloads holiday data if missing |
| **No External Dependencies** | Python version uses only standard library |

---

## Quick Start

### Jenkins Pipeline

```bash
# Add to Jenkins, configure pipeline from SCM, and run
# Select month and adjust parameters as needed
```

### Python Script

```bash
# Run with defaults (current month)
python3 cesu.py

# Calculate for specific month with custom values
python3 cesu.py --m 6 --sn 15 --t 80 --nb-a-d 2

# View help
python3 cesu.py --help
```

---

## Prerequisites

### Jenkins Pipeline
- Jenkins 2.x or higher
- Groovy sandbox enabled
- Access to Git repository

### Python Script
- Python 3.6 or higher
- No additional packages required (uses standard library only)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/cesu-calculator.git
cd cesu-calculator
```

### Jenkins Pipeline Setup

1. **Create a new Pipeline job** in Jenkins
2. **Configure Pipeline source**:
   - Select "Pipeline script from SCM"
   - Choose your SCM (Git)
   - Point to this repository
3. **Save and run** the pipeline

### Python Script Setup

```bash
# Make script executable (Linux/macOS)
chmod +x cesu.py

# Or run directly
python3 cesu.py
```

---

## Usage

### Jenkins Pipeline Usage

1. Navigate to your Jenkins job
2. Click "Build with Parameters"
3. Configure parameters:
   - **SALARY_NETT**: Hourly rate (default: 12€)
   - **TRANSPORT**: Monthly transport allowance (default: 60€)
   - **NB_ABSENT_DAYS**: Number of absent days (default: 0)
   - **MONTH**: Select 0 for current month or 1-12 for specific month
4. Click "Build"

### Python Script Usage

#### Command-Line Options

| Option | Long Form | Default | Description |
|:-------|:----------|:-------:|:------------|
| `--m` | `--month` | Current month | Target month (1-12) |
| `--sn` | `--salary-nett` | `12.0` | Net hourly salary in euros |
| `--nb-a-d` | `--nb-absent-days` | `0` | Number of absent days |
| `--t` | `--transport` | `60.0` | Monthly transport allowance in euros |
| `--ics` | | `jours_feries_metropole.ics` | Path to ICS holidays file |

#### Examples

```bash
# Calculate for current month with all defaults
python3 cesu.py

# Calculate for March
python3 cesu.py --m 3

# Calculate with custom salary and transport
python3 cesu.py --sn 15 --t 80

# Calculate for June with 2 absent days
python3 cesu.py --m 6 --nb-a-d 2

# Full custom calculation
python3 cesu.py --m 12 --sn 14.50 --t 75 --nb-a-d 1

# Display help
python3 cesu.py --help
```

---

## Configuration

### Pipeline Parameters

| Parameter | Type | Default | Description |
|:----------|:-----|:-------:|:------------|
| `SALARY_NETT` | `string` | `12` | Hourly net rate in euros (€/h) |
| `TRANSPORT` | `string` | `60` | Monthly transport allowance in euros (€) |
| `NB_ABSENT_DAYS` | `string` | `0` | Number of absent days to deduct |
| `MONTH` | `choice` | `0` | Month (0=Current, 1-12 for specific) |

### Holiday Data

The ICS file is automatically downloaded from:
```
https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics
```

- Python script auto-downloads if missing
- Jenkins pipeline uses local file or embedded fallback data
- Data maintained by [Etalab](https://www.etalab.gouv.fr/)

---

## Calculation Methodology

### Hours Computation

The total billable hours are computed using the following rules:

| Day Type | Multiplier | Description |
|:---------|:----------:|:------------|
| Regular Day | ×1 | Base rate: 1 hour per calendar day |
| Sunday | ×2 | Double rate applied (+1 bonus hour) |
| Public Holiday | ×2 | Double rate applied (+1 bonus hour) |
| Thursday | +25% | Additional hours rounded up (ceil) |
| Absent Day | -1 | Deducted from total |

### Salary Formula

```
BASE_HOURS = Days_in_Month
BONUS_HOURS = Sundays + Holidays + ceil(Thursdays × 0.25)
TOTAL_HOURS = BASE_HOURS + BONUS_HOURS - Absent_Days

TOTAL_SALARY = ((TOTAL_HOURS × SALARY_NETT) × 1.10) + TRANSPORT
```

> **Note**: The 10% bonus is applied as per standard CESU employment terms.

---

## Example Output

**Input**: Month 6 (June 2026) with 30 days, 4 Sundays, 5 Thursdays, 1 public holiday, 0 absent days

**Python Script:**
```
$ python3 cesu.py --m 6

=== SALARY CALCULATION FOR 6/2026 ===
Days in month: 30
ICS file 'jours_feries_metropole.ics' not found locally.
Downloading holidays data from https://etalab.github.io/jours-feries-france-data/...
Successfully downloaded to jours_feries_metropole.ics
Public holidays in month 6/2026: [8]
Sundays: [7, 14, 21, 28] (count: 4)
Thursdays: [4, 11, 18, 25] (count: 4)

=== HOURS BREAKDOWN ===
Base hours (1 per day): 30
Sunday bonus (+1 per Sunday): +4
Holiday bonus (+1 per holiday): +1
Thursday bonus (25% per Thursday): +1
Absent days: -0
TOTAL HOURS: 36.0

=== SALARY BREAKDOWN ===
Base salary (36.0 hours × 12.0€): 432.00€
With 10% bonus: 475.20€
Transport allowance: +60.00€

==========================================
TOTAL SALARY: 535.20€
==========================================
```

**Jenkins Pipeline:**
```
=== SALARY CALCULATION FOR 6/2026 ===
Days in month: 30
Loaded ICS from workspace: 15324 bytes
Public holidays in month 6/2026: [8]
Sundays: [7, 14, 21, 28] (count: 4)
Thursdays: [4, 11, 18, 25] (count: 4)

=== HOURS BREAKDOWN ===
Base hours (1 per day): 30
Sunday bonus (+1 per Sunday): +4
Holiday bonus (+1 per holiday): +1
Thursday bonus (25% per Thursday): +1.0
Absent days: -0
TOTAL HOURS: 36.0

=== SALARY BREAKDOWN ===
Base salary (36.0 hours x 12€): 432.0€
With 10% bonus: 475.2€
Transport allowance: +60€

==========================================
TOTAL SALARY: 535.20€
==========================================
```

---

## API Reference

### Environment Variables (Jenkins Output)

After pipeline execution, the following environment variables are available for downstream jobs:

| Variable | Type | Description |
|:---------|:-----|:------------|
| `TOTAL_HOURS` | `string` | Computed total hours |
| `TOTAL_SALARY` | `string` | Final salary amount (formatted) |

### Python Script Exit Codes

| Code | Description |
|:----:|:------------|
| `0` | Successful calculation |
| `1` | Error occurred (invalid parameters, file errors, etc.) |

---

## Files

| File | Description |
|:-----|:------------|
| `Jenkinsfile` | Jenkins pipeline definition |
| `cesu.py` | Standalone Python script |
| `jours_feries_metropole.ics` | French public holidays (ICS format, auto-downloaded) |
| `README.md` | This documentation |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <sub>Built with Jenkins & Python</sub>
</p>