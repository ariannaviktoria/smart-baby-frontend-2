import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import { Animated } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: number;
  mode?: 'elevated' | 'outlined' | 'contained';
}

const Card = ({
  children,
  style,
  onPress,
  elevation = 2,
  mode = 'elevated',
}: CardProps) => {
  const theme = useTheme();
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <PaperCard
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            elevation: elevation,
          },
          style,
        ]}
        mode={mode}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </PaperCard>
    </Animated.View>
  );
};

// Export Card subelements for convenience
Card.Title = PaperCard.Title;
Card.Content = PaperCard.Content;
Card.Cover = PaperCard.Cover;
Card.Actions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default Card; 