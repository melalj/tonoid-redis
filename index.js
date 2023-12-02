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
    host = process.env.REDIS_HOST || 'redis',
    port = process.env.REDIS_PORT || 6379,
    username = process.env.REDIS_USERNAME,
    password = process.env.REDIS_PASSWORD,
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
    const redisUsername = parsedURL.username || username;
    const redisPassword = parsedURL.password || password;
    const redisClientOptions = {
      host: parsedURL.hostname || host,
      port: Number(parsedURL.port || port),
      username: redisUsername ? decodeURIComponent(redisUsername) : undefined,
      password: redisPassword ? decodeURIComponent(redisPassword) : undefined,
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
