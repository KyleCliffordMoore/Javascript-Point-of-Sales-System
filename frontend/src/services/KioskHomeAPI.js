/**
 * API service for fetching kiosk home data.
 * 
 * This service contains the function `fetchKioskHomeData` that retrieves data related to
 * the kiosk home screen, such as available order details or other related data from the backend.
 * It uses a GET request to fetch data from the `/order` endpoint and handles errors gracefully.
 */

/**
 * Fetches data for the Kiosk Home screen.
 * 
 * This function makes a GET request to the backend to retrieve the kiosk home data (e.g., available orders).
 * In case of failure, it logs the error and returns an empty array.
 *
 * @async
 * @function fetchKioskHomeData
 * @returns {Promise<Object[]>} The data fetched from the backend, returns an empty array on failure.
 * @throws {Error} If the fetch operation fails, an empty array is returned.
 * 
 * @example
 * const kioskData = await fetchKioskHomeData();
 * console.log(kioskData); // Logs the fetched kiosk home data or an empty array in case of error.
 */
const API_URL = '/api';

export const fetchKioskHomeData = async () => {
  try {
    const response = await fetch(`${API_URL}/order`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch kiosk home data:', error);
    return [];
  }
};
