import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function ProfileScreen({ route }) {
  const [workouts, setWorkouts] = useState([]);

  React.useEffect(() => {
    if (route.params?.workout) {
      setWorkouts((prevWorkouts) => [...prevWorkouts, route.params.workout]);
    }
  }, [route.params?.workout]);

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutText}>Type: {item.type}</Text>
      <Text style={styles.workoutText}>Distance: {item.distance} km</Text>
      <Text style={styles.workoutText}>Pace: {item.pace} min/km</Text>
      <Text style={styles.workoutText}>Time: {item.time}</Text>
      <Text style={styles.workoutText}>Elevation: {item.elevation}</Text>
      <Text style={styles.workoutText}>Notes: {item.notes}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWorkoutItem}
        ListEmptyComponent={<Text>No workouts recorded yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  workoutItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  workoutText: {
    fontSize: 16,
  },
});
