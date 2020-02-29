const express = require('express');

const router = express.Router();

const { charactersController } = require('../controller');

router.get('/info', charactersController.info.get);

router.get('/rank', charactersController.rank.get);

router.post('/newcharacter', charactersController.newcharacter.post);

module.exports = router;
