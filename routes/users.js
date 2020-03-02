const express = require('express');

const router = express.Router();

const { usersController } = require('../controller');

router.get('/info', usersController.info.get);

router.post('/signin', usersController.signin.post);

router.post('/signup', usersController.signup.post);

router.post('/signout', usersController.signout.post);

router.delete('/secession', usersController.secession.delete);

module.exports = router;
