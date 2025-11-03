/**
 * QueryDatabase Component
 * 
 * This component executes a database query via an API request and displays the result or an error message.
 * It accepts a `query` prop to send to the server and triggers a callback function `onResult` with the query's result.
 * 
 * Features:
 * - Sends a POST request to the server to execute the provided query.
 * - Displays a success or error message based on the query execution.
 * - Passes the query result to the `onResult` callback function.
 * 
 * Props:
 * @param {string} query - The database query to execute.
 * @param {function} onResult - A callback function that receives the query result.
 * 
 * @component
 * @example
 * // Example usage
 * <QueryDatabase 
 *   query="SELECT * FROM users" 
 *   onResult={handleQueryResult} 
 * />
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Executes a database query and passes the result to the onResult callback.
 * 
 * @param {Object} props - Props for the component.
 * @param {string} props.query - The database query to execute.
 * @param {function} props.onResult - Callback function triggered with the query result.
 * @returns {JSX.Element} - The rendered QueryDatabase component.
 */
function QueryDatabase({ query, onResult }) {
  // Local state to manage the message displayed to the user
  const [message, setMessage] = useState('');

  useEffect(() => {
    /**
     * Function to fetch data from the server by executing the query.
     * Sends the query to the backend API and handles the response.
     * 
     * @returns {Promise<void>} - Asynchronous function that handles the query execution.
     */
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/query', { query });
        setMessage('Query executed successfully.');
        onResult(response.data); // Pass the query result to the callback function
      } catch (error) {
        setMessage('Error executing query.');
        onResult(null); // Pass null if the query failed
      }
    };

    // Execute the query if it's provided
    if (query) {
      fetchData();
    }
  }, [query, onResult]); // Re-run if the query or onResult function changes

  return (
    <div>
      {message && <p>{message}</p>} {/* Display the message if available */}
    </div>
  );
}

export default QueryDatabase;
