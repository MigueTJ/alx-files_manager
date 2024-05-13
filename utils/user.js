const redisClient = require('./redis');
const dbClient = require('./db');

const userUtils = {
  async getUserIdAndKey (request) {
    const obj = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return obj;

    obj.key = `auth_${xToken}`;

    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  async getUser (query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  }
};

module.exports = userUtils;
