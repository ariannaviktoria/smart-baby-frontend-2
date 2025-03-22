import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Text, useTheme, Surface, IconButton, FAB } from 'react-native-paper';
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

const DailyActivitiesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [activities] = useState([
    {
      id: 1,
      type: 'sleep',
      title: 'Alvás',
      time: '09:00 - 10:30',
      duration: '1.5 óra',
      icon: 'sleep',
      color: '#45B7D1',
    },
    {
      id: 2,
      type: 'feeding',
      title: 'Étkezés',
      time: '10:45',
      duration: '15 perc',
      icon: 'food',
      color: '#96CEB4',
    },
    {
      id: 3,
      type: 'diaper',
      title: 'Pelenka',
      time: '11:00',
      duration: '5 perc',
      icon: 'baby',
      color: '#FFB6B9',
    },
    {
      id: 4,
      type: 'bath',
      title: 'Fürdés',
      time: '11:30',
      duration: '10 perc',
      icon: 'water',
      color: '#4ECDC4',
    },
  ]);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleAddActivity = () => {
    // TODO: Implement add activity functionality
    Alert.alert('Új tevékenység', 'Új tevékenység hozzáadása...');
  };

  const handleActivityPress = (activity: any) => {
    // TODO: Implement activity details view
    Alert.alert(activity.title, `Idő: ${activity.time}\nIdőtartam: ${activity.duration}`);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
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

        {/* Tevékenységek listája */}
        <View style={styles.activitiesContainer}>
          {activities.map((activity, index) => (
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
                          <Text style={styles.activityDuration}>{activity.duration}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
});

export default DailyActivitiesScreen; 