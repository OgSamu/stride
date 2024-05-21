import axios from 'axios';
import Constants from 'expo-constants';

const MAPBOX_API_KEY = Constants.expoConfig.extra.mapboxApiKey;

export const fetchNearbyTrails = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/trail.json`, {
      params: {
        proximity: `${longitude},${latitude}`,
        access_token: MAPBOX_API_KEY,
        types: 'poi',
        limit: 10,
        radius: 2000, // 2 km radius
      },
    });
    console.log('API Response:', response.data);
    return response.data.features.map((trail) => {
      if (trail.geometry && trail.geometry.coordinates) {
        return {
          name: trail.text,
          location: trail.geometry.coordinates,
          details: trail.place_name,
        };
      }
      return null;
    }).filter(trail => trail !== null);
  } catch (error) {
    console.error('Error fetching nearby trails:', error);
    return [];
  }
};
