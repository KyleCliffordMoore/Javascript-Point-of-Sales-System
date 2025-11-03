/**
 * @file SelectEntreePage1.js
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
const SelectEntreePage1 = () => {
    const [entreeItems, setEntreeItems] = useState([]);
    const [selectedEntree, setSelectedEntree] = useState(null); 
    const navigate = useNavigate();
    const location = useLocation();
    const { translate } = useTranslate(); // Access translate function from context

    const mealItem = location.state?.meal_item || "bowl"; 

    const [translatedStrings, setTranslatedStrings] = useState({
        title: '',
        selectEntreeAlert: '',
        nextButton: '',
    });

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
     * Fetches translations for UI text and updates the `translatedStrings` state.
     * Runs on component mount and whenever the `translate` function changes.
     */
    useEffect(() => {
        fetchEntrees();

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
     * Handles navigation to the next page based on the selected entree and meal item.
     * Validates user selection and uses translated alert messages when necessary.
     */
    const handleNext = () => {
        if (!selectedEntree) {
            alert(translatedStrings.selectEntreeAlert); // Use translated alert
            return;
        }

        if (mealItem.name === "Bowl") {
            console.log(mealItem);
            navigate('/selectside', { 
                state: { 
                    meal_item: mealItem.name, 
                    entree1: selectedEntree.name, 
                    entree2: "N/A",
                    entree3: "N/A",
                    price: mealItem.price
                } 
            });
        } else {
            navigate('/selectentree2', { state: { meal_item: mealItem, entree: selectedEntree } });
        }
    };

    return (
        <div className="select-entree-page">
            <h2>{translatedStrings.title}</h2>
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
                {translatedStrings.nextButton} {/* Use translated text */}
            </button>
        </div>
    );
};

export default SelectEntreePage1;
