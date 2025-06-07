import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MealHistoryComponent from '../components/MealHistoryComponent';
import { MealHistoryPerDate } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../api';

// Defined Colors
const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';
const COLOR_ACCENT = '#FDA2B1';
const BORDER_COLOR = '#E0E0E0';


const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<MealHistoryPerDate[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await Api.post(
                '/search-meal-history',
                { query },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setResult(response.data.data);
        } catch (error) {
            console.error('Search error:', error);
            setResult([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the deletion of a meal entry.
     * This function calls the API and then updates the local state to remove the meal
     * from the UI without needing a full refresh.
     * * @param mealId The ID of the meal to be deleted.
     */
    const handleDeleteMeal = async (mealId: number | string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert("Authentication Error", "Please log in again.");
                return;
            }

            const response = await Api.delete(`/delete-meal-history/${mealId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 204) {
                const updatedResult = result
                    .map(dateEntry => ({
                        ...dateEntry,
                        meals: dateEntry.meals.filter(meal => meal.id !== mealId),
                    }))
                    .filter(dateEntry => dateEntry.meals.length > 0);

                setResult(updatedResult);
                Alert.alert("Success", "Meal history has been deleted.");
            } else {
                 throw new Error("Failed to delete meal history.");
            }

        } catch (error: any) {
            console.error('Delete error:', error);
            const errorMessage = error.response?.data?.message || "An error occurred while deleting the meal.";
            Alert.alert('Error', errorMessage);
        }
    };


    return (
        <View style={styles.flexContainer}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Cari Makanan Yang Pernah Kamu Makan</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Cari histori makanmu..."
                        placeholderTextColor="#999"
                        value={query}
                        onChangeText={setQuery}
                        style={styles.input}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
                        <Icon name="magnify" size={28} color={COLOR_DARK} />
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator style={styles.loading} size="large" color={COLOR_ACCENT} />
                ) : hasSearched ? (
                    <MealHistoryComponent history={result} onDeleteMeal={handleDeleteMeal} />
                ) : null}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: WHITE_BACKGROUND,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLOR_DARK,
        marginBottom: 24,
        lineHeight: 36,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    input: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
        color: COLOR_DARK,
    },
    iconButton: {
        marginLeft: 12,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: BORDER_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loading: {
        marginTop: 40,
    },
    navBar: {
      borderTopWidth: 1,
      borderColor: BORDER_COLOR,
      paddingVertical: 20,
      backgroundColor: WHITE_BACKGROUND,
      alignItems: 'center',
    },
    navBarText: {
        fontSize: 14,
        color: '#888',
    }
});

export default SearchScreen;