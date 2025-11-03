/**
 * @file SelectEntreePage3.js
 * @description Page component for selecting the first entree. Handles fetching entree data,
 * managing user selection, and navigating to subsequent pages based on the meal item and user choices.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/SelectEntreePage.css';

const API_URL = '/api';

/**
 * SelectEntreePage1 Component
 *
 * Renders a page where users can select their first entree as part of their meal order.
 * Fetches entree data from the server, supports internationalization via translations,
 * and navigates to the next page upon user selection.
 *
 * @component
 * @returns {JSX.Element} The rendered component for selecting an entree.
 */
const SelectEntreePage3 = () => {
    const [entreeItems, setEntreeItems] = useState([]);
    const [selectedEntree, setSelectedEntree] = useState(null); 
    const navigate = useNavigate();
    const location = useLocation();
    const { translate } = useTranslate(); // Access translate function from context

    // Retrieve meal item and two initial entrees from the previous route if passed in
    const mealItem = location.state?.meal_item || "plate";
    const initialEntree1 = location.state?.entree1 || null;
    const initialEntree2 = location.state?.entree2 || null;

    const [translatedStrings, setTranslatedStrings] = useState({
        title: '',
        selectEntreeAlert: '',
        nextButton: '',
    });
    /**
     * Fetches translations from the backend API and updates the component state.
     */
    useEffect(() => {
        // Fetch translations
        const translateStrings = async () => {
            const title = await translate('Select an Entree');
            const selectEntreeAlert = await translate('Please select an entree before proceeding.');
            const nextButton = await translate('Next');

            setTranslatedStrings({
                title,
                selectEntreeAlert,
                nextButton,
            });
        };

        translateStrings(); // Translate strings on component mount
    }, [translate]);

     /**
     * Fetches initial entree items
     */
    useEffect(() => {
        if (initialEntree1) {
            setSelectedEntree(initialEntree1);
        }
    }, [initialEntree1]);

    /**
     * Fetches entree items from the backend API and updates the component state.
     */
    const fetchEntrees = async () => {
        try {
            const response = await fetch(`${API_URL}/doQueryEntree`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setEntreeItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching entree items:', error);
            setEntreeItems([]);
        }
    };

    /**
     * Fetches entree items from the backend API and updates the component state.
     */
    useEffect(() => { fetchEntrees(); }, []);

    /**
     * Handles next button click
     */
    const handleNext = () => {
        if (!selectedEntree) {
            alert(translatedStrings.selectEntreeAlert); // Use translated alert
            return;
        }

        navigate('/selectside', { 
            state: { 
                meal_item: mealItem.name, 
                entree1: initialEntree1.name, 
                entree2: initialEntree2.name, 
                entree3: selectedEntree.name,
                price: mealItem.price
            } 
        });
    };

    return (
        <div className="select-entree-page">
            <h2>{translatedStrings.title}</h2> {/* Use translated title */}
            <div className="grid-container">
                {entreeItems.map((item, index) => (
                    <button
                        key={index}
                        className={`grid-item ${selectedEntree === item ? 'selected' : ''}`}
                        onClick={() => setSelectedEntree(item)}
                    >
                        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={`${item.name}`}></img>
                        {item.name}
                    </button>
                ))}
            </div>
            <button onClick={handleNext} className="next-button">
                {translatedStrings.nextButton} {/* Use translated button text */}
            </button>
        </div>
    );
};

export default SelectEntreePage3;
