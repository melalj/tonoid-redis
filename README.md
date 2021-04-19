# @tonoid/redis

![npm](https://img.shields.io/npm/dt/@tonoid/redis.svg) ![npm](https://img.shields.io/npm/v/@tonoid/redis.svg) ![npm](https://img.shields.io/npm/l/@tonoid/redis.svg) ![David](https://img.shields.io/david/melalj/tonoid-redis.svg)
[![GitHub stars](https://img.shields.io/github/stars/melalj/tonoid-redis.svg?style=social&label=Star&maxAge=2592003)](https://github.com/melalj/tonoid-redis)

Redis plugin for [@tonoid/helpers](https://github.com/melalj/tonoid-helpers)

## Init options

- `host`: (defaults: `process.env.REDIS_HOST || 'mongo'`) Redis host.
- `port`: (defaults: `process.env.REDIS_PORT || 27017`) Redis port.
- `password`: (defaults: `process.env.REDIS_PASSWORD || 'mongo'`) Redis password.
- `db`: (defaults: `process.env.REDIS_DB || 'admin'`) Redis database.
- `url`: (defaults: `process.env.REDIS_URL`) Redis url, if set it overrides other auth options.

## Exported context attributes

- `.getValue(key)`: Get a value from redis cache
- `.setValue(key, value, ttl)`: Set a value in redis cache
- `.delValue(key)`: Delete a value in redis cache

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
