#!/usr/bin/env bash
# Vídeo da seção "Em movimento": montagem vertical (3:4) com clipes do Mixkit
# (licença gratuita para uso comercial, sem necessidade de crédito — mixkit.co/license).
# Clipes provisórios: substitua por vídeos gravados nas festas da By Dani Decora.
# Requer ffmpeg (ex.: pip install imageio-ffmpeg). Uso: npm run video
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-$(command -v ffmpeg || python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())')}"
TMP=$(mktemp -d)
# id do clipe : segundo inicial : posição horizontal do recorte (0 = esquerda, 1 = direita)
CLIPS=("5224:0.5:0.45" "51544:1:0.5" "5213:1:0.5" "5103:2:0.42")
DUR=3.4; FADE=0.7; FPS=30
inputs=(); filters=""
for i in "${!CLIPS[@]}"; do
  IFS=: read -r id ss px <<< "${CLIPS[$i]}"
  [ -f "$TMP/$id.mp4" ] || curl -sSL -o "$TMP/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-1080.mp4" || curl -sSL -o "$TMP/$id.mp4" "https://assets.mixkit.co/videos/$id/$id-720.mp4"
  inputs+=(-ss "$ss" -t "$DUR" -i "$TMP/$id.mp4")
  filters+="[$i:v]scale=-2:1080,crop=810:1080:(iw-810)*$px:0,scale=720:960,setpts=PTS-STARTPTS,fps=$FPS,format=yuv420p,setsar=1[v$i];"
done
prev="v0"
for ((i=1; i<${#CLIPS[@]}; i++)); do
  off=$(python3 -c "print(round($i*($DUR-$FADE),2))")
  filters+="[$prev][v$i]xfade=transition=fade:duration=$FADE:offset=$off[x$i];"
  prev="x$i"
done
mkdir -p assets/video
"$FF" -y -hide_banner -loglevel error "${inputs[@]}" -filter_complex "${filters%;}" -map "[$prev]" \
  -c:v libx264 -preset slow -crf 25 -profile:v high -pix_fmt yuv420p -movflags +faststart -an assets/video/em-movimento.mp4
"$FF" -y -hide_banner -loglevel error -ss 0.8 -i assets/video/em-movimento.mp4 -frames:v 1 -q:v 3 assets/video/em-movimento-poster.jpg
rm -rf "$TMP"
ls -la assets/video
