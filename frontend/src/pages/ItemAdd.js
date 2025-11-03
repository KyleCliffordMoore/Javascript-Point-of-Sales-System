/**
 * ItemAdd Component
 * 
 * This component provides a form to add a new item (e.g., menu item) to the system. It allows 
 * users to input details such as the name, type, price, and calories of the item. Upon submission, 
 * the data is sent to the backend API to be stored, and the user is redirected to the item page 
 * on success.
 * 
 * Features:
 * - Collects item details including name, type, price, and calories.
 * - Sends the new item data to the backend for storage.
 * - Displays success or error messages based on the result of the API request.
 * - Supports navigation back to the item page.
 * 
 * API Endpoints:
 * - `/api/addItem` - Adds a new item to the backend.
 * 
 * @example
 * <ItemAdd />
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/AllManager.module.css';
import '../styles/Inventory.css'

const API_URL = '/api'; // Base URL for the backend

/**
 * ItemAdd Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered form for adding a new item.
 */
function ItemAdd() {
    // States for form data
    /**
     * The state for the name of the new item.
     * @type {string}
     */
    const [name, setName] = useState('');

    /**
     * The state for the type of the new item (e.g., drink, appetizer).
     * @type {string}
     */
    const [itemType, setItemType] = useState('');

    /**
     * The state for the price of the new item.
     * @type {string}
     */
    const [price, setPrice] = useState('');

    /**
     * The state for the calorie count of the new item.
     * @type {string}
     */
    const [calories, setCalories] = useState('');

    const navigate = useNavigate();

    /**
     * Handles the form submission to add a new item.
     * Sends the item data to the backend API and handles the response.
     * 
     * @param {React.FormEvent} e - The form submission event.
     * @returns {void} - Sends the new item data to the backend and navigates or shows an error message.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page on submit

        const newItem = {
            name,
            item_type: itemType,
            price: itemType === 'meal' || itemType === 'drink' || itemType === 'appetizer' ? (price ? parseFloat(price) : null) : null,
            calories: ['meal', 'drink'].includes(itemType) ? null : (calories ? parseInt(calories) : null),
        };

        try {
            const response = await axios.post(`${API_URL}/addItem`, newItem);
            if (response.data.success) {
                alert('Item added successfully!');
                navigate('/itempage');
            } else {
                alert('Failed to add item: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('There was an error while adding the item.');
        }
    };

    /**
     * Navigates back to the item page.
     * 
     * @returns {void} - Navigates to the `/itempage` route.
     */
    const navigateBack = () => {
        navigate('/itempage');
    };

    return (
        <div className={styles.container}>
            <h2>Add New Item</h2>
            <div className={styles.buttonGroup}>
                <button onClick={navigateBack} className={styles.button} >Back</button>
            </div>
            <form onSubmit={handleSubmit} className='form'>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                <label>Type:</label>
                    <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a type</option>
                        <option value="meal">Meal</option>
                        <option value="drink">Drink</option>
                        <option value="entree">Entree</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="side">Side</option>
                    </select>
                </div>
                {['meal', 'drink', 'appetizer'].includes(itemType) && (
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                )}
                {!['meal', 'drink'].includes(itemType) && itemType && (
                    <div>
                        <label>Calories:</label>
                        <input
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}

export default ItemAdd;
