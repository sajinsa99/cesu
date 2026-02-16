#!/usr/bin/env python3
"""
CESU Salary Calculator

Automated calculation of monthly CESU (Chèque Emploi Service Universel) salary
with French labor law compliant bonuses.

This script computes the total salary based on:
- Base hours (1 hour per day)
- Sunday premium rates (x2)
- French public holiday bonuses (x2)
- Thursday scheduling considerations (+25%, rounded up)
- Absent days deduction
- 10% bonus
- Transport allowance
"""

import argparse
import calendar
import re
import sys
from datetime import datetime
from math import ceil
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError


def download_ics_file(url, destination):
    """
    Download ICS file from URL.

    Args:
        url (str): URL to download from
        destination (str): Local file path to save to

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        print(f"Downloading holidays data from {url}...")
        with urlopen(url, timeout=30) as response:
            content = response.read().decode('utf-8')

        with open(destination, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Successfully downloaded to {destination}")
        return True

    except URLError as e:
        print(f"Warning: Could not download ICS file: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Warning: Error downloading ICS file: {e}", file=sys.stderr)
        return False


def parse_ics_holidays(ics_file, year, month):
    """
    Parse ICS file to extract French public holidays for a specific month.
    If file doesn't exist locally, attempts to download it.

    Args:
        ics_file (str): Path to the ICS file
        year (int): Target year
        month (int): Target month (1-12)

    Returns:
        list: List of day numbers (int) for holidays in the specified month
    """
    holidays = []
    ics_url = 'https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics'

    # If file doesn't exist, try to download it
    if not Path(ics_file).exists():
        print(f"ICS file '{ics_file}' not found locally.")
        if not download_ics_file(ics_url, ics_file):
            print("Continuing without holidays data.", file=sys.stderr)
            return []

    try:
        with open(ics_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match DTSTART lines with 8-digit date pattern (YYYYMMDD)
        # Format can be: DTSTART:20260501 or DTSTART;VALUE=DATE:20260501
        pattern = r'DTSTART[;:].*?(\d{8})'
        matches = re.findall(pattern, content)

        for date_str in matches:
            if len(date_str) >= 8:
                h_year = int(date_str[0:4])
                h_month = int(date_str[4:6])
                h_day = int(date_str[6:8])

                if h_year == year and h_month == month:
                    holidays.append(h_day)

        return sorted(holidays)

    except FileNotFoundError:
        print(f"Warning: ICS file '{ics_file}' not found. Continuing without holidays.", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Warning: Could not parse ICS file: {e}", file=sys.stderr)
        return []


def get_weekday_occurrences(year, month, weekday):
    """
    Get all occurrences of a specific weekday in a month.

    Args:
        year (int): Target year
        month (int): Target month (1-12)
        weekday (int): Weekday (0=Monday, 6=Sunday)

    Returns:
        list: List of day numbers for the specified weekday
    """
    days = []
    cal = calendar.monthcalendar(year, month)

    for week in cal:
        if week[weekday] != 0:
            days.append(week[weekday])

    return days


def calculate_salary(month, salary_nett, nb_absent_days, transport, ics_file='jours_feries_metropole.ics'):
    """
    Calculate monthly CESU salary with all bonuses.

    Args:
        month (int): Month (1-12)
        salary_nett (float): Net hourly salary
        nb_absent_days (int): Number of absent days
        transport (float): Transport allowance
        ics_file (str): Path to ICS holidays file

    Returns:
        dict: Calculation results with breakdown
    """
    current_year = datetime.now().year

    # Get number of days in the month
    days_in_month = calendar.monthrange(current_year, month)[1]

    print(f"\n=== SALARY CALCULATION FOR {month}/{current_year} ===")
    print(f"Days in month: {days_in_month}")

    # Load public holidays from ICS file
    holidays = parse_ics_holidays(ics_file, current_year, month)
    print(f"Public holidays in month {month}/{current_year}: {holidays}")

    # Count Sundays (weekday 6) and Thursdays (weekday 3)
    sundays = get_weekday_occurrences(current_year, month, 6)  # Sunday
    thursdays = get_weekday_occurrences(current_year, month, 3)  # Thursday

    print(f"Sundays: {sundays} (count: {len(sundays)})")
    print(f"Thursdays: {thursdays} (count: {len(thursdays)})")

    # Calculate hours
    # Base: 1 day = 1 hour
    total_hours = float(days_in_month)

    # Sundays: x2 (add extra hour for each Sunday)
    sunday_bonus = len(sundays)
    total_hours += sunday_bonus

    # Public holidays: x2 (add extra hour for each holiday)
    holiday_bonus = len(holidays)
    total_hours += holiday_bonus

    # Thursdays: +25% (rounded up)
    thursday_bonus = ceil(len(thursdays) * 0.25)
    total_hours += thursday_bonus

    # Subtract absent days
    total_hours -= nb_absent_days

    print("\n=== HOURS BREAKDOWN ===")
    print(f"Base hours (1 per day): {days_in_month}")
    print(f"Sunday bonus (+1 per Sunday): +{sunday_bonus}")
    print(f"Holiday bonus (+1 per holiday): +{holiday_bonus}")
    print(f"Thursday bonus (25% per Thursday): +{thursday_bonus}")
    print(f"Absent days: -{nb_absent_days}")
    print(f"TOTAL HOURS: {total_hours}")

    # Calculate salary
    # TOTAL_SALARY = ((TOTAL_HOURS × SALARY_NETT) + 10%) + TRANSPORT
    base_salary = total_hours * salary_nett
    with_bonus = base_salary * 1.10  # +10%
    total_salary = with_bonus + transport

    print("\n=== SALARY BREAKDOWN ===")
    print(f"Base salary ({total_hours} hours × {salary_nett}€): {base_salary:.2f}€")
    print(f"With 10% bonus: {with_bonus:.2f}€")
    print(f"Transport allowance: +{transport:.2f}€")
    print("\n" + "=" * 42)
    print(f"TOTAL SALARY: {total_salary:.2f}€")
    print("=" * 42 + "\n")

    return {
        'year': current_year,
        'month': month,
        'days_in_month': days_in_month,
        'total_hours': total_hours,
        'total_salary': round(total_salary, 2),
        'sunday_bonus': sunday_bonus,
        'holiday_bonus': holiday_bonus,
        'thursday_bonus': thursday_bonus,
        'absent_days': nb_absent_days
    }


def main():
    """Main entry point for the CESU salary calculator."""
    parser = argparse.ArgumentParser(
        description='CESU Salary Calculator - Calculate monthly salary with French labor law bonuses',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                                    # Calculate for current month with defaults
  %(prog)s --m 3 --sn 15 --t 80              # Calculate for March with custom values
  %(prog)s --m 6 --nb-a-d 2                  # Calculate for June with 2 absent days

For more information, visit: https://github.com/your-repo/cesu-calculator
        """
    )

    parser.add_argument(
        '--m', '--month',
        type=int,
        default=datetime.now().month,
        choices=range(1, 13),
        metavar='MONTH',
        help='Target month (1-12). Defaults to current month.'
    )

    parser.add_argument(
        '--sn', '--salary-nett',
        type=float,
        default=12.0,
        metavar='AMOUNT',
        help='Net hourly salary in euros (default: 12)'
    )

    parser.add_argument(
        '--nb-a-d', '--nb-absent-days',
        type=int,
        default=0,
        metavar='DAYS',
        help='Number of absent days to deduct (default: 0)'
    )

    parser.add_argument(
        '--t', '--transport',
        type=float,
        default=60.0,
        metavar='AMOUNT',
        help='Monthly transport allowance in euros (default: 60)'
    )

    parser.add_argument(
        '--ics',
        type=str,
        default='jours_feries_metropole.ics',
        metavar='FILE',
        help='Path to ICS holidays file (default: jours_feries_metropole.ics)'
    )

    args = parser.parse_args()

    # Validate inputs
    if args.sn <= 0:
        parser.error("Salary must be greater than 0")

    if args.nb_a_d < 0:
        parser.error("Number of absent days cannot be negative")

    if args.t < 0:
        parser.error("Transport allowance cannot be negative")

    # Run calculation
    try:
        calculate_salary(
            month=args.m,
            salary_nett=args.sn,
            nb_absent_days=args.nb_a_d,
            transport=args.t,
            ics_file=args.ics
        )
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
