import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { Recommendation } from '../components/FoodRecommendationCard';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const openAIApi = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  },
});

/**
 * Fetches food recommendations for a given city using the GPT-4o mini model.
 * @param city - The name of the city.
 * @returns A promise that resolves to an array of Recommendation objects.
 */
export const fetchFoodRecommendations = async (
  city: string,
): Promise<Recommendation[]> => {
  console.log(`Fetching new recommendations for ${city}...`);
  const prompt = `
    Provide a list of 5 local food recommendations in the city of "${city}, Indonesia".
    Your response MUST be a valid JSON array, with no other text before or after it.
    Each object in the array should have three keys: "restaurantName", "signatureFood", and "priceRange".
    "priceRange" must be an object with "lowest" and "highest" prices in Indonesian Rupiah (IDR) as numbers.
    Example format:
    [
      {
        "restaurantName": "Gudeg Yu Djum",
        "signatureFood": "Nasi Gudeg Krecek",
        "priceRange": {
          "lowest": 25000,
          "highest": 50000
        }
      }
    ]
  `;

  try {
    const response = await openAIApi.post('/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.data.choices[0].message.content;
    const cleanedContent = content.replace(/```json\n|```/g, '').trim();
    const parsedRecommendations: Recommendation[] = JSON.parse(cleanedContent);
    return parsedRecommendations;
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    throw new Error('Failed to fetch recommendations from AI.');
  }
};