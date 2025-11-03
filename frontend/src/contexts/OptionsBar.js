/**
 * @file OptionsBar.js
 * @description It displays the current time, weather, and a language selector for translation functionality.
 * The component uses multiple contexts for managing translations, time, and weather.
 */

import React, { useState, useEffect } from "react";
import { useTranslate } from "./TranslationContext";
import { useFasterTranslate } from "./FasterTranslationContext";
import { useTime } from "./TimeProvider";
import { useWeatherContext } from "./WeatherProvider";

/**
 * OptionsBar Component
 * 
 * @returns {JSX.Element} A bar displaying current time, weather, and a language selector.
 */
const OptionsBar = () => {
  const { currentTime, timeLoading } = useTime();
  const { currentWeather, weatherLoading } = useWeatherContext();

  const { setLanguage: setLanguageOld } = useTranslate();
  const { setLanguage: setLanguageFast, translate, currentLanguage } = useFasterTranslate();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState({
    selectLanguage: "Select Language",
    timeUnavailable: "Time not available",
    weatherUnavailable: "Weather not available",
    translatedWeather: "",
  });

  const languages = [
    { code: "af", label: "Afrikaans" },
    { code: "sq", label: "Albanian" },
    { code: "am", label: "Amharic" },
    { code: "ar", label: "Arabic" },
    { code: "hy", label: "Armenian" },
    { code: "az", label: "Azerbaijani" },
    { code: "eu", label: "Basque" },
    { code: "be", label: "Belarusian" },
    { code: "bn", label: "Bengali" },
    { code: "bs", label: "Bosnian" },
    { code: "bg", label: "Bulgarian" },
    { code: "ca", label: "Catalan" },
    { code: "ceb", label: "Cebuano" },
    { code: "zh", label: "Chinese" },
    { code: "co", label: "Corsican" },
    { code: "hr", label: "Croatian" },
    { code: "cs", label: "Czech" },
    { code: "da", label: "Danish" },
    { code: "nl", label: "Dutch" },
    { code: "en", label: "English" },
    { code: "eo", label: "Esperanto" },
    { code: "et", label: "Estonian" },
    { code: "fi", label: "Finnish" },
    { code: "fr", label: "French" },
    { code: "fy", label: "Frisian" },
    { code: "gl", label: "Galician" },
    { code: "ka", label: "Georgian" },
    { code: "de", label: "German" },
    { code: "el", label: "Greek" },
    { code: "gu", label: "Gujarati" },
    { code: "ht", label: "Haitian Creole" },
    { code: "ha", label: "Hausa" },
    { code: "haw", label: "Hawaiian" },
    { code: "he", label: "Hebrew" },
    { code: "hi", label: "Hindi" },
    { code: "hmn", label: "Hmong" },
    { code: "hu", label: "Hungarian" },
    { code: "is", label: "Icelandic" },
    { code: "ig", label: "Igbo" },
    { code: "id", label: "Indonesian" },
    { code: "ga", label: "Irish" },
    { code: "it", label: "Italian" },
    { code: "ja", label: "Japanese" },
    { code: "jv", label: "Javanese" },
    { code: "kn", label: "Kannada" },
    { code: "kk", label: "Kazakh" },
    { code: "km", label: "Khmer" },
    { code: "rw", label: "Kinyarwanda" },
    { code: "ko", label: "Korean" },
    { code: "ku", label: "Kurdish" },
    { code: "ky", label: "Kyrgyz" },
    { code: "lo", label: "Lao" },
    { code: "la", label: "Latin" },
    { code: "lv", label: "Latvian" },
    { code: "lt", label: "Lithuanian" },
    { code: "lb", label: "Luxembourgish" },
    { code: "mk", label: "Macedonian" },
    { code: "mg", label: "Malagasy" },
    { code: "ms", label: "Malay" },
    { code: "ml", label: "Malayalam" },
    { code: "mt", label: "Maltese" },
    { code: "mi", label: "Maori" },
    { code: "mr", label: "Marathi" },
    { code: "mn", label: "Mongolian" },
    { code: "my", label: "Myanmar (Burmese)" },
    { code: "ne", label: "Nepali" },
    { code: "no", label: "Norwegian" },
    { code: "ny", label: "Nyanja (Chichewa)" },
    { code: "or", label: "Odia (Oriya)" },
    { code: "ps", label: "Pashto" },
    { code: "fa", label: "Persian" },
    { code: "pl", label: "Polish" },
    { code: "pt", label: "Portuguese" },
    { code: "pa", label: "Punjabi" },
    { code: "ro", label: "Romanian" },
    { code: "ru", label: "Russian" },
    { code: "sm", label: "Samoan" },
    { code: "gd", label: "Scots Gaelic" },
    { code: "sr", label: "Serbian" },
    { code: "st", label: "Sesotho" },
    { code: "sn", label: "Shona" },
    { code: "sd", label: "Sindhi" },
    { code: "si", label: "Sinhala (Sinhalese)" },
    { code: "sk", label: "Slovak" },
    { code: "sl", label: "Slovenian" },
    { code: "so", label: "Somali" },
    { code: "es", label: "Spanish" },
    { code: "su", label: "Sundanese" },
    { code: "sw", label: "Swahili" },
    { code: "sv", label: "Swedish" },
    { code: "tl", label: "Tagalog (Filipino)" },
    { code: "tg", label: "Tajik" },
    { code: "ta", label: "Tamil" },
    { code: "tt", label: "Tatar" },
    { code: "te", label: "Telugu" },
    { code: "th", label: "Thai" },
    { code: "tr", label: "Turkish" },
    { code: "tk", label: "Turkmen" },
    { code: "uk", label: "Ukrainian" },
    { code: "ur", label: "Urdu" },
    { code: "ug", label: "Uyghur" },
    { code: "uz", label: "Uzbek" },
    { code: "vi", label: "Vietnamese" },
    { code: "cy", label: "Welsh" },
    { code: "xh", label: "Xhosa" },
    { code: "yi", label: "Yiddish" },
    { code: "yo", label: "Yoruba" },
    { code: "zu", label: "Zulu" },
  ];

  /**
   * Stores the language the user wants text translated to in the translation context then 
   * translates all text on the website to the specified language
   *  
   * @param {*} code The 2 letter code for the language the user wants text to be translated to
   */
  const handleLanguageChange = (code) => {
    setLanguageOld(code); // Update language in TranslationContext
    setLanguageFast(code); // Update language in FasterTranslationContext
    setDropdownVisible(false); // Close the dropdown after selection
  };

  useEffect(() => {
    const loadTranslations = async () => {
      const [selectLanguage, timeUnavailable, weatherUnavailable] = await translate([
        "Select Language",
        "Time not available",
        "Weather not available",
      ]);
      const translatedWeather = currentWeather
        ? await translate(currentWeather)
        : weatherUnavailable;

      setTranslatedText({
        selectLanguage,
        timeUnavailable,
        weatherUnavailable,
        translatedWeather,
      });
    };

    loadTranslations();
  }, [translate, currentWeather]);

  if (timeLoading || weatherLoading) {
    return <div className="time-bar">{translatedText.timeUnavailable}</div>;
  }

  return (
    <div
      className="bar"
      style={{
        position: "fixed", // Sticks the bar to the bottom of the screen
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#282c34",
        color: "white",
        zIndex: 9999,
      }}
    >
      <div className="time" style={{ color: "white" }}>
        {currentTime ? currentTime.toLocaleTimeString() : translatedText.timeUnavailable}
      </div>

      <div>{translatedText.translatedWeather}</div>

      <div
        className="language-selector"
        style={{
          position: "relative",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => setDropdownVisible((prev) => !prev)}
      >
        {currentLanguage
          ? languages.find((lang) => lang.code === currentLanguage)?.label
          : translatedText.selectLanguage}
        {dropdownVisible && (
          <div
            className="dropdown"
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              right: 0,
              background: "white",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              zIndex: 1000,
              overflow: "hidden",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {languages.map((language) => (
              <div
                key={language.code}
                className="dropdown-item"
                onClick={() => handleLanguageChange(language.code)}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                {language.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsBar;
