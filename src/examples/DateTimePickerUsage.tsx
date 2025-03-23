import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePicker, TimePicker, PageHeader, Button } from '../components';

const DateTimePickerUsage = ({ navigation }: any) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [dateError, setDateError] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');

  const validateInputs = () => {
    let isValid = true;

    // Ellenőrzöm, hogy a kiválasztott dátum nem-e a jövőben van
    if (selectedDate > new Date()) {
      setDateError('A dátum nem lehet jövőbeli!');
      isValid = false;
    } else {
      setDateError('');
    }

    // Ellenőrzöm az időpontot (például munkaidőben kell lennie)
    const [hours] = selectedTime.split(':').map(Number);
    if (hours < 8 || hours > 18) {
      setTimeError('Az időpont 8:00 és 18:00 között kell lennie!');
      isValid = false;
    } else {
      setTimeError('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      // Itt tovább lehet küldeni az adatokat
      alert(`Sikeres mentés: ${selectedDate.toLocaleDateString()} ${selectedTime}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        title="Dátum és Idő Választás" 
        onRightIconPress={handleSubmit}
        rightIcon="check"
      />

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>DatePicker Példa</Text>
          
          <DatePicker
            label="Válassz egy dátumot"
            date={selectedDate}
            onDateChange={setSelectedDate}
            errorText={dateError}
            maximumDate={new Date()} // Csak múltbeli és mai dátum választható
          />
          
          <View style={styles.spacer} />
          
          <TimePicker
            label="Válassz egy időpontot"
            time={selectedTime}
            onTimeChange={setSelectedTime}
            errorText={timeError}
          />
          
          <View style={styles.spacer} />
          
          <Button mode="contained" onPress={handleSubmit}>
            Adatok elküldése
          </Button>
        </Surface>
        
        <Surface style={[styles.card, styles.resultCard]}>
          <Text style={styles.resultTitle}>Kiválasztott értékek:</Text>
          <Text style={styles.resultText}>
            Dátum: {selectedDate.toLocaleDateString('hu-HU')}
          </Text>
          <Text style={styles.resultText}>
            Időpont: {selectedTime}
          </Text>
        </Surface>
        
        <Surface style={styles.card}>
          <Text style={styles.cardTitle}>Más beállítási lehetőségek</Text>
          
          <DatePicker
            label="Korlátozott tartomány"
            date={new Date()}
            onDateChange={() => {}}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2025, 11, 31)}
          />
          
          <View style={styles.spacer} />
          
          <TimePicker
            label="12 órás formátum"
            time="14:30"
            onTimeChange={() => {}}
            is24Hour={false}
          />
          
          <View style={styles.spacer} />
          
          <DatePicker
            label="Letiltott állapot"
            date={new Date()}
            onDateChange={() => {}}
            disabled={true}
          />
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  spacer: {
    height: 16,
  },
  resultCard: {
    backgroundColor: '#e8f4fd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default DateTimePickerUsage; 