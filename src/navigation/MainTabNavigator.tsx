import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MainScreen from '../screens/MainScreen';
import DailyActivitiesScreen from '../screens/activities/DailyActivitiesScreen';
import FeedingScreen from '../screens/activities/FeedingScreen';
import SleepTrackingScreen from '../screens/activities/SleepTrackingScreen';
import GrowthScreen from '../screens/activities/GrowthScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: 'Főoldal',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DailyActivities"
        component={DailyActivitiesScreen}
        options={{
          tabBarLabel: 'Napi rutin',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Feeding"
        component={FeedingScreen}
        options={{
          tabBarLabel: 'Étkezés',
          tabBarIcon: ({ color, size }) => (
            <Icon name="food" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sleep"
        component={SleepTrackingScreen}
        options={{
          tabBarLabel: 'Alvás',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sleep" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Growth"
        component={GrowthScreen}
        options={{
          tabBarLabel: 'Fejlődés',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Beállítások',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 