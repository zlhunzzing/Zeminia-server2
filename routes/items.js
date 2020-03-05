const express = require('express');

const router = express.Router();

const { itemsController } = require('../controller');

router.get('/info', itemsController.info.get);

module.exports = router;
