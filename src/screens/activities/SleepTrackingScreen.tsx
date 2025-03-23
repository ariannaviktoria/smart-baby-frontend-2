import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { FAB, IconButton, Surface, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { sleepService, SleepPeriod } from '../../services/sleepService';
import { useBaby } from '../../contexts/BabyContext';
import BabySelector from '../../components/baby/BabySelector';

const SleepTrackingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { currentBaby } = useBaby();
  const [sleepRecords, setSleepRecords] = useState<SleepPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  useEffect(() => {
    loadSleepRecords();
  }, [currentBaby]);

  const loadSleepRecords = async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const records = await sleepService.getAllByBabyId(currentBaby.id);
      setSleepRecords(records);
    } catch (err) {
      setError('Nem sikerült betölteni az alvási adatokat');
      console.error('Hiba az alvási adatok betöltésekor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSleep = async () => {
    if (!currentBaby) {
      Alert.alert('Hiba', 'Nincs kiválasztva baba');
      return;
    }

    Alert.alert('Új alvás', 'Szeretnél új alvás rekordot rögzíteni?', [
      { text: 'Mégse', style: 'cancel' },
      { 
        text: 'Rögzítés', 
        onPress: async () => {
          try {
            const newSleep = await sleepService.create({
              babyId: currentBaby.id,
              startTime: new Date(),
              quality: 'good',
            });
            setSleepRecords(prev => [...prev, newSleep]);
          } catch (err) {
            Alert.alert('Hiba', 'Nem sikerült rögzíteni az alvást');
          }
        }
      }
    ]);
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'good':
        return 'sleep';
      case 'fair':
        return 'sleep-off';
      case 'poor':
        return 'sleep-off';
      default:
        return 'sleep';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good':
        return '#4CAF50';
      case 'fair':
        return '#FFC107';
      case 'poor':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const calculateDuration = (startTime: Date, endTime?: Date) => {
    if (!endTime) return null;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    return Math.round(diff / (1000 * 60 * 60) * 10) / 10; // órákban, 1 tizedesjegyre kerekítve
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BabySelector />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
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
                <Text style={styles.headerTitle}>Alvás Követés</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(200).duration(1000).springify()}
            style={styles.statsContainer}
          >
            <Surface style={styles.statsCard}>
              <Text style={styles.statsTitle}>Mai Alvás</Text>
              <Text style={styles.statsValue}>
                {sleepRecords
                  .filter(record => format(new Date(record.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                  .reduce((acc, curr) => acc + (calculateDuration(curr.startTime, curr.endTime) || 0), 0)
                  .toFixed(1)} óra
              </Text>
              <Text style={styles.statsSubtitle}>
                {sleepRecords.filter(record => 
                  format(new Date(record.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ).length} alvásidőszak
              </Text>
            </Surface>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(400).duration(1000).springify()}
            style={styles.recordsContainer}
          >
            <Text style={styles.sectionTitle}>Alvásidőszakok</Text>
            {sleepRecords.map((record, index) => (
              <Animated.View
                key={record.id}
                entering={FadeInUp.delay(600 + index * 100).duration(1000).springify()}
              >
                <Surface style={[styles.recordCard, animatedStyle]}>
                  <View style={styles.recordHeader}>
                    <MaterialCommunityIcons
                      name={getQualityIcon(record.quality || 'good')}
                      size={24}
                      color={getQualityColor(record.quality || 'good')}
                    />
                    <Text style={styles.recordDuration}>
                      {calculateDuration(record.startTime, record.endTime)?.toFixed(1) || '?'} óra
                    </Text>
                  </View>
                  <View style={styles.recordDetails}>
                    <Text style={styles.recordTime}>
                      {format(new Date(record.startTime), 'HH:mm', { locale: hu })}
                      {record.endTime && ` - ${format(new Date(record.endTime), 'HH:mm', { locale: hu })}`}
                    </Text>
                    <Text style={styles.recordDate}>
                      {format(new Date(record.startTime), 'yyyy. MMMM d.', { locale: hu })}
                    </Text>
                  </View>
                  {record.notes && (
                    <Text style={styles.recordNotes}>{record.notes}</Text>
                  )}
                </Surface>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>

        <Animated.View 
          entering={FadeInUp.delay(800).duration(1000).springify()}
          style={styles.fabContainer}
        >
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={handleAddSleep}
            color={theme.colors.primary}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recordsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  recordCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDuration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  recordDetails: {
    marginBottom: 8,
  },
  recordTime: {
    fontSize: 16,
    color: '#000',
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  fabContainer: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab: {
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f00',
    margin: 16,
  },
});

export default SleepTrackingScreen; 