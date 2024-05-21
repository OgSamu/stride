import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddFriendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Friends Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE0B5',
  },
  text: {
    fontSize: 20,
    color: '#242c40',
  },
});
