/**
 * ManagerOrEmployee Component
 * 
 * This component displays the dashboard for either a manager or employee, depending on the user's role. 
 * It provides navigation options to different sections (Manager Selection, Cashier Page, Kitchen, etc.) 
 * based on the user’s role, which is passed from the previous page using React Router’s `useLocation`.
 * The component also fetches and displays translations for various UI elements.
 * 
 * Features:
 * - Displays a dashboard with different options for Manager and Employee roles.
 * - Allows navigation to the manager selection, cashier page, or kitchen page based on role.
 * - Provides an option to log out and return to the login page.
 * - Supports dynamic translation of UI elements based on the selected language.
 * 
 * API Endpoints:
 * - None directly in this component, but navigation occurs to other pages like `/managerselection`, `/cashierpage`, and `/kitchen`.
 * 
 * @example
 * <ManagerOrEmployee />
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Import the useTranslate hook
import '../styles/ManagerOrEmployee.css'; // Import the CSS file

/**
 * ManagerOrEmployee Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered dashboard page for manager or employee.
 */
function ManagerOrEmployee() {
    // Extract position from the location state (passed during navigation)
    const { position } = useLocation().state || {};
    const navigate = useNavigate();
    const { translate } = useTranslate(); // Access the translate function from context

    // State to store translated text
    /**
     * The state that stores translations for various UI elements.
     * @type {Object}
     */
    const [translations, setTranslations] = useState({
        dashboard: '',
        manager: '',
        employee: '',
        kitchen: '',
        backToLogin: '',
    });

    /**
     * Fetch translations for static text labels when the component mounts.
     * 
     * @returns {void}
     */
    useEffect(() => {
        const fetchTranslations = async () => {
            const translatedDashboard = await translate("Welcome to the Dashboard");
            const translatedManager = await translate("Manager");
            const translatedEmployee = await translate("Employee");
            const translatedKitchen = await translate("Kitchen");
            const translatedBackToLogin = await translate("Back to Login");

            setTranslations({
                dashboard: translatedDashboard,
                manager: translatedManager,
                employee: translatedEmployee,
                kitchen: translatedKitchen,
                backToLogin: translatedBackToLogin,
            });
        };

        fetchTranslations();
    }, [translate]); // Re-fetch translations if the translate function changes

    // Navigation functions
    /**
     * Navigates to the login page.
     * 
     * @returns {void}
     */
    const navigateToLoginPage = () => { navigate('/login'); };

    /**
     * Navigates to the manager selection page.
     * 
     * @returns {void}
     */
    const navigateToManagerSelectionPage = () => { navigate('/managerselection'); };

    /**
     * Navigates to the cashier page.
     * 
     * @returns {void}
     */
    const navigateToCashierPage = () => { navigate('/cashierpage'); };

    /**
     * Navigates to the kitchen page.
     * 
     * @returns {void}
     */
    const navigateToKitchenPage = () => { navigate('/kitchen'); };

    return (
        <div className="manager-employee-container">
            <div className="content-box">
                <h3>{translations.dashboard || "Loading..."}</h3>
                {position === 'Manager' && (
                    <button onClick={navigateToManagerSelectionPage}>
                        {translations.manager || "Loading..."}
                    </button>
                )}
                <button onClick={navigateToCashierPage}>
                    {translations.employee || "Loading..."}
                </button>
                <button onClick={navigateToKitchenPage}>
                    {translations.kitchen || "Loading..."}
                </button>
                <button onClick={navigateToLoginPage}>
                    {translations.backToLogin || "Loading..."}
                </button>
            </div>
        </div>
    );
}

export default ManagerOrEmployee;
