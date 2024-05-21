import axios from 'axios';
import Constants from 'expo-constants';

const GOOGLE_API_KEY = Constants.expoConfig.extra.googleApiKey;

export const fetchDirections = async (origin, destination) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
      params: {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode: 'walking', // Mode of transport
        key: GOOGLE_API_KEY,
      },
    });
    return response.data.routes[0].overview_polyline.points;
  } catch (error) {
    console.error('Error fetching directions:', error);
    return '';
  }
};
