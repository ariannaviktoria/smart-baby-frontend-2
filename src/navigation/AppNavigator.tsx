import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import BabyInfoScreen from '../screens/BabyInfoScreen';
import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';
import SleepTrackingScreen from '../screens/SleepTrackingScreen';
import FeedingScreen from '../screens/FeedingScreen';
import GrowthScreen from '../screens/GrowthScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="BabyInfo" component={BabyInfoScreen} />
      <Stack.Screen name="DailyActivities" component={DailyActivitiesScreen} />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="Feeding" component={FeedingScreen} />
      <Stack.Screen name="Growth" component={GrowthScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 