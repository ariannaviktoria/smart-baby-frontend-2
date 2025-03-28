import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { BabyProvider } from './src/contexts/BabyContext';
import { DailyRoutineProvider } from './src/contexts/DailyRoutineContext';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#5856D6',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <BabyProvider>
          <DailyRoutineProvider>
            <NavigationContainer>
              <AuthNavigator />
            </NavigationContainer>
          </DailyRoutineProvider>
        </BabyProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
