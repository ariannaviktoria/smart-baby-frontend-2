import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Text, TextInput, Image, SafeAreaView } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
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
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { profileApi, UserProfile, UpdateProfileData } from '../services/api';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const scale = useSharedValue(1);

  useEffect(() => {
    loadProfile();
    scale.value = withSequence(
      withDelay(300, withSpring(1.05, { damping: 8 })),
      withSpring(1, { damping: 8 })
    );
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileApi.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName,
        email: data.email,
      });
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült betölteni a profil adatait.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const response = await profileApi.uploadProfileImage(imageUri);
        setProfile(prev => prev ? { ...prev, profileImage: response.imageUrl } : null);
      }
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült feltölteni a profil képet.');
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await profileApi.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Siker', 'A profil sikeresen frissítve!');
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült frissíteni a profil adatait.');
    } finally {
      setIsLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (isLoading && !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Betöltés...</Text>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Profil</Text>
            <IconButton
              icon={isEditing ? "check" : "pencil"}
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
              style={styles.editButton}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={styles.profileContainer}
        >
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePick}
            disabled={!isEditing}
          >
            {profile?.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialCommunityIcons name="account" size={50} color="#666" />
              </View>
            )}
            {isEditing && (
              <View style={styles.imageOverlay}>
                <MaterialCommunityIcons name="camera" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Név</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.fullName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                editable={isEditing}
                placeholder="Add meg a neved"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Add meg az e-mail címed"
              />
            </View>

            {isEditing && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Jelenlegi jelszó</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.currentPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                    secureTextEntry
                    placeholder="Add meg a jelenlegi jelszavad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Új jelszó</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.newPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                    secureTextEntry
                    placeholder="Add meg az új jelszavad"
                  />
                </View>
              </>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
  },
  editButton: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputDisabled: {
    color: '#666',
  },
});

export default ProfileScreen; 