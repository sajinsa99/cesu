# CESU Web — Calculateur de Salaire CESU

Interface web pour le calcul automatisé du salaire mensuel CESU (Chèque Emploi Service Universel), conforme aux dispositions du droit du travail français.

**Application disponible à : [https://bfablet92.hd.free.fr/cesu/](https://bfablet92.hd.free.fr/cesu/)**

## Fonctionnalités

- Calcul du salaire mensuel avec toutes les majorations légales :
  - Majoration dominicale (×2)
  - Majoration pour jours fériés (×2, hors dimanches)
  - Majoration des jeudis (+25%, arrondi au supérieur)
  - Déduction des jours d'absence
  - Prime de 10%
  - Indemnité de transport
- Téléchargement automatique du calendrier des jours fériés français (fichier ICS via [etalab](https://github.com/etalab/jours-feries-france-data))
- Historique des calculs persisté localement (JSON)
- Interface responsive (mobile/desktop)

## Stack

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js + Express |
| Frontend | HTML / CSS / JS vanilla |
| Déploiement | systemd + nginx (reverse proxy) |
| Données | JSON file (`data/history.json`) |

Aucune dépendance Python — la logique métier est entièrement réimplémentée en JavaScript.

---

## Prérequis (serveur)

- Ubuntu 20.04+ (ou Debian équivalent)
- Node.js ≥ 18 (installé automatiquement par le script si absent)
- nginx avec un vhost SSL existant (`/etc/nginx/sites-available/bruno`)
- Accès root (`sudo`)

---

## Installation / Déploiement

### 1. Copier le projet sur le serveur

```bash
rsync -av --exclude=node_modules --exclude=data cesu_web/ user@bfablet92.hd.free.fr:/tmp/cesu_web/
```

ou via git directement sur le serveur.

### 2. Lancer le script d'installation

```bash
ssh user@bfablet92.hd.free.fr
cd /tmp/cesu_web
sudo bash install_cesu.sh
```

Le script effectue automatiquement les opérations suivantes :

1. Installe Node.js et npm si absents
2. Sauvegarde les données existantes dans `/opt/cesu_web_data.bak`
3. Copie le projet dans `/opt/cesu_web/`
4. Exécute `npm install --production`
5. Configure les permissions (`www-data`)
6. Installe et active le service systemd `cesu`
7. Dépose le snippet nginx dans `/etc/nginx/snippets/cesu_location.conf`
8. Injecte l'`include` dans le vhost SSL `/etc/nginx/sites-available/bruno`
9. Vérifie la configuration nginx (`nginx -t`) et recharge nginx

L'application est ensuite accessible à :

```
https://bfablet92.hd.free.fr/cesu/
```

### 3. Configuration optionnelle (.env)

Par défaut l'application écoute sur le port **4000** avec le chemin `/cesu`. Pour personnaliser, créer `/opt/cesu_web/.env` avant de démarrer le service :

```dotenv
PORT=4000
BASE_PATH=/cesu
```

Puis redémarrer le service :

```bash
sudo systemctl restart cesu
```

---

## Gestion du service

```bash
# Statut
sudo systemctl status cesu

# Démarrer / Arrêter / Redémarrer
sudo systemctl start cesu
sudo systemctl stop cesu
sudo systemctl restart cesu

# Logs en temps réel
sudo journalctl -u cesu -f
```

---

## Mise à jour

```bash
rsync -av --exclude=node_modules --exclude=data cesu_web/ user@bfablet92.hd.free.fr:/tmp/cesu_web/
ssh user@bfablet92.hd.free.fr "sudo bash /tmp/cesu_web/install_cesu.sh"
```

Le script sauvegarde les données avant d'écraser les fichiers, l'historique est préservé.

---

## Utilisation de l'application

### Calcul d'un salaire

1. Sélectionner le **mois** et l'**année** ciblés
2. Saisir le **salaire horaire net** (€)
3. Indiquer le nombre de **jours d'absence** (0 par défaut)
4. Saisir l'**indemnité de transport** mensuelle (60 € par défaut)
5. Cliquer sur **Calculer**

Le détail des heures (base, majorations, absences) et du salaire (base, prime, transport, total) s'affiche immédiatement. Le calcul est automatiquement sauvegardé dans l'historique.

### Historique

Le panneau latéral gauche liste tous les calculs précédents, triés du plus récent au plus ancien. Cliquer sur une entrée recharge les paramètres du mois correspondant et ré-affiche le résultat. Le bouton **×** supprime définitivement une entrée.

---

## Structure du projet

```
cesu_web/
├── server.js                   Point d'entrée Express
├── package.json
├── .gitignore
├── lib/
│   ├── cesu.js                 Logique de calcul du salaire
│   └── holidays.js             Téléchargement et parsing du fichier ICS
├── public/
│   ├── index.html              Interface utilisateur
│   ├── style.css
│   └── app.js                  Logique frontend (fetch API, rendu)
├── data/                       Historique JSON (exclu du dépôt git)
├── deploy/
│   ├── cesu.service            Unité systemd
│   └── nginx-cesu.conf         Snippet nginx (location /cesu/)
└── install_cesu.sh             Script d'installation
```

---

## Règles de calcul

| Composante | Règle |
|---|---|
| Heures de base | 1 heure par jour calendaire |
| Majoration dimanche | +1 heure par dimanche (soit ×2) |
| Majoration jour férié | +1 heure par jour férié ne tombant pas un dimanche |
| Majoration jeudi | +25% du nombre de jeudis, arrondi à l'entier supérieur |
| Absence | −1 heure par jour d'absence |
| Prime | Salaire brut (heures × taux) × 1.10 |
| Transport | Forfait mensuel ajouté au total |

**Formule :** `((heures_totales × taux_horaire) × 1.10) + transport`

---

## Jours fériés

Le fichier ICS est téléchargé automatiquement depuis [etalab/jours-feries-france-data](https://github.com/etalab/jours-feries-france-data) lors du premier calcul et mis en cache localement dans le répertoire d'installation (`/opt/cesu_web/jours_feries_metropole.ics`). Pour forcer la mise à jour, supprimer ce fichier et relancer un calcul.
