import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Text, useTheme, IconButton, Surface, Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBaby } from '../../contexts/BabyContext';
import { useDailyRoutineContext } from '../../contexts/DailyRoutineContext';

const AddActivityScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const { currentBaby } = useBaby();
  const { saveDailyRoutine } = useDailyRoutineContext();
  const [date] = useState(route.params?.date || new Date());
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [bedTime, setBedTime] = useState('20:00');
  const [napCount, setNapCount] = useState('2');
  const [feedingCount, setFeedingCount] = useState('5');
  const [notes, setNotes] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'wakeup' | 'bedtime' | null>(null);

  const handleSave = async () => {
    if (!currentBaby) {
      Alert.alert('Hiba', 'Nincs kiválasztva baba');
      return;
    }

    try {
      const napCountNum = parseInt(napCount);
      const feedingCountNum = parseInt(feedingCount);
      
      if (isNaN(napCountNum) || isNaN(feedingCountNum)) {
        Alert.alert('Hiba', 'Érvénytelen szám formátum az alvás vagy étkezés mezőben');
        return;
      }
      
      const dailyRoutineData = {
        babyId: currentBaby.id,
        date: date,
        wakeUpTime,
        bedTime,
        napCount: napCountNum,
        feedingCount: feedingCountNum,
        notes,
        isDefault: false,
      };
      
      await saveDailyRoutine(dailyRoutineData);
      Alert.alert('Sikeres mentés', 'A napi rutin sikeresen elmentve!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Hiba', error.message || 'Nem sikerült menteni a napi rutint');
      console.error('Napi rutin mentési hiba:', error);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const timeString = format(selectedDate, 'HH:mm');
      if (activeTimeField === 'wakeup') {
        setWakeUpTime(timeString);
      } else if (activeTimeField === 'bedtime') {
        setBedTime(timeString);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Új Tevékenység</Text>
      </View>

      <ScrollView style={styles.content}>
        <Surface style={styles.card}>
          <Text style={styles.dateText}>
            {format(date, 'yyyy. MMMM d.', { locale: hu })}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ébredés</Text>
            <Button
              mode="outlined"
              onPress={() => {
                setActiveTimeField('wakeup');
                setShowTimePicker(true);
              }}
              style={styles.timeButton}
            >
              {wakeUpTime}
            </Button>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Lefekvés</Text>
            <Button
              mode="outlined"
              onPress={() => {
                setActiveTimeField('bedtime');
                setShowTimePicker(true);
              }}
              style={styles.timeButton}
            >
              {bedTime}
            </Button>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alvások száma</Text>
            <TextInput
              mode="outlined"
              value={napCount}
              onChangeText={setNapCount}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Étkezések száma</Text>
            <TextInput
              mode="outlined"
              value={feedingCount}
              onChangeText={setFeedingCount}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Megjegyzések</Text>
            <TextInput
              mode="outlined"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>
        </Surface>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Mentés
        </Button>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${activeTimeField === 'wakeup' ? wakeUpTime : bedTime}:00`)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
  },
  timeButton: {
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    padding: 4,
  },
});

export default AddActivityScreen; 