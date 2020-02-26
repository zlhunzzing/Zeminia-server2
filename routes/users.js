const express = requires('express');
const router = express.Router();

const { usersController } = require('../controller');

router.post('/signup', usersController.signup.post);
router.post('/signin', usersController.signin.post);

module.export = router;
