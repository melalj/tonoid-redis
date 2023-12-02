const { createClient } = require('redis');
const { URL } = require('url');

function isValidUrl(string) {
  try {
    // eslint-disable-next-line no-new
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = (
  {
    url = process.env.REDIS_URL,
    db = process.env.REDIS_DB,
    errorHandler = () => {},
    extendOptions = {},
  },
  ctxName = 'redis',
) => ({
  name: ctxName,
  init: async () => {
    // Redis options
    const parsedURL = isValidUrl(url) ? new URL(url) : {};
    const redisClientOptions = {
      url,
      db: db || (parsedURL.pathname || '/0').slice(1) || '0',
      ...extendOptions,
    };

    const redisCache = await createClient(redisClientOptions)
      .on('error', errorHandler)
      .connect();

    const getValue = (key) => redisCache.get(key);

    const setValue = (key, value, ttl) => redisCache.set(key, value, (ttl ? { EX: ttl } : {}));

    const delValue = (key) => redisCache.del(key);

    const expire = (key, v) => redisCache.expire(key, v);

    const incr = (key) => redisCache.incr(key);

    const decr = (key) => redisCache.decr(key);

    const close = () => redisCache.quit();

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
