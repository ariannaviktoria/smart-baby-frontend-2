import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = true,
  rightIcon,
  onRightIconPress,
  subtitle,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <Animated.View 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      entering={FadeInDown.duration(500).delay(100)}
    >
      <View style={styles.headerContent}>
        {showBackButton && (
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightIcon && (
          <IconButton
            icon={rightIcon}
            size={24}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 8,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default PageHeader; 