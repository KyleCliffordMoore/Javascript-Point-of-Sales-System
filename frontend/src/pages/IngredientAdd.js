/**
 * IngredientAdd Component
 * 
 * This component allows users to add ingredients to a recipe by selecting an inventory item,
 * specifying the quantity, and providing the quantity type. The ingredient is then added to the
 * recipe by sending a POST request to the backend.
 * 
 * - Displays a dropdown to select an inventory item.
 * - Allows users to specify the quantity and type of the ingredient.
 * - Handles form submission to add the ingredient to the recipe.
 * - Displays success or error messages after form submission.
 * 
 * @component
 * @example
 * // Example usage
 * <IngredientAdd />
 */

/**
 * The main IngredientAdd component that handles the process of adding ingredients to a recipe.
 * 
 * @returns {JSX.Element} - The rendered IngredientAdd component.
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslate } from '../contexts/TranslationContext';

const IngredientAdd = () => {
  const location = useLocation();
  const recipeId = location.state?.recipeId; // Retrieve the passed recipeId
  const { translate } = useTranslate();

  const [formData, setFormData] = useState({
    inventory_id: '',
    name: '',
    quantity: '',
    quantity_type: '',
  });

  // State for success message
  const [message, setMessage] = useState('');

  // State for error message
  const [error, setError] = useState('');
  const [inventory, setInventory] = useState([]); // To store the inventory items

   // Labels for UI
   const [labels, setLabels] = useState({
    title: 'Add Ingredient',
    inventoryItem: 'Inventory Item:',
    quantity: 'Quantity:',
    quantityType: 'Quantity Type:',
    submit: 'Add Ingredient',
    success: 'Ingredient added successfully!',
    failure: 'Failed to add ingredient:',
    error: 'An error occurred while adding the ingredient.',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setLabels({
        title: await translate('Add Ingredient'),
        inventoryItem: await translate('Inventory Item:'),
        quantity: await translate('Quantity:'),
        quantityType: await translate('Quantity Type:'),
        submit: await translate('Add Ingredient'),
        success: await translate('Ingredient added successfully!'),
        failure: await translate('Failed to add ingredient:'),
        error: await translate('An error occurred while adding the ingredient.'),
      });
    };

    loadTranslations();
  }, [translate]);

  /**
   * Fetches available ingredients from the backend and sets the inventory state.
   * 
   * @async
   * @returns {void}
   */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/getInventory', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipe_id: recipeId }),
        });

        const result = await response.json();
        if (response.ok) {
          setInventory(result); // Set the list of ingredients
        } else {
          alert("Error loading ingredients: " + result.error);
        }
      } catch (err) {
        setError('An error occurred while fetching the inventory.');
      }
    };

    fetchInventory();
  }, [recipeId, labels.failure, labels.error]);

  /**
   * Handles input field changes and updates the formData state.
   * 
   * @param {React.ChangeEvent} e - The event object for the input change.
   * @returns {void} Returns nothing.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Find the selected item by name and get its inventory_id
      const selectedItem = inventory.find(item => item.name === value);
      if (selectedItem) {
        setFormData(prevFormData => ({
          ...prevFormData,
          name: value,
          inventory_id: selectedItem.inventory_id, // Set the inventory_id when name changes
        }));
      }
    } else {
      // For other fields, just update the form data normally
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  /**
   * Handles the form submission to add a new ingredient.
   * Sends the form data to the backend API and processes the response to show feedback messages.
   * 
   * @param {React.FormEvent} e - The event object for the form submission.
   * @returns {void} Returns nothing.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = { ...formData, recipe_id: recipeId };
    console.log('Payload sent to backend:', payload);

    try {
      const response = await axios.post('/api/addIngredient', payload);
      if (response.data.success) {

        setMessage(labels.success);
        setFormData({ inventory_id: '', name: '', quantity: '', quantity_type: '' });

      } else {
        setError(`${labels.failure} ${response.data.error || ''}`); // Display error message
      }
    } catch (err) {
      setError(labels.error); // Handle API call failure
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
      }}
    >
      <h2>{labels.title}</h2>

      {message && <p style={{ color: 'black' }}>{message}</p>}
      {error && <p style={{ color: 'black' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.inventoryItem}</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">{labels.inventoryItem}</option>
            {inventory.map((item) => (
              <option key={item.inventory_id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.quantity}</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{labels.quantityType}</label>
          <input
            type="text"
            name="quantity_type"
            value={formData.quantity_type}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '75%',
            display: "block",
            margin: "auto"
          }}
        >
          {labels.submit}
        </button>
      </form>
    </div>
  );
};

export default IngredientAdd;
