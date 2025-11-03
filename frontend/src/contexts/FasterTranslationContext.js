/**
 * FasterTranslationContext.js
 * 
 * This file provides a context and a custom hook for managing translations within the application.
 * It includes caching functionality to reduce the number of API calls and improve performance.
 * The translation is performed for the current language, and the translations are stored in a cache.
 * 
 * Features:
 * - Translation context to manage language settings and translations.
 * - Caching to store translations and avoid redundant API calls.
 * - Supports batch translation requests to improve efficiency.
 * 
 * @module FasterTranslationContext
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Create the Context
const FasterTranslationContext = createContext();

/**
 * Custom hook to access the translation context.
 * Provides access to translation functions and language settings.
 * 
 * @returns {Object} The context containing `translate`, `setLanguage`, and `currentLanguage`.
 * @example
 * const { translate, setLanguage, currentLanguage } = useFasterTranslate();
 */
export const useFasterTranslate = () => useContext(FasterTranslationContext);

/**
 * Translation Provider component that manages language settings and translation caching.
 * Wraps the application with the translation context to provide access to translation functions.
 * 
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.children - The children components that will be wrapped by the provider.
 * @returns {JSX.Element} The rendered provider component with the context.
 * 
 * @example
 * <FasterTranslationProvider>
 *   <App />
 * </FasterTranslationProvider>
 */
export const FasterTranslationProvider = ({ children }) => {
  // State to manage the current language of the application
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // State to manage the translation cache, storing translations to avoid redundant API calls
  const [translationCache, setTranslationCache] = useState({});

  /**
   * Sets the current language of the application and clears the translation cache.
   * 
   * @param {string} lang - The language code to set as the current language (e.g., 'en', 'es').
   * @returns {void}
   */
  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    setTranslationCache({}); // Clear the cache when language changes
  };

  /**
   * Translates one or more texts into the current language, using the translation cache and batch API calls.
   * If the translation is already cached, it returns the cached value.
   * 
   * @param {string|Array<string>} texts - The text(s) to translate.
   * @returns {Promise<string|Array<string>>} - The translated text(s), either a single string or an array of strings.
   */
  const translate = useCallback(
    async (texts) => {
      // If the current language is 'en', no translation is needed, return the original text(s)
      if (currentLanguage === 'en') return texts;

      const textsArray = Array.isArray(texts) ? texts : [texts];

      // Filter out texts that are already in the cache
      const untranslatedTexts = textsArray.filter((text) => !translationCache[text]);

      if (untranslatedTexts.length > 0) {
        try {
          // Make a single API call to translate all untranslated texts
          const response = await axios.post('/api/doTranslateBatch', {
            texts: untranslatedTexts,
            targetLanguage: currentLanguage,
          });

          const translationsArray = response.data.translations;

          // Map untranslatedTexts to translationsArray and update the cache
          const newTranslations = {};
          untranslatedTexts.forEach((text, index) => {
            newTranslations[text] = translationsArray[index];
          });

          // Update the cache with new translations
          setTranslationCache((prevCache) => ({ ...prevCache, ...newTranslations }));
        } catch (error) {
          console.error('Translation error:', error);
          // Fallback to using the original text in case of an error
          const fallbackTranslations = {};
          untranslatedTexts.forEach((text) => {
            fallbackTranslations[text] = text;
          });
          setTranslationCache((prevCache) => ({ ...prevCache, ...fallbackTranslations }));
        }
      }

      // Retrieve translations from the cache or use the original text if not cached
      const translations = textsArray.map((text) => translationCache[text] || text);

      // Return a single string if only one text was passed, or an array if multiple texts
      return Array.isArray(texts) ? translations : translations[0];
    },
    [currentLanguage, translationCache] // Dependencies to re-run the function if language or cache changes
  );

  return (
    <FasterTranslationContext.Provider value={{ translate, setLanguage, currentLanguage }}>
      {children}
    </FasterTranslationContext.Provider>
  );
};
