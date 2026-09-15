import { FEED_LIMIT, buildFeed } from "@/lib/feed";

/** Feed RSS 2.0 con las últimas noticias. */
export function GET(): Response {
  return new Response(buildFeed(FEED_LIMIT), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
