import axios from 'axios';

export const fetchRoutes = async (origin, destination, loopBack, distance) => {
  let destinationStr = `${destination.latitude},${destination.longitude}`;
  if (loopBack) {
    // If looping back, set the destination to the origin
    destinationStr = `${origin.latitude},${origin.longitude}`;
  }

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
      params: {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: destinationStr,
        key: 'AIzaSyBSe4R3AB0n1_0Z0yfmmH42VfScy1Lg8PU',
      },
    });
    return response.data.routes;
  } catch (error) {
    console.error(error);
    return [];
  }
};
