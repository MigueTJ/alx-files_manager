const redis = require('redis');
const util = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client did not connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    const getAsync = util.promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  async set(key, value, duration) {
    const setAsync = util.promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  async del(key) {
    const delAsync = util.promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

module.exports = new RedisClient();
