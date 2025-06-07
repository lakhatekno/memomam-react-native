import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { convertIDRtoUSD } from '../utils/Currency'; // Adjust path if needed
import { Props } from '../interfaces/ExploreInterface';

const COLOR_DARK = '#18024E';
const WHITE_BACKGROUND = '#FDFFFC';

const FoodRecommendationCard: React.FC<Props> = ({ recommendation, index }) => {
  const { restaurantName, signatureFood, priceRange } = recommendation;

  const priceIDR = `IDR ${priceRange.lowest / 1000}K - ${priceRange.highest / 1000}K`;
  const priceUSD = `USD${convertIDRtoUSD(priceRange.lowest)} - ${convertIDRtoUSD(priceRange.highest)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.restaurantTitle}>{`${index + 1}. ${restaurantName}`}</Text>
      <View style={styles.card}>
        <Text style={styles.foodText}>{signatureFood}</Text>
        <Text style={styles.priceText}>{`${priceIDR} ~ ${priceUSD}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  restaurantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR_DARK,
    marginBottom: 8,
  },
  card: {
    backgroundColor: WHITE_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  foodText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR_DARK,
    marginBottom: 8,
  },
  priceText: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default FoodRecommendationCard;