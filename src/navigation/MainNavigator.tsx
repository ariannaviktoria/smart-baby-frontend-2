import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import AddActivityScreen from '../screens/activities/AddActivityScreen';
import ActivityDetailsScreen from '../screens/activities/ActivityDetailsScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AddActivity" component={AddActivityScreen} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      {/* ... existing screens ... */}
    </Stack.Navigator>
  );
};

export default MainNavigator; 