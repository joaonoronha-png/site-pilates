#!/usr/bin/env sh
# Troca o domínio provisório pelo domínio definitivo em todos os arquivos de SEO.
# Uso: sh scripts/definir-dominio.sh www.seudominio.com.br
set -e
[ -z "$1" ] && { echo "Uso: sh scripts/definir-dominio.sh www.seudominio.com.br"; exit 1; }
cd "$(dirname "$0")/.."
for f in index.html 404.html robots.txt sitemap.xml; do
  sed -i.bak "s#dominio-a-definir\.com\.br#$1#g" "$f" && rm -f "$f.bak"
done
echo "Domínio atualizado para $1"
