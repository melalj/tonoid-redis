# @tonoid/redis

![npm](https://img.shields.io/npm/dt/@tonoid/redis.svg) ![npm](https://img.shields.io/npm/v/@tonoid/redis.svg) ![npm](https://img.shields.io/npm/l/@tonoid/redis.svg)
[![GitHub stars](https://img.shields.io/github/stars/melalj/tonoid-redis.svg?style=social&label=Star&maxAge=2592003)](https://github.com/melalj/tonoid-redis)

Redis plugin for [@tonoid/helpers](https://github.com/melalj/tonoid-helpers)

## Init options

- `url`: (defaults: `process.env.REDIS_URL`) Redis url, if set it overrides other auth options.
- `host`: (defaults: `process.env.REDIS_HOST || 'redis'`) Redis host.
- `port`: (defaults: `process.env.REDIS_PORT || 6379`) Redis port.
- `username`: (defaults: `process.env.REDIS_USERNAME`) Redis username.
- `password`: (defaults: `process.env.REDIS_PASSWORD`) Redis password.
- `db`: (defaults: `process.env.REDIS_DB || '0'`) Redis database.
- `extendOptions`: (default: `{}`) Extend RedisClient options
- `errorHandler`: (default: `(err) => {}`) Handle redis connect eror

## Exported context attributes

- `.redisCache`: Redis cacheManager instance
- `.getValue(key)`: Get a value from redis cache
- `.setValue(key, value, ttl)`: Set a value in redis cache (ttl in seconds)
- `.delValue(key)`: Delete a value in redis cache
- `.expire(key, value)`: Expire a value in redis cache (value in seconds)
- `.incr(key)`: Increment a value in redis cache
- `.decr(key)`: Decrement a value in redis cache

## Usage example

```js
const { context, init } = require('@tonoid/helpers');
const redis = require('@tonoid/redis');

(async () => {
  await init([
    redis(),
  ]);

  await context.redis.setValue('foo', 'bar');
  const fooValue = await context.redis.getValue('foo');
  console.log(fooValue);
})();

```

## Credits

This module is maintained by [Simo Elalj](https://twitter.com/simoelalj) @[tonoid](https://www.tonoid.com)
