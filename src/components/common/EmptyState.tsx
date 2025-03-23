import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: any;
  buttonText?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
}

const EmptyState = ({
  title,
  message,
  icon = 'information-outline',
  buttonText,
  onButtonPress,
  style,
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name={icon}
        size={80}
        color={theme.colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.backdrop }]}>{message}</Text>
      {buttonText && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.button}
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState; 