const redisClient = require('./redis');
const dbClient = require('./db');

const userUtils = {
  async getUserIdAndKey(request) {
    const obj = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return obj;

    obj.key = `auth_${xToken}`;

    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  async getUser(query) {
    try {
      const usersCollection = await dbClient.usersCollection();
      const user = await usersCollection.findOne(query);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};

module.exports = userUtils;
