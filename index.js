const { caching } = require('cache-manager');
const { ioRedisStore } = require('@tirke/node-cache-manager-ioredis');
const { URL } = require('url');

module.exports = (
  {
    url = process.env.REDIS_URL,
    host = process.env.REDIS_HOST || 'redis',
    port = process.env.REDIS_PORT || 6379,
    username = process.env.REDIS_USERNAME,
    password = process.env.REDIS_PASSWORD,
    db = process.env.REDIS_DB || 0,
  },
  ctxName = 'redis',
) => ({
  name: ctxName,
  init: async () => {
    let credentials = {};
    if (url) {
      const parsedURL = new URL(url);
      credentials = {
        host: parsedURL.hostname || 'redis',
        port: Number(parsedURL.port || 6379),
        username: parsedURL.username ? decodeURIComponent(parsedURL.username) : null,
        password: parsedURL.password ? decodeURIComponent(parsedURL.password) : null,
        db: db || (parsedURL.pathname || '/0').slice(1) || '0',
      };
    } else {
      credentials = {
        host,
        port,
        username,
        password,
        db,
      };
    }

    const redisCache = await caching(ioRedisStore, credentials);

    const getValue = (key) => redisCache.get(key);

    const setValue = (key, value, ttl) => redisCache.set(key, value, ttl);

    const delValue = (key) => redisCache.del(key);

    const expire = (key, v) => redisCache.store.client.expire(key, v);

    const incr = (key) => redisCache.store.client.incr(key);

    const decr = (key) => redisCache.store.client.decr(key);

    const close = () => redisCache.store.client.quit();

    return {
      name: ctxName,
      close,
      redisCache,
      getValue,
      setValue,
      delValue,
      expire,
      incr,
      decr,
    };
  },
});
