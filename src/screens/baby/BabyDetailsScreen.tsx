import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useBaby, Baby } from '../../contexts/BabyContext';

const BabyDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentBaby, getBaby, deleteBaby, isLoading } = useBaby();
  const scale = useSharedValue(1);

  const babyId = route.params?.babyId;

  useEffect(() => {
    if (babyId) {
      loadBabyDetails();
    }
  }, [babyId]);

  const loadBabyDetails = async () => {
    try {
      await getBaby(babyId);
    } catch (error) {
      Alert.alert('Hiba', 'A baba adatainak lekérdezése során hiba történt.');
      navigation.goBack();
    }
  };

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

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

  const handleEditBaby = () => {
    navigation.navigate('EditBaby', { babyId: currentBaby?.id });
  };

  const handleDeleteBaby = () => {
    Alert.alert(
      'Megerősítés',
      'Biztosan törölni szeretnéd ezt a babát? Ez a művelet nem visszavonható.',
      [
        { text: 'Mégsem', style: 'cancel' },
        {
          text: 'Törlés',
          onPress: async () => {
            try {
              if (currentBaby) {
                await deleteBaby(currentBaby.id);
                Alert.alert('Siker', 'A baba sikeresen törölve!');
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Hiba', 'A baba törlése során hiba történt.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!currentBaby) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Betöltés...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              icon="arrow-left"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Baba adatai</Text>
            <IconButton
              icon="dots-vertical"
              onPress={() => {
                Alert.alert(
                  'Műveletek',
                  'Válassz műveletet',
                  [
                    { text: 'Szerkesztés', onPress: handleEditBaby },
                    { text: 'Törlés', onPress: handleDeleteBaby, style: 'destructive' },
                    { text: 'Mégsem', style: 'cancel' },
                  ]
                );
              }}
              style={styles.menuButton}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800).springify()}
          style={styles.profileContainer}
        >
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons 
              name={currentBaby.gender === 'Male' ? 'baby-face-outline' : 'baby-face'} 
              size={60} 
              color={currentBaby.gender === 'Male' ? '#007AFF' : '#FF2D55'} 
            />
          </View>
          <Text style={styles.babyName}>{currentBaby.name}</Text>
          <Text style={styles.babyAge}>{getAgeText(currentBaby.dateOfBirth)}</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(400).duration(800).springify()}
          style={styles.infoCard}
        >
          <Text style={styles.sectionTitle}>Alapadatok</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="cake-variant" size={24} color="#8E8E93" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Születési dátum</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentBaby.dateOfBirth).toLocaleDateString('hu-HU')}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons 
                name={currentBaby.gender === 'Male' ? 'gender-male' : 'gender-female'} 
                size={24} 
                color="#8E8E93" 
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nem</Text>
                <Text style={styles.infoValue}>
                  {currentBaby.gender === 'Male' ? 'Fiú' : 'Lány'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(600).duration(800).springify()}
          style={styles.buttonContainer}
        >
          <Button
            title="Szerkesztés"
            onPress={handleEditBaby}
            style={styles.editButton}
            titleStyle={styles.editButtonText}
            leading={props => <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />}
          />
          
          <Button
            title="Törlés"
            onPress={handleDeleteBaby}
            style={styles.deleteButton}
            titleStyle={styles.deleteButtonText}
            leading={props => <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
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
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  babyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  babyAge: {
    fontSize: 16,
    color: '#8E8E93',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 32,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BabyDetailsScreen; 