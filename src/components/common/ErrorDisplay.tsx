import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon, useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const theme = useTheme();

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Icon 
        source="alert-circle-outline" 
        size={48} 
        color={theme.colors.error} 
      />
      <Text style={[styles.errorText, { color: theme.colors.error }]}>
        {error}
      </Text>
      {onRetry && (
        <Button 
          mode="contained" 
          onPress={onRetry} 
          style={styles.retryButton}
          icon="refresh"
        >
          Újrapróbálás
        </Button>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorDisplay; 