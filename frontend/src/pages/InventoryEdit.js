/**
 * InventoryEdit Component
 * 
 * This component allows managers to edit an existing inventory item. It preloads the current 
 * details of the inventory item (name, quantity, and quantity type) and provides a form to update 
 * them. The updated information is sent to the backend, and success or error messages are displayed 
 * based on the result.
 * 
 * Features:
 * - Preloads inventory item details for editing.
 * - Sends updated information to the backend.
 * - Displays success or error messages.
 * 
 * API Endpoints:
 * - `/api/editInventoryItem` - Updates an inventory item's details in the backend.
 * 
 * @example
 * <InventoryEdit />
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InventoryModify.css';

const API_URL = '/api'; // Base URL for the backend

/**
 * InventoryEdit Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered component for editing an inventory item.
 */
function InventoryEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * The inventory item's initial state passed from the location state.
   * @type {Object}
   * @property {string} inventory_id - The unique identifier of the inventory item.
   * @property {string} name - The name of the inventory item.
   * @property {number} quantity - The current quantity of the inventory item.
   * @property {string} quantity_type - The type of quantity (e.g., "kg", "pieces").
   */
  const { inventory_id, name, quantity, quantity_type } = location.state || {};

  // State for form inputs
  /**
   * The state for the inventory item's ID.
   * @type {string}
   */
  const [inventoryId, setId] = useState(inventory_id);

  /**
   * The state for the inventory item's name.
   * @type {string}
   */
  const [nameForm, setName] = useState(name);

  /**
   * The state for the inventory item's quantity.
   * @type {number}
   */
  const [quantityForm, setQuantity] = useState(quantity);

  /**
   * The state for the inventory item's quantity type.
   * @type {string}
   */
  const [quantityType, setType] = useState(quantity_type);

  /**
   * Handles the form submission to update an inventory item.
   * Sends the updated data to the backend and handles the response.
   * 
   * @param {React.FormEvent} e - The form submission event.
   * @returns {void} - Sends the inventory data to the backend and navigates or shows an error message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page on submit

    const inventoryItem = {
      inventory_id: inventoryId,
      name: nameForm,
      quantity: quantityForm,
      quantity_type: quantityType,
    };

    try {
      const response = await fetch(`${API_URL}/editInventoryItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryItem),
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        navigate("/managerselection");
      } else {
        alert("Failed to update inventory item: " + result.error);
      }
    } catch (error) {
      console.error("Error updating inventory item:", error);
      alert("There was an error while updating the inventory item.");
    }
  };

  return (
    <div className='inventoryAdd'>
      <h2>Edit Inventory Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={nameForm}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantityForm}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            required
          />
        </div>

        <div>
          <label>Quantity Type:</label>
          <input
            type="text"
            value={quantityType}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <button type="submit" className='submitButton'>Update Item</button>
      </form>
    </div>
  );
}

export default InventoryEdit;
