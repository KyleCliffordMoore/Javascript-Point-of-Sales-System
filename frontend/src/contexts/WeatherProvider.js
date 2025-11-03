/**
 * @file WeatherProvider.js
 * @description Provides context for weather information in College Station with functionality to fetch weather information.
 */
import React, { createContext, useContext, useEffect, useState } from "react";

const WeatherContext = createContext();

/**
 * Hook to use weather context.
 * @returns {Object} An object containing:
 * - `currentWeather` {Function}: A function to get the current weather information as a string.
 * - `loading` {Function}: A function to get a boolean representing if the weather provider is in the process of loading weather data.
 * 
 * @example const { currentWeather, weatherLoading } = useWeatherContext();
 */
export const useWeatherContext = () => useContext(WeatherContext);

/**
 * a WeatherProvider component that provides weather information in college Station.
 *
 * @component
 * @param {Object} props - provider
 * @param {React.ReactNode} props.children - The components wrapped inside the provider.
 *
 * @example
 * <WeatherProvider>
 *   <App />
 * </WeatherProvider>
 *
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timerInterval;

    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.weather.gov/gridpoints/HGX/28,134/forecast/hourly");
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();

        var finalWeatherString = "";
        const now = (new Date()).getTime();
        data.properties.periods.forEach((period) => {
            if ((new Date(period.startTime)) < now && now < (new Date(period.endTime))) {
                finalWeatherString += "College Station Hourly Forecast: " + period.temperature + "° " + period.temperatureUnit + ", " + period.shortForecast;
                setCurrentWeather(finalWeatherString);
                setLoading(false);
                return;
            }
        })
        setLoading(false);

        // Start timer
        // clearInterval(timerInterval);
        // timerInterval = setInterval(() => fetchWeather, 5000);
      } 
      catch (error) {
        console.error("Error fetching weather: ", error);
        setLoading(false);
      }
    };

    fetchWeather();

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, []);

  return (
    <WeatherContext.Provider value={{ currentWeather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};
