/**
 * @file LoginAPI.js
 * @description Provides functions for API requests to verify a user's login information/credentials.
 */

const API_URL = '/api'; // Base URL for the backend

/**
 * Queries the API to verify if a user's credentials match a user in the database
 * 
 * @param {string} username User's username as a string
 * @param {string} password User's password as a string
 * @returns API Response with a list of user roles corresponding to the user that attempted to sign in
 */
export const login = async (username, password) => {
  const queryText = `SELECT position FROM employee WHERE name = '${username}' AND password = '${password}'`;

  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText, params: [username, password] }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error('Error logging in:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

/**
 * Queries the API to verify if a user's Google SSO credentials (emails specifically) match a user in the database
 * 
 * @param {JSON} credentialResponse Credential response from Google's SSO API
 * @returns {Array} API Response with a list of user roles corresponding to the user that attempted to sign in
 */
export const googleLogin = async(credentialResponse) => {
  const googleLoginResponse = await fetch(`${API_URL}/doGoogleLogin`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credentialResponse: credentialResponse }),
  });
  if (!googleLoginResponse.ok){
      return;
  }

  const result = (await googleLoginResponse.json());
  return result.rows;
}