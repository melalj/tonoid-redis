const { caching } = require('cache-manager');
const { ioRedisStore } = require('@tirke/node-cache-manager-ioredis');
const { URL } = require('url');

module.exports = (customOptions) => ({
  name: 'redis',
  init: async () => {
    const defaultConfig = {
      ...(process.env.REDIS_URL
        ? { url: process.env.REDIS_URL }
        : {
          host: process.env.REDIS_HOST || 'redis',
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD,
          db: process.env.REDIS_DB || 0,
        }
      ),
    };

    const options = customOptions || defaultConfig;

    let credentials = {};
    if (options.url) {
      const parsedURL = new URL(options.url);
      credentials = {
        host: parsedURL.hostname || 'redis',
        port: Number(parsedURL.port || 6379),
        password: parsedURL.password ? decodeURIComponent(parsedURL.password) : null,
        db: (parsedURL.pathname || '/0').substr(1) || '0',
      };
    } else {
      credentials = {
        host: options.host,
        port: options.port,
        password: options.password,
        db: options.db,
      };
    }

    const redisCache = await caching(ioRedisStore, credentials);

    const getValue = (key) => redisCache.get(key);

    const setValue = (key, value, ttl) => redisCache.set(key, value, ttl);

    const delValue = (key) => redisCache.del(key);

    // It seems we do not need to close the connection
    const close = () => {};

    return {
      close,
      redisCache,
      getValue,
      setValue,
      delValue,
    };
  },
});
