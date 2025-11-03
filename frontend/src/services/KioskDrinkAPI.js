// src/services/KioskDrinkAPI.js

const API_URL = '/api'; // Base URL for the backend

/**
 * Fetches the list of drinks from the backend.
 *
 * @async
 * @returns {Promise<Object[]>} A promise that resolves to an array of drink objects.
 *                              Returns an empty array if the request fails.
 * @example
 * const drinks = await fetchDrinks();
 * console.log(drinks); // [{ id: 1, name: 'Coca-Cola', price: 1.99 }, ...]
 */
export const fetchDrinks = async () => {
  try {
    const response = await fetch(`${API_URL}/drinks`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch drinks:', error);
    return [];
  }
};
