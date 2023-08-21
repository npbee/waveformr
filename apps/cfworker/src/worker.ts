import { Hono } from 'hono';
import { bearerAuth } from "hono/bearer-auth";

export type Bindings = {
  AUTH_KEY_SECRET: string;
  cdn: R2Bucket;
}

let app = new Hono<{ Bindings: Bindings }>();

const maxAge = 60 * 60 * 24 * 30

app.use('*', async (c, next) => {
  let secret = c.env.AUTH_KEY_SECRET;
  let auth = bearerAuth({ token: secret });
  return auth(c, next);
})

app.get('/:key', async c => {
  let key = c.req.param('key');

  let cacheKey = new Request(c.req.url.toString(), c.req);
  let cache = caches.default;
  let cached = await cache.match(cacheKey);

  if (cached) {
    console.log(`Cache hit for :${c.req.url}`);
    return cached;
  }

  console.log(`Cache miss for ${c.req.url}`);

  let object = await c.env.cdn.get(key);

  if (!object) {
    return c.notFound();
  }

  let headers = new Headers();
  object.writeHttpMetadata(headers)
  headers.set('Etag', object.httpEtag);
  headers.set('Content-Type', object.httpMetadata?.contentType ?? '');
  headers.append('Cache-Control', `public, s-max-age=${maxAge}`);

  let response = new Response(object.body, { headers })

  c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()))

  return response;
})

app.put('/:key', async c => {
  let key = c.req.param('key');
  let contentType = c.req.headers.get('Content-Type') ?? undefined;
  let body = await c.req.arrayBuffer();
  await c.env.cdn.put(key, body, {
    httpMetadata: {
      contentType,
    }
  });
  return c.text(key);
})


export default app;

