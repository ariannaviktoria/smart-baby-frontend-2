import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: any;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  children: React.ReactNode;
  color?: string;
}

const Button = ({
  mode = 'contained',
  onPress,
  style,
  labelStyle,
  loading = false,
  disabled = false,
  icon,
  children,
  color,
}: ButtonProps) => {
  const theme = useTheme();
  
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      loading={loading}
      disabled={disabled}
      icon={icon}
      color={color || theme.colors.primary}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Button; 