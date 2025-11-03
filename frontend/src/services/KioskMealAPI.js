/**
 * API service for fetching meal data.
 * 
 * This service contains the function `fetchMeals` that retrieves meal-related data, such as 
 * available meals from the backend, using a GET request to the `/meals` endpoint.
 * It handles errors gracefully by logging the error and returning an empty array if the request fails.
 */

/**
 * Fetches data for available meals.
 * 
 * This function makes a GET request to the backend to retrieve the meal data (e.g., available meals).
 * In case of failure, it logs the error and returns an empty array.
 *
 * @async
 * @function fetchMeals
 * @returns {Promise<Object[]>} The data fetched from the backend, returns an empty array on failure.
 * @throws {Error} If the fetch operation fails, an empty array is returned.
 * 
 * @example
 * const meals = await fetchMeals();
 * console.log(meals); // Logs the fetched meal data or an empty array in case of error.
 */
const API_URL = '/api';

export const fetchMeals = async () => {
  try {
    const response = await fetch(`${API_URL}/meals`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    return [];
  }
};
