const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

function routingControl (app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller
  router.get('/status', AppController.getStatus);
  router.get('/stats', AppController.getStats);

  // User Controller
  router.post('/users', UsersController.postNew);

  // Authenticate user
  router.get('/connect', AuthController.getConnect);
  router.get('/disconnect', AuthController.getDisconnect);
  router.get('/users/me', UsersController.getMe);

  // Files Controller
  router.post('/files', FilesController.postUpload);
  router.get('/files/:id', FilesController.getShow);
  router.get('/files', FilesController.getIndex);
  router.put('/files/:id/publish', FilesController.putPublish);
  router.put('/files/:id/unpublish', FilesController.putUnpublish);
  router.get('/files/:id/data', FilesController.getFile);
}

module.exports = routingControl;
