import React, { useEffect, useState } from 'react';
import { Linking, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../api';
import { useNavigation } from '@react-navigation/native';

const ACCENT_COLOR = '#FDA2B1';

export default function ProfileScreen() {
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          return;
        }
        const res = await Api.get('/profile-summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
            Alert.alert('Error', 'Gagal memuat data profil.');
      }
    };
    fetchData();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hi, {data.name}!</Text>

        <View style={styles.statsRow}>
          {Object.entries(data.statistics).map(([key, value]) => (
            <View style={styles.statItem} key={key}>
              <View style={styles.statCircle}>
                <Text style={styles.statNumber}>{value}&#215;</Text>
              </View>
              <Text style={styles.statLabel}>
                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.mostEatenContainer}>
            <Text style={styles.sectionTitle}>Paling Sering kamu makan:</Text>
            <Text style={styles.mostEatenText}>{data.most_eaten}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NotificationSetting')}>
          <MaterialCommunityIcons name="bell-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Atur Pengingat Makan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
            <Text style={styles.creatorText}>Created by Muhammad Islakha</Text>
            <View style={styles.socialRow}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/muhammad-islakha/')}>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="linkedin" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/lakhatekno')}>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="github" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    alignItems: 'flex-start', // Align items to the start (left)
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  statsTitle: {
      alignSelf: 'center',
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
      marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statCircle: {
    width:70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  mostEatenContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 60,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  mostEatenText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%', // Make buttons full width relative to padding
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    borderColor: '#000',
    marginLeft: 8,
  },
  buttonLogout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#fa4234',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginBottom: 16,
      width: '100%', // Make buttons full width relative to padding
  },
  textLogout: {
      fontSize: 16,
      fontWeight: '700',
      color: '#fa4234',
      marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto', // Pushes footer to the bottom
    paddingTop: 40,
    width: '100%',
  },
  creatorText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  navBar: {
      borderTopWidth: 1,
      borderColor: '#e0e0e0',
      paddingVertical: 15,
      paddingHorizontal: 24,
      backgroundColor: '#fff',
      alignItems: 'center',
  },
  navBarText: {
      fontSize: 14,
      color: '#888',
  }
});