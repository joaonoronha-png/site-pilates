#!/usr/bin/env bash
# Vídeo vertical (reel) montado com fotos reais de projetos da By Dani Decora.
# Requer ffmpeg (ex.: pip install imageio-ffmpeg). Uso: npm run video
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-$(command -v ffmpeg || python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())')}"
IMG=assets/img
CLIPS=(cha-revelacao-34 detalhe-baloes festa-sininho-34 divertida-mente-34 flor-de-baloes-34 detalhe-tucano happy-birthday-lilas-34 divertida-mente-bolo-34)
DUR=2.6; FADE=0.6; FPS=30; FR=$(python3 -c "print(int($DUR*$FPS))")
inputs=(); filters=""
for i in "${!CLIPS[@]}"; do
  inputs+=(-i "$IMG/${CLIPS[$i]}.webp")
  # zoom lento, alternando o sentido do movimento
  if (( i % 2 == 0 )); then Z="1+0.07*on/$FR"; else Z="1.07-0.07*on/$FR"; fi
  filters+="[$i:v]scale=1440:1920:force_original_aspect_ratio=increase,crop=1440:1920,zoompan=z='$Z':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FR:s=720x960:fps=$FPS,format=yuv420p,setsar=1[v$i];"
done
prev="v0"
for ((i=1; i<${#CLIPS[@]}; i++)); do
  off=$(python3 -c "print(round($i*($DUR-$FADE),2))")
  filters+="[$prev][v$i]xfade=transition=fade:duration=$FADE:offset=$off[x$i];"
  prev="x$i"
done
filters="${filters%;}"
"$FF" -y -hide_banner -loglevel error "${inputs[@]}" -filter_complex "$filters" -map "[$prev]" \
  -c:v libx264 -preset slow -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart -an assets/video/projetos-by-dani.mp4
"$FF" -y -hide_banner -loglevel error -i assets/video/projetos-by-dani.mp4 -frames:v 1 -q:v 3 assets/video/projetos-by-dani-poster.jpg
ls -la assets/video
