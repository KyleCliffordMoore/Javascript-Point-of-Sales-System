/**
 * SelectSidePage Component
 * 
 * This component allows users to select a side dish for their meal.
 * 
 * Features:
 * - Fetches and displays a list of available sides.
 * - Allows users to select a side and add it to their shopping cart along with meal details.
 * 
 * @exampleUsage Example:
 * <SelectSidePage />
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useTranslate } from '../contexts/TranslationContext';
import '../styles/SelectEntreePage.css';

const API_URL = '/api';

/**
 * The main component for the SelectSidePage, where users select a side dish for their meal.
 * 
 * @returns {JSX.Element} - The rendered page with a list of side items and a button to add the selected side to the cart.
 *
 */
const SelectSidePage = () => {
    const [sideItems, setSideItems] = useState([]);
    const [selectedSide, setSelectedSide] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { addItemToCart } = useShoppingCart();
    const { translate } = useTranslate(); // Access translate function from context

    // Extract meal item and its properties from location state
    const mealItem = location.state?.meal_item || "plate";
    const price = location.state?.price || "N/A";
    const entree1 = location.state?.entree1 || "N/A";
    const entree2 = location.state?.entree2 || "N/A";
    const entree3 = location.state?.entree3 || "N/A"; 

    // State to store translated strings for various UI elements
    const [translatedStrings, setTranslatedStrings] = useState({
        title: '',
        selectSideAlert: '',
        finishedButton: '',
    });

    /**
     * Fetches translations for UI text (title, alert, and button) and sets them in state.
     * This function is called when the component mounts and whenever the language changes.
     * 
     * @returns {void}
     */
    useEffect(() => {
        // Fetch translations
        const translateStrings = async () => {
            const title = await translate('Select Your Side');
            const selectSideAlert = await translate('Please select a side before proceeding.');
            const finishedButton = await translate('Finished');

            setTranslatedStrings({
                title,
                selectSideAlert,
                finishedButton,
            });
        };

        translateStrings(); // Translate strings on component mount
    }, [translate]);

    /**
     * Fetches side items from the server API and sets them in state.
     * This function is called when the component mounts.
     * 
     * @returns {void}
     */
    const fetchSides = async () => {
        try {
            const response = await fetch(`${API_URL}/doQuerySide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setSideItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching side items:', error);
            setSideItems([]);
        }
    };

    // Fetch side items when the component mounts
    useEffect(() => {
        fetchSides();
    }, []);

    /**
     * Handles adding the selected side to the cart along with meal and entrees information.
     * If no side is selected, an alert is shown to prompt the user to select a side.
     * 
     * @returns {void}
     */
    const handleAddToCart = () => {
        if (!selectedSide) {
            alert(translatedStrings.selectSideAlert); // Use translated alert
            return;
        }

        // Prepare full item for the cart
        const fullItem = {
            name: mealItem,
            price: price,
            entrees: [entree1, entree2, entree3], // Filter out null entrees
            sides: [selectedSide.name], // Only one side allowed
            type: "Meal"
        };

        console.log(fullItem);

        // Add item to cart and show a success alert
        addItemToCart(fullItem);
        alert(`${mealItem} with selected entrees and side added to cart!`);
        navigate('/order'); // Navigate to order page
    };

    return (
        <div className="select-entree-page">
            <h2>{translatedStrings.title}</h2> {/* Use translated title */}
            <div className="grid-container">
                {sideItems.map((item, index) => (
                    <button
                        key={index}
                        className={`grid-item ${selectedSide === item ? 'selected' : ''}`}
                        onClick={() => setSelectedSide(item)}
                    >
                        <img src={`${process.env.PUBLIC_URL}/${item.name.replace(/[\s/]/g, '')}.png`} alt={`${item.name}`}></img>
                        {item.name}
                    </button>
                ))}
            </div>
            <button onClick={handleAddToCart} className="add-to-cart-button">
                {translatedStrings.finishedButton} {/* Use translated button text */}
            </button>
        </div>
    );
};

export default SelectSidePage;
