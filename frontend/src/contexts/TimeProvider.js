/**
 * @file TimeProvider.js
 * @description Provides a context and state management for handling and displaying the current time.
 * Includes an API call to fetch the current time and keeps it updated in real time.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// Create the Context
const TimeContext = createContext();

// Create a custom hook to access the context
/**
 * Custom hook to access the current time and loading state from the TimeContext.
 * 
 * @returns {Object} An object containing:
 * - `currentTime` {Date | null}: The current time or `null` if not yet fetched.
 * - `loading` {boolean}: Indicates if the time is being fetched.
 * 
 * @example
 * const { currentTime, loading } = useTime();
 */
export const useTime = () => useContext(TimeContext);

// TimeProvider component
/**
 * handles time logic
 * 
 * @component
 * @param {Object} props - provider
 * @param {React.ReactNode} props.children - The components wrapped inside the provider.
 * 
 * @example
 * <TimeProvider>
 *   <App />
 * </TimeProvider>
 * 
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export const TimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timerInterval;

     /**
     * Fetches the initial time from the WorldTimeAPI and starts the real-time timer.
     */
    const fetchInitialTime = async () => {
      try {
        // Fetch initial time from the API
        const response = await fetch("https://worldtimeapi.org/api/ip");
        if (!response.ok) throw new Error("Failed to fetch time");
        const data = await response.json();

        // Initialize date
        let initialTime = new Date(data.datetime);
        setCurrentTime(initialTime);
        setLoading(false);

        // Start timer
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          setCurrentTime((prevTime) => new Date(prevTime.getTime() + 1000/2*2));
        }, 1000);
      } catch (error) {
        console.error("Error fetching time:", error);
        setLoading(false);
      }
    };

    fetchInitialTime();

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, []);

  return (
    <TimeContext.Provider value={{ currentTime, loading }}>
      {children}
    </TimeContext.Provider>
  );
};
