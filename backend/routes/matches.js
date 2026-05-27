const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

router.get('/', matchesController.getAllMatches);
router.get('/team/:teamId', matchesController.getMatchesByTeam);

module.exports = router;
