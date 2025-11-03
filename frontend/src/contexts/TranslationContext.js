/**
 * @file TranslationProvider.jsx
 * @description Provides a context for managing language translation in a React application. 
 * Includes functionality for setting the language, retrieving the current language, and translating text.
 */
import React, { createContext, useContext, useState } from 'react';

// Create the Context
const TranslationContext = createContext();

// Hook to use Translation
/**
 * Hook to access translation functionalities.
 *
 * @returns {Object} An object containing:
 * - `translate` {Function}: A function to translate text to the current language.
 * - `setLanguage` {Function}: A function to set the current language.
 * - `getLanguage` {Function}: A function to retrieve the current language.
 *
 * @example
 * const { translate, setLanguage, getLanguage } = useTranslate();
 */
export const useTranslate = () => useContext(TranslationContext);

// Translation Provider
/**
 * TranslationProvider component that manages the current language state and provides translation functionality.
 * Translates text using a backend API and allows switching between all google api languages.
 *
 * @component
 * @param {Object} props - provider
 * @param {React.ReactNode} props.children - The components wrapped inside the provider.
 *
 * @example
 * <TranslationProvider>
 *   <App />
 * </TranslationProvider>
 *
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en'); // default to 'es' for Spanish, changed to 'en' for English

  // Function to set the current language
    /**
   * Sets the current language.
   * 
   * @param {string} lang - The language code to set ('en' for English).
   */
  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  // Function to get the current language
  /**
   * Gets the current language.
   * 
   * @returns {string} The current language code.
   */
  const getLanguage = () => {
    return currentLanguage;
  };

  // Function to translate the text
  /**
   * Translates the given text to the current language using a backend API.
   * 
   * @async This is done asyncronisly.
   * @param {string} text - The text to be translated.
   * @returns {Promise<string>} The translated text or the original text if an error occurs or translation is unnecessary.
   * 
   * @example
   * const translatedText = await translate("Hello");
   */
  const translate = async (text) => {
    if (currentLanguage === 'en') return text; // Return text if English (no translation needed)

    try {
      const response = await fetch('/api/doTranslate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: currentLanguage }), // Fixing key names here
      });

      const data = await response.json();
      return data.translatedText; // Directly accessing the translated text
    } catch (error) {
      console.error('Translation error:', error);
      return text; // If translation fails, return the original text
    }
  };

  return (
    <TranslationContext.Provider value={{ translate, setLanguage, getLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
