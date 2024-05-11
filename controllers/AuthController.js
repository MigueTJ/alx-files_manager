const sha1 = require('sha1');
const uuid = require('uuid');
const redisClient = require('../utils/redis');
const userUtils = require('../utils/user');
const dbClient = require('../utils/db');

class AuthController {
	static async getConnect(request, response) {
		const Authorixation = request.header('Authorization') || '';
		const credentials = Authorization.split(' ')[1];

		if (!credentials) return response.status(401).send({ error: 'Unauthorized' });

		const [email, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');

		if (!email || !password)  return response.status(401).send({ error: 'Unauthorized' });

		const usersCollection = await dbClient.usersCollection();
		const user = await usersCollection.findOne({ email, password: sha1(password) });

		return response.status(200).send({ token });
	}

	static async getDisconnect(request, response) {
		const { userId, key } = await userUtils.getUserIdAndKey(request);

		if (!userId) return response.status(401).send({ error: 'Unauthorized' });

		await redisClient.del(key);

		return response.status(204).send();
	}
}

module.exports = AuthController;
