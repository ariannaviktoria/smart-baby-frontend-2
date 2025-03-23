import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

interface LoadingIndicatorProps {
  text?: string;
  size?: 'small' | 'large';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = 'Betöltés...',
  size = 'large',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && <Text style={[styles.text, { color: theme.colors.primary }]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default LoadingIndicator; 