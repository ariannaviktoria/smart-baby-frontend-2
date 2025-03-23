import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import SleepTrackingScreen from '../screens/activities/SleepTrackingScreen';
import FeedingScreen from '../screens/activities/FeedingScreen';
import GrowthScreen from '../screens/activities/GrowthScreen';
import DailyActivitiesScreen from '../screens/activities/DailyActivitiesScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import AddBabyScreen from '../screens/baby/AddBabyScreen';
import BabyDetailsScreen from '../screens/baby/BabyDetailsScreen';
import EditBabyScreen from '../screens/baby/EditBabyScreen';
import BabyInfoScreen from '../screens/baby/BabyInfoScreen';


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
      <Stack.Screen name="DailyActivities" component={DailyActivitiesScreen} />
      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
      <Stack.Screen name="Feeding" component={FeedingScreen} />
      <Stack.Screen name="Growth" component={GrowthScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AddBaby" component={AddBabyScreen} />
      <Stack.Screen name="BabyDetails" component={BabyDetailsScreen} />
      <Stack.Screen name="EditBaby" component={EditBabyScreen} />
      <Stack.Screen name="BabyInfo" component={BabyInfoScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 