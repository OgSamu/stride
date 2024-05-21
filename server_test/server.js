const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
import Constants from 'expo-constants';

const googleApiKey = Constants.expoConfig.extra.googleApiKey;


// Mapbox API access token
const MAPBOX_API_KEY = googleApiKey.MAPBOX_API_KEY;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to fetch nearby trails
app.post('/trails', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/trail.json`, {
      params: {
        proximity: `${longitude},${latitude}`,
        access_token: MAPBOX_API_KEY,
        types: 'poi',
        limit: 10,
      },
    });

    const trails = response.data.features.map((trail) => ({
      name: trail.text,
      location: trail.geometry.coordinates,
      details: trail.place_name,
    }));

    res.json(trails);
  } catch (error) {
    console.error('Error fetching trails:', error);
    res.status(500).json({ error: 'Failed to fetch trails' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
