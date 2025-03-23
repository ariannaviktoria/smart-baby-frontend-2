import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, useTheme, Icon } from 'react-native-paper';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ActivityCardProps {
  title: string;
  subtitle?: string;
  date?: Date;
  time?: string;
  icon: string;
  iconColor?: string;
  onPress?: () => void;
  index?: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  subtitle,
  date,
  time,
  icon,
  iconColor,
  onPress,
  index = 0,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 100)}
    >
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Surface style={[styles.card, { backgroundColor: theme.colors.background }]}>
          <View style={styles.iconContainer}>
            <Icon source={icon} size={32} color={iconColor || theme.colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            <View style={styles.detailsContainer}>
              {date && (
                <Text style={styles.date}>
                  {format(date, 'yyyy. MMMM d.', { locale: hu })}
                </Text>
              )}
              {time && <Text style={styles.time}>{time}</Text>}
            </View>
          </View>
          {onPress && (
            <Icon source="chevron-right" size={24} color={theme.colors.onSurfaceDisabled} />
          )}
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
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default ActivityCard; 