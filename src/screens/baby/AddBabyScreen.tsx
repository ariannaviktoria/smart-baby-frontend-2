import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, TextInput, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton, Button } from '@react-native-material/core';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useBaby } from '../../contexts/BabyContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddBabyScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { createBaby, isLoading, error } = useBaby();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Figyelmeztetés', 'Kérjük add meg a baba nevét!');
        return;
      }

      if (name.trim().length > 100) {
        Alert.alert('Figyelmeztetés', 'A baba neve nem lehet hosszabb 100 karakternél!');
        return;
      }

      await createBaby({
        name: name.trim(),
        dateOfBirth: dateOfBirth.toISOString(),
        gender: gender,
      });
      
      Alert.alert('Siker', 'Az új baba sikeresen hozzáadva!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Create baby error:', error.response?.data);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        Alert.alert('Hiba', errorMessages);
      } else if (error.response?.data?.message) {
        Alert.alert('Hiba', error.response.data.message);
      } else {
        Alert.alert('Hiba', 'Hiba történt a mentés során. Kérlek próbáld újra.');
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={styles.header}
      >
        <LinearGradient
          colors={['#f0f0f0', '#ffffff']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <IconButton
              icon="close"
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            />
            <Text style={styles.headerTitle}>Új baba hozzáadása</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800).springify()}
          style={styles.formContainer}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Alapadatok</Text>
            <Text style={styles.sectionDescription}>Add meg a baba nevét és születési idejét</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Név</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Add meg a baba nevét"
              placeholderTextColor="#8E8E93"
              autoFocus
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Születési dátum</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dateOfBirth.toLocaleDateString('hu-HU')}
              </Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDateOfBirth(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Nem</Text>
            <Text style={styles.sectionDescription}>Válaszd ki a baba nemét</Text>
          </View>

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'Male' && styles.genderButtonActive
              ]}
              onPress={() => setGender('Male')}
            >
              <MaterialCommunityIcons
                name="gender-male"
                size={24}
                color={gender === 'Male' ? '#fff' : '#666'}
              />
              <Text style={[
                styles.genderButtonText,
                gender === 'Male' && styles.genderButtonTextActive
              ]}>Fiú</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'Female' && styles.genderButtonActive
              ]}
              onPress={() => setGender('Female')}
            >
              <MaterialCommunityIcons
                name="gender-female"
                size={24}
                color={gender === 'Female' ? '#fff' : '#666'}
              />
              <Text style={[
                styles.genderButtonText,
                gender === 'Female' && styles.genderButtonTextActive
              ]}>Lány</Text>
            </TouchableOpacity>
          </View>

          <Animated.View 
            entering={FadeInUp.delay(600).duration(800).springify()}
            style={styles.buttonContainer}
          >
            <Button
              title="Mentés"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
              titleStyle={styles.saveButtonText}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
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
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  genderButtonActive: {
    backgroundColor: '#007AFF',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBabyScreen; 