#!/usr/bin/env python3
"""
Calculateur de Salaire CESU

Calcul automatisé du salaire mensuel CESU (Chèque Emploi Service Universel)
conforme aux dispositions du droit du travail français.

Ce script calcule le salaire total en tenant compte de :
- Heures de base (1 heure par jour)
- Majoration dominicale (×2)
- Majoration pour jours fériés (×2)
- Majoration des jeudis (+25%, arrondi au supérieur)
- Déduction des jours d'absence
- Prime de 10%
- Indemnité de transport
"""

import argparse
import calendar
import re
import sys
from datetime import datetime
from math import ceil
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlopen
from urllib.error import URLError
import json

# Constantes
ICS_DEFAULT_URL = 'https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics'


def download_ics_file(url, destination):
    """
    Télécharge un fichier ICS depuis une URL.

    Args:
        url (str): URL source du téléchargement
        destination (str): Chemin local de destination

    Returns:
        bool: True si réussi, False sinon
    """
    parsed = urlparse(url)
    if parsed.scheme != 'https':
        print(f"Avertissement : URL refusée (HTTPS requis) : {url}", file=sys.stderr)
        return False
    try:
        print(f"Téléchargement des données de jours fériés depuis {url}...")
        with urlopen(url, timeout=30) as response:
            content = response.read().decode('utf-8')

        with open(destination, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Téléchargement réussi vers {destination}")
        return True

    except URLError as e:
        print(f"Avertissement : Impossible de télécharger le fichier ICS : {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Avertissement : Erreur lors du téléchargement du fichier ICS : {e}", file=sys.stderr)
        return False


def parse_ics_holidays(ics_file, year, month):
    """
    Analyse un fichier ICS pour extraire les jours fériés français d'un mois spécifique.
    Si le fichier n'existe pas localement, tente de le télécharger.

    Args:
        ics_file (str): Chemin vers le fichier ICS
        year (int): Année ciblée
        month (int): Mois ciblé (1-12)

    Returns:
        list: Liste des numéros de jours (int) fériés dans le mois spécifié
    """
    holidays = []

    # Téléchargement du fichier s'il n'existe pas localement
    if not Path(ics_file).exists():
        print(f"Fichier ICS '{ics_file}' introuvable localement.")
        if not download_ics_file(ICS_DEFAULT_URL, ics_file):
            print("Poursuite du calcul sans les données de jours fériés.", file=sys.stderr)
            return []

    try:
        with open(ics_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Recherche des lignes DTSTART avec format de date à 8 chiffres (AAAAMMJJ)
        # Format possible : DTSTART:20260501 ou DTSTART;VALUE=DATE:20260501
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

    except Exception as e:
        print(f"Avertissement : Impossible d'analyser le fichier ICS : {e}", file=sys.stderr)
        return []


def get_weekday_occurrences(year, month, weekday):
    """
    Récupère toutes les occurrences d'un jour de la semaine spécifique dans un mois.

    Args:
        year (int): Année ciblée
        month (int): Mois ciblé (1-12)
        weekday (int): Jour de la semaine (0=Lundi, 6=Dimanche)

    Returns:
        list: Liste des numéros de jours correspondant au jour de la semaine spécifié
    """
    days = []
    cal = calendar.monthcalendar(year, month)

    for week in cal:
        if week[weekday] != 0:
            days.append(week[weekday])

    return days


def calculate_salary(month, salary_nett, nb_absent_days, transport, ics_file='jours_feries_metropole.ics', year=None, json_output=False):
    """
    Calcule le salaire mensuel CESU avec toutes les majorations.

    Args:
        month (int): Mois (1-12)
        salary_nett (float): Salaire horaire net
        nb_absent_days (int): Nombre de jours d'absence
        transport (float): Indemnité de transport
        ics_file (str): Chemin vers le fichier ICS des jours fériés
        year (int): Année ciblée (None = année courante)
        json_output (bool): Si True, affiche le résultat en JSON

    Returns:
        dict: Résultats du calcul avec détails
    """
    current_year = year if year is not None else datetime.now().year

    # Récupération du nombre de jours dans le mois
    days_in_month = calendar.monthrange(current_year, month)[1]
    
    # Validation du nombre de jours d'absence
    if nb_absent_days > days_in_month:
        raise ValueError(f"Le nombre de jours d'absence ({nb_absent_days}) ne peut pas dépasser le nombre de jours dans le mois ({days_in_month})")
    
    if not json_output:
        print(f"\n=== CALCUL DE SALAIRE POUR {month}/{current_year} ===")
        print(f"Nombre de jours dans le mois : {days_in_month}")

    # Chargement des jours fériés depuis le fichier ICS
    holidays = parse_ics_holidays(ics_file, current_year, month)
    
    # Comptage des dimanches (jour 6) et des jeudis (jour 3)
    sundays = get_weekday_occurrences(current_year, month, 6)  # Dimanche
    thursdays = get_weekday_occurrences(current_year, month, 3)  # Jeudi
    
    # Filtrer les jours fériés qui tombent un dimanche pour éviter le double comptage
    # Un jour férié tombant un dimanche bénéficie déjà de la majoration dimanche
    holidays_not_sunday = [h for h in holidays if h not in sundays]
    
    if not json_output:
        print(f"Jours fériés du mois {month}/{current_year} : {holidays}")
        if len(holidays) != len(holidays_not_sunday):
            print(f"  → Jours fériés tombant un dimanche (déjà majorés) : {[h for h in holidays if h in sundays]}")
            print(f"  → Jours fériés à majorer : {holidays_not_sunday}")
        print(f"Dimanches : {sundays} (total : {len(sundays)})")
        print(f"Jeudis : {thursdays} (total : {len(thursdays)})")

    # Calcul des heures
    # Base : 1 jour = 1 heure
    total_hours = float(days_in_month)

    # Dimanches : ×2 (ajout d'une heure supplémentaire par dimanche)
    sunday_bonus = len(sundays)
    total_hours += sunday_bonus

    # Jours fériés : ×2 (ajout d'une heure supplémentaire par jour férié)
    # Uniquement pour les jours fériés ne tombant pas un dimanche
    holiday_bonus = len(holidays_not_sunday)
    total_hours += holiday_bonus

    # Jeudis : +25% (arrondi au supérieur)
    thursday_bonus = ceil(len(thursdays) * 0.25)
    total_hours += thursday_bonus

    # Soustraction des jours d'absence
    total_hours -= nb_absent_days

    if not json_output:
        print("\n=== DÉTAIL DES HEURES ===")
        print(f"Heures de base (1 par jour) : {days_in_month}")
        print(f"Majoration dimanches (+1 par dimanche) : +{sunday_bonus}")
        print(f"Majoration jours fériés (+1 par jour férié non-dimanche) : +{holiday_bonus}")
        print(f"Majoration jeudis (25% par jeudi, arrondi supérieur) : +{thursday_bonus}")
        print(f"Jours d'absence : -{nb_absent_days}")
        print(f"TOTAL DES HEURES : {total_hours}")

    # Calcul du salaire
    # SALAIRE_TOTAL = ((TOTAL_HEURES × SALAIRE_NET) + 10%) + TRANSPORT
    base_salary = total_hours * salary_nett
    with_bonus = base_salary * 1.10  # +10%
    total_salary = with_bonus + transport

    if not json_output:
        print("\n=== DÉTAIL DU SALAIRE ===")
        print(f"Salaire de base ({total_hours} heures × {salary_nett}€) : {base_salary:.2f}€")
        print(f"Avec prime de 10% : {with_bonus:.2f}€")
        print(f"Indemnité de transport : +{transport:.2f}€")
        print("\n" + "=" * 42)
        print(f"SALAIRE TOTAL : {total_salary:.2f}€")
        print("=" * 42 + "\n")

    result = {
        'year': current_year,
        'month': month,
        'days_in_month': days_in_month,
        'total_hours': total_hours,
        'base_salary': round(base_salary, 2),
        'salary_with_bonus': round(with_bonus, 2),
        'transport_allowance': round(transport, 2),
        'total_salary': round(total_salary, 2),
        'breakdown': {
            'sunday_bonus_hours': sunday_bonus,
            'holiday_bonus_hours': holiday_bonus,
            'thursday_bonus_hours': thursday_bonus,
            'absent_days': nb_absent_days,
            'sundays': sundays,
            'holidays': holidays,
            'holidays_not_sunday': holidays_not_sunday,
            'thursdays': thursdays
        }
    }
    
    if json_output:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    return result


def main():
    """Point d'entrée principal du calculateur de salaire CESU."""
    parser = argparse.ArgumentParser(
        description='Calculateur de Salaire CESU - Calcul du salaire mensuel conforme au droit du travail français',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  %(prog)s                                    # Calcul pour le mois en cours avec les valeurs par défaut
  %(prog)s -m 3 -s 15 -t 80                  # Calcul pour mars avec des valeurs personnalisées
  %(prog)s -m 6 -n 2                          # Calcul pour juin avec 2 jours d'absence

Pour plus d'informations, consultez : https://github.com/your-repo/cesu-calculator
        """
    )

    parser.add_argument(
        '-m', '--month',
        type=int,
        default=datetime.now().month,
        choices=range(1, 13),
        metavar='MOIS',
        help='Mois ciblé (1-12). Par défaut, le mois en cours'
    )

    parser.add_argument(
        '-y', '--year',
        type=int,
        default=None,
        metavar='ANNÉE',
        help='Année ciblée (ex: 2026). Par défaut, l\'année en cours'
    )

    parser.add_argument(
        '-s', '--salary-nett',
        type=float,
        default=12.0,
        metavar='MONTANT',
        help='Salaire horaire net en euros (défaut : 12)'
    )

    parser.add_argument(
        '-n', '--nb-absent-days',
        type=int,
        default=0,
        metavar='JOURS',
        help='Nombre de jours d\'absence à déduire (défaut : 0)'
    )

    parser.add_argument(
        '-t', '--transport',
        type=float,
        default=60.0,
        metavar='MONTANT',
        help='Indemnité de transport mensuelle en euros (défaut : 60)'
    )

    parser.add_argument(
        '--ics',
        type=str,
        default=str(Path(__file__).parent / 'jours_feries_metropole.ics'),
        metavar='FICHIER',
        help='Chemin vers le fichier ICS des jours fériés (défaut : répertoire du script)'
    )

    parser.add_argument(
        '-j', '--json',
        action='store_true',
        help='Afficher le résultat au format JSON'
    )

    args = parser.parse_args()

    # Validation des arguments
    if args.salary_nett <= 0:
        parser.error("Le salaire doit être supérieur à 0")

    if args.nb_absent_days < 0:
        parser.error("Le nombre de jours d'absence ne peut pas être négatif")

    if args.transport < 0:
        parser.error("L'indemnité de transport ne peut pas être négative")
    
    if args.year is not None and (args.year < 1900 or args.year > 2100):
        parser.error("L'année doit être entre 1900 et 2100")

    # Exécution du calcul
    try:
        calculate_salary(
            month=args.month,
            salary_nett=args.salary_nett,
            nb_absent_days=args.nb_absent_days,
            transport=args.transport,
            ics_file=args.ics,
            year=args.year,
            json_output=args.json
        )
    except ValueError as e:
        print(f"Erreur de validation : {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Erreur : {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
