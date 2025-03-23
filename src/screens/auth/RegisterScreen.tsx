import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../services/api';

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const theme = useTheme();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Hiba', 'Kérjük töltse ki az összes mezőt!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hiba', 'A jelszavak nem egyeznek!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hiba', 'A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }

    try {
      setLoading(true);
      await authApi.register({ email, password, fullName: name });
      // Sikeres regisztráció után navigálás a fő képernyőre
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Hiba', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Regisztráció</Text>
            <Text style={styles.subtitle}>Hozza létre fiókját</Text>

            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Teljes név"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
                disabled={loading}
              />
              <TextInput
                mode="outlined"
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
              />
              <TextInput
                mode="outlined"
                label="Jelszó"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                disabled={loading}
              />
              <TextInput
                mode="outlined"
                label="Jelszó megerősítése"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                disabled={loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Regisztráció</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                Már van fiókja? Jelentkezzen be
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RegisterScreen; 