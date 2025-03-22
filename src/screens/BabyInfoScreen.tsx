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
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useBaby, Baby } from '../contexts/BabyContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const BabyInfoScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { currentBaby, createBaby, updateBaby, isLoading, error } = useBaby();
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (currentBaby) {
      setName(currentBaby.name);
      setDateOfBirth(new Date(currentBaby.dateOfBirth));
      setGender(currentBaby.gender);
    }
  }, [currentBaby]);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleSave = async () => {
    try {
      if (currentBaby) {
        await updateBaby(currentBaby.id, {
          name,
          dateOfBirth: dateOfBirth.toISOString(),
          gender,
        });
      } else {
        await createBaby({
          name,
          dateOfBirth: dateOfBirth.toISOString(),
          gender,
        });
      }
      Alert.alert('Siker', 'A baba adatai sikeresen mentve!');
    } catch (error) {
      Alert.alert('Hiba', 'A baba adatainak mentése során hiba történt. Kérlek próbáld újra.');
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
        entering={FadeInDown.duration(1000).springify()}
        style={styles.header}
      >
        <LinearGradient
          colors={['#f0f0f0', '#ffffff']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <IconButton
              icon="arrow-left"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Baba adatai</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Név</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Add meg a baba nevét"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nem</Text>
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
          </View>

          <Animated.View 
            entering={FadeInUp.delay(800).duration(1000).springify()}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
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
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
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
    marginTop: 20,
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

export default BabyInfoScreen; 