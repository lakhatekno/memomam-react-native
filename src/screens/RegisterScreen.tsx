import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const BORDER_COLOR = '#E0E0E0';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!name || !username || !password || !confirmPassword) {
      Alert.alert('Perhatian', 'Semua kolom harus diisi.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Perhatian', 'Password minimal harus 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Perhatian', 'Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post('/register', {
        name,
        username,
        password,
        confirm_password: confirmPassword,
      });

      if (response.status === 201) {
        Alert.alert(
          'Registrasi Berhasil!',
          `Silahkan Login.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            },
          ]
        );
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        Alert.alert('Registrasi Gagal', error.response.data.message || 'Terjadi kesalahan.');
      } else {
        Alert.alert('Error', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
            />
          </View>

          <Text style={styles.headerTitle}>Buat Akun Baru</Text>

          <Text style={styles.label}>Nama Kamu</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan namamu"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Masukkan username unik"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 8 karakter"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />

          <Text style={styles.label}>Konfirmasi Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Ketik lagi password barusan"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Masuk</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOR_DARK,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_DARK,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    color: COLOR_DARK,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: COLOR_DARK,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
  },
  footerText: {
      fontSize: 14,
      color: '#666',
  },
  linkText: {
      fontSize: 14,
      color: COLOR_DARK,
      fontWeight: 'bold',
  }
});

export default RegisterScreen;