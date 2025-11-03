/**
 * ItemPage Component
 * 
 * This component displays a list of items from the inventory. It allows the user to view 
 * the details of each item, navigate to the item edit page, and remove items from the inventory.
 * The page fetches the item data from the backend and dynamically renders a list of item details.
 * 
 * Features:
 * - Displays a list of items with details like name, type, price, and calories.
 * - Allows navigating to the item edit page.
 * - Provides a remove button to delete an item from the inventory.
 * - Supports navigation to a page to add new items.
 * 
 * API Endpoints:
 * - `/api/doItemLoad` - Fetches all items from the inventory.
 * - `/api/removeItem` - Removes an item from the inventory based on the item ID.
 * 
 * @example
 * <ItemPage />
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/AllManager.module.css';
import '../styles/Inventory.css';
import { useFasterTranslate } from '../contexts/FasterTranslationContext';

const API_URL = '/api'; // Base URL for the backend

/**
 * ItemPage Component
 * 
 * @component
 * @returns {JSX.Element} - The rendered item page displaying the list of items.
 */
function ItemPage() {
  const { translate } = useFasterTranslate();
  /**
   * State to hold the fetched item data.
   * @type {Array<Object>}
   */
  const [itemData, setItemData] = useState([]);
  const navigate = useNavigate();

  const [translatedText, setTranslatedText] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  // Fetch and set translated labels
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await translate([
          'Back',
          'Add New Item',
          'Item removed successfully!',
          'Failed to remove item',
          'Item',
          'Type',
          'Price',
          'Calories',
          'Remove',
          'Edit',
        ]);
        setTranslatedText({
          back: translations[0],
          addNewItem: translations[1],
          removeSuccess: translations[2],
          removeFailure: translations[3],
          item: translations[4],
          type: translations[5],
          price: translations[6],
          calories: translations[7],
          remove: translations[8],
          edit: translations[9],
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [translate]);

  /**
   * Fetches the item data from the backend API and updates the state.
   * 
   * @returns {void}
   */
  const fetchItemData = async () => {
    try {
      const response = await axios.post(`${API_URL}/doItemLoad`);
      setItemData(response.data);
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, []);

  if (loadingTranslations) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => navigate('/managerselection')}>
          {translatedText.back}
        </button>
        <button className={styles.button} onClick={() => navigate('/itemadd')}>
          {translatedText.addNewItem}
        </button>
      </div>
      <div className="inventory">
        {itemData.map((item) => (
          <ItemSlice
            key={item.menu_id}
            item={item}
            fetchItemData={fetchItemData}
            translatedText={translatedText}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ItemSlice Component
 * 
 * This component displays a single item with its details (name, type, price, and calories).
 * It provides buttons to remove the item or navigate to the edit page for further modifications.
 * 
 * @component
 * @param {Object} props - The props for the component.
 * @param {Object} props.item - The item details to display.
 * @param {Function} props.fetchItemData - Function to refresh the item data.
 * @returns {JSX.Element} - The rendered item slice.
 */
function ItemSlice({ item, fetchItemData, translatedText }) {
  const { menu_id, name, item_type, price, calories } = item;
  const navigate = useNavigate();

  /**
   * Handles removing an inventory item from the backend.
   * 
   * @param {string} menuId - The unique identifier of the item to be removed.
   * @returns {void}
   */
  const handleRemove = async (menuId) => {
    try {
      const response = await axios.post(`${API_URL}/removeItem`, { menu_id: menuId });
      if (response.data.success) {
        alert(translatedText.removeSuccess);
        fetchItemData();
      } else {
        alert(translatedText.removeFailure);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert(translatedText.removeFailure);
    }
  };

  return (
    <div className="slice2">
      <div className="item">
        <strong style={{ color: 'black' }}>{translatedText.item}: </strong>
        {name}
      </div>
      <div className="item">
        <strong style={{ color: 'black' }}>{translatedText.type}: </strong>
        {item_type}
      </div>
      <div className="item">
        <strong style={{ color: 'black' }}>{translatedText.price}: </strong>
        {price !== undefined && price !== null ? `$${parseFloat(price).toFixed(2)}` : 'N/A'}
      </div>
      <div className="item">
        <strong style={{ color: 'black' }}>{translatedText.calories}: </strong>
        {calories !== undefined && calories !== null ? calories : 'N/A'}
      </div>
      <div>
        <button className="button" onClick={() => handleRemove(menu_id)}>
          {translatedText.remove}
        </button>
      </div>
      <div>
        <button className="button" onClick={() => navigate('/itemedit', { state: { menu_id } })}>
          {translatedText.edit}
        </button>
      </div>
    </div>
  );
}

export default ItemPage;
