import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import { Picker } from '@react-native-picker/picker';

export default function TrackScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [goalPace, setGoalPace] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [runDetails, setRunDetails] = useState({ type: '', notes: '' });
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (isTracking) {
      startTracking();
      startTimer();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isTracking]);

  const startTracking = async () => {
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        const { latitude, longitude, altitude } = newLocation.coords;
        const newCoords = { latitude, longitude };

        if (route.length > 0) {
          const lastCoords = route[route.length - 1];
          const dist = haversine(lastCoords, newCoords) / 1000; // distance in km
          setDistance((prevDistance) => prevDistance + dist);
        }

        setRoute((prevRoute) => [...prevRoute, newCoords]);
        setLocation(newLocation.coords);
        setElevation(altitude); // Update elevation

        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: newCoords,
            zoom: 15,
          });
        }
      }
    );
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startTimer = () => {
    setStartTime(new Date());
    timerInterval.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handleStartStopTracking = () => {
    if (isTracking) {
      setIsTracking(false);
    } else {
      setRoute([]);
      setDistance(0);
      setElapsedTime(0);
      setElevation(0);
      setStartTime(new Date());
      setIsTracking(true);
    }
  };

  const handleFinish = () => {
    setIsTracking(false);
    setModalVisible(true);
  };

  const handleSaveWorkout = () => {
    const workout = {
      distance: distance.toFixed(2),
      pace: getPace(),
      time: getDuration(),
      elevation: `${elevation.toFixed(2)} m`,
      ...runDetails,
    };
    navigation.navigate('Profile', { workout });
    setModalVisible(false);
    resetTrackingState();
  };

  const handleDiscardWorkout = () => {
    setModalVisible(false);
    resetTrackingState();
  };

  const resetTrackingState = () => {
    setRoute([]);
    setDistance(0);
    setElapsedTime(0);
    setElevation(0);
    setShowStats(false);
  };

  const getDuration = () => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = Math.floor(elapsedTime % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPace = () => {
    if (elapsedTime === 0 || distance === 0) return '0:00';
    const pace = elapsedTime / 60 / distance; // pace in minutes per km
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace % 1) * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getBackgroundColor = () => {
    if (!goalPace || getPace() === '0:00') return '#ffffff'; // Default color if no goal pace set or pace is zero
    const [goalMinutes, goalSeconds] = goalPace.split(':').map(Number);
    const goalPaceInSeconds = goalMinutes * 60 + goalSeconds;
    const [currentMinutes, currentSeconds] = getPace().split(':').map(Number);
    const currentPaceInSeconds = currentMinutes * 60 + currentSeconds;

    return currentPaceInSeconds <= goalPaceInSeconds ? 'green' : 'red';
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
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
        <Polyline coordinates={route} strokeWidth={5} />
      </MapView>
      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Distance</Text>
              <Text style={styles.statsValue}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Average Pace</Text>
              <Text style={styles.statsValue}>{getPace()} min/km</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Time</Text>
              <Text style={styles.statsValue}>{getDuration()}</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>Elevation</Text>
              <Text style={styles.statsValue}>{elevation.toFixed(2)} m</Text>
            </View>
          </View>
        </View>
      )}
      <View style={[styles.bottomContainer, { backgroundColor: getBackgroundColor() }]}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleStartStopTracking}>
            <Text style={styles.buttonText}>{isTracking ? 'Stop' : 'Start'} Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowStats(!showStats)}>
            <Text style={styles.buttonText}>Switch View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          {!isTracking && route.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Set Goal Pace</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>Set Goal Pace (m/km):</Text>
            <TextInput
              style={styles.goalPaceInput}
              keyboardType="numeric"
              placeholder="e.g. 5:30"
              value={goalPace}
              onChangeText={setGoalPace}
            />
            <Button
              title="Set Goal"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            /> */}
            <Text style={styles.modalText}>Run Details:</Text>
            <Picker
              selectedValue={runDetails.type}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setRunDetails({ ...runDetails, type: itemValue })
              }
            >
              <Picker.Item label="Select Run Type" value="" />
              <Picker.Item label="Night Run" value="Night Run" />
              <Picker.Item label="Day Run" value="Day Run" />
              <Picker.Item label="Fun Run" value="Fun Run" />
              <Picker.Item label="Jog" value="Jog" />
            </Picker>
            <TextInput
              style={styles.notesInput}
              placeholder="Add private notes about your run"
              value={runDetails.notes}
              onChangeText={(text) => setRunDetails({ ...runDetails, notes: text })}
              multiline
            />
            <View style={styles.modalButtonRow}>
              <Button
                title="Save Workout"
                onPress={handleSaveWorkout}
              />
              <Button
                title="Discard Workout"
                onPress={handleDiscardWorkout}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 7,  // 70% of the screen
  },
  statsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 16,
  },
  bottomContainer: {
    flex: 3,  // 30% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FFC55A',
    paddingVertical: 15,  // Vertical padding for the button
    paddingHorizontal: 20,  // Horizontal padding for the button
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalPaceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
