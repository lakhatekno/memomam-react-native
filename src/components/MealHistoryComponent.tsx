import React from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MealHistoryPerDate, Meal } from '../interfaces/MealHistoryInterface';

// Defined Colors
const COLOR_DARK = '#18024E';
const COLOR_DANGER = '#D9534F';
const COLOR_EDIT = '#F0AD4E';

type Props = {
    history: MealHistoryPerDate[];
    onDeleteMeal?: (id: number | string) => void;
}

const MealHistoryComponent: React.FC<Props> = ({ history, onDeleteMeal }) => {
    const navigation = useNavigation();

    const handleDeletePress = (meal: Meal) => {
        Alert.alert(
            "Hapus Makanan",
            `Apakah Anda yakin ingin menghapus "${meal.food_name}"?`,
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Hapus",
                    onPress: () => {
                        console.log(`Deleting meal with ID: ${meal.id}`);
                        if (onDeleteMeal) {
                            onDeleteMeal(meal.id);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (!history || history.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.noResultsText}>Tidak ada hasil yang ditemukan.</Text>
            </View>
        );
    }

    const renderMealCard = (meal: Meal) => (
        <View key={meal.id.toString()} style={styles.card}>
            <View style={styles.cardInfo}>
                <Text style={styles.foodName}>{meal.food_name}</Text>
                <Text style={styles.mealType}>{meal.meal_type.replace('_', ' ')}</Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDeletePress(meal)}
                >
                    <Icon name="trash-can-outline" size={22} color={COLOR_DANGER} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={history}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
                <View style={styles.section}>
                    <Text style={styles.date}>{item.date.replace(/-/g, ' - ')}</Text>
                    {item.meals.map(renderMealCard)}
                </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_DARK,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  cardInfo: {
      flex: 1, // Allows text to take available space and wrap if needed
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR_DARK,
    textTransform: 'capitalize',
  },
  mealType: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  actionsContainer: {
      flexDirection: 'row',
      marginLeft: 16,
  },
  iconButton: {
      padding: 8,
      marginLeft: 8,
  },
  centered: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
  }
});

export default MealHistoryComponent;