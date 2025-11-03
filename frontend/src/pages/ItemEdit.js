/**
 * ItemEdit Component
 * 
 * This component allows users (e.g., managers) to edit the details of an existing item (e.g., menu item).
 * It preloads the current details (name, type, price, and calories) from the provided state, 
 * and allows the user to update these details. The updated information is sent to the backend API to be stored,
 * and the user is redirected to the item page on success.
 * 
 * Features:
 * - Preloads item details for editing.
 * - Sends updated item data to the backend.
 * - Displays success or error messages based on the result of the API request.
 * - Supports navigation back to the item page.
 * 
 * API Endpoints:
 * - `/api/editItem` - Updates an item in the backend with new details.
 * 
 * @example
 * <ItemEdit />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/AllManager.module.css';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

const API_URL = '/api'; // Base URL for the backend

/**
 * ItemEdit Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered form for editing an item.
 */
function ItemEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { translate } = useFasterTranslate();

  const { menu_id, name, item_type, price, calories } = location.state || {};
  const [nameForm, setName] = useState(name || '');
  const [typeForm, setType] = useState(item_type || '');
  const [priceForm, setPrice] = useState(price || 0);
  const [caloriesForm, setCalories] = useState(calories || 0);

  const [translatedText, setTranslatedText] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Edit Item',
          'Name:',
          'Type:',
          'Price:',
          'Calories:',
          'Update Item',
          'Item updated successfully!',
          'Error updating item',
        ]);
        setTranslatedText({
          title: translations[0],
          nameLabel: translations[1],
          typeLabel: translations[2],
          priceLabel: translations[3],
          caloriesLabel: translations[4],
          updateButton: translations[5],
          successMessage: translations[6],
          errorMessage: translations[7],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  /**
   * Handles the form submission to update the item.
   * Sends the updated data to the backend API and handles the response.
   * 
   * @param {React.FormEvent} e - The form submission event.
   * @returns {void} - Sends the updated item data to the backend and navigates or shows an error message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page on submit

    const item = {
      menu_id,
      name: nameForm,
      item_type: typeForm,
      price: parseFloat(priceForm),
      calories: parseInt(caloriesForm),
    };

    try {
      const response = await axios.post(`${API_URL}/editItem`, item);
      if (response.data.success) {
        alert(translatedText.successMessage);
        navigate('/itempage');
      } else {
        alert(`${translatedText.errorMessage}: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert(translatedText.errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{translatedText.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{translatedText.nameLabel}</label>
          <input type="text" value={nameForm} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>{translatedText.typeLabel}</label>
          <select value={typeForm} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select Type</option>
            <option value="meal">Meal</option>
            <option value="drink">Drink</option>
            <option value="appetizer">Appetizer</option>
          </select>
        </div>
        <div>
          <label>{translatedText.priceLabel}</label>
          <input type="number" value={priceForm} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>{translatedText.caloriesLabel}</label>
          <input type="number" value={caloriesForm} onChange={(e) => setCalories(e.target.value)} required />
        </div>
        <button type="submit">{translatedText.updateButton}</button>
      </form>
    </div>
  );
}

export default ItemEdit;
