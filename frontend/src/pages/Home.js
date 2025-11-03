/**
 * Home Component
 * 
 * This component renders the home page for the application, featuring navigation buttons 
 * for viewing the menu, starting an order, and logging in. It integrates with the 
 * translation context to display text in the selected language.
 * 
 * Features:
 * - Displays a welcome message.
 * - Provides navigation to the menu, order, and login pages.
 * - Dynamically translates text based on the selected language.
 * 
 * @example
 * <Home />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Import the useTranslate hook
import '../styles/Home.css';

/**
 * Home Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered home page with buttons for navigation.
 */
function Home() {
    const navigate = useNavigate();
    const { translate } = useTranslate(); // Access translate function from context

    /**
     * State to store translated text for the UI.
     * @type {Object}
     * @property {string} welcome - Translated "Welcome" text.
     * @property {string} viewMenu - Translated "View Menu" text.
     * @property {string} startOrder - Translated "Start Order" text.
     * @property {string} login - Translated "Login" text.
     */
    const [translatedText, setTranslatedText] = useState({
        welcome: '',
        viewMenu: '',
        startOrder: '',
        login: '',
    });

    /**
     * Fetches and sets translated text when the component mounts or the translate function changes.
     * 
     * @returns {void} - Updates the `translatedText` state with the translated text.
     */
    useEffect(() => {
        const translateText = async () => {
            setTranslatedText({
                welcome: await translate("Welcome to Panda Express"),
                viewMenu: await translate("View Menu"),
                startOrder: await translate("Start Order"),
                login: await translate("Login"),
            });
        };

        translateText();
    }, [translate]); // Re-run translation when the translate function changes (e.g., language changes)

    /**
     * Navigates to the menu page.
     * 
     * @returns {void} - Redirects the user to the `/menu` route.
     */
    const handleViewMenu = () => {
        navigate('/menu');
    };

    /**
     * Navigates to the order page.
     * 
     * @returns {void} - Redirects the user to the `/order` route.
     */
    const handleStartOrder = () => {
        navigate('/order');
    };

    /**
     * Navigates to the login page.
     * 
     * @returns {void} - Redirects the user to the `/login` route.
     */
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="overlay"></div>
            <div className="home-content">
                <h1>{translatedText.welcome || "Welcome to Panda Express"}</h1>
                <button className="menu-button" onClick={handleViewMenu}>
                    {translatedText.viewMenu || "View Menu"}
                </button>
                <button className="start-order-button" onClick={handleStartOrder}>
                    {translatedText.startOrder || "Start Order"}
                </button>
                <button className="login-button" onClick={handleLogin}>
                    {translatedText.login || "Login"}
                </button>
            </div>
        </div>
    );
}

export default Home;
