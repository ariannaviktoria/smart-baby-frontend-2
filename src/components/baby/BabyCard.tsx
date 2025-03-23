import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Avatar, useTheme } from 'react-native-paper';
import { format, differenceInMonths, differenceInYears } from 'date-fns';
import { hu } from 'date-fns/locale';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Baby } from '../../types';

interface BabyCardProps {
  baby: Baby;
  onPress?: () => void;
  isSelected?: boolean;
  index?: number;
}

const BabyCard: React.FC<BabyCardProps> = ({
  baby,
  onPress,
  isSelected = false,
  index = 0,
}) => {
  const theme = useTheme();
  
  const getAgeText = (dateOfBirth: Date) => {
    const years = differenceInYears(new Date(), new Date(dateOfBirth));
    const months = differenceInMonths(new Date(), new Date(dateOfBirth)) % 12;
    
    if (years > 0) {
      return `${years} éves${months > 0 ? `, ${months} hónapos` : ''}`;
    } else {
      return `${months} hónapos`;
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400).delay(index * 100)}
    >
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Surface 
          style={[
            styles.card, 
            { 
              backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.background,
              borderColor: isSelected ? theme.colors.primary : 'transparent',
            },
          ]}
        >
          <Avatar.Text 
            size={50} 
            label={baby.name.substring(0, 2).toUpperCase()} 
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.contentContainer}>
            <Text style={[styles.name, { color: isSelected ? theme.colors.primary : theme.colors.onBackground }]}>
              {baby.name}
            </Text>
            <Text style={styles.age}>
              {getAgeText(new Date(baby.dateOfBirth))}
            </Text>
            <Text style={styles.birthDate}>
              Született: {format(new Date(baby.dateOfBirth), 'yyyy. MMMM d.', { locale: hu })}
            </Text>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 2,
  },
  contentContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 14,
    marginTop: 2,
  },
  birthDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
});

export default BabyCard; 