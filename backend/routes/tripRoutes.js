const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

router.post('/create', tripController.createTrip);
router.get('/list', tripController.getTrips);
router.get('/recommendations', tripController.getRecommendations);

module.exports = router;