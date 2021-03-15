const express = require('express');

const router = express.Router();

const { itemsController } = require('../controller');

router.get('/info', itemsController.info.get);

router.post('/create', itemsController.create.post);

module.exports = router;
