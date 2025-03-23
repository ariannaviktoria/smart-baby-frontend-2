import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton, Surface, FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { feedingService, Feeding } from '../../services/feedingService';
import { useBaby } from '../../contexts/BabyContext';
import BabySelector from '../../components/baby/BabySelector';

const FeedingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { currentBaby } = useBaby();
  const [feedingRecords, setFeedingRecords] = useState<Feeding[]>([]);
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
    loadFeedingRecords();
  }, [currentBaby]);

  const loadFeedingRecords = async () => {
    if (!currentBaby) return;

    setIsLoading(true);
    setError(null);
    try {
      const records = await feedingService.getAllByBabyId(currentBaby.id);
      setFeedingRecords(records);
    } catch (err) {
      setError('Nem sikerült betölteni az étkezési adatokat');
      console.error('Hiba az étkezési adatok betöltésekor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeeding = async () => {
    if (!currentBaby) {
      Alert.alert('Hiba', 'Nincs kiválasztva baba');
      return;
    }

    Alert.alert('Új étkezés', 'Szeretnél új étkezést rögzíteni?', [
      { text: 'Mégse', style: 'cancel' },
      { 
        text: 'Rögzítés', 
        onPress: async () => {
          try {
            const newFeeding = await feedingService.create({
              babyId: currentBaby.id,
              startTime: new Date(),
              type: 'breast',
            });
            setFeedingRecords(prev => [...prev, newFeeding]);
          } catch (err) {
            Alert.alert('Hiba', 'Nem sikerült rögzíteni az étkezést');
          }
        }
      }
    ]);
  };

  const getFeedingTypeIcon = (type: string) => {
    switch (type) {
      case 'breast':
        return 'baby-bottle-outline' as const;
      case 'bottle':
        return 'bottle-tonic' as const;
      case 'solid':
        return 'food' as const;
      default:
        return 'food' as const;
    }
  };

  const getFeedingTypeColor = (type: string) => {
    switch (type) {
      case 'breast':
        return '#FF69B4';
      case 'bottle':
        return '#87CEEB';
      case 'solid':
        return '#98FB98';
      default:
        return '#2196F3';
    }
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
                <Text style={styles.headerTitle}>Étkezés Követés</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(200).duration(1000).springify()}
            style={styles.statsContainer}
          >
            <Surface style={styles.statsCard}>
              <Text style={styles.statsTitle}>Mai Étkezések</Text>
              <Text style={styles.statsValue}>
                {feedingRecords.filter(record => 
                  format(new Date(record.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ).length}
              </Text>
              <Text style={styles.statsSubtitle}>alkalom</Text>
            </Surface>
            <Surface style={styles.statsCard}>
              <Text style={styles.statsTitle}>Utolsó Étkezés</Text>
              <Text style={styles.statsValue}>
                {feedingRecords.length > 0 
                  ? format(new Date(feedingRecords[0].startTime), 'HH:mm', { locale: hu })
                  : 'Nincs adat'}
              </Text>
              <Text style={styles.statsSubtitle}>
                {feedingRecords.length > 0 && 'óra'}
              </Text>
            </Surface>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(400).duration(1000).springify()}
            style={styles.recordsContainer}
          >
            <Text style={styles.sectionTitle}>Étkezések</Text>
            {feedingRecords.map((record, index) => (
              <Animated.View
                key={record.id}
                entering={FadeInUp.delay(600 + index * 100).duration(1000).springify()}
              >
                <Surface style={[styles.recordCard, animatedStyle]}>
                  <View style={styles.recordHeader}>
                    <MaterialCommunityIcons
                      name={getFeedingTypeIcon(record.type)}
                      size={24}
                      color={getFeedingTypeColor(record.type)}
                    />
                    <Text style={styles.recordDuration}>
                      {record.endTime 
                        ? `${Math.round((new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / (1000 * 60))} perc`
                        : 'Folyamatban...'}
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
            onPress={handleAddFeeding}
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
    color: 'red',
    margin: 16,
  },
});

export default FeedingScreen; 