import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton, Surface, FAB } from '@react-native-material/core';
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
  withTiming,
  Easing,
} from 'react-native-reanimated';

const FeedingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [feedingRecords, setFeedingRecords] = useState([
    {
      id: '1',
      time: new Date(),
      type: 'breast',
      duration: '15',
      side: 'left',
      notes: 'Jól evett',
    },
    // További rekordok...
  ]);

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleAddFeeding = () => {
    Alert.alert('Új étkezés', 'Szeretnél új étkezést rögzíteni?', [
      { text: 'Mégse', style: 'cancel' },
      { 
        text: 'Rögzítés', 
        onPress: () => {
          // TODO: Implement feeding tracking
          Alert.alert('Rögzítés', 'Az étkezés rögzítése hamarosan elérhető lesz!');
        }
      }
    ]);
  };

  const getFeedingTypeIcon = (type: string) => {
    switch (type) {
      case 'breast':
        return 'breast';
      case 'bottle':
        return 'bottle-tonic';
      case 'food':
        return 'food';
      default:
        return 'food';
    }
  };

  const getFeedingTypeColor = (type: string) => {
    switch (type) {
      case 'breast':
        return '#FF69B4';
      case 'bottle':
        return '#87CEEB';
      case 'food':
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
            <Text style={styles.headerTitle}>Étkezés Követés</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.statsContainer}
        >
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Mai Étkezések</Text>
            <Text style={styles.statsValue}>3</Text>
            <Text style={styles.statsSubtitle}>alkalom</Text>
          </Surface>
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Utolsó Étkezés</Text>
            <Text style={styles.statsValue}>2 óra</Text>
            <Text style={styles.statsSubtitle}>ezelőtt</Text>
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
                    name={getFeedingTypeIcon(record.type) as any}
                    size={24}
                    color={getFeedingTypeColor(record.type)}
                  />
                  <Text style={styles.recordDuration}>{record.duration} perc</Text>
                </View>
                <View style={styles.recordDetails}>
                  <Text style={styles.recordTime}>
                    {format(record.time, 'HH:mm', { locale: hu })}
                  </Text>
                  <Text style={styles.recordDate}>
                    {format(record.time, 'yyyy. MMMM d.', { locale: hu })}
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
          icon={(props) => <MaterialCommunityIcons name="plus" {...props} />}
          style={styles.fab}
          onPress={handleAddFeeding}
          color={theme.colors.primary}
        />
      </Animated.View>
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
});

export default FeedingScreen; 