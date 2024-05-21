import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { fetchRoutes } from '../functions/fetchRoutes';

const RunningRoutesMap = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [distance, setDistance] = useState('');
  const [loopBack, setLoopBack] = useState(false);

  const fetchLocation = async (address) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: 'AIzaSyBSe4R3AB0n1_0Z0yfmmH42VfScy1Lg8PU',
        },
      });
      const location = response.data.results[0].geometry.location;
      setOrigin({ latitude: location.lat, longitude: location.lng });
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching location');
    }
  };

  const fetchAndDisplayRoutes = async () => {
    if (!origin) {
      Alert.alert('Please enter a location first');
      return;
    }

    let dest = origin;
    if (!loopBack && distance) {
      // Calculate a new destination based on the distance
      const rad = distance / 6371; // Distance in radians (assuming Earth's radius in km)
      const bearing = Math.random() * 2 * Math.PI; // Random bearing
      const lat = origin.latitude + rad * Math.cos(bearing);
      const lon = origin.longitude + rad * Math.sin(bearing);
      dest = { latitude: lat, longitude: lon };
    }

    const routes = await fetchRoutes(origin, dest, loopBack, distance);
    setRoutes(routes);
    setDestination(dest);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={locationInput}
        onChangeText={setLocationInput}
      />
      <Button
        title="Fetch Location"
        onPress={() => fetchLocation(locationInput)}
      />
      <Picker
        selectedValue={loopBack}
        onValueChange={(itemValue, itemIndex) => setLoopBack(itemValue)}
      >
        <Picker.Item label="Loop Back to Start" value={true} />
        <Picker.Item label="One Way" value={false} />
      </Picker>
      {!loopBack && (
        <TextInput
          style={styles.input}
          placeholder="Enter distance in km"
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
        />
      )}
      <Button
        title="Fetch Routes"
        onPress={fetchAndDisplayRoutes}
      />
      <MapView
        style={styles.map}
        region={origin ? {
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        } : null}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && !loopBack && <Marker coordinate={destination} />}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route.legs[0].steps.map(step => ({
              latitude: step.start_location.lat,
              longitude: step.start_location.lng,
            }))}
            strokeColor="#000"
            strokeWidth={6}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RunningRoutesMap;
