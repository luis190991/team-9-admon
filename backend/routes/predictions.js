const express = require('express');
const router = express.Router();
const predictionsController = require('../controllers/predictionsController');

router.get('/', predictionsController.predict);

module.exports = router;
