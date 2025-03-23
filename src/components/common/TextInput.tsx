import React, { forwardRef } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { TextInput as PaperInput, HelperText, useTheme } from 'react-native-paper';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  mode?: 'flat' | 'outlined';
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  placeholder?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

const TextInput = forwardRef<any, TextInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      style,
      inputStyle,
      mode = 'outlined',
      error,
      secureTextEntry = false,
      multiline = false,
      numberOfLines = 1,
      disabled = false,
      placeholder,
      left,
      right,
      autoCapitalize = 'none',
      keyboardType = 'default',
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <View style={[styles.container, style]}>
        <PaperInput
          ref={ref}
          label={label}
          value={value}
          onChangeText={onChangeText}
          mode={mode}
          style={[styles.input, inputStyle]}
          error={!!error}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          disabled={disabled}
          placeholder={placeholder}
          left={left}
          right={right}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          theme={{
            ...theme,
            colors: {
              ...theme.colors,
              background: mode === 'flat' ? 'transparent' : theme.colors.surface,
            }
          }}
        />
        {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default TextInput; 