import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Surface, IconButton } from 'react-native-paper';
import { useBaby } from '../../contexts/BabyContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface BabySelectorModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const BabySelectorModal = ({ visible, onDismiss }: BabySelectorModalProps) => {
  const { babies, currentBaby, setCurrentBaby } = useBaby();

  const handleSelectBaby = (babyId: number) => {
    const selectedBaby = babies.find(baby => baby.id === babyId);
    if (selectedBaby) {
      setCurrentBaby(selectedBaby);
      onDismiss();
    }
  };

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

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Text style={styles.title}>Válassz babát</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
            />
          </View>
          <ScrollView style={styles.scrollView}>
            {babies.map((baby, index) => (
              <Animated.View
                key={baby.id}
                entering={FadeInDown.delay(index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.babyItem,
                    currentBaby?.id === baby.id && styles.selectedBaby
                  ]}
                  onPress={() => handleSelectBaby(baby.id)}
                >
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons
                      name="baby-face-outline"
                      size={35}
                      color="#666"
                    />
                  </View>
                  <View style={styles.babyInfo}>
                    <Text style={styles.babyName}>{baby.name}</Text>
                    <Text style={styles.babyAge}>
                      {calculateAge(new Date(baby.dateOfBirth))}
                    </Text>
                  </View>
                  {currentBaby?.id === baby.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4CAF50"
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  surface: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 400,
  },
  babyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedBaby: {
    backgroundColor: '#f8f8f8',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  babyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  babyName: {
    fontSize: 16,
    fontWeight: '500',
  },
  babyAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
});

export default BabySelectorModal; 