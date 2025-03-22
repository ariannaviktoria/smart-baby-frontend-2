import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import BabyInfoScreen from '../screens/BabyInfoScreen';
import DailyActivitiesScreen from '../screens/DailyActivitiesScreen';
import SleepTrackingScreen from '../screens/SleepTrackingScreen';
import FeedingScreen from '../screens/FeedingScreen';
import GrowthScreen from '../screens/GrowthScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="BabyInfo" component={BabyInfoScreen} />
      <Stack.Screen name="DailyActivities" component={DailyActivitiesScreen} />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="Feeding" component={FeedingScreen} />
      <Stack.Screen name="Growth" component={GrowthScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 