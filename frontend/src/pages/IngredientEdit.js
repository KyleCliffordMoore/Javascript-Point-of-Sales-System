import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useTranslate } from '../contexts/TranslationContext';

const IngredientEdit = () => {
  const location = useLocation();
  const { translate } = useTranslate();

  // Extract data from location.state and set default values
  const initialData = {
    recipe_ing_id: '',
    recipe_id: '',
    inventory_id: '',
    name: '',
    quantity: '',
    quantity_type: '',
  };

  const recipe_ing_id = location.state?.recipe_ing_id;
  console.log(recipe_ing_id);

  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [inventory, setInventory] = useState([]); // To store the inventory items

  // Labels for UI
  const [labels, setLabels] = useState({
    title: 'Edit Ingredient',
    inventoryItem: 'Inventory Item:',
    quantity: 'Quantity:',
    quantityType: 'Quantity Type:',
    submit: 'Save Changes',
    success: 'Ingredient updated successfully!',
    failure: 'Failed to update ingredient:',
    error: 'An error occurred while updating the ingredient.',
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setLabels({
        title: await translate('Edit Ingredient'),
        inventoryItem: await translate('Inventory Item:'),
        quantity: await translate('Quantity:'),
        quantityType: await translate('Quantity Type:'),
        submit: await translate('Save Changes'),
        success: await translate('Ingredient updated successfully!'),
        failure: await translate('Failed to update ingredient:'),
        error: await translate('An error occurred while updating the ingredient.'),
      });
    };
  
    loadTranslations();
  }, [translate]);

  // Fetch inventory items and ingredient details when recipe_ing_id is available
  useEffect(() => {
    const fetchIngredientDetails = async () => {
      if (!recipe_ing_id) return;

      try {
        // Fetch ingredient details based on the recipe_ing_id
        const response = await axios.post('/api/getIngredientDetails', { recipe_ing_id });
        if (response.data) {
          const { recipe_id, inventory_id, name, quantity, quantity_type } = response.data;
  
          setFormData({
            recipe_ing_id, // Keep the original recipe_ing_id
            recipe_id,
            inventory_id,
            name,
            quantity,
            quantity_type,
          });
        }
      } catch (error) {
        setError(labels.error);
        console.error(error);
      }
    };

    // Fetch available ingredients from the backend
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/getInventory', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipe_id: recipe_ing_id }), // Use menu_id or equivalent recipe_id
        });

        const result = await response.json();

        if (response.ok) {
            setInventory(result); // Set the list of ingredients
        } else {
            alert(labels.failure);
        }
      } catch (err) {
        setError(labels.error);
      }
    };

    fetchIngredientDetails();
    fetchInventory();
  }, [recipe_ing_id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    console.log(formData);

    try {
      const response = await axios.post('/api/editIngredient', formData);
      if (response.data.success) {
        setMessage(labels.success);
      } else {
        setError(`${labels.failure} ${response.data.error || ''}`);
      }
    } catch (err) {
      setError(labels.error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
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

export default IngredientEdit;


