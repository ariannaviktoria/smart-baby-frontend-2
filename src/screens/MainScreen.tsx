import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Text, useTheme, Surface, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const { width } = Dimensions.get('window');

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    // Indítjuk az animációkat amikor a képernyő betöltődik
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const menuItems = [
    {
      title: 'Baba Információk',
      icon: 'baby-face',
      color: '#FF69B4',
      onPress: () => navigation.navigate('BabyInfo'),
    },
    {
      title: 'Napi Tevékenységek',
      icon: 'calendar-check',
      color: '#87CEEB',
      onPress: () => navigation.navigate('DailyActivities'),
    },
    {
      title: 'Alvás Követés',
      icon: 'sleep',
      color: '#98FB98',
      onPress: () => navigation.navigate('SleepTracking'),
    },
    {
      title: 'Étkezés Követés',
      icon: 'food',
      color: '#FFB6C1',
      onPress: () => navigation.navigate('Feeding'),
    },
    {
      title: 'Növekedés Követés',
      icon: 'chart-line',
      color: '#DDA0DD',
      onPress: () => navigation.navigate('Growth'),
    },
    {
      title: 'Beállítások',
      icon: 'cog',
      color: '#A9A9A9',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

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
            <Text style={styles.headerTitle}>Smart Baby</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.statsContainer}
        >
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Mai Alvás</Text>
            <Text style={styles.statsValue}>2.5 óra</Text>
            <Text style={styles.statsSubtitle}>3 alvásidőszak</Text>
          </Surface>
          <Surface style={styles.statsCard}>
            <Text style={styles.statsTitle}>Mai Étkezések</Text>
            <Text style={styles.statsValue}>3</Text>
            <Text style={styles.statsSubtitle}>alkalom</Text>
          </Surface>
        </Animated.View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(400 + index * 100).duration(1000).springify()}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Animated.View style={[styles.menuItemCard, animatedStyle]}>
                  <View style={styles.menuItemContent}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={24}
                        color="#fff"
                      />
                    </View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
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
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    marginBottom: 12,
  },
  menuItemCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default MainScreen; 