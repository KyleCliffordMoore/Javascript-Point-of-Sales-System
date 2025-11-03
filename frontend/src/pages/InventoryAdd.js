/**
 * InventoryAdd Component
 * 
 * This component allows managers to add new inventory items to the system.
 * Users can input the item's name, quantity, and quantity type, then submit 
 * the form to save the item in the backend. Translations are applied to labels 
 * for multilingual support.
 * 
 * Features:
 * - Provides a form to add a new inventory item with validation.
 * - Integrates with a backend API to save the inventory item.
 * - Displays success or error messages based on the backend response.
 * - Dynamically translates UI labels based on the selected language.
 * 
 * API Endpoints:
 * - `/api/addInventoryItem` - Adds a new inventory item to the backend.
 * 
 * @example
 * <InventoryAdd />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext'; // Adjust the import path
import './InventoryModify.css';

const API_URL = '/api'; // Base URL for the backend

/**
 * InventoryAdd Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered component for adding a new inventory item.
 */
function InventoryAdd() {
    // Form state
    /**
     * The state for the name of the inventory item.
     * @type {string}
     */
    const [nameForm, setName] = useState('');

    /**
     * The state for the quantity of the inventory item.
     * @type {number}
     */
    const [quantityForm, setQuantity] = useState(0);

    /**
     * The state for the quantity type of the inventory item.
     * @type {string}
     */
    const [quantityType, setType] = useState('');

    const navigate = useNavigate();
    const { translate } = useTranslate();

    /**
     * The state for storing translated labels for the UI.
     * @type {Object}
     */
    const [labels, setLabels] = useState({
        title: 'Add Inventory Item',
        name: 'Name:',
        quantity: 'Quantity:',
        quantityType: 'Quantity Type:',
        submit: 'Add Item',
        success: 'Item added successfully!',
        failure: 'Failed to add inventory item:',
        error: 'There was an error while adding the inventory item.',
    });

    /**
     * Fetches translations for all UI labels when the component mounts or when the 
     * translation function changes (e.g., language changes).
     * 
     * @returns {void} - Updates the `labels` state with translated values.
     */
    useEffect(() => {
        const loadTranslations = async () => {
            setLabels({
                title: await translate('Add Inventory Item'),
                name: await translate('Name:'),
                quantity: await translate('Quantity:'),
                quantityType: await translate('Quantity Type:'),
                submit: await translate('Add Item'),
                success: await translate('Item added successfully!'),
                failure: await translate('Failed to add inventory item:'),
                error: await translate('There was an error while adding the inventory item.'),
            });
        };

        loadTranslations();
    }, [translate]);

    /**
     * Handles the form submission to add a new inventory item.
     * Sends the form data to the backend API and handles the response.
     * 
     * @param {React.FormEvent} e - The form submission event.
     * @returns {void} - Sends the inventory data to the backend and navigates or shows an error message.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page on submit

        const inventoryItem = {
            name: nameForm,
            quantity: quantityForm,
            quantity_type: quantityType,
        };

        try {
            const response = await fetch(`${API_URL}/addInventoryItem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inventoryItem),
            });

            const result = await response.json();
            if (result.success) {
                alert(labels.success);
                navigate('/managerselection');
            } else {
                alert(`${labels.failure} ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding inventory item:', error);
            alert(labels.error);
        }
    };

    return (
        <div className="inventoryAdd">
            <h2>{labels.title}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>{labels.name}</label>
                    <input
                        type="text"
                        value={nameForm}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>{labels.quantity}</label>
                    <input
                        type="number"
                        value={quantityForm}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        required
                    />
                </div>

                <div>
                    <label>{labels.quantityType}</label>
                    <input
                        type="text"
                        value={quantityType}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submitButton">
                    {labels.submit}
                </button>
            </form>
        </div>
    );
}

export default InventoryAdd;
