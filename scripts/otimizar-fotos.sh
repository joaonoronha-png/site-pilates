#!/usr/bin/env sh
# Gera as versões AVIF + WebP (480, 800, 1200 e 1800 px) usadas pelo site.
# Requer ImageMagick 7 ("magick") ou 6 ("convert") com suporte a AVIF/WebP.
#
# Uso:  sh scripts/otimizar-fotos.sh foto-original.jpg nome-da-imagem [pasta-destino]
# Ex.:  sh scripts/otimizar-fotos.sh ~/fotos/casamento.jpg evento-casamento
#       -> substitui assets/img/provisorias/evento-casamento-*.{avif,webp}
#
# Dica: para trocar uma foto provisória por uma real, use o MESMO nome da
# provisória — o HTML não precisa mudar. Depois, ajuste o texto "alt" no
# index.html para descrever a foto nova.
set -e
[ $# -lt 2 ] && { sed -n '2,12p' "$0"; exit 1; }
SRC="$1"; NAME="$2"; DEST="${3:-assets/img/provisorias}"
IM=$(command -v magick || command -v convert)
mkdir -p "$DEST"
for W in 480 800 1200 1800; do
  "$IM" "$SRC" -auto-orient -strip -resize "${W}x>" -quality 62 "$DEST/$NAME-$W.webp"
  "$IM" "$SRC" -auto-orient -strip -resize "${W}x>" -quality 50 "$DEST/$NAME-$W.avif"
done
echo "Pronto: $DEST/$NAME-{480,800,1200,1800}.{webp,avif}"
echo "Se a proporção da foto mudou, atualize width/height da <img> no index.html."
