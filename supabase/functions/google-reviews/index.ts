/**
 * google-reviews — devolve a nota, o total e as avaliações mais recentes da
 * By Dani Decora no Google, para o site se atualizar sozinho.
 *
 * Roda como Edge Function (Lovable Cloud / Supabase).
 *
 * Segredos (configurar no painel, nunca no código):
 *   GOOGLE_PLACES_API_KEY  chave do Google Cloud com a "Places API (New)" ativada
 *   GOOGLE_PLACE_ID        opcional — se ficar vazio, a função encontra o lugar pelo nome/endereço
 *
 * Resposta (JSON):
 *   { rating, count, url, reviews: [{ author, authorUrl, photo, rating, text, relative, time }], updatedAt }
 *
 * O resultado fica em cache por 24 h (no servidor e na CDN), então o Google é
 * consultado no máximo algumas vezes por dia.
 */

const SEARCH_QUERY = 'By Dani Decora, Av. João Cabral de Mello Neto, 850, Barra da Tijuca, Rio de Janeiro';
const CACHE_SECONDS = 60 * 60 * 24;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

let memo: { at: number; body: string } | null = null;
let placeIdMemo: string | null = null;

async function findPlaceId(key: string): Promise<string> {
  const fixed = Deno.env.get('GOOGLE_PLACE_ID');
  if (fixed) return fixed;
  if (placeIdMemo) return placeIdMemo;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName' },
    body: JSON.stringify({ textQuery: SEARCH_QUERY, languageCode: 'pt-BR', regionCode: 'BR' }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const id = data.places?.[0]?.id;
  if (!id) throw new Error('Lugar não encontrado no Google');
  placeIdMemo = id;
  return id;
}

async function fetchReviews(key: string) {
  const id = await findPlaceId(key);
  const res = await fetch(`https://places.googleapis.com/v1/places/${id}?languageCode=pt-BR&regionCode=BR`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
  });
  if (!res.ok) throw new Error(`details ${res.status}: ${await res.text()}`);
  const p = await res.json();
  return {
    rating: p.rating ?? null,
    count: p.userRatingCount ?? null,
    url: p.googleMapsUri ?? null,
    reviews: (p.reviews ?? []).map((r: any) => ({
      author: r.authorAttribution?.displayName ?? '',
      authorUrl: r.authorAttribution?.uri ?? null,
      photo: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? null,
      // texto original (sem tradução automática), como o cliente escreveu
      text: r.originalText?.text ?? r.text?.text ?? '',
      relative: r.relativePublishTimeDescription ?? '',
      time: r.publishTime ?? null,
    })),
    updatedAt: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  const headers = { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=3600, s-maxage=${CACHE_SECONDS}` };

  if (memo && Date.now() - memo.at < CACHE_SECONDS * 1000) return new Response(memo.body, { headers });

  const key = Deno.env.get('GOOGLE_PLACES_API_KEY');
  if (!key) return new Response(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY não configurada' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });

  try {
    const body = JSON.stringify(await fetchReviews(key));
    memo = { at: Date.now(), body };
    return new Response(body, { headers });
  } catch (err) {
    console.error(err);
    // Se o Google falhar, devolve o último resultado bom (se houver)
    if (memo) return new Response(memo.body, { headers });
    return new Response(JSON.stringify({ error: 'Falha ao consultar o Google' }), { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
