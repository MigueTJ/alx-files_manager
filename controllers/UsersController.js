const ObjectId = require('mongodb');
const sha1 = require('sha1');
const Queue = require('bull');
const dbClient = require('../utils/db');
const User = require('../utils/user');
const crypto = require('crypto');

const userQueue = new Queue('sending email');

class UsersController {
  static async postNew (req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      const usersCollection = await dbClient.usersCollection();
      const emailExists = await usersCollection.findOne({ email });

      if (emailExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPass = crypto.createHash('sha1').update(password).digest('hex');

      const insertionInfo = await usersCollection.insertOne({ email, password: hashedPass });
      const userId = insertionInfo.insertedId.toString();

      userQueue.add({ userId });
      return res.status(201).json({ email, id: userId });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe (request, response) {
    try {
      const { userId, key } = await User.getUserIdAndKey(request);

      if (!key) {
        return response.status(401).send({ error: 'Unauthorized' });
      }

      const user = await User.getUser({
        _id: ObjectId(userId)
      });

      if (!user) {
        return response.status(401).send({ error: 'Unauthorized' });
      }

      const processedUser = { id: user._id, ...user };
      delete processedUser._id;
      delete processedUser.password;

      return response.status(200).send(processedUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
