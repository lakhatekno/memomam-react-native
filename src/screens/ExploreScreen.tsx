// src/screens/ExploreScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCityFromCoordinates } from '../api/LocationService';
import { fetchFoodRecommendations } from '../api/RecommendationService';
import FoodRecommendationCard from '../components/FoodRecommendationCardComponent';
import { Recommendation } from '../interfaces/ExploreInterface';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const COLOR_ACCENT = '#FDA2B1';

const ExploreScreen = () => {
  const [city, setCity] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAndSetCity = useCallback(async () => {
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        throw new Error('Location permission denied.');
      }

      const position = await new Promise<Geolocation.GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
      });

      const { latitude, longitude } = position.coords;
      const currentCity = await getCityFromCoordinates(latitude, longitude);

      setCity(currentCity);
      return currentCity;

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to get your location.');
      setLoading(false);
      return null;
    }
  }, []);

  const loadRecommendations = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    const currentCity = city || await getAndSetCity();

    if (!currentCity) {
      return;
    }

    const storageKey = `@recommendations_${currentCity.toLowerCase()}`;

    if (!forceRefresh) {
      const cachedData = await AsyncStorage.getItem(storageKey);
      if (cachedData) {
        console.log(`Found cached data for ${currentCity}.`);
        setRecommendations(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
    }

    try {
      const newRecommendations = await fetchFoodRecommendations(currentCity);
      if (newRecommendations.length > 0) {
        setRecommendations(newRecommendations);
        await AsyncStorage.setItem(storageKey, JSON.stringify(newRecommendations));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [city, getAndSetCity]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleRefresh = () => {
    loadRecommendations(true);
  };

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
         <Text style={styles.title}>Rekomendasi Makanan di Sekitarmu</Text>

         <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
              <Icon name="map-marker-outline" size={22} color={COLOR_DARK} />
              <Text style={styles.cityText}>{city || 'Mencari lokasi...'}</Text>
            </View>
            <TouchableOpacity onPress={handleRefresh}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

        {loading && <ActivityIndicator size="large" color={COLOR_ACCENT} style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && recommendations.map((item, index) => (
          <FoodRecommendationCard key={item.restaurantName + index} recommendation={item} index={index} />
        ))}
      </ScrollView>
  );
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    return authStatus === 'granted';
  }
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'FoodApp Location Permission',
        message: 'We need your location to recommend local food.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLOR_DARK,
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 16
  },
  locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  cityText: {
    fontSize: 16,
    color: COLOR_DARK,
    marginLeft: 8,
  },
  refreshText: {
    fontSize: 16,
    color: COLOR_DARK,
    fontWeight: '500',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#D9534F',
    fontSize: 16,
  },
});

export default ExploreScreen;