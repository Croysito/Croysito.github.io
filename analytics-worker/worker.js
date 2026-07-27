// Worker puente: expone públicamente el conteo de "visits" que ya recolecta
// Cloudflare Web Analytics (RUM), leyéndolo vía la API GraphQL de Cloudflare.
// El token de API nunca se expone al navegador — vive como secret del Worker.

const GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';
// Cloudflare limita este dataset a un rango de consulta máximo de 13 semanas y
// 2 días (93 días) por cuenta; 90 es el máximo práctico dentro de ese límite.
const WINDOW_DAYS = 90;
const CACHE_TTL_SECONDS = 3600;

// El filtro exacto "requestPath" de esta API no matchea de forma confiable
// (bug/quirk conocido de rumPageloadEventsAdaptiveGroups). En vez de filtrar
// server-side por path, se trae todo agrupado por requestPath y se busca el
// match exacto acá abajo, en JS.
const QUERY = `
  query GetVisits($accountTag: String!, $siteTag: String!, $since: Time!, $until: Time!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        rumPageloadEventsAdaptiveGroups(
          limit: 200
          filter: { siteTag: $siteTag, datetime_geq: $since, datetime_leq: $until }
        ) {
          sum { visits }
          dimensions { requestPath }
        }
      }
    }
  }
`;

function withCors(headers, origin) {
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return headers;
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: withCors(new Headers(), origin) });
    }

    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    const cached = await cache.match(cacheKey);
    if (cached) {
      const headers = withCors(new Headers(cached.headers), origin);
      return new Response(cached.body, { status: cached.status, headers });
    }

    const until = new Date();
    const since = new Date(until.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const upstream = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          accountTag: env.CF_ACCOUNT_TAG,
          siteTag: env.CF_SITE_TAG,
          since: since.toISOString(),
          until: until.toISOString(),
        },
      }),
    });

    if (!upstream.ok) {
      const bodyText = await upstream.text();
      return new Response(JSON.stringify({ error: 'upstream_error', status: upstream.status, body: bodyText }), {
        status: 502,
        headers: withCors(new Headers({ 'Content-Type': 'application/json' }), origin),
      });
    }

    const data = await upstream.json();
    if (data.errors) {
      return new Response(JSON.stringify({ error: data.errors }), {
        status: 502,
        headers: withCors(new Headers({ 'Content-Type': 'application/json' }), origin),
      });
    }

    const groups = data?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];
    const match = groups.find((g) => g.dimensions?.requestPath === path);
    const count = match?.sum?.visits ?? 0;

    const response = new Response(JSON.stringify({ count, windowDays: WINDOW_DAYS }), {
      headers: withCors(
        new Headers({
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
        }),
        origin
      ),
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
