import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Import icons from @expo/vector-icons
import { StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import RoutesScreen from '../screens/RoutesScreen';
import TrackScreen from '../screens/TrackScreen';
import GroupsScreen from '../screens/GroupsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 10,
    paddingBottom: 40,
    height: 90,  // Adjust height to accommodate padding
  },
  iconStyle: {
    marginTop: 2,  // Adjust icon margin if needed
  }
});

export default function Router() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Routes') {
            iconName = 'map';
          } else if (route.name === 'Track') {
            iconName = 'navigate';
          } else if (route.name === 'Groups') {
            iconName = 'people';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <View style={styles.iconStyle}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen name="Track" component={TrackScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
