const express = require('express');

const router = express.Router();

const { monstersController } = require('../controller');

router.get('/info', monstersController.info.get);

router.post('/create', monstersController.create.post);

module.exports = router;
