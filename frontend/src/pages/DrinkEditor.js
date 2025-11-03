/**
 * DrinkEditor Component
 * 
 * This component provides an interface for viewing and updating the prices of drink items.
 * It fetches the current menu items from the backend, displays them in a table, and allows
 * the user to input and submit new prices for individual items.
 * 
 * Features:
 * - Displays a list of drink menu items with their names, types, and current prices.
 * - Allows the user to enter and submit a new price for each item.
 * - Updates the price in the backend and refreshes the list upon success.
 * - Validates input to ensure only valid prices are submitted.
 * 
 * API Endpoints:
 * - `/api/getDrinkItems` - Fetches the list of drink menu items.
 * - `/api/updateDrinkPrice` - Updates the price of a specific drink item.
 * 
 * @example
 * <DrinkEditor />
 */

import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * DrinkEditor Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered drink price editor interface.
 */
const DrinkEditor = () => {
    // State to store menu items
    const [menuItems, setMenuItems] = useState([]);
    
    // State to store new prices entered by the user
    const [newPrices, setNewPrices] = useState({});

    /**
     * Fetches the menu items (drinks) from the backend API.
     * 
     * @returns {void} - Updates `menuItems` state with the fetched data.
     */
    const fetchMenuItems = () => {
        axios
            .get("/api/getDrinkItems")
            .then((response) => setMenuItems(response.data))
            .catch((error) => console.error("Error fetching menu items:", error));
    };

    /**
     * Fetch menu items when the component mounts.
     */
    useEffect(() => {
        fetchMenuItems();
    }, []);

    /**
     * Handles changes to the input field for new prices.
     * 
     * @param {string} id - The unique identifier of the menu item being updated.
     * @param {string} value - The new price value entered by the user.
     * @returns {void} - Updates `newPrices` state with the new price for the item.
     */
    const handleInputChange = (id, value) => {
        setNewPrices((prev) => ({ ...prev, [id]: value }));
    };

    /**
     * Submits the new price for a specific menu item to the backend API.
     * 
     * @param {string} id - The unique identifier of the menu item being updated.
     * @returns {void} - Sends the new price to the backend and updates the UI on success.
     */
    const handleUpdate = (id) => {
        const newPrice = newPrices[id];
        if (!newPrice) {
            alert("Enter a valid price.");
            return;
        }

        axios
            .post("/api/updateDrinkPrice", { menu_id: id, newPrice })
            .then(() => {
                alert("Price updated successfully");
                fetchMenuItems(); // Refresh menu items
                setNewPrices((prev) => ({ ...prev, [id]: "" })); // Clear input
            })
            .catch((error) => console.error("Error updating price:", error));
    };

    return (
        <div>
            <h1>Menu Price Editor</h1>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Type</th>
                        <th>Current Price</th>
                        <th>New Price</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((item) => (
                        <tr key={item.menu_id}>
                            <td>{item.name}</td>
                            <td>{item.item_type}</td>
                            <td>{item.price || "N/A"}</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Enter new price"
                                    value={newPrices[item.menu_id] || ""}
                                    onChange={(e) =>
                                        handleInputChange(item.menu_id, e.target.value)
                                    }
                                />
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(item.menu_id)}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DrinkEditor;
