// src/services/KioskAppetizerAPI.js

const API_URL = '/api'; // Base URL for the backend

/**
 * Fetches the list of appetizers from the backend.
 *
 * @async
 * @returns {Promise<Object[]>} A promise that resolves to an array of appetizer objects.
 *                              Returns an empty array if the request fails.
 * @example
 * const appetizers = await fetchAppetizers();
 * console.log(appetizers); // [{ id: 1, name: 'Spring Rolls', price: 5.99 }, ...]
 */
export const fetchAppetizers = async () => {
  try {
    const response = await fetch(`${API_URL}/appetizers`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch appetizers:', error);
    return [];
  }
};
