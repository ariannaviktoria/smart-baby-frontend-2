import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, Switch, SafeAreaView } from 'react-native';
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
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Kijelentkezés',
      'Biztosan ki szeretnél jelentkezni?',
      [
        { text: 'Mégse', style: 'cancel' },
        { 
          text: 'Kijelentkezés', 
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Login' as never);
            } catch (error) {
              Alert.alert('Hiba', 'A kijelentkezés során hiba történt. Kérlek próbáld újra.');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: 'Profil',
      icon: 'account',
      onPress: () => navigation.navigate('Profile' as never),
    },
    {
      title: 'Értesítések',
      icon: 'bell',
      rightComponent: (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notifications ? '#2196F3' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Sötét mód',
      icon: 'theme-light-dark',
      rightComponent: (
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#2196F3' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Adatok exportálása',
      icon: 'export',
      onPress: () => Alert.alert('Exportálás', 'Az adatok exportálása hamarosan elérhető lesz!'),
    },
    {
      title: 'Adatok törlése',
      icon: 'delete',
      onPress: () => Alert.alert('Törlés', 'Az adatok törlése hamarosan elérhető lesz!'),
    },
    {
      title: 'Súgó',
      icon: 'help-circle',
      onPress: () => Alert.alert('Súgó', 'A súgó hamarosan elérhető lesz!'),
    },
    {
      title: 'Névjegy',
      icon: 'information',
      onPress: () => Alert.alert('Névjegy', 'Smart Baby v1.0.0\n\n© 2024 Smart Baby\nMinden jog fenntartva.'),
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
            <IconButton
              icon="arrow-left"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Beállítások</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.menuContainer}
        >
          {menuItems.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(400 + index * 100).duration(1000).springify()}
            >
              <TouchableOpacity
                onPress={item.onPress}
                style={styles.menuItem}
              >
                <Animated.View style={[styles.menuItemContent, animatedStyle]}>
                  <View style={styles.menuItemLeft}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color="#666"
                    />
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                  {item.rightComponent || (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#666"
                    />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(1200).duration(1000).springify()}
          style={styles.logoutContainer}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Kijelentkezés</Text>
          </TouchableOpacity>
        </Animated.View>
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
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 