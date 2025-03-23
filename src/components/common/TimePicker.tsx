import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TimePickerProps {
  time: string; // 'HH:mm' formátumban
  onTimeChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  is24Hour?: boolean;
  errorText?: string;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
  label = 'Időpont',
  placeholder = 'Válassz időpontot',
  is24Hour = true,
  errorText,
  disabled = false,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const theme = useTheme();

  // Konvertáljuk a string időt Date objektummá a TimePicker számára
  const timeToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
    return date;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedTime = format(selectedDate, 'HH:mm');
      onTimeChange(formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.onSurface }]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.timeButton,
          { borderColor: errorText ? theme.colors.error : theme.colors.outline },
          disabled && { opacity: 0.6 }
        ]}
        onPress={() => !disabled && setShowTimePicker(true)}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.timeText, 
            { color: time ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
            errorText && { color: theme.colors.error }
          ]}
        >
          {time || placeholder}
        </Text>
        <MaterialCommunityIcons 
          name="clock-outline" 
          size={20} 
          color={errorText ? theme.colors.error : theme.colors.onSurfaceVariant} 
        />
      </TouchableOpacity>
      
      {errorText && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errorText}
        </Text>
      )}

      {showTimePicker && (
        <DateTimePicker
          value={timeToDate(time || '00:00')}
          mode="time"
          is24Hour={is24Hour}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    height: 56,
  },
  timeText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TimePicker; 