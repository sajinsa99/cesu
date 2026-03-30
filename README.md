# Calculateur de Salaire CESU

> Calcul automatisé du salaire mensuel CESU (Chèque Emploi Service Universel) avec les primes conformes au droit du travail français.

[![Python](https://img.shields.io/badge/Python-3.6%2B-blue?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![France](https://img.shields.io/badge/Région-France-blue)](https://www.service-public.fr/particuliers/vosdroits/F2107)

---

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [Méthodologie de calcul](#méthodologie-de-calcul)
- [Exemple de sortie](#exemple-de-sortie)
- [Référence API](#référence-api)
- [Contribuer](#contribuer)

---

## Vue d'ensemble

Ce projet fournit un script Python pour automatiser le calcul des salaires mensuels pour les contrats d'emploi CESU en France.

Le script prend en compte :

- La durée variable des mois
- Les majorations pour les dimanches
- Les primes pour les jours fériés
- La prise en compte des jeudis
- La déduction des jours d'absence
- Les indemnités de transport

---

## Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Calendrier dynamique** | Détermine automatiquement les jours du mois sélectionné |
| **Intégration des jours fériés** | Récupère les jours fériés officiels depuis l'API gouvernementale |
| **Calcul des primes** | Applique les coefficients légaux pour les jours spéciaux |
| **Gestion des absences** | Déduit les jours d'absence du total d'heures |
| **Téléchargement automatique** | Le script Python télécharge automatiquement les données de jours fériés si absentes |
| **Mode interactif** | Invite à saisir les paramètres manquants avec la valeur par défaut pré-remplie |
| **Mode silencieux** | Option `-q` pour utiliser les valeurs par défaut sans prompt |
| **Sortie fichier** | Résultat automatiquement sauvegardé dans `AAAA_MM.md` |
| **Aucune dépendance externe** | La version Python utilise uniquement la bibliothèque standard |

---

## Démarrage rapide

```bash
# Exécuter avec les valeurs par défaut (mois en cours)
python3 cesu.py

# Calculer pour un mois spécifique avec des valeurs personnalisées
python3 cesu.py -m 6 -s 15 -t 80 -n 2

# Afficher l'aide
python3 cesu.py --help
```

---

## Prérequis

- Python 3.6 ou supérieur
- Aucun package supplémentaire requis (utilise uniquement la bibliothèque standard)

---

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/your-username/cesu-calculator.git
cd cesu-calculator
```

### Configuration du script Python

```bash
# Rendre le script exécutable (Linux/macOS)
chmod +x cesu.py

# Ou exécuter directement
python3 cesu.py
```

---

## Utilisation

#### Options en ligne de commande

| Option | Forme longue | Défaut | Description |
|:-------|:-------------|:------:|:------------|
| `-m` | `--month` | Mois actuel | Mois cible (1-12) |
| `-y` | `--year` | Année actuelle | Année cible (ex: 2026) |
| `-s` | `--salary-nett` | `12.0` | Salaire horaire net en euros |
| `-n` | `--nb-absent-days` | `0` | Nombre de jours d'absence |
| `-t` | `--transport` | `60.0` | Indemnité de transport mensuelle en euros |
| `--ics` | | répertoire du script | Chemin vers le fichier ICS des jours fériés |
| `-j` | `--json` | | Afficher le résultat au format JSON |
| `-q` | `--quiet` | | Mode silencieux : pas de prompt, utilise les valeurs par défaut |

#### Exemples

```bash
# Calculer pour le mois en cours avec toutes les valeurs par défaut (mode interactif)
python3 cesu.py

# Calculer pour le mois de mars
python3 cesu.py -m 3

# Calculer avec un salaire et transport personnalisés
python3 cesu.py -s 15 -t 80

# Calculer pour juin avec 2 jours d'absence
python3 cesu.py -m 6 -n 2

# Calcul entièrement personnalisé
python3 cesu.py -m 12 -s 14.50 -t 75 -n 1

# Mode silencieux (pas de prompt, valeurs par défaut)
python3 cesu.py -q

# Afficher le résultat au format JSON
python3 cesu.py -j

# Afficher l'aide
python3 cesu.py --help
```

---

## Configuration

### Données des jours fériés

Le fichier ICS est automatiquement téléchargé depuis :
```
https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics
```

- Le script Python télécharge automatiquement les données si le fichier est absent
- Données maintenues par [Etalab](https://www.etalab.gouv.fr/)

---

## Méthodologie de calcul

### Calcul des heures

Le total des heures facturables est calculé selon les règles suivantes :

| Type de jour | Multiplicateur | Description |
|:-------------|:--------------:|:------------|
| Jour normal | ×1 | Taux de base : 1 heure par jour calendaire |
| Dimanche | ×2 | Taux doublé appliqué (+1 heure de prime) |
| Jour férié | ×2 | Taux doublé appliqué (+1 heure de prime) |
| Jeudi | +25% | Heures supplémentaires arrondies au supérieur (ceil) |
| Jour d'absence | -1 | Déduit du total |

### Formule de calcul du salaire

```
HEURES_BASE = Jours_du_mois
HEURES_PRIME = Dimanches + Jours_fériés + ceil(Jeudis × 0.25)
HEURES_TOTALES = HEURES_BASE + HEURES_PRIME - Jours_absence

SALAIRE_TOTAL = ((HEURES_TOTALES × SALAIRE_NET) × 1.10) + TRANSPORT
```

> **Note** : Le bonus de 10% est appliqué conformément aux conditions standards d'emploi CESU.

---

## Exemple de sortie

**Entrée** : Mois 6 (juin 2026) avec 30 jours, 4 dimanches, 4 jeudis, 0 jour férié, 0 jour d'absence

```
$ python3 cesu.py -m 6 -q

=== CALCUL DE SALAIRE POUR 6/2026 ===
Nombre de jours dans le mois : 30
Jours fériés du mois 6/2026 : 0
Dimanches : [7, 14, 21, 28] (total : 4)
Jeudis : [4, 11, 18, 25] (total : 4)

=== DÉTAIL DES HEURES ===
Heures de base (1 par jour) : 30
Majoration dimanches (+1 par dimanche) : +4
Majoration jours fériés (+1 par jour férié non-dimanche) : 0
Majoration jeudis (25% par jeudi, arrondi supérieur) : +1
Jours d'absence : 0
TOTAL DES HEURES : 35.0

=== DÉTAIL DU SALAIRE ===
Salaire de base (35.0 heures × 12.0€) : 420.00€
Avec prime de 10% : 462.00€
Indemnité de transport : +60.00€

==========================================
SALAIRE TOTAL : 522.00€
==========================================

Résultat sauvegardé dans 2026_06.md
```

---

## Référence API

### Codes de sortie du script Python

| Code | Description |
|:----:|:------------|
| `0` | Calcul réussi |
| `1` | Erreur survenue (paramètres invalides, erreurs de fichier, etc.) |

---

## Fichiers

| Fichier | Description |
|:--------|:------------|
| `cesu.py` | Script Python pour le calcul du salaire |
| `jours_feries_metropole.ics` | Jours fériés français (format ICS, téléchargé automatiquement) |
| `AAAA_MM.md` | Résultat du calcul (ex: `2026_06.md`), généré automatiquement |
| `README.md` | Cette documentation |

---

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrez une Pull Request

---

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<p align="center">
  <sub>Développé avec Python</sub>
</p>