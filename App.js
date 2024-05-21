

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { Pedometer } from 'expo-sensors';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// const App = () => {
//   const [location, setLocation] = useState(null);
//   const [route, setRoute] = useState([]);
//   const [distance, setDistance] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [movingTime, setMovingTime] = useState(0);
//   const [steps, setSteps] = useState(0);
//   const [elevationGain, setElevationGain] = useState(0);
//   const [elevationData, setElevationData] = useState([]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.error('Permission to access location was denied');
//         return;
//       }

//       const locationSubscription = await Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
//         (loc) => {
//           const { latitude, longitude, altitude } = loc.coords;
//           setLocation(loc.coords);

//           // Calculate distance
//           if (route.length > 0) {
//             const lastPoint = route[route.length - 1];
//             const distanceIncrement = getDistanceFromLatLonInKm(
//               lastPoint.latitude,
//               lastPoint.longitude,
//               latitude,
//               longitude
//             );
//             setDistance((prevDistance) => prevDistance + distanceIncrement);

//             // Calculate elevation gain
//             const lastAltitude = elevationData[elevationData.length - 1];
//             if (altitude > lastAltitude) {
//               setElevationGain((prevElevation) => prevElevation + (altitude - lastAltitude));
//             }
//             setElevationData((prevData) => [...prevData, altitude]);
//           } else {
//             setStartTime(new Date());
//             setElevationData([altitude]);
//           }

//           setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
//         }
//       );

//       const pedometerSubscription = Pedometer.watchStepCount((result) => {
//         setSteps(result.steps);
//       });

//       return () => {
//         locationSubscription.remove();
//         pedometerSubscription.remove();
//       };
//     })();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (startTime) {
//         setMovingTime(Math.floor((new Date() - startTime) / 1000));
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [startTime]);

//   const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the earth in km
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c; // Distance in km
//     return distance;
//   };

//   const deg2rad = (deg) => {
//     return deg * (Math.PI / 180);
//   };

//   const calculatePace = () => {
//     if (movingTime > 0) {
//       return (distance / (movingTime / 3600)).toFixed(2); // pace in km/h
//     }
//     return 0;
//   };

//   return (
//     <SafeAreaProvider>
//     <SafeAreaView style={{ flex: 1 }}>
//       <View>
        
//          <MapView
//           style={{ alignSelf: 'stretch', height: '70%' }}
//           initialRegion={{
//             latitude: location ? location.latitude : 37.78825,
//             longitude: location ? location.longitude : -122.4324,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
//           {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />}
//         </MapView>
//         <View style={styles.statsContainer}>
//           <Text style={styles.statsText}>Distance: {distance.toFixed(2)} km</Text>
//           <Text style={styles.statsText}>Time: {movingTime} sec</Text>
//           <Text style={styles.statsText}>Avg Pace: {calculatePace()} km/h</Text>
//           <Text style={styles.statsText}>Elevation Gain: {elevationGain.toFixed(2)} m</Text>
//           <Text style={styles.statsText}>Steps: {steps}</Text>
//         </View> 
//       </View>
//     </SafeAreaView>
//   </SafeAreaProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   statsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statsText: {
//     fontSize: 18,
//     margin: 5,
//   },
// });



import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './navigation/Router';

export default function App() {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}
