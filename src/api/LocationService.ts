// src/api/locationService.ts

import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Fetches the city name from geographical coordinates using the Nominatim API.
 * @param latitude - The latitude of the location.
 * @param longitude - The longitude of the location.
 * @returns The name of the city as a string.
 */
export const getCityFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  console.log("Fetching city from:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Memomam/1.0 (younglakha1@gmail.com)',
      },
    });

    if (!response.data || !response.data.address) {
      throw new Error('Could not parse location data from Nominatim.');
    }

    const address = response.data.address;
    const city = address.city || address.town || address.county || address.state;

    if (!city) {
      throw new Error('Could not determine city from Nominatim response.');
    }

    // Clean up "Kota" or "Kabupaten" prefixes
    return city.replace('Kota ', '').replace('Kabupaten ', '');
  } catch (error) {
    console.error('Nominatim API request failed:', error);
    // Re-throw the error to be caught by the calling function in the screen
    throw new Error('Failed to get city name.');
  }
};