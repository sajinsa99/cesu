#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="/opt/cesu_web"
SERVICE_NAME="cesu"
NGINX_SNIPPET="/etc/nginx/snippets/cesu_location.conf"
BRUNO_CONF="/etc/nginx/sites-available/bruno"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash install_cesu.sh" >&2
  exit 1
fi

echo "==> Checking Node.js..."
NODE_MAJOR=$(node --version 2>/dev/null | sed 's/v\([0-9]*\).*/\1/')
if ! command -v node &>/dev/null || [[ ${NODE_MAJOR:-0} -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "    node $(node --version) already installed, skipping."
fi

echo "==> Backing up data..."
if [[ -d "$INSTALL_DIR/data" ]]; then
  cp -r "$INSTALL_DIR/data" "/opt/cesu_web_data.bak"
  echo "    Data backed up to /opt/cesu_web_data.bak"
else
  echo "    No existing data to back up."
fi

echo "==> Copying project to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
rsync -a --exclude='.git' --exclude='node_modules' --exclude='data' --exclude='.env' \
  "$SCRIPT_DIR/" "$INSTALL_DIR/"

echo "==> Installing npm dependencies..."
cd "$INSTALL_DIR"
npm ci --omit=dev

echo "==> Preparing data directory..."
mkdir -p "$INSTALL_DIR/data"
chown -R www-data:www-data "$INSTALL_DIR"
chmod 750 "$INSTALL_DIR/data"
[ -f "$INSTALL_DIR/data/history.json" ] && chmod 640 "$INSTALL_DIR/data/history.json"

echo "==> Installing systemd service..."
cp "$INSTALL_DIR/deploy/cesu.service" "/etc/systemd/system/${SERVICE_NAME}.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"

if [[ -f "$INSTALL_DIR/.env" ]]; then
  echo "==> Starting service..."
  systemctl restart "$SERVICE_NAME"
  systemctl status "$SERVICE_NAME" --no-pager
else
  echo ""
  echo "  INFO: No .env file found. Service will use defaults (port 4000, path /cesu)."
  echo "  Optionally create $INSTALL_DIR/.env with:"
  echo "    PORT=4000"
  echo "    BASE_PATH=/cesu"
  echo "  Then: sudo systemctl start $SERVICE_NAME"
  echo ""
  systemctl start "$SERVICE_NAME" || true
fi

echo "==> Configuring nginx..."
mkdir -p /etc/nginx/snippets
cp "$INSTALL_DIR/deploy/nginx-cesu.conf" "$NGINX_SNIPPET"

if [[ -f "$BRUNO_CONF" ]]; then
  if grep -q "cesu_location" "$BRUNO_CONF"; then
    sed -i "s|include .\+cesu_location\.conf;|include $NGINX_SNIPPET;|" "$BRUNO_CONF"
    echo "    Updated include path in $BRUNO_CONF"
    if grep -q "location /cesu" "$BRUNO_CONF"; then
      echo "    WARNING: a raw 'location /cesu' block also exists in $BRUNO_CONF — remove it to avoid duplicate location error." >&2
    fi
  elif grep -q "location /cesu" "$BRUNO_CONF"; then
    echo "    WARNING: a '/cesu' location block already exists in $BRUNO_CONF — skipping inject." >&2
  else
    sed -i '/listen 443 ssl/a\    include /etc/nginx/snippets/cesu_location.conf;' "$BRUNO_CONF"
    echo "    Injected cesu include into $BRUNO_CONF"
  fi
else
  echo "  WARNING: $BRUNO_CONF not found. Add manually to your nginx SSL vhost:" >&2
  echo "    include $NGINX_SNIPPET;" >&2
fi

nginx -t
systemctl reload nginx

echo ""
echo "Done. CESU calculator available at https://bfablet92.hd.free.fr/cesu/"
