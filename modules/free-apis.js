export const name = 'free-apis';
export const description = 'Free external APIs for crypto, news, weather, search';
export const version = '1.0.0';
export const tools = [
  { name: 'crypto_fear_greed', params: {} },
  { name: 'crypto_dexscreen', params: { token: 'string' } },
  { name: 'crypto_sol_price', params: {} },
  { name: 'news_crypto_rss', params: {} },
  { name: 'news_hackernews', params: { limit: 'number' } },
  { name: 'weather_get', params: { city: 'string' } },
  { name: 'search_wiki', params: { query: 'string' } },
  { name: 'search_ddg', params: { query: 'string' } },
];

export function init() { return { tools }; }

async function safeFetch(url, timeout = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e) {
    clearTimeout(t);
    return { error: e.message };
  }
}

export async function handleTool(name, params) {
  switch (name) {
    case 'crypto_fear_greed': {
      const d = await safeFetch('https://api.alternative.me/fng/?limit=1');
      if (d.error) return d;
      const fg = d.data?.[0];
      return { value: fg?.value, classification: fg?.value_classification, timestamp: fg?.timestamp };
    }

    case 'crypto_dexscreen': {
      const token = params.token || 'SOL';
      const d = await safeFetch('https://api.dexscreener.com/latest/dex/search?q=' + token);
      if (d.error) return d;
      const pairs = (d.pairs || []).slice(0, 5).map(p => ({
        name: p.baseToken?.name,
        symbol: p.baseToken?.symbol,
        price: p.priceUsd,
        volume24h: p.volume?.h24,
        priceChange24h: p.priceChange?.h24,
        dex: p.dexId,
        chain: p.chainId
      }));
      return { results: pairs };
    }

    case 'crypto_sol_price': {
      const d = await safeFetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur&include_24hr_change=true');
      if (d.error) return d;
      return { sol_usd: d.solana?.usd, sol_eur: d.solana?.eur, change_24h: d.solana?.usd_24h_change };
    }

    case 'news_crypto_rss': {
      // Fetch Cointelegraph RSS as text
      try {
        const r = await fetch('https://cointelegraph.com/rss', { signal: AbortSignal.timeout(8000) });
        const text = await r.text();
        const items = [...text.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<\/item>/g)]
          .slice(0, 5).map(m => m[1]);
        return { source: 'cointelegraph', headlines: items };
      } catch (e) { return { error: e.message }; }
    }

    case 'news_hackernews': {
      const limit = params.limit || 5;
      const ids = await safeFetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      if (ids.error) return ids;
      const stories = [];
      for (const id of ids.slice(0, limit)) {
        const s = await safeFetch('https://hacker-news.firebaseio.com/v0/item/' + id + '.json');
        if (!s.error) stories.push({ title: s.title, url: s.url, score: s.score });
      }
      return { stories };
    }

    case 'weather_get': {
      const city = params.city || 'Helsinki';
      try {
        const r = await fetch('https://wttr.in/' + encodeURIComponent(city) + '?format=j1', { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        const c = d.current_condition?.[0];
        return {
          city,
          temp_c: c?.temp_C,
          feels_like: c?.FeelsLikeC,
          humidity: c?.humidity,
          description: c?.weatherDesc?.[0]?.value,
          wind_kmph: c?.windspeedKmph
        };
      } catch (e) { return { error: e.message }; }
    }

    case 'search_wiki': {
      const d = await safeFetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(params.query));
      if (d.error) return d;
      return { title: d.title, extract: d.extract, url: d.content_urls?.desktop?.page };
    }

    case 'search_ddg': {
      const d = await safeFetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(params.query) + '&format=json&no_html=1');
      if (d.error) return d;
      return {
        abstract: d.Abstract || d.AbstractText,
        source: d.AbstractSource,
        url: d.AbstractURL,
        related: (d.RelatedTopics || []).slice(0, 5).map(t => ({ text: t.Text, url: t.FirstURL }))
      };
    }

    default:
      throw new Error('Unknown tool: ' + name);
  }
}
