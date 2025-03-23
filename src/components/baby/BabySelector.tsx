import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBaby } from '../../contexts/BabyContext';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import Animated, { FadeIn } from 'react-native-reanimated';
import BabySelectorModal from './BabySelectorModal';

const BabySelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { babies, currentBaby } = useBaby();

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const monthDiff = today.getMonth() - birthDate.getMonth() + 
      (12 * (today.getFullYear() - birthDate.getFullYear()));
    
    if (monthDiff < 1) {
      const dayDiff = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${dayDiff} napos`;
    } else if (monthDiff < 24) {
      return `${monthDiff} hónapos`;
    } else {
      const years = Math.floor(monthDiff / 12);
      return `${years} éves`;
    }
  };

  if (!currentBaby || babies.length === 0) {
    return null;
  }

  return (
    <>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.container}
      >
        <Surface style={styles.surface}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.content}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons
                  name="baby-face-outline"
                  size={30}
                  color="#666"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{currentBaby.name}</Text>
                <Text style={styles.age}>
                  {calculateAge(new Date(currentBaby.dateOfBirth))}
                </Text>
              </View>
              {babies.length > 1 && (
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color="#666"
                  style={styles.icon}
                />
              )}
            </View>
          </TouchableOpacity>
        </Surface>
      </Animated.View>
      <BabySelectorModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  surface: {
    borderRadius: 16,
    backgroundColor: '#fff',
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
  button: {
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  age: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  icon: {
    marginLeft: 8,
  },
});

export default BabySelector; 