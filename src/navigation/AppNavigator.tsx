import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import { RootStackParamList } from './types';
import DailyActivitiesScreen from '../screens/activities/DailyActivitiesScreen';
import SleepTrackingScreen from '../screens/activities/SleepTrackingScreen';
import FeedingScreen from '../screens/activities/FeedingScreen';
import GrowthScreen from '../screens/activities/GrowthScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import EditBabyScreen from '../screens/baby/EditBabyScreen';


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="DailyActivities" component={DailyActivitiesScreen} />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="Feeding" component={FeedingScreen} />
      <Stack.Screen name="Growth" component={GrowthScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddBaby" component={AddBabyScreen} />
      <Stack.Screen name="BabyDetails" component={BabyDetailsScreen} />
      <Stack.Screen name="EditBaby" component={EditBabyScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 