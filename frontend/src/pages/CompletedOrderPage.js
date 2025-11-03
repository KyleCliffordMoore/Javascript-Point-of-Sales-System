/**
 * CompletedOrderPage Component
 * 
 * This component displays a confirmation message after a user completes an order. 
 * 
 * Features:
 * - Displays a thank you message and the order receipt ID.
 * - Allows users to email the receipt or finish the order process.
 * 
 * @example Usage Example:
 * <CompletedOrderPage />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/CompletedOrderPage.css'; // Adjust the path to your CSS file

/**
 * The main component for the completed order page.
 * 
 * @component
 * @returns {JSX.Element} - The rendered completed order page with options to email the receipt or finish the order process.
 */
function CompletedOrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const receiptId = location.state?.receipt || NaN;
    const { translate } = useTranslate(); // Access translate function from context

    // State for storing translated strings
    const [translatedStrings, setTranslatedStrings] = useState({
        thankYouMessage: '',
        receiptMessage: '',
        emailButton: '',
        finishButton: '',
    });

    /**
     * Loads translations for the thank you message, receipt message, button texts, and other UI elements.
     * The translations are loaded on component mount and when the language changes.
     * 
     * @returns {void} returns nothing
     */
    useEffect(() => {
        const translateStrings = async () => {
            const thankYouMessage = await translate('Thank you for your order!');
            const receiptMessage = await translate('Your receipt:');
            const emailButton = await translate('Email me my receipt & notify when order is ready.');
            const finishButton = await translate('Finished');
            
            setTranslatedStrings({
                thankYouMessage,
                receiptMessage,
                emailButton,
                finishButton,
            });
        };

        translateStrings(); // Translate strings on component mount
    }, [translate]); // Re-run translation if language changes

    return (
        <div className="completed-order-page">
            <h2>{translatedStrings.thankYouMessage}</h2>
            <p className="receipt">
                {translatedStrings.receiptMessage} <strong>{receiptId}</strong>
            </p>
            <button
                className="back-btn"
                onClick={() => navigate('/emailreceiptpage', { state: { receiptId: receiptId } })}
            >
                {translatedStrings.emailButton}
            </button>
            <button className="back-btn" onClick={() => navigate('/order')}>
                {translatedStrings.finishButton}
            </button>
        </div>
    );
}

export default CompletedOrderPage;
