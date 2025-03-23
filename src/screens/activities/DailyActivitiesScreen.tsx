import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Text, useTheme, Surface, IconButton, FAB, ActivityIndicator, Button, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useDailyRoutineContext } from '../../contexts/DailyRoutineContext';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import BabySelector from '../../components/baby/BabySelector';

const DailyActivitiesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { dailyRoutine, defaultRoutine, isLoading, error, loadDailyRoutine, loadDefaultRoutine } = useDailyRoutineContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadDailyRoutine(selectedDate);
    loadDefaultRoutine();
  }, [selectedDate]);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleAddActivity = () => {
    navigation.navigate('AddActivity', { date: selectedDate });
  };

  const handleActivityPress = (activity: any) => {
    navigation.navigate('ActivityDetails', { activity });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getActivitiesFromRoutine = () => {
    if (!dailyRoutine) return [];

    const activities = [];

    if (dailyRoutine.wakeUpTime) {
      activities.push({
        id: 'wakeup',
        type: 'wakeup',
        title: 'Ébredés',
        time: dailyRoutine.wakeUpTime,
        icon: 'weather-sunny',
        color: '#FFD700',
      });
    }

    if (dailyRoutine.napCount && dailyRoutine.napCount > 0) {
      activities.push({
        id: 'nap',
        type: 'sleep',
        title: 'Alvás',
        time: 'Napi alvások száma',
        duration: `${dailyRoutine.napCount}x`,
        icon: 'sleep',
        color: '#45B7D1',
      });
    }

    if (dailyRoutine.feedingCount && dailyRoutine.feedingCount > 0) {
      activities.push({
        id: 'feeding',
        type: 'feeding',
        title: 'Étkezés',
        time: 'Napi étkezések száma',
        duration: `${dailyRoutine.feedingCount}x`,
        icon: 'food',
        color: '#96CEB4',
      });
    }

    if (dailyRoutine.bedTime) {
      activities.push({
        id: 'bedtime',
        type: 'bedtime',
        title: 'Lefekvés',
        time: dailyRoutine.bedTime,
        icon: 'weather-night',
        color: '#4B0082',
      });
    }

    return activities;
  };

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
        <ScrollView style={styles.scrollView}>
          {/* Fejléc */}
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            style={styles.header}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Napi Tevékenységek</Text>
          </Animated.View>

          {/* Dátum kiválasztó */}
          <View style={styles.dateContainer}>
            <IconButton
              icon="chevron-left"
              onPress={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            />
            <Text style={styles.dateText}>
              {format(selectedDate, 'yyyy. MMMM d.', { locale: hu })}
            </Text>
            <IconButton
              icon="chevron-right"
              onPress={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            />
          </View>

          {/* Tevékenységek listája */}
          <View style={styles.activitiesContainer}>
            {getActivitiesFromRoutine().map((activity, index) => (
              <Animated.View
                key={activity.id}
                entering={FadeInUp.delay(200 + index * 100).duration(1000).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleActivityPress(activity)}
                >
                  <Animated.View style={[styles.activityCard, animatedStyle]}>
                    <Surface style={styles.activityCard}>
                      <LinearGradient
                        colors={[activity.color, `${activity.color}80`]}
                        style={styles.activityGradient}
                      >
                        <View style={styles.activityContent}>
                          <IconButton
                            icon={activity.icon}
                            size={32}
                            iconColor="#fff"
                            style={styles.activityIcon}
                          />
                          <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>{activity.title}</Text>
                            <Text style={styles.activityTime}>{activity.time}</Text>
                            {activity.duration && (
                              <Text style={styles.activityDuration}>{activity.duration}</Text>
                            )}
                          </View>
                        </View>
                      </LinearGradient>
                    </Surface>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Új tevékenység gomb */}
        <Animated.View 
          entering={FadeInUp.delay(800).duration(1000).springify()}
          style={styles.fabContainer}
        >
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={handleAddActivity}
            color="#fff"
            label="Új tevékenység"
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
  scrollView: {
    flex: 1,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
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
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  activitiesContainer: {
    padding: 16,
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityGradient: {
    padding: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    margin: 0,
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  fabContainer: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fab: {
    backgroundColor: '#007AFF',
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
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default DailyActivitiesScreen; 