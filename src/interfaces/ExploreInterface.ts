export interface Recommendation {
  restaurantName: string;
  signatureFood: string;
  priceRange: {
    lowest: number;
    highest: number;
  };
}

export interface Props {
  recommendation: Recommendation;
  index: number;
}