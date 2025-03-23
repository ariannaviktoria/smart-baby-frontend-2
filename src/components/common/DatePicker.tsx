import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  formatPattern?: string;
  errorText?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  label = 'Dátum',
  placeholder = 'Válassz dátumot',
  minimumDate,
  maximumDate,
  formatPattern = 'yyyy. MMMM d.',
  errorText,
  disabled = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const theme = useTheme();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const formattedDate = date ? format(date, formatPattern, { locale: hu }) : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.onSurface }]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.dateButton,
          { borderColor: errorText ? theme.colors.error : theme.colors.outline },
          disabled && { opacity: 0.6 }
        ]}
        onPress={() => !disabled && setShowDatePicker(true)}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.dateText, 
            { color: date ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
            errorText && { color: theme.colors.error }
          ]}
        >
          {formattedDate}
        </Text>
        <MaterialCommunityIcons 
          name="calendar" 
          size={20} 
          color={errorText ? theme.colors.error : theme.colors.onSurfaceVariant} 
        />
      </TouchableOpacity>
      
      {errorText && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errorText}
        </Text>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    height: 56,
  },
  dateText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default DatePicker; 