import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealHistoryPerDate } from '../interfaces/MealHistoryInterface';
import MealHistoryComponent from '../components/MealHistoryComponent';

// Defined Colors
const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const BORDER_COLOR = '#E0E0E0';

const JournalScreen = () => {
    const [foodName, setFoodName] = useState('');
    const [mealTypeId, setMealTypeId] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [mealHistory, setMealHistory] = useState<MealHistoryPerDate[]>([]);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await Api.get('/get-meal-history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            });
            setMealHistory(response.data.data);
        } catch (e) {
            console.error("Failed to fetch meal history:", e);
            Alert.alert("Error", "Gagal memuat riwayat makanan.");
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const submitJournal = async () => {
        if (!foodName.trim()) {
            Alert.alert('Perhatian', 'Nama makanan harus diisi.');
            return;
        }
        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            await Api.post(
              '/save-meal-history',
              {
                date: formattedDate,
                food_name: foodName,
                meal_type_id: mealTypeId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
                },
              }
            );
            Alert.alert('Sukses', 'Hore! Catatan makanmu berhasil disimpan.');
            setFoodName(''); // Clear input on success
            fetchHistory(); // Refresh the history list
        } catch (e: any) {
            console.error("Failed to save journal:", e.response?.data || e.message);
            Alert.alert('Gagal', e.response?.data?.message || 'Gagal menyimpan catatan makan.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteMeal = async (mealId: number | string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await Api.delete(`/delete-meal-history/${mealId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistically update UI
            const updatedHistory = mealHistory
                .map(group => ({
                    ...group,
                    meals: group.meals.filter(meal => meal.id !== mealId),
                }))
                .filter(group => group.meals.length > 0);

            setMealHistory(updatedHistory);
            Alert.alert("Sukses", "Catatan makan telah dihapus.");
        } catch (error: any) {
            console.error('Delete error:', error);
            Alert.alert('Error', error.response?.data?.message || "Gagal menghapus catatan.");
        }
    };

    return(
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Catat Makananmu Hari Ini</Text>

            <Text style={styles.label}>Makan apa nih?</Text>
            <TextInput
                style={styles.input}
                placeholder="Nama makananmu"
                placeholderTextColor="#999"
                value={foodName}
                onChangeText={setFoodName}
            />

            <Text style={styles.label}>Dimakan pas apa?</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={mealTypeId}
                    onValueChange={(itemValue) => setMealTypeId(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Sarapan" value={1} />
                    <Picker.Item label="Makan Siang" value={2} />
                    <Picker.Item label="Makan Malam" value={3} />
                    <Picker.Item label="Camilan" value={4} />
                </Picker>
                <Icon name="chevron-down" size={24} color={COLOR_DARK} style={styles.pickerIcon} />
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={submitJournal}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Simpan Catatan Makan</Text>
                )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.historyTitle}>Yang Udah Kamu Makan:</Text>
            {loadingHistory ? (
                <ActivityIndicator style={{marginTop: 20}} size="large" color={COLOR_DARK} />
            ) : (
                <MealHistoryComponent history={mealHistory} onDeleteMeal={handleDeleteMeal} />
            )}
        </ScrollView>
    );
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
    marginBottom: 24,
    color: COLOR_DARK,
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
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: COLOR_DARK,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    color: COLOR_DARK,
  },
  pickerIcon: {
      position: 'absolute',
      right: 15,
      pointerEvents: 'none',
  },
  submitButton: {
      backgroundColor: COLOR_DARK,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
  },
  submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  divider: {
      height: 1.5,
      backgroundColor: BORDER_COLOR,
      marginVertical: 32,
  },
  historyTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: COLOR_DARK,
      marginBottom: 16,
  }
});

export default JournalScreen;