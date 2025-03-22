import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 