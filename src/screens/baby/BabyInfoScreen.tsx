import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, Text, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from '@react-native-material/core';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
  ZoomIn,
} from 'react-native-reanimated';
import { useBaby, Baby } from '../../contexts/BabyContext';

const BabyInfoScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { babies, getBabies, setCurrentBaby, isLoading, error } = useBaby();
  const scale = useSharedValue(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBabies();
  }, []);

  const fetchBabies = async () => {
    try {
      setRefreshing(true);
      await getBabies();
    } catch (error) {
      Alert.alert('Hiba', 'A babák lekérdezése során hiba történt. Kérlek próbáld újra.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleAddBaby = () => {
    setCurrentBaby(null);
    navigation.navigate('AddBaby');
  };

  const handleSelectBaby = (baby: Baby) => {
    setCurrentBaby(baby);
    navigation.navigate('BabyDetails', { babyId: baby.id });
  };

  const getAgeText = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const monthsDiff = today.getMonth() - birthDate.getMonth() + 
      (12 * (today.getFullYear() - birthDate.getFullYear()));
    
    if (monthsDiff < 1) {
      const daysDiff = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysDiff} napos`;
    } else if (monthsDiff < 24) {
      return `${monthsDiff} hónapos`;
    } else {
      const years = Math.floor(monthsDiff / 12);
      return `${years} éves`;
    }
  };

  const renderBabyItem = ({ item }: { item: Baby }) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(200).duration(500).springify()}
      >
        <TouchableOpacity
          onPress={() => handleSelectBaby(item)}
          style={styles.babyCard}
        >
          <View style={styles.babyIconContainer}>
            <MaterialCommunityIcons 
              name={item.gender === 'Male' ? 'baby-face-outline' : 'baby-face'} 
              size={40} 
              color={item.gender === 'Male' ? '#007AFF' : '#FF2D55'} 
            />
          </View>
          <View style={styles.babyInfo}>
            <Text style={styles.babyName}>{item.name}</Text>
            <Text style={styles.babyAge}>{getAgeText(item.dateOfBirth)}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#C7C7CC" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyList = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="baby-carriage" size={80} color="#C7C7CC" />
        <Text style={styles.emptyText}>Még nincs hozzáadott baba</Text>
        <Text style={styles.emptySubText}>Kattints a + gombra egy új baba hozzáadásához</Text>
      </View>
    );
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
            <Text style={styles.headerTitle}>Babáim</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={babies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBabyItem}
        contentContainerStyle={styles.listContent}
        onRefresh={fetchBabies}
        refreshing={refreshing}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Animated.View
        entering={ZoomIn.delay(500).duration(800)}
        style={styles.fabContainer}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddBaby}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  babyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  babyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    marginRight: 16,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  babyAge: {
    fontSize: 14,
    color: '#8E8E93',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 120,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginTop: 24,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fab: {
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BabyInfoScreen; 