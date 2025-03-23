import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { IconButton, Surface, FAB, ActivityIndicator } from 'react-native-paper';
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
import { growthService, Growth } from '../../services/growthService';
import { useBaby } from '../../contexts/BabyContext';
import BabySelector from '../../components/baby/BabySelector';

const GrowthScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { currentBaby } = useBaby();
  const [growthRecords, setGrowthRecords] = useState<Growth[]>([]);
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
    loadGrowthRecords();
  }, [currentBaby]);

  const loadGrowthRecords = async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const records = await growthService.getAllByBabyId(currentBaby.id);
      setGrowthRecords(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setError('Nem sikerült betölteni a növekedési adatokat');
      console.error('Hiba a növekedési adatok betöltésekor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGrowth = async () => {
    if (!currentBaby) {
      Alert.alert('Hiba', 'Nincs kiválasztva baba');
      return;
    }

    Alert.alert('Új mérés', 'Szeretnél új növekedési adatot rögzíteni?', [
      { text: 'Mégse', style: 'cancel' },
      { 
        text: 'Rögzítés', 
        onPress: async () => {
          try {
            const newGrowth = await growthService.create({
              babyId: currentBaby.id,
              date: new Date(),
            });
            setGrowthRecords(prev => [newGrowth, ...prev]);
          } catch (err) {
            Alert.alert('Hiba', 'Nem sikerült rögzíteni a mérést');
          }
        }
      }
    ]);
  };

  const getLatestRecord = () => {
    return growthRecords[0];
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

  const latestRecord = getLatestRecord();

  return (
    <View style={styles.container}>
      <BabySelector />
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
              <Text style={styles.headerTitle}>Növekedés Követés</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.statsContainer}
        >
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Utolsó Súly</Text>
            <Text style={styles.statsValue}>
              {latestRecord?.weight ? `${latestRecord.weight} kg` : 'Nincs adat'}
            </Text>
            <Text style={styles.statsSubtitle}>
              {latestRecord?.date ? format(new Date(latestRecord.date), 'yyyy. MM. dd.', { locale: hu }) : ''}
            </Text>
          </Surface>
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Utolsó Magasság</Text>
            <Text style={styles.statsValue}>
              {latestRecord?.height ? `${latestRecord.height} cm` : 'Nincs adat'}
            </Text>
            <Text style={styles.statsSubtitle}>
              {latestRecord?.date ? format(new Date(latestRecord.date), 'yyyy. MM. dd.', { locale: hu }) : ''}
            </Text>
          </Surface>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={styles.recordsContainer}
        >
          <Text style={styles.sectionTitle}>Növekedési Adatok</Text>
          {growthRecords.map((record, index) => (
            <Animated.View
              key={record.id}
              entering={FadeInUp.delay(600 + index * 100).duration(1000).springify()}
            >
              <Surface style={[styles.recordCard, animatedStyle]}>
                <View style={styles.recordHeader}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={24}
                    color="#2196F3"
                  />
                  <Text style={styles.recordDate}>
                    {format(new Date(record.date), 'yyyy. MMMM d.', { locale: hu })}
                  </Text>
                </View>
                <View style={styles.recordDetails}>
                  {record.weight && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Súly:</Text>
                      <Text style={styles.recordValue}>{record.weight} kg</Text>
                    </View>
                  )}
                  {record.height && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Magasság:</Text>
                      <Text style={styles.recordValue}>{record.height} cm</Text>
                    </View>
                  )}
                  {record.headCircumference && (
                    <View style={styles.recordItem}>
                      <Text style={styles.recordLabel}>Fejkerület:</Text>
                      <Text style={styles.recordValue}>{record.headCircumference} cm</Text>
                    </View>
                  )}
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
          onPress={handleAddGrowth}
          color={theme.colors.primary}
        />
      </Animated.View>
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
    marginBottom: 12,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  recordDetails: {
    marginBottom: 8,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordLabel: {
    fontSize: 16,
    color: '#666',
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  recordNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
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
    color: 'red',
    margin: 16,
  },
});

export default GrowthScreen; 