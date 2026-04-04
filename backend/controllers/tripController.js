const Trip = require('../models/Trip');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.createTrip = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { start, destination } = req.body;

    // Mock route calculation (replace with real Google Directions API)
    const route = {
      totalDistance: '1050 km',
      stages: [
        { mode: 'Train', distance: '1000 km', duration: '16h', details: 'Delhi to Patna, IRCTC' },
        { mode: 'Bus', distance: '45 km', duration: '1h 30m', details: 'Patna to Vaishali Bus Stand' },
        { mode: 'Walk', distance: '5 km', duration: '1h', details: 'Walk to Vaishali site' },
      ],
    };

    const trip = new Trip({ userId: decoded.id, start, destination, route });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTrips = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const trips = await Trip.find({ userId: decoded.id });
    res.json(trips);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { destination } = req.query;
  try {
    // Use Google Places API for real recommendations
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
      params: {
        query: `cafes bars hotels in ${destination}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};