const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const { monstersController } = require('../controller');

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  })
});

router.get('/info', monstersController.info.get);

router.post('/create', upload.single('img'), monstersController.create.post);

router.patch('/update', upload.single('img'), monstersController.update.patch);

router.delete('/delete', monstersController.remove.delete);

module.exports = router;
