import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function RoutesScreen() {
  const [location, setLocation] = useState(null);
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchTrails(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchTrails = async (latitude, longitude) => {
    try {
      const response = await axios.post('https://e884-2001-56a-f933-f600-e129-7e00-8ec9-cf4a.ngrok-free.app/trails', {
        latitude,
        longitude,
      });

      setTrails(response.data);
    } catch (error) {
      console.error('Error fetching trails:', error);
      Alert.alert('Failed to fetch trails');
    }
  };

  const handleTrailSelect = (trail) => {
    setSelectedTrail(trail);
  };

  const renderTrailItem = ({ item }) => (
    <TouchableOpacity style={styles.trailItem} onPress={() => handleTrailSelect(item)}>
      <Text>{item.name}</Text>
      <Text>{item.details}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        showsUserLocation
      >
        {trails.map((trail, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: trail.location[1], longitude: trail.location[0] }}
            title={trail.name}
            description={trail.details}
            pinColor={selectedTrail && selectedTrail.name === trail.name ? 'red' : 'gray'}
          />
        ))}
      </MapView>
      <FlatList
        data={trails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTrailItem}
        ListEmptyComponent={<Text>No trails found</Text>}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  trailItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatList: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
